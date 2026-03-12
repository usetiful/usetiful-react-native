import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Measure } from './types';
import { Modal } from './components/Modal';
import { useStore } from './stores/useStore';
import { Pointer } from './components/Pointer';
import { Slideout } from './components/Slideout';
import { useCurrentRouteName } from './hooks/useCurrentRouteName';
import { useGestureHandler } from './hooks/useGestureHandler';

export const Tour = ({ layoutMeasure }: { layoutMeasure: Measure }) => {
  const currentRouteName = useCurrentRouteName();

  const tourStepIndex = useStore((s) => s.tourStepIndex);

  const step = useStore((s) => s.step);
  const setStep = useStore((s) => s.setStep);
  const availableTour = useStore((s) => s.availableTour);
  const selfClosed = useStore((s) => s.selfClosed);
  const setSelfClosed = useStore((s) => s.setSelfClosed);

  useEffect(() => {
    setSelfClosed(false);
  }, [currentRouteName, setSelfClosed]);

  useEffect(
    () =>
      setStep(
        !!availableTour && !selfClosed && availableTour.steps[tourStepIndex]
          ? availableTour.steps[tourStepIndex]
          : undefined
      ),
    [availableTour, selfClosed, setStep, tourStepIndex]
  );

  const panHandlers = useGestureHandler();

  const refs = useStore((s) => s.pointers);
  const stepType = useMemo(() => {
    if (step && step.type !== 'pointer') return step.type;
    else if (step?.type === 'pointer')
      return refs[step.element] ? 'pointer' : 'slideout';
    else return undefined;
  }, [refs, step]);

  return (
    <>
      {step && (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.guidesAndSurveysLayer,
            backgroundColor: stepType === 'modal' ? '#000000cc' : 'transparent',
            justifyContent: stepType === 'slideout' ? 'flex-end' : 'flex-start',
          }}
          {...panHandlers}
        >
          {stepType === 'modal' && (
            <Modal step={step} key={`${stepType}-${step.id}`} />
          )}
          {stepType === 'pointer' && (
            <Pointer
              step={step}
              layoutMeasure={layoutMeasure}
              key={`${stepType}-${step.id}`}
            />
          )}
          {stepType === 'slideout' && (
            <Slideout step={step} key={`${stepType}-${step.id}`} />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  guidesAndSurveysContainer: {
    flex: 1,
  },
  guidesAndSurveysLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
});
