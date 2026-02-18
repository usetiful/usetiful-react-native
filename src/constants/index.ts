import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');
export const pixelDensity = PixelRatio.get();

const adjustedWidth = width / pixelDensity;
const adjustedHeight = height / pixelDensity;

export const diagonalScale =
  Math.sqrt(adjustedWidth ** 2 + adjustedHeight ** 2) * 0.001;

export const THEME_DEFAULT = {
  primaryColor: '#387DFF',
  progressBarColor: '#387DFF',
  buttonPositionBottom: 0,
  buttonPositionRight: 0,
  fontFamily: '',
  customFontFamily: '',
  fontTitleFamily: '',
  customFontTitleFamily: '',
  fontButtonFamily: '',
  customFontButtonFamily: '',
  fontColor: '#000',
  bgColor: '#fff',
  secondaryButtonColor: '',
  fontSize: 14,
  fontTitleSize: 14,
  fontButtonSize: 14,
};

const PIXEL_DENSITY_MEDIUM = 2;
const PIXEL_DENSITY_HIGH = 3;
const FONT_SIZE_MEDIUM = 3;
const FONT_SIZE_LARGE = 8;
const FONT_SIZE_DEFAULT = 1;
export const webViewFontHandler = () => {
  switch (pixelDensity) {
    case PIXEL_DENSITY_MEDIUM:
      return FONT_SIZE_MEDIUM;
    case PIXEL_DENSITY_HIGH:
      return FONT_SIZE_LARGE;
    default:
      return FONT_SIZE_DEFAULT;
  }
};

export const SURVEY_STATE = {
  IN_PROGRESS: 'inProgress',
  CLOSED: 'closed',
} as const;

export const TARGET_TYPE_ADDRESS_SIMPLE = 'address-simple';
export const TARGET_TYPE_USER_SEGMENT = 'user-segment';
export const TARGET_OPERATOR_SEGMENT_EXACT = 'segment-exact';
export const TARGET_OPERATOR_SEGMENT_IS_NOT = 'segment-is-not';

export const FS_EVENT_NAMES = {
  surveyStateChanged: 'Survey State Changed',
  surveyPageSeen: 'Survey Page Seen',
  questionAnswered: 'Question Answered',
} as const;
