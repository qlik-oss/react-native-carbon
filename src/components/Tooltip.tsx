/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import Animated, {FadeIn, FadeOut, ZoomIn, ZoomOut} from 'react-native-reanimated';

export type TooltipProps = {
  show: boolean;
  content: any;
};

export const Tooltip: React.FC<TooltipProps> = ({show, content}) => {
  const dims = useWindowDimensions();
  let left = Math.max(content?.tap?.clientX - 175, 0);
  left = left + 350 > dims.width ? dims.width - 358 : left;
  let triangleLeft = content?.tap?.clientX - left; //350 * 0.5;
  return show ? (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[
        styles.talkBubble,
        {top: content.tap.clientY - 52, left: 0, right: 0},
      ]}
    >
      <Animated.View
        entering={ZoomIn.duration(200)}
        exiting={ZoomOut.duration(100)}
        style={[styles.talkBubbleSquare, {left}]}
      >
        {content.content?.display?.()}
        <View
          style={[styles.talkBubbleTriangle, {bottom: -5, left: triangleLeft}]}
        />
      </Animated.View>
    </Animated.View>
  ) : null;
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
    width: 350,
    borderRadius: 4,
    position: 'absolute',
  },
  talkBubbleContent: {
    maxHeight: 400,
  },
  talkBubbleTriangle: {
    position: 'absolute',
    left: 0,
    height: 10,
    width: 10,
    backgroundColor: '#595959',
    transform: [{rotate: '45deg'}],
  },
});
