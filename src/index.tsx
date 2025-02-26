import { useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Measure, UsetigulTag } from './types';
import { Modal } from './components/Modal';
import { useStore } from './stores/useStore';
import { Pointer } from './components/Pointer';
import { Slideout } from './components/Slideout';
import { useCurrentRouteName } from './hooks/useCurrentRouteName';
import { useTargetting } from './hooks/useTargetting';
import { useProgressorUpdate } from './hooks/useProgressorUpdate';
export { setPointer } from './utils/setPointer';

type Props = {
  token: string;
  tags?: UsetigulTag;
} & PropsWithChildren;

export const Usetiful = ({ children, token, tags }: Props) => {
  const currentRouteName = useCurrentRouteName();

  const tourStepIndex = useStore((s) => s.tourStepIndex);

  const setToken = useStore((s) => s.setToken);
  const availableTour = useStore((s) => s.availableTour);
  const [layoutMeasure, setLayoutMeasure] = useState<Measure>();

  const closeTour = () => {
    useStore.setState((state) => {
      if (state.progressorData && state.progressorData.tours && availableTour) {
        const updatedTours = state.progressorData.tours.map((tour) => {
          if (tour.id === availableTour.id) {
            return { ...tour, state: 'closed' };
          }
          return tour;
        });

        return {
          progressorData: {
            ...state.progressorData,
            tours: updatedTours,
          },
        };
      }
      return state;
    });
  };
  useEffect(() => {
    setToken(token, tags);
  }, [setToken, tags, token]);

  useTargetting();
  useProgressorUpdate();

  useEffect(() => {
    setSelfClosed(false);
  }, [currentRouteName]);
  const [selfClosed, setSelfClosed] = useState(false);

  const step =
    !!availableTour && !selfClosed && availableTour.steps[tourStepIndex]
      ? availableTour.steps[tourStepIndex]
      : undefined;

  const refs = useStore((s) => s.pointers);
  const stepType = useMemo(() => {
    if (step && step.type !== 'pointer') return step.type;
    else if (step?.type === 'pointer')
      return refs[step.element] ? 'pointer' : 'slideout';
    else return undefined;
  }, [refs, step]);

  return (
    <View
      style={styles.UsetifulContainer}
      onLayout={(e) => {
        e.target.measure((x, y, width, height, pageX, pageY) => {
          if (
            ![x, y, width, height, pageX, pageY].some((i) => i === undefined)
          ) {
            setLayoutMeasure({ x, y, width, height, pageX, pageY } as Measure);
          }
        });
      }}
    >
      {children}
      {step && (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.usetifulLayer,
            backgroundColor: stepType === 'modal' ? '#000000cc' : 'transparent',
            justifyContent: stepType === 'slideout' ? 'flex-end' : 'flex-start',
          }}
        >
          {stepType === 'modal' && (
            <Modal step={step} onClose={() => setSelfClosed(true)} />
          )}
          {stepType === 'pointer' && (
            <Pointer
              step={step}
              onClose={() => setSelfClosed(true)}
              layoutMeasure={layoutMeasure}
            />
          )}
          {stepType === 'slideout' && (
            <Slideout
              step={step}
              onClose={() => {
                setSelfClosed(true);
                closeTour();
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  UsetifulContainer: {
    flex: 1,
  },
  usetifulLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000000cc',
  },
  crossBtn: {
    fontSize: 16,
    width: 20,
    height: 20,
    alignItems: 'flex-end',
  },
  footerBtn: {
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
  primaryBtn: {
    backgroundColor: '#387DFF',
  },
  secondaryBrn: {
    borderColor: '#464646',
    borderWidth: 1,
  },
});
