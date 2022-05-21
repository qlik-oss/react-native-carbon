import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import SelectionsToolbar from './SelectionsToolbar';

export type TitleProps = {
  layout: any;
  onLayout: (p: any) => void;
  topPadding?: any;
  theme: any;
  style?: any;
  disableSubTitle?: boolean;
};

const getTitleStyle = (theme: any) => {
  let color = theme?.object?.title?.main?.color;
  let fontSize = theme?.object?.title?.main?.fontSize || '20px';
  fontSize = parseInt(fontSize, 10);
  if (color) {
    color = theme?._variables[color] || color;
  }
  return {color, fontSize};
};

const getSubtitleStyle = (theme: any) => {
  let color = theme?.object?.title?.subTitle?.color;
  let fontSize = theme?.object?.title?.subTitle?.fontSize || '5px';
  fontSize = parseInt(fontSize, 10);
  if (color) {
    color = theme?._variables[color] || color;
  }
  return {color, fontSize};
};

export const Title: React.FC<TitleProps> = ({
  layout,
  onLayout,
  topPadding,
  theme,
  style,
  disableSubTitle,
}) => {
  const titleStyle = getTitleStyle(theme);
  const subtitleStyle = getSubtitleStyle(theme);
  const marginBottom = !disableSubTitle && layout?.subtitle?.length > 0 ? 8 : 0;
  return layout?.showTitles ? (
    <View
      onLayout={onLayout}
      style={[
        styles.titleBar,
        // eslint-disable-next-line react-native/no-inline-styles
        {minHeight: topPadding === 'none' ? undefined : 40},
        {marginBottom},
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
  },
  subtitle: {
    color: '#404040',
    fontSize: 12,
  },
  filler: {
    minHeight: 40,
  },
  titleBar: {
    paddingLeft: 8,
    justifyContent: 'center',
    paddingTop: 4,
  },
});
