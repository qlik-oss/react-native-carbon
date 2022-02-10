import {
  supernovaToolTipStateAtom,
  supernovaToolTipVisible,
} from '@qlik/react-native-carbon/src/carbonAtoms';
import {useAtomValue, useResetAtom} from 'jotai/utils';
import {useAtom} from 'jotai';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const animationConfig = {
  duration: 150,
  easing: Easing.inOut(Easing.linear),
  useNativeDriver: true,
};

export const Tooltip = ({duration, insets}) => {
  const deviceInsets = useSafeAreaInsets();
  const tooltipState = useAtomValue(supernovaToolTipStateAtom);
  const [visible, setVisible] = useAtom(supernovaToolTipVisible);
  const resetTooltipState = useResetAtom(supernovaToolTipStateAtom);
  const layout = useRef(undefined);
  const cachedShowState = useRef(undefined);
  const animationProgress = useRef(new Animated.Value(0));

  const [showState, setShowState] = useState({
    top: 0,
    left: 0,
    triangleLeft: 0,
    triangleBottom: -5,
  });

  const opacity = animationProgress.current.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0, 1],
  });

  const scale = animationProgress.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  useEffect(() => {
    if (visible) {
      layout.current = undefined;
      Animated.timing(animationProgress.current).stop();
      calcluatePos();
    } else {
      Animated.timing(animationProgress.current).stop();
      Animated.timing(animationProgress.current, {
        ...animationConfig,
        toValue: 0,
      }).start();
    }
  }, [calcluatePos, duration, visible, tooltipState.config]);

  const calcluatePos = useCallback(() => {
    if (tooltipState.config) {
      const params = tooltipState.config;
      const nativeEvent = cachedShowState.current;
      const triangleHalf = 5;

      const topInset = insets?.top || 0;
      let triangleBottom = -triangleHalf;
      let top =
        params.pageLocation.pageY +
        params.rect.y -
        nativeEvent.height -
        triangleHalf -
        2 +
        topInset;

      if (top < deviceInsets.top) {
        top = deviceInsets.top;
      }
      let left = params.pageLocation.pageX;
      let triangleLeft = params.rect.x + params.rect.width * 0.5 - triangleHalf;

      layout.current = true;
      setShowState({
        top,
        left,
        width: params.pageLocation.width,
        triangleLeft,
        triangleBottom,
      });
      if (visible) {
        Animated.timing(animationProgress.current, {
          toValue: 1,
          ...animationConfig,
        }).start();
      }
    }
  }, [tooltipState.config, insets?.top, deviceInsets.top, visible]);

  const onLayout = ({nativeEvent}) => {
    cachedShowState.current = {...nativeEvent.layout};
    calcluatePos();
  };

  const onClose = () => {
    setVisible(false);
    resetTooltipState();
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.talkBubble, {...showState}]}
      onLayout={onLayout}
    >
      <Animated.View style={[{opacity, transform: [{scale}]}]}>
        <View style={styles.talkBubbleSquare}>
          {tooltipState?.config?.content?.display() || null}
          <IconButton
            icon="cross"
            color="white"
            size={16}
            style={styles.close}
            onPress={onClose}
          />
        </View>
        <View
          style={[
            styles.talkBubbleTriangle,
            {left: showState.triangleLeft, bottom: showState.triangleBottom},
          ]}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  talkBubble: {
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8.65,
    elevation: 8,
  },
  talkBubbleSquare: {
    padding: 8,
    backgroundColor: '#595959',
    borderRadius: 4,
  },
  talkBubbleTriangle: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    height: 10,
    width: 10,
    backgroundColor: '#595959',
    transform: [{rotate: '45deg'}],
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
