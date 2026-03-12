/**
 * API Configuration
 * Central location for all API URLs and endpoints
 */
export const API_CONFIG = {
  PLAYPEN_BASE_URL: 'https://guides.onfire.fyi',
  ENDPOINTS: {
    DATA: '/api-space/data.json',
    PROGRESSOR_GET: '/progressor/api/get',
    PROGRESSOR_SAVE: '/progressor/api/save',
    SURVEY_RESPONSES: '/reporter/api/surveys',
  },
  DEFAULT_PARAMS: {
    lang: 'en',
    app: 'mobile',
  },
} as const;
