import type { SurveyAnswer, SurveyReporterAnswer, Tag } from '../../types';
import { useDataStore } from '../useDataStore';
import { useReportQueueStore } from '../useReportQueueStore';

function createProgressorAnswer(
  surveyId: string,
  questionId: string,
  questionType: string,
  value: string | number,
  pageId: string,
  pageName?: string
): SurveyAnswer {
  const updatedAt = new Date().toISOString();
  const answer: SurveyAnswer = {
    id: `${surveyId}_${questionId}_${Date.now()}`,
    updatedAt,
    surveyId,
    questionId,
    questionType,
    pageId,
    pageName,
  };
  // TODO: add other question types
  if (questionType === 'nps') {
    answer.optionValue =
      typeof value === 'number' ? value : parseInt(value as string, 10);
  } else if (questionType === 'open') {
    answer.answerText = String(value);
  }
  return answer;
}

function createReporterAnswer(
  questionId: string,
  questionType: string,
  value: string | number,
  visitorIdent: string,
  respondedAt: string,
  tags?: Tag
): SurveyReporterAnswer {
  const reporterAnswer: SurveyReporterAnswer = {
    questionId,
    questionType,
    visitorIdent,
    respondedAt,
    ...(tags && { tags }),
  };
  if (questionType === 'nps') {
    reporterAnswer.optionValue =
      typeof value === 'number' ? value : parseInt(value as string, 10);
  } else if (questionType === 'open') {
    reporterAnswer.answerText = String(value);
  }
  // TODO: add other question types (e.g. optionValues for multi-select)
  return reporterAnswer;
}

/**
 * Persist a survey answer to the progressor and enqueue it for the reporter.
 * Creates two representations from the same event: one for progress, one for analytics.
 */
export const saveSurveyAnswer = (
  surveyId: string,
  questionId: string,
  questionType: string,
  value: string | number,
  pageId: string,
  pageName?: string
): void => {
  const progressorData = useDataStore.getState().getCurrentProgressorData();
  const uf_survey_answers = progressorData.uf_survey_answers || [];

  const progressorAnswer = createProgressorAnswer(
    surveyId,
    questionId,
    questionType,
    value,
    pageId,
    pageName
  );
  useDataStore.getState().setProgressorData({
    ...progressorData,
    uf_survey_answers: [...uf_survey_answers, progressorAnswer],
  });

  const { visitorIdent, tags, spaceToken } = useDataStore.getState();

  // should always be available
  if (visitorIdent && spaceToken) {
    const reporterAnswer = createReporterAnswer(
      questionId,
      questionType,
      value,
      visitorIdent,
      progressorAnswer.updatedAt,
      tags
    );
    useReportQueueStore
      .getState()
      .addPendingReport(surveyId, reporterAnswer, spaceToken);
  }
};
