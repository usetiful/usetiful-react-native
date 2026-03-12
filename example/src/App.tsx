import { RootStack } from './RootStack';
import { NavigationContainer } from '@react-navigation/native';
import { useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { GuidesAndSurveys } from '@fullstory/guides-and-surveys-react-native';

export default function App() {
  // TODO: consider automatic orgID detection
  const orgId = 'o-1Y9Z-na1';
  const navigationRef = useRef(null);

  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={navigationRef}>
        <GuidesAndSurveys
          orgId={orgId}
          tags={{ userId: '2222' }}
          navigationRef={navigationRef}
        >
          <RootStack />
        </GuidesAndSurveys>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
