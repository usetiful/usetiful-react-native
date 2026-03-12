import {
  useEffect,
  useState,
  type PropsWithChildren,
  type RefObject,
} from 'react';
import { StyleSheet, View } from 'react-native';
import type { Tag, Measure } from './types';
import { useTargeting } from './hooks/useTargeting';
import { useActiveExperienceStore } from './stores/useActiveExperienceStore';
import Survey from './Survey';
import { useDataStore } from './stores/useDataStore';
import type { Survey as SurveyType } from './types';
import type { NavigationContainerRef } from '@react-navigation/native';
import { Tour } from './Tour';
import Fullstory from '@fullstory/react-native';
// TODO remove this once we combine stores
import { useStore } from './stores/useStore';

type Props = {
  orgId: string;
  tags?: Tag;
  navigationRef?: RefObject<NavigationContainerRef<any>>;
} & PropsWithChildren;

export const GuidesAndSurveys = ({
  children,
  orgId,
  tags,
  navigationRef,
}: Props) => {
  // TODO remove this once we combine stores
  const initializeOldStore = useStore((s) => s.initialize);
  const initialize = useDataStore((s) => s.initialize);
  const refreshProgressor = useDataStore((s) => s.refreshProgressor);
  const spaceToken = useDataStore((s) => s.spaceToken);

  useEffect(() => {
    initialize(orgId, tags, null);
  }, [initialize, initializeOldStore, tags, tags?.userId, orgId]);

  useEffect(() => {
    let cancelled = false;
    Fullstory.onReady().then((result: { sessionId?: string }) => {
      if (!cancelled && result.sessionId && spaceToken) {
        console.log(
          'GuidesAndSurveys: Fullstory is ready, refreshing progressor'
        );
        refreshProgressor(spaceToken, result.sessionId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [refreshProgressor, spaceToken]);

  useTargeting(navigationRef);
  const [layoutMeasure, setLayoutMeasure] = useState<Measure>();
  const availableTour = useStore((s) => s.availableTour);
  const activeExperience = useActiveExperienceStore((s) => s.activeExperience);

  const renderContent = () => {
    switch (activeExperience?.type) {
      case 'survey':
        return <Survey survey={activeExperience!.experience as SurveyType} />;
    }

    // TODO migrate to activeExperience
    if (availableTour) {
      return <Tour layoutMeasure={layoutMeasure as Measure} />;
    }

    return null;
  };

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        e.target.measure((x, y, width, height, pageX, pageY) => {
          if (
            ![x, y, width, height, pageX, pageY].some((i) => i === undefined)
          ) {
            setLayoutMeasure({ x, y, width, height, pageX, pageY } as Measure);
          }
        });
      }}
    >
      {children}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
