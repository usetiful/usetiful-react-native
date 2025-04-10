import { StyleSheet, View, Dimensions } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { Body } from '../Body';
import { Action } from '../Action';
import type { Alignment, StepPositioning, Theme, TourStep } from '../../types';
import { useMemo } from 'react';
import { useStore } from '../../stores/useStore';
import { StepHeader } from '../StepHeader/StepHeader';
import { RenderProgressBar } from '../ProgressBar';

type ModalProps = {
  step: TourStep;
};

export const Modal = ({ step }: ModalProps) => {
  const { title, actions, content, alignment, positioning } = step;
  const theme = useStore((s) => s.theme);

  const styles = useStyle(alignment, positioning, theme);

  return (
    <View style={styles.modal}>
      <StepHeader {...{ title }} />
      <View style={styles.modalBody}>
        {!!content && <Body content={content} />}
      </View>
      <View style={styles.modalActions}>
        {actions.map((action) => {
          return <Action key={action.id} {...{ action }} />;
        })}
      </View>
      <RenderProgressBar />
    </View>
  );
};

const useStyle = (
  alignment: Alignment,
  positioning: StepPositioning,
  theme: Theme
) => {
  return useMemo(() => {
    const justifyContent =
      alignment === 'left'
        ? 'flex-start'
        : alignment === 'center'
          ? 'center'
          : alignment === 'right'
            ? 'flex-end'
            : 'flex-start';

    const positionStyles: StyleProp<ViewStyle> = {
      position: 'absolute',
    };

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    switch (positioning.position) {
      case 'top-left':
        positionStyles.width = '90%';
        positionStyles.top = Math.max(positioning.coordinates.top ?? 20, 20);
        positionStyles.left = positioning.coordinates.left ?? 20;
        break;
      case 'left':
        positionStyles.width = '90%';
        positionStyles.left = positioning.coordinates.left ?? 20;
        positionStyles.top = '50%';
        positionStyles.transform = [{ translateY: -(screenHeight * 0.25) }];
        break;
      case 'bottom-left':
        positionStyles.bottom = Math.max(
          positioning.coordinates.bottom ?? 20,
          20
        );
        positionStyles.left = positioning.coordinates.left ?? 20;
        positionStyles.width = '90%';
        break;
      case 'top':
        positionStyles.top = Math.max(positioning.coordinates.top ?? 20, 20);
        positionStyles.left = '50%';
        positionStyles.width = '80%';
        positionStyles.transform = [{ translateX: -(screenWidth * 0.4) }];
        break;
      case 'center':
        positionStyles.width = '90%';
        positionStyles.top = '50%';
        positionStyles.left = '50%';
        positionStyles.transform = [
          { translateX: -(screenWidth * 0.45) },
          { translateY: -(screenHeight * 0.25) },
        ];
        break;
      case 'bottom':
        positionStyles.width = '90%';
        positionStyles.left = '50%';
        positionStyles.bottom = Math.max(
          positioning.coordinates.bottom ?? 20,
          20
        );
        positionStyles.transform = [{ translateX: -(screenWidth * 0.45) }];
        break;
      case 'top-right':
        positionStyles.width = '90%';
        positionStyles.top = positioning.coordinates.top ?? 20;
        positionStyles.right = positioning.coordinates.right ?? 20;
        break;
      case 'right':
        positionStyles.width = '90%';
        positionStyles.right = positioning.coordinates.right ?? 20;
        positionStyles.top = '50%';
        positionStyles.transform = [{ translateY: -50 }];
        break;
      case 'bottom-right':
        positionStyles.width = '90%';
        positionStyles.bottom = positioning.coordinates.bottom ?? 20;
        positionStyles.right = positioning.coordinates.right ?? 20;
        break;
      default:
        positionStyles.top = 20;
        positionStyles.left = '50%';
        positionStyles.transform = [{ translateX: -50 }];
    }

    return StyleSheet.create({
      modal: {
        backgroundColor: theme.bgColor,
        shadowColor: '#000000',
        shadowOpacity: 0.5,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        ...positionStyles,
      },
      modalActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: justifyContent,
        alignItems: 'flex-start',
        marginTop: 10,
      },
      modalBody: {
        paddingVertical: 8,
      },
    });
  }, [theme, alignment, positioning]);
};
