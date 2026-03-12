export default {
  expo: {
    name: 'example',
    slug: 'example',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'guidesandsurveys.example',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'guidesandsurveys.example',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      ['expo-font', { fonts: ['./assets/fonts/RubikStorm-Regular.ttf'] }],
      [
        '@fullstory/react-native',
        {
          version: '1.67.1',
          org: 'o-1Y9Z-na1',
          host: 'onfire.fyi',
        },
      ],
    ],
  },
};
