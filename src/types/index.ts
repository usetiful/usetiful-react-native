import {
  SURVEY_STATE,
  TARGET_TYPE_ADDRESS_SIMPLE,
  TARGET_TYPE_USER_SEGMENT,
  TARGET_OPERATOR_SEGMENT_EXACT,
  TARGET_OPERATOR_SEGMENT_IS_NOT,
} from '../constants';
export type GuidesAndSurveysResponse = {
  tours?: Tour[];
  surveys?: Survey[];
  spaceToken: string;
};

export type Tour = {
  id: string;
  name: string;
  steps: TourStep[];
  targetOperator: number;
  targets: Target[];
  themeObject: Theme;
  progress: boolean;
  progressType: number;
  rememberLastStep: boolean;
  objectPriority: number;
  trigger: TourTrigger;
};
export type ActionType = {
  id: string;
  styleType: 'Primary' | 'Secondary' | string;
  type: 'next' | 'close' | 'previous' | 'gototour' | 'goto' | 'jump';
  value: string;
  tourId: string;
  url?: string;
  to: string;
};
export type TourStep = {
  actions: ActionType[];
  content: string;
  id: string;
  title: string;
  type: 'modal' | 'pointer' | 'slideout';
  element: string;
  alignment: 'left' | 'right' | 'center';
};
export type TourTrigger = {
  type: string;
};

export type AddressTarget = {
  type: typeof TARGET_TYPE_ADDRESS_SIMPLE;
  url: string;
};

export type UserSegmentTarget = {
  type: typeof TARGET_TYPE_USER_SEGMENT;
  operator:
    | typeof TARGET_OPERATOR_SEGMENT_EXACT
    | typeof TARGET_OPERATOR_SEGMENT_IS_NOT;
  name?: string;
  formattedName?: string;
};

export type TargetGroup = {
  targets: Target[];
  targetOperator: 0 | 1;
};

export type Target = AddressTarget | UserSegmentTarget | TargetGroup;

export type Measure = {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
};

export type Theme = {
  primaryColor: string;
  progressBarColor: string;
  buttonPositionBottom: number;
  buttonPositionRight: number;
  fontFamily: string;
  customFontFamily: string;
  fontTitleFamily: string;
  customFontTitleFamily: string;
  fontButtonFamily: string;
  customFontButtonFamily: string;
  fontColor: string;
  fontTitleColor: string;
  bgColor: string;
  secondaryButtonColor: string;
  surveyScaleColor: string;
  surveyScaleTextColor: string;
  primaryColorText: string;
  secondaryColorText: string;
  surveyCloseIconColor: string;
  fontSize: number;
  fontTitleSize: number;
  fontButtonSize: number;
  fontContentColor: string;
};

export type Tag = {
  [key: string]: string;
};

export type ProgressorTour = {
  id: string;
  state: string;
  name: string;
  currentStep: number;
  updatedAt: string;
};

export type UFCompleted = {
  type: string;
  id: string;
  updatedAt: string;
};

export type SurveyAnswer = {
  id: string;
  updatedAt: string;
  surveyId: string;
  questionId: string;
  questionType: string;
  pageId: string;
  pageName?: string;
  optionValue?: number;
  optionValues?: number[];
  answerText?: string;
};

export type SurveyReporterAnswer = {
  questionId: string;
  questionType: string;
  visitorIdent: string;
  respondedAt: string;
  optionValue?: number;
  optionValues?: number[];
  answerText?: string;
  sessionId?: string;
  tags?: Tag;
};

/** Report type discriminator for the reporter queue. Extend with 'entity' | 'form' | 'error' | 'assistant' when needed. */
export const REPORT_TYPE_SURVEY = 'survey';
export type ReportType = typeof REPORT_TYPE_SURVEY;

/** A single item in the reporter queue. Survey reports can be batched per surveyId when sending. */
export type PendingReport = {
  id: string;
  reportType: typeof REPORT_TYPE_SURVEY;
  surveyId: string;
  payload: SurveyReporterAnswer;
};
// Future: extend with | { id; reportType: 'entity'; ... } | { reportType: 'form'; ... } etc.

export type ProgressorData = {
  uf_completed: UFCompleted[];
  tours: ProgressorTour[];
  uf_surveys: SurveyProgress[];
  uf_survey_answers: SurveyAnswer[];
  autoSegment: string;
  customSegments: string[];
  storedAt: string | null;
  isTemporaryProfile: boolean;
  abExperiments: any[];
  tags: any[];
  progressClearedAt: string | null;
};

type SurveyState = (typeof SURVEY_STATE)[keyof typeof SURVEY_STATE];

export type SurveyProgress = {
  id: string;
  name: string;
  currentPageId: string;
  updatedAt: string;
  state: SurveyState;
};

export type ActiveExperience =
  | { type: 'tour'; experience: Tour; currentPageIndex: number }
  | { type: 'survey'; experience: Survey; currentPageIndex: number }
  | null;

/*
  Survey types
  */
export const SURVEY_ACTION_TYPES = {
  CONFIRM_SURVEY: 'confirm-survey',
  CLOSE_SURVEY: 'close-survey',
  SHOW_LATER: 'show-later',
} as const;

export type SurveyActionType =
  (typeof SURVEY_ACTION_TYPES)[keyof typeof SURVEY_ACTION_TYPES];

export type SurveyPageAction = {
  id: string;
  type: SurveyActionType;
  value: string;
  styleType: 'Primary' | 'Secondary' | 'Custom';
  classes?: string;
  showLaterDuration?: number;
  showLaterTimeUnit?: 'hours' | 'days' | 'weeks' | 'months';
};

export type SurveyPage = {
  id: string;
  name: string;
  type: 'modal' | 'slideout';
  content: any;
  customStyle: any;
  closeButton: boolean;
  alignment: 'center' | 'right' | 'left';
  actions: SurveyPageAction[];
  questions: SurveyQuestion[];
};

export type SurveyQuestion = {
  alignment: 'left' | 'right' | 'center';
  id: string;
  type: 'nps' | 'open';
  maximalValueLabel?: string;
  minimalValueLabel?: string;
  options?: any[] | null;
  required: boolean;
  question: string;
  placeholderText?: string;
};

export type Survey = {
  active: boolean;
  id: string;
  name: string;
  objectPriority: number;
  pages: SurveyPage[];
  targets: Target[];
  themeObject: Theme;
  trigger: SurveyTrigger;
  // 0: all conditions must be true, 1: any condition must be true
  targetOperator: 0 | 1;
};

export type SurveyTrigger = AutomaticSurveyTrigger | ManualSurveyTrigger;

type AutomaticSurveyTrigger = {
  autoplay: true;
  showEveryTime: true;
  type: typeof TRIGGER_TYPE_EVERYTIME_TILL_COMPLETE;
};

type ManualSurveyTrigger = {
  autoplay: false;
  showEveryTime: true;
  type: typeof TRIGGER_TYPE_EVERYTIME;
  pageEvent?: PageEvent;
};
export const TRIGGER_TYPE_EVERYTIME_TILL_COMPLETE = 'everytime_till_complete';
export const TRIGGER_TYPE_EVERYTIME = 'everytime';
// TODO we do not support manual triggers
type PageEvent = {
  url: string;
  type: string;
  name: string;
  element: string;
  eventName: string;
  loop?: string;
  tag?: string;
  operator?: string;
  value?: string;
};
