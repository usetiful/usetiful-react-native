import { View, Text, StyleSheet, Button, type ViewStyle } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { setPointer } from '@fullstory/guides-and-surveys-react-native';
import KitchenSinkScreen from './screens/KitchenSink';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Fullstory from '@fullstory/react-native';

type RootStackParamList = {
  Detail: undefined;
  Home: undefined;
  About: undefined;
  Help: undefined;
  KitchenSink: undefined;
};

export const HomeScreen = () => {
  const navitaion = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.home}>
      <View style={styles.navContainer}>
        <View style={styles.navBtn}>
          <Button title="Detail" onPress={() => navitaion.navigate('Detail')} />
        </View>
        <View style={styles.navBtn}>
          <Button title="About" onPress={() => navitaion.navigate('About')} />
        </View>
        <View style={styles.navBtn}>
          <Button title="Help" onPress={() => navitaion.navigate('Help')} />
        </View>
        <View style={styles.navBtn}>
          <Button
            title="Kitchen Sink"
            onPress={() => navitaion.navigate('KitchenSink')}
          />
        </View>
        <View style={styles.navBtn}>
          <Button
            title="Clear Async Storage"
            onPress={() => AsyncStorage.clear()}
          />
        </View>
        <View style={styles.navBtn}>
          <Button
            title="Fullstory Identify"
            onPress={() => Fullstory.identify('1234567890')}
          />
          <Button
            title="Fullstory Set User Properties"
            onPress={() => Fullstory.setUserVars({ name: 'John Doe' })}
          />
          <Button
            title="Fullstory Anonymize"
            onPress={() => Fullstory.anonymize()}
          />
          <Button
            title="Get Session Id"
            onPress={() => {
              Fullstory.getCurrentSession().then((session) => {
                console.log('session', session);
              });
            }}
          />
          <Button
            title="Shutdown Fullstory"
            onPress={() => {
              Fullstory.shutdown();
            }}
          />
          <Button
            title="Restart Fullstory"
            onPress={() => {
              Fullstory.restart();
            }}
          />
        </View>
      </View>
    </View>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="KitchenSink" component={KitchenSinkScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
  detail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    width: '100%',
  },
  navContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
  },
  navBtn: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

function DetailsScreen() {
  const navitaion = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ ...styles.home, backgroundColor: 'green' }}>
      <Text>Details Screen</Text>
      <Text>About</Text>
      <Text>Number One</Text>
      <Text>Number Two</Text>
      <View onLayout={(e) => setPointer('Test1', e)}>
        <Text>First Pointer</Text>
      </View>
      <Text>Number four</Text>
      <View
        style={{ marginTop: 100, marginLeft: 200 } as ViewStyle}
        onLayout={(e) => setPointer('SecondView', e)}
      >
        <Text>Second Pointer</Text>
      </View>
      <View
        style={{ marginTop: 300 }}
        onLayout={(e) => setPointer('NextView', e)}
      >
        <Text>Third Pointer</Text>
      </View>
      <Button
        title="Go to HomeScreen"
        onPress={() => navitaion.navigate('Home')}
      />
    </View>
  );
}
function AboutScreen() {
  const navitaion = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={{ ...styles.home, backgroundColor: 'lightblue' }}>
      <Text>About Screen</Text>
      <Button
        title="Go to HomeScreen"
        onPress={() => navitaion.navigate('Home')}
      />
    </View>
  );
}

function HelpScreen() {
  const navitaion = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <View style={{ ...styles.home, backgroundColor: 'darkblue' }}>
      <Text>Help Screen</Text>
      <Button
        title="Go to HomeScreen"
        onPress={() => navitaion.navigate('Home')}
      />
    </View>
  );
}
