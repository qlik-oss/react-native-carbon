import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

export type LengendItemProps = {
  item: any;
};

export const LegendItem: React.FC<LengendItemProps> = ({item}) => {
  const backgroundColor = item.color;
  return (
    <View style={styles.main}>
      <View style={[styles.box, {backgroundColor}]} />
      <Text
        style={styles.label}
        numberOfLines={1}
        onPressIn={undefined}
        onPressOut={undefined}
      >
        {item.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    margin: 4,
    alignItems: 'center',
  },
  label: {
    marginRight: 8,
    marginLeft: 4,
    maxWidth: 80,
    fontSize: 12,
  },
  box: {
    width: 12,
    height: 12,
  },
});
