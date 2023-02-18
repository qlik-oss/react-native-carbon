import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

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
      <Text numberOfLines={1} style={[styles.footer, {...footerStyle}]}>
        {layout?.footnote}
      </Text>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 8,
    borderRadius: 4,
    height: 36,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#rgba(217, 217, 217, 0.5)',
  },
  footer: {
    fontStyle: 'italic',
    fontSize: 12,
  },
});
