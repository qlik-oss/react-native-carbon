import React, {useMemo} from 'react';
import {__DO_NOT_USE__ as NebulaInternals} from '@nebula.js/stardust';
const {theme: themeFn} = NebulaInternals;
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
  const color =
    theme?.getStyle?.('object.title', 'main.name', 'color') || '#404040';
  const ff =
    theme?.getStyle?.('object.title', 'main.name', 'fontSize') || '16px';
  return {color, fontSize: parseInt(ff, 10)};
};

const getSubtitleStyle = (theme: any) => {
  const color =
    theme?.getStyle?.('object.title', 'subTitle.name', 'color') || '#404040';
  const ff =
    theme?.getStyle?.('object.title', 'subTitle.name', 'fontSize') || '12px';
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
  // const theme = this.theme();
  // theme.internalAPI.setTheme(vizTheme, 'horizon');
  const themeRef = useMemo(() => {
    const _theme = themeFn();
    _theme.internalAPI.setTheme(theme, 'custom');
    return _theme;
  }, [theme]);

  const titleStyles = useMemo(() => {
    const titleStyle = getTitleStyle(themeRef);
    const subtitleStyle = getSubtitleStyle(themeRef);
    const marginBottom =
      !disableSubTitle && layout?.subtitle?.length > 0 ? 8 : 0;

    return {titleStyle, subtitleStyle, marginBottom};
  }, [disableSubTitle, layout, themeRef]);

  return layout?.showTitles ? (
    <View
      onLayout={onLayout}
      style={[
        styles.titleBar,
        {minHeight: topPadding || 40},
        {marginBottom: titleStyles.marginBottom},
        style,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[styles.title, {...titleStyles.titleStyle}]}
      >
        {layout.title}
      </Text>
      {!disableSubTitle && layout?.subtitle?.length > 0 ? (
        <Text
          numberOfLines={1}
          style={[styles.subtitle, {...titleStyles.subtitleStyle}]}
        >
          {layout.subtitle}
        </Text>
      ) : null}
    </View>
  ) : topPadding ? (
    <View onLayout={onLayout} style={[styles.filler, {minHeight: topPadding}]} />
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
    minHeight: 40,
  },
  titleBar: {
    paddingLeft: 8,
    justifyContent: 'center',
    paddingTop: 4,
  },
});
