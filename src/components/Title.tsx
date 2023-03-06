import React, {useMemo} from 'react';
import {getValue} from './internalTheme';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';

export type TitleProps = {
  layout: any;
  onLayout: (p: any) => void;
  topPadding?: any;
  theme: any;
  style?: any;
  disableSubTitle?: boolean;
};

const getTitleStyle = (theme: any) => {
  const color = getValue(theme, 'object.title.main.color', '#404040');
  const ff = getValue(theme, 'object.title.main.fontSize', '16px');
  return {color, fontSize: parseInt(ff, 10)};
};

const getSubtitleStyle = (theme: any) => {
  const color = getValue(theme, 'object.title.subTitle.color', '#404040');
  const ff = getValue(theme, 'object.title.subTitle.fontSize', '16px');
  return {color, fontSize: parseInt(ff, 10)};
};

export const Title: React.FC<TitleProps> = ({
  layout,
  onLayout,
  topPadding,
  theme,
  style,
  disableSubTitle,
}) => {
  const titleStyles = useMemo(() => {
    const titleStyle = getTitleStyle(theme);
    const subtitleStyle = getSubtitleStyle(theme);
    const marginBottom =
      !disableSubTitle && layout?.subtitle?.length > 0 ? 8 : 0;

    return {titleStyle, subtitleStyle, marginBottom};
  }, [disableSubTitle, layout, theme]);

  return layout?.showTitles ? (
    <View
      onLayout={onLayout}
      style={[
        styles.titleBar,
        {minHeight: topPadding || 36},
        {marginBottom: titleStyles.marginBottom},
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          {...titleStyles.titleStyle},
          {lineHeight: titleStyles?.titleStyle?.fontSize},
        ]}
      >
        {layout.title}
      </Text>
      {!disableSubTitle && layout?.subtitle?.length > 0 ? (
        <Text
          numberOfLines={1}
          style={[
            styles.subtitle,
            {...titleStyles.subtitleStyle},
            {lineHeight: titleStyles?.subtitleStyle?.fontSize},
          ]}
        >
          {layout.subtitle}
        </Text>
      ) : null}
    </View>
  ) : topPadding ? (
    <View
      onLayout={onLayout}
      style={[styles.filler, {minHeight: topPadding}]}
    />
  ) : null;
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
    minHeight: 36,
  },
  titleBar: {
    paddingLeft: 8,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
});
