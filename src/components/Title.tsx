import React, {useState, useEffect} from 'react';
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
  showTitle?: string;
  element: any;
};

const getTitleStyle = (theme: any) => {
  const color = theme?.getStyle('object.title', 'main.name', 'color') || 'red';
  const ff = theme?.getStyle('object.title', 'main.name', 'fontSize') || '12px';
  return {color, fontSize: parseInt(ff, 10)};
};

const getSubtitleStyle = (theme: any) => {
  const color =
    theme?.getStyle('object.title', 'subTitle.name', 'color') || 'red';
  const ff =
    theme?.getStyle('object.title', 'subTitle.name', 'fontSize') || '12px';
  return {color, fontSize: parseInt(ff, 10)};
};

export const Title: React.FC<TitleProps> = ({
  layout,
  onLayout,
  topPadding,
  theme,
  style,
  disableSubTitle,
  element,
  showTitle,
}) => {
  const [title, setTitle] = useState<string | undefined>(undefined);
  const titleStyle = getTitleStyle(theme);
  const subtitleStyle = getSubtitleStyle(theme);
  const marginBottom = !disableSubTitle && layout?.subtitle?.length > 0 ? 8 : 0;

  useEffect(() => {
    const onTitleChanged = (v: string) => {
      setTitle(v);
    };
    if (element) {
      element.eventEmitter.on('titleChanged', onTitleChanged);
    }

    return () => {
      if (element) {
        element.eventEmitter.off('titleChanged', onTitleChanged);
      }
    };
  }, [element]);

  return layout?.showTitles || showTitle ? (
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
      <Text numberOfLines={1} style={[styles.title, {...titleStyle}]}>
        {title || layout.title}
      </Text>
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
