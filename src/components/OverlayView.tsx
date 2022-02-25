import React, {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
} from 'react-native-reanimated';

export type OverlayViewTypes = {
  suspended: boolean;
};

export const OverlayView: React.FC<OverlayViewTypes> = ({suspended}) => {
  const progress = useSharedValue(0);
  useEffect(() => {
    if (!suspended) {
      progress.value = withTiming(0, {duration: 300});
    } else {
      progress.value = withRepeat(
        withSequence(
          withTiming(0.7, {
            duration: 2200,
            easing: Easing.in(Easing.elastic(1)),
          }),
          withTiming(0.5, {
            duration: 2200,
            easing: Easing.in(Easing.elastic(1)),
          }),
        ),
        -1,
        true,
      );
    }
  }, [progress, suspended]);
  const animatedStyle = useAnimatedStyle(() => {
    return {opacity: progress.value};
  }, [suspended]);

  return (
    <Animated.View
      style={[styles.body, animatedStyle]}
      pointerEvents={suspended ? 'auto' : 'none'}
    />
  );
};

const styles = {
  body: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
  },
};
