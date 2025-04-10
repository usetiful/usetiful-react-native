export type UsetifulResponse = {
  tours: Tour[];
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

export type Alignment = 'left' | 'center' | 'right';

export type TourStep = {
  actions: ActionType[];
  content: string;
  id: string;
  title: string;
  type: 'modal' | 'pointer' | 'slideout';
  element: string;
  alignment: Alignment;
  positioning: StepPositioning;
};

export type StepPositioning = {
  position:
    | 'left'
    | 'right'
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'top'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom';
  fixed: boolean;
  coordinates: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};

export type TourTrigger = {
  type: string;
};
export type Target = {
  type: 'address-simple' | 'user-segment' | string;
  url?: string;
  formattedName?: string;
  name?: string;
};

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
  bgColor: string;
  secondaryButtonColor: string;
  fontSize: number;
  fontTitleSize: number;
  fontButtonSize: number;
};

export type UsetigulTag = {
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
  id: number;
  updatedAt: string;
};

export type ProgressorData = {
  uf_completed: UFCompleted[];
  tours: ProgressorTour[];
  autoSegment: string;
  customSegments: string[];
  storedAt: string;
};
