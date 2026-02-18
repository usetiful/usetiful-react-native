import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Pressable, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import type { Survey as SurveyType } from './types';
import { CrossBtn } from './components/Cross';
import { NPS } from './components/NPS/NPS';
import {
  updateSurveyStarted,
  updateSurveyProgress,
  updateSurveyClosed,
  updateSurveyCompleted,
} from './stores/util/surveyProgress';
import { saveSurveyAnswer } from './stores/util/surveyAnswers';
import {
  fsTrackSurveyStateChanged,
  fsTrackSurveyPageSeen,
  fsTrackQuestionAnswered,
} from './utils/fsEvents';
import { useActiveExperienceStore } from './stores/useActiveExperienceStore';
import { useDataStore } from './stores/useDataStore';

const Survey = ({ survey }: { survey: SurveyType }) => {
  const selfClosed = useActiveExperienceStore((s) => s.selfClosed);
  const setSelfClosed = useActiveExperienceStore((s) => s.setSelfClosed);

  const { control, handleSubmit } = useForm();

  const surveyProgress = useDataStore((s) =>
    s.getCurrentProgressorData().uf_surveys?.find((sp) => sp.id === survey.id)
  );

  const currentPageIndex = useMemo(
    () =>
      surveyProgress
        ? survey.pages.findIndex((p) => p.id === surveyProgress.currentPageId)
        : 0,
    [survey.pages, surveyProgress]
  );

  const currentPage = useMemo(
    () =>
      currentPageIndex >= 0 ? survey.pages[currentPageIndex] : survey.pages[0],
    [survey.pages, currentPageIndex]
  );

  // Initialize survey in store if it's new
  useEffect(() => {
    if (surveyProgress) {
      return;
    }

    const firstPage = survey.pages[0];
    if (!firstPage || !firstPage.id) {
      console.error(`Survey ${survey.id} has no pages or first page has no ID`);
      return;
    }

    updateSurveyStarted(survey.id, survey.name, firstPage.id);
    fsTrackSurveyStateChanged(survey, firstPage, 0, 'started');
  }, [survey, surveyProgress]);

  // Fire "Survey Page Seen" when showing any page
  useEffect(() => {
    if (!currentPage) {
      return;
    }

    fsTrackSurveyPageSeen(survey, currentPage, currentPageIndex);
  }, [survey, currentPage, currentPageIndex]);

  // Filter to only supported question types
  const supportedQuestions =
    currentPage?.questions.filter(
      (q) => q.type === 'nps' || q.type === 'open'
    ) || [];

  const onSubmit = (data: any) => {
    if (!currentPage) {
      return;
    }

    // Save each answer and fire FullStory "Question Answered"
    Object.entries(data).forEach(([questionId, value]) => {
      const question = supportedQuestions.find((q) => q.id === questionId);
      if (question && value !== undefined && value !== null && value !== '') {
        const answer = value as string | number;
        saveSurveyAnswer(
          survey.id,
          questionId,
          question.type,
          answer,
          currentPage.id,
          currentPage.name
        );
        const questionIndex = currentPage.questions.findIndex(
          (q) => q.id === questionId
        );
        fsTrackQuestionAnswered(
          survey,
          currentPage,
          currentPageIndex,
          question,
          questionIndex >= 0 ? questionIndex : 0,
          answer
        );
      }
    });

    const nextPageIndex = currentPageIndex + 1;
    const nextPage = survey.pages[nextPageIndex];

    if (nextPage) {
      updateSurveyProgress(survey.id, nextPage.id);
    } else {
      updateSurveyCompleted(survey.id);
      fsTrackSurveyStateChanged(
        survey,
        currentPage,
        currentPageIndex,
        'completed'
      );
    }
  };

  // Don't show if:
  // - No valid page to display
  // - User closed this survey in current session
  if (!currentPage || selfClosed) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {currentPage.closeButton && (
          <View style={styles.modalHeader}>
            <CrossBtn
              onClose={() => {
                updateSurveyClosed(survey.id);
                fsTrackSurveyStateChanged(
                  survey,
                  currentPage,
                  currentPageIndex,
                  'closed'
                );
                setSelfClosed(true);
              }}
            />
          </View>
        )}
        <View style={styles.modalBody}>
          {supportedQuestions.map((question) => (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.questionText}>{question.question}</Text>
              <Controller
                control={control}
                name={question.id}
                rules={{ required: question.required }}
                render={({ field: { onChange, value } }) => {
                  if (question.type === 'nps') {
                    return (
                      <NPS
                        value={value}
                        onChange={onChange}
                        leftLabel={question.minimalValueLabel}
                        rightLabel={question.maximalValueLabel}
                      />
                    );
                  }

                  // question.type === 'open'
                  return (
                    <TextInput
                      style={styles.textInput}
                      value={value || ''}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={4}
                      placeholder="Type your answer here..."
                      placeholderTextColor="#999999"
                      textAlignVertical="top"
                    />
                  );
                }}
              />
            </View>
          ))}
        </View>
        <View style={styles.modalFooter}>
          <Pressable
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>
              {currentPage.actions.label || 'Submit'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Survey;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
  modal: {
    backgroundColor: 'white',
    marginTop: '50%',
    marginHorizontal: '5%',
    shadowColor: '#000000',
    shadowOpacity: 0.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  modalHeader: {
    alignItems: 'flex-end',
  },
  modalBody: {
    paddingVertical: 8,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  modalFooter: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
