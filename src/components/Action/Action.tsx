import { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import type { ActionType } from '../../types';
import { useStore } from '../../stores/useStore';

type ActionProps = {
  action: ActionType;
  onClose: () => void;
};
export const USAction = ({ action, onClose }: ActionProps) => {
  const { styleType, type, value, to } = action;
  const theme = useStore((s) => s.theme);

  const setTourStepIndex = useStore((s) => s.setTourStepIndex);
  const tourStepIndex = useStore((s) => s.tourStepIndex);
  const tourStepLength = useStore((s) => s.tourStepLength);
  const availableTour = useStore((s) => s.availableTour);

  const onPress = useMemo(() => {
    switch (type) {
      case 'next':
        if (tourStepIndex < tourStepLength - 1)
          return () => setTourStepIndex(tourStepIndex + 1);
        else return onClose;
      case 'previous':
        return () => setTourStepIndex(tourStepIndex - 1);
      case 'jump':
        return () => {
          if (!availableTour || !availableTour.steps) return;
          const stepIndex = availableTour.steps.findIndex(
            (step) => parseInt(step.id, 10) === parseInt(to, 10)
          );
          if (stepIndex !== -1) {
            setTourStepIndex(stepIndex);
          }
        };

      default:
        return onClose;
    }
  }, [
    onClose,
    setTourStepIndex,
    tourStepIndex,
    tourStepLength,
    type,
    to,
    availableTour,
  ]);

  const btnStyles = useMemo(
    () =>
      StyleSheet.create({
        footerBtn: {
          marginRight: 10,
          padding: 8,
          borderRadius: 6,
        },
        primaryBtn: {
          backgroundColor: theme.primaryColor,
          color: '#fff',
          borderWidth: 0,
        },
        secondaryBtn: {
          borderColor: theme.secondaryButtonColor,
          borderWidth: 1,
        },
      }),
    [theme]
  );

  const textStyles = useMemo(
    () =>
      StyleSheet.create({
        footerBtn: {
          fontWeight: '500',
          fontSize: theme.fontButtonSize,
        },
        primaryBtn: {
          color: '#fff',
        },
        secondaryBtn: {
          color: theme.secondaryButtonColor,
        },
      }),
    [theme]
  );

  const textStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return { ...textStyles.footerBtn, ...textStyles.primaryBtn };
      case 'Secondary':
        return { ...textStyles.footerBtn, ...textStyles.secondaryBtn };
      default:
        return { ...textStyles.footerBtn };
    }
  }, [
    styleType,
    textStyles.footerBtn,
    textStyles.primaryBtn,
    textStyles.secondaryBtn,
  ]);
  const btnStyle = useMemo(() => {
    switch (styleType) {
      case 'Primary':
        return { ...btnStyles.footerBtn, ...btnStyles.primaryBtn };
      case 'Secondary':
        return { ...btnStyles.footerBtn, ...btnStyles.secondaryBtn };
      default:
        return { ...btnStyles.footerBtn };
    }
  }, [
    btnStyles.footerBtn,
    btnStyles.primaryBtn,
    btnStyles.secondaryBtn,
    styleType,
  ]);

  return (
    <TouchableOpacity style={btnStyle} onPress={onPress}>
      <Text style={textStyle}>{value}</Text>
    </TouchableOpacity>
  );
};
