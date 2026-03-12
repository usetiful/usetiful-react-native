import type {
  ProgressorData,
  SurveyReporterAnswer,
  GuidesAndSurveysResponse,
} from '../types';
import { API_CONFIG } from '../constants/api';

/**
 * Fetches tour data from the Guides And Surveys API
 * @param token - Authentication token
 * @returns Array of tours or empty array on error
 */
export const fetchDataJson = async (
  token: string
): Promise<GuidesAndSurveysResponse | null> => {
  const reqUrl = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.DATA}?lang=${API_CONFIG.DEFAULT_PARAMS.lang}&app=${API_CONFIG.DEFAULT_PARAMS.app}`;
  try {
    const response = await fetch(reqUrl, {
      method: 'GET',
      headers: {
        'x-org-id': token,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=utf-8',
      },
    });

    if (!response.ok) {
      console.error(`GuidesAndSurveys HTTP ERROR - status: ${response.status}`);
      return null;
    }

    const res: GuidesAndSurveysResponse = await response.json();

    console.log(`GuidesAndSurveys: data loaded`);

    return res;
  } catch (error: any) {
    console.error('=====error====>', error.message);
    return null;
  }
};

/**
 * Fetches user progress data from the Progressor API
 * @param accountToken - Guide & Surveys space token
 * @param sessionId - Session ID to fetch progress for
 * @returns Progress data or null on error
 */
export const fetchProgressor = async (
  accountToken: string,
  sessionId: string
): Promise<ProgressorData | null> => {
  const url = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.PROGRESSOR_GET}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const body = JSON.stringify({
    sessionId,
    accountToken,
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.error(
        '=======Error=====>',
        new Error(`GuidesAndSurveys: connection error ${response.status}`)
      );
      return null;
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('=======Error=====>', error.message);
    return null;
  }
};

/**
 * Saves user progress data to the Progressor API
 * @param accountToken - Guide & Surveys space token
 * @param sessionId - Session ID to save progress for
 * @param progressorData - Progress data to save
 * @returns True if save was successful, false otherwise
 */
export const saveProgressor = async (
  accountToken: string,
  sessionId: string,
  progressorData: ProgressorData
): Promise<boolean> => {
  const url = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.PROGRESSOR_SAVE}`;
  const headers = {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
  const body = JSON.stringify({
    sessionId,
    accountToken,
    data: progressorData,
  });

  try {
    const response = await fetch(url, {
      keepalive: true,
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      console.error(
        '=======Error=====>',
        new Error(`GuidesAndSurveys: connection error ${response.status}`)
      );
      return false;
    }
    console.log('GuidesAndSurveys: Progressor is updated!');
    return true;
  } catch (error: any) {
    console.error('=======Error=====>', error.message);
    return false;
  }
};

/**
 * Posts a survey response to the reporter API for analytics.
 * @param accountToken - Guide & Surveys space token
 * @param surveyId - Survey ID
 * @param payload - Survey response payload (visitorIdent, tags, respondedAt, etc.)
 * @returns True if post was successful, false otherwise
 */
export const postSurveyResponse = async (
  accountToken: string,
  surveyId: string,
  payload: SurveyReporterAnswer[]
): Promise<boolean> => {
  const url = `${API_CONFIG.PLAYPEN_BASE_URL}${API_CONFIG.ENDPOINTS.SURVEY_RESPONSES}/${surveyId}/responses/`;
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'x-auth-token': accountToken,
  };
  const body = JSON.stringify(payload);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      console.error(
        'GuidesAndSurveys: reporter survey response error',
        response.status
      );
      return false;
    }

    console.log(
      'GuidesAndSurveys: reporter survey response is sent:',
      response.status,
      body
    );
    return true;
  } catch (error: any) {
    console.error(
      'GuidesAndSurveys: reporter survey response error',
      error?.message
    );
    return false;
  }
};
