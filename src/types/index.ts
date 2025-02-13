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
};
export type ActionType = {
  id: string;
  styleType: 'Primary' | 'Secondary' | string;
  type: 'next' | 'close' | 'previous' | 'jump';
  value: string;
  to: string;
};
export type TourStep = {
  actions: ActionType[];
  content: string;
  id: string;
  title: string;
  type: 'modal' | 'pointer' | 'slideout';
  element: string;
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

export type ProgressorData = {
  uf_completed: [];
  tours: {
    id: number;
    state: string;
    name: string;
    currentStep: number;
    updatedAt: string;
  }[];
  checklistsRedirects: [];
  checklistsDismiss: [];
  uf_tags: UsetigulTag;
  uf_banners: [];
  uf_smartTips: [];
  autoSegment: string;
  customSegments: string[];
  report_tags: { firstName: 'vahid'; lastName: 'alam' };
  storedAt: string;
  abExperiments: [];
};
