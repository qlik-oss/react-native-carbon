import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Caption} from 'react-native-paper';

export type FooterType = {
  layout: any;
  theme: any;
};

const getFootStyle = (theme: any) => {
  let color = theme?.object?.title?.footer?.color;
  let fontSize = theme?.object?.title?.footer?.fontSize || '5px';
  let fontStyle = theme?.object?.title?.footer?.fontVariant;
  let backgroundColor =
    theme?.object?.title?.footer?.backgroundColor || 'white';
  fontSize = parseInt(fontSize, 10);
  if (color) {
    color = theme?._variables[color] || color;
  }
  if (backgroundColor) {
    backgroundColor = theme?._variables[backgroundColor] || backgroundColor;
  }
  if (fontStyle === 'regular') {
    fontStyle = 'normal';
  }
  return {color, fontSize, backgroundColor, fontStyle};
};

export const Footer: React.FC<FooterType> = ({layout, theme}) => {
  const footerStyle = getFootStyle(theme);
  return layout?.showTitles && layout?.footnote?.length > 0 ? (
    <View style={[styles.body, {backgroundColor: footerStyle.backgroundColor}]}>
      <Caption numberOfLines={1} style={[styles.footer, {...footerStyle}]}>
        {layout?.footnote}
      </Caption>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F7F7F7',
    padding: 8,
    borderRadius: 4,
    height: 36,
  },
  footer: {
    fontStyle: 'italic',
    fontSize: 12,
  },
});
