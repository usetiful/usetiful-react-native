import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { postSurveyResponse } from '../services/api';
import type { SurveyReporterAnswer, PendingReport } from '../types';
import { REPORT_TYPE_SURVEY } from '../types';
import { withRetry } from '../utils/retry';

type SurveyReportItem = PendingReport & {
  reportType: typeof REPORT_TYPE_SURVEY;
};

function isSurveyReport(item: PendingReport): item is SurveyReportItem {
  return item.reportType === REPORT_TYPE_SURVEY;
}

/**
 * Send survey reports: group by surveyId, batch payloads, one POST per survey with retries.
 * Returns the set of queue item ids that were successfully sent.
 */
async function sendSurveys(
  accountToken: string,
  items: SurveyReportItem[]
): Promise<Set<string>> {
  const sentIds = new Set<string>();
  if (items.length === 0) return sentIds;

  const bySurvey = new Map<
    string,
    { items: SurveyReportItem[]; payload: SurveyReporterAnswer[] }
  >();
  for (const item of items) {
    const batch = bySurvey.get(item.surveyId);
    const answer = item.payload;
    if (!batch) {
      bySurvey.set(item.surveyId, {
        items: [item],
        payload: [answer],
      });
    } else {
      batch.items.push(item);
      batch.payload.push(answer);
    }
  }

  for (const [surveyId, { items: batchItems, payload }] of bySurvey) {
    const success = await withRetry(() =>
      postSurveyResponse(accountToken, surveyId, payload)
    );
    if (success) {
      batchItems.forEach((item) => sentIds.add(item.id));
    }
  }
  return sentIds;
}

// Debounce timer to batch rapid report additions (e.g. multiple answers from same page)
let processQueueDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const PROCESS_QUEUE_DEBOUNCE_MS = 150;

interface ReportQueueState {
  /** Unified queue for all report types. Only survey is used for now. */
  pendingReports: PendingReport[];
  isProcessing: boolean;
  /** Add a survey report (batched with other survey answers for the same survey when sending). */
  addPendingReport: (
    surveyId: string,
    payload: SurveyReporterAnswer,
    spaceToken: string
  ) => void;
  /** Process the queue: send survey reports in batched payloads per survey; other types can be added later. */
  processQueue: (spaceToken: string) => Promise<void>;
}

export const useReportQueueStore = create<ReportQueueState>()(
  persist(
    (set, get) => ({
      pendingReports: [],
      isProcessing: false,

      addPendingReport: (surveyId, payload, spaceToken) => {
        const id = `survey_${surveyId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        const item: PendingReport = {
          id,
          reportType: REPORT_TYPE_SURVEY,
          surveyId,
          payload,
        };

        set((state) => ({
          pendingReports: [...state.pendingReports, item],
        }));

        // Debounce to batch multiple answers from the same page
        if (processQueueDebounceTimer) {
          clearTimeout(processQueueDebounceTimer);
        }
        processQueueDebounceTimer = setTimeout(() => {
          processQueueDebounceTimer = null;
          get().processQueue(spaceToken);
        }, PROCESS_QUEUE_DEBOUNCE_MS);
      },

      processQueue: async (spaceToken: string) => {
        const { pendingReports, isProcessing } = get();
        if (isProcessing || pendingReports.length === 0) {
          return;
        }
        set({ isProcessing: true });

        const surveyItems = pendingReports.filter(isSurveyReport);
        const sentIds = await sendSurveys(spaceToken, surveyItems);

        set({
          pendingReports: pendingReports.filter(
            (item) => !sentIds.has(item.id)
          ),
          isProcessing: false,
        });
      },
    }),
    {
      name: 'fullstory-guides-and-surveys-report-queue',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        pendingReports: state.pendingReports,
      }),
    }
  )
);
