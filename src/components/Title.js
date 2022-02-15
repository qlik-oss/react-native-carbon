import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const getTitleStyle = (theme) => {
  let color = theme?.object?.title?.main?.color;
  let fontSize = theme?.object?.title?.main?.fontSize || '5px';
  fontSize = parseInt(fontSize, 10);
  if (color) {
    color = theme?._variables[color] || color;
  }
  return {color, fontSize};
};

const getSubtitleStyle = (theme) => {
  let color = theme?.object?.title?.subTitle?.color;
  let fontSize = theme?.object?.title?.subTitle?.fontSize || '5px';
  fontSize = parseInt(fontSize, 10);
  if (color) {
    color = theme?._variables[color] || color;
  }
  return {color, fontSize};
};

export const Title = ({
  layout,
  onLayout,
  topPadding,
  theme,
  style,
  disableSubTitle,
}) => {
  const titleStyle = getTitleStyle(theme);
  const subtitleStyle = getSubtitleStyle(theme);
  return layout?.showTitles ? (
    <View
      onLayout={onLayout}
      style={[
        styles.titleBar,
        // eslint-disable-next-line react-native/no-inline-styles
        {minHeight: topPadding === 'none' ? undefined : 40},
        style,
      ]}
    >
      {layout?.title?.length > 0 ? (
        <Text numberOfLines={1} style={[styles.title, {...titleStyle}]}>
          {layout.title}
        </Text>
      ) : null}
      {!disableSubTitle && layout?.subtitle?.length > 0 ? (
        <Text numberOfLines={1} style={[styles.subtitle, {...subtitleStyle}]}>
          {layout.subtitle}
        </Text>
      ) : null}
    </View>
  ) : topPadding === 'none' ? null : (
    <View onLayout={onLayout} style={styles.filler} />
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#404040',
    margin: 0,
    flex: 1,
  },
  subtitle: {
    color: '#404040',
    fontSize: 12,
    marginLeft: 4,
  },
  filler: {
    height: 40,
  },
  titleBar: {
    minHeight: 40,
    paddingLeft: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginRight: 8,
    paddingBottom: 2,
  },
});