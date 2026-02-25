import Fullstory from '@fullstory/react-native';
import type { Survey, SurveyPage, SurveyQuestion } from '../types';
import { FS_EVENT_NAMES } from '../constants';

function baseSurveyPageProperties(
  survey: Survey,
  page: SurveyPage,
  pageIndex: number
): Record<string, string | number> {
  return {
    surveyName: survey.name,
    surveyId: survey.id,
    pageName: page.name,
    pageType: page.type,
    pageId: page.id,
    pageIndex,
  };
}

/**
 * Fire "Survey State Changed" (started or completed).
 */
export function fsTrackSurveyStateChanged(
  survey: Survey,
  page: SurveyPage,
  pageIndex: number,
  state: 'started' | 'completed' | 'closed'
): void {
  Fullstory.event(FS_EVENT_NAMES.surveyStateChanged, {
    ...baseSurveyPageProperties(survey, page, pageIndex),
    state,
  });
}

/**
 * Fire "Survey Page Seen" when a page is shown.
 */
export function fsTrackSurveyPageSeen(
  survey: Survey,
  page: SurveyPage,
  pageIndex: number
): void {
  Fullstory.event(FS_EVENT_NAMES.surveyPageSeen, {
    ...baseSurveyPageProperties(survey, page, pageIndex),
  });
}

const npsCategory = (score: number): 'promoter' | 'neutral' | 'detractor' => {
  if (score >= 9) return 'promoter';
  if (score >= 7) return 'neutral';
  return 'detractor';
};

/**
 * Fire "Question Answered" for each submitted question.
 * For NPS questions, adds npsCategory. Open answers are masked.
 */
export function fsTrackQuestionAnswered(
  survey: Survey,
  page: SurveyPage,
  pageIndex: number,
  question: SurveyQuestion,
  questionIndex: number,
  answer: string | number
): void {
  const props: Record<string, string | number | boolean> = {
    ...baseSurveyPageProperties(survey, page, pageIndex),
    questionName: question.question,
    questionId: question.id,
    questionType: question.type,
    isRequired: question.required,
    questionIndex,
    answer,
  };
  if (question.type === 'nps' && typeof answer === 'number') {
    props.npsCategory = npsCategory(answer);
  }
  if (question.type === 'open') {
    props.answer = 'answer masked';
  }
  Fullstory.event(FS_EVENT_NAMES.questionAnswered, props);
}
