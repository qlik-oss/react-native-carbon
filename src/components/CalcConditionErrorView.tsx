import React from 'react';
import {StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

export type CalcConditionErrorViewProps = {
  layout: any;
};

const CalcConditionErrorView: React.FC<CalcConditionErrorViewProps> = ({
  layout,
}) => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.body}>
      <Text style={styles.text}>{layout?.qHyperCube?.qCalcCondMsg}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  body: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F6F6F6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default CalcConditionErrorView;
