import { create } from 'zustand';
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchDataJson, fetchProgressor } from '../services/api';
import { visitor } from '../services/Visitor';
import type {
  Tour,
  Survey,
  Tag,
  ProgressorData,
  SurveyProgress,
  SurveyAnswer,
} from '../types';
import { syncProgressor } from '../services/syncProgressor';
import { useReportQueueStore } from './useReportQueueStore';

interface DataStoreState {
  // Raw data
  tours: Tour[];
  surveys: Survey[];
  orgId: string | undefined;
  tags: Tag | undefined;
  visitorIdent: string | undefined;
  progressorData: ProgressorData;
  spaceToken: string | undefined;
  sessionId: string | undefined;

  // Actions
  initialize: (
    orgId: string,
    tags?: Tag,
    sessionId?: string | null
  ) => Promise<void>;
  refreshProgressor: (spaceToken: string, sessionId: string) => Promise<void>;
  setTours: (tours: Tour[]) => void;
  setSurveys: (surveys: Survey[]) => void;
  setProgressorData: (data: ProgressorData) => void;
  getCurrentProgressorData: () => ProgressorData;
}

type DataStorePersistedState = Pick<
  DataStoreState,
  'progressorData' | 'visitorIdent'
>;

const emptyProgressorData = (): ProgressorData => ({
  uf_completed: [],
  tours: [],
  uf_surveys: [],
  uf_survey_answers: [],
  autoSegment: '',
  customSegments: [],
  storedAt: null,
  isTemporaryProfile: true,
  abExperiments: [],
  tags: [],
  progressClearedAt: null,
});

/**
 * Merges local and server progressor data, keeping whichever has newer updatedAt timestamps.
 * This prevents data loss when sync fails and app restarts.
 */
const mergeProgressorData = (
  local: ProgressorData,
  server: ProgressorData
): ProgressorData => {
  // Helper to merge arrays by ID, keeping items with newer updatedAt
  const mergeArrayById = <T extends { id: string; updatedAt?: string }>(
    localArr: T[],
    serverArr: T[]
  ): T[] => {
    // NOTE: If server deletes an item, but local has it, it will be kept and synced.
    const merged = new Map<string, T>();

    // Add server items first
    serverArr.forEach((item) => merged.set(item.id, item));

    // Override with local items if they're newer
    localArr.forEach((item) => {
      const existing = merged.get(item.id);
      if (!existing) {
        merged.set(item.id, item);
      } else if (item.updatedAt && existing.updatedAt) {
        // Keep whichever has newer timestamp
        if (new Date(item.updatedAt) > new Date(existing.updatedAt)) {
          merged.set(item.id, item);
        }
      } else {
        // If we can't compare timestamps, prefer local (current session)
        merged.set(item.id, item);
      }
    });

    return Array.from(merged.values());
  };

  return {
    tours: server.tours || local.tours || [],
    uf_surveys: mergeArrayById<SurveyProgress>(
      local.uf_surveys || [],
      server.uf_surveys || []
    ),
    uf_survey_answers: mergeArrayById<SurveyAnswer>(
      local.uf_survey_answers || [],
      server.uf_survey_answers || []
    ),
    uf_completed: mergeArrayById(
      local.uf_completed || [],
      server.uf_completed || []
    ),
    autoSegment: server.autoSegment || local.autoSegment || '',
    customSegments: server.customSegments || local.customSegments || [],
    storedAt: server.storedAt || local.storedAt || null,
    isTemporaryProfile:
      server.isTemporaryProfile ?? local.isTemporaryProfile ?? true,
    abExperiments: server.abExperiments || local.abExperiments || [],
    tags: server.tags || local.tags || [],
    progressClearedAt:
      server.progressClearedAt ?? local.progressClearedAt ?? null,
  };
};

export const useDataStore = create(
  subscribeWithSelector(
    persist<DataStoreState, [], [], DataStorePersistedState>(
      (set, get) => ({
        tours: [],
        surveys: [],
        orgId: undefined,
        tags: undefined,
        visitorIdent: undefined,
        progressorData: emptyProgressorData(),
        spaceToken: undefined,
        sessionId: undefined,

        getCurrentProgressorData: () => {
          return get().progressorData;
        },

        initialize: async (orgId, tags, sessionId) => {
          try {
            let visitorIdent = get().visitorIdent;
            if (!visitorIdent) {
              visitorIdent = await visitor.getIdent();
              set({ visitorIdent });
            }

            const response = await fetchDataJson(orgId);
            const spaceToken = response?.spaceToken || '';

            set({
              orgId,
              spaceToken,
              tags: { ...tags, visitorIdent },
              tours: response?.tours || [],
              surveys: response?.surveys || [],
            });

            if (!spaceToken) {
              throw new Error('Space token not found');
            }
            if (sessionId) {
              get().refreshProgressor(spaceToken, sessionId);
            }
            useReportQueueStore.getState().processQueue(spaceToken);
          } catch (error) {
            // TODO: send error to analytics
            console.error('Error initializing data store:', error);
          }
        },

        refreshProgressor: async (spaceToken, sessionId) => {
          if (!spaceToken || !sessionId) return;
          set({ sessionId });

          try {
            const localProgressorData = get().progressorData;
            const serverProgressorData = await fetchProgressor(
              spaceToken,
              sessionId
            );

            if (
              serverProgressorData &&
              !serverProgressorData.isTemporaryProfile
            ) {
              const mergedProgressorData = mergeProgressorData(
                localProgressorData,
                serverProgressorData
              );

              set({ progressorData: mergedProgressorData });

              if (
                JSON.stringify(mergedProgressorData) !==
                JSON.stringify(serverProgressorData)
              ) {
                syncProgressor(mergedProgressorData, spaceToken, sessionId, 0);
              }
            }
          } catch (error) {
            // TODO: send error to analytics
            console.error('Error refreshing progressor:', error);
          }
        },

        setTours: (tours) => set({ tours }),
        setSurveys: (surveys) => set({ surveys }),
        setProgressorData: (data) => {
          const { sessionId, spaceToken } = get();
          set({ progressorData: data });

          // isTemporaryProfile is required to be false to sync progressor data
          if (!data.isTemporaryProfile && sessionId && spaceToken) {
            syncProgressor(data, spaceToken, sessionId);
          }
        },
      }),
      {
        name: 'fullstory-guides-and-surveys-data-storage',
        storage: createJSONStorage(() => AsyncStorage),
        partialize: (state) => ({
          progressorData: state.progressorData,
          visitorIdent: state.visitorIdent,
        }),
      }
    )
  )
);
