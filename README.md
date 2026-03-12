# guides-and-surveys-react-native

### Empower Your React Native Apps with FullStory's Seamless Onboarding and Product Guidance

The FullStory Guides and Surveys React Native package brings the power of FullStory's user onboarding and engagement tools directly into React Native apps. Designed for those looking to enhance the user experience, FullStory seamlessly integrates guided tours, including modals, slideouts, and pointers, as well as onboarding flows to help users navigate your app more efficiently.

## Installation

```sh
npm install @fullstory/guides-and-surveys-react-native
```

```sh
yarn add @fullstory/guides-and-surveys-react-native
```

## Usage

```js
import { GuidesAndSurveys } from '@fullstory/guides-and-surveys-react-native';
```

### Wrap Your App with GuidesAndSurveys

Note: When using React Navigation, GuidesAndSurveys must be a child of the NavigationContainer. For Expo projects, you can wrap your main \_layout page with GuidesAndSurveys.

```js
<NavigationContainer>
  <GuidesAndSurveys org={orgId}>
    <YourApp />
  </GuidesAndSurveys>
</NavigationContainer>
```

## Create a tour in FullStory panel

To create a tour, log in to your FullStory account and navigate to Home → Tour in the menu.

## Modals and Slide Outs

Slide-outs and modals are entirely codeless. Simply define them in the FullStory panel, and they will automatically appear in your target app.

## Pointers

To use pointers, you need to add following code to your target element. You can choose any key for your element and add it to setPointer function. Then, use your key as a selector in the FullStory admin.

```js
onLayout={(e) => setPointer('YOUR_KEY', e)}
```

Example:

```js
import { setPointer } from '@fullstory/guides-and-surveys-react-native';

return (
  <View>
    <View onLayout={(e) => setPointer('YourFirstKey', e)}>
      <Text>First Pointer</Text>
    </View>
    <View onLayout={(e) => setPointer('YourSecondKey', e)}>
      <Text>Second Pointer</Text>
    </View>
    <View onLayout={(e) => setPointer('AnotherKey', e)}>
      <Text>Third Pointer</Text>
    </View>
  </View>
);
```

## Targeting Screens

We support React Navigation version 6 and higher. To target a screen, add the screen name as the value in the URL contains condition.

Note: If your target screen is a child within a nested stack (default screen), you need to specify both the parent and child screen names. Separate them with "or" (as shown in the image) to account for different ways the screen might be navigated to.

![How to target screens](./src/assets/images/targeting.png)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
