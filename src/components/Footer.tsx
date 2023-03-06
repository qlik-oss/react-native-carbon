import CarbonTheme from '../core/CarbonTheme';
import React, {useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';

export type FooterType = {
  layout: any;
  theme: any;
};

const getFootStyle = (theme: CarbonTheme) => {
  let color = theme.getValue('object.title.footer.color', '#404040');
  let fontSize = theme.getFont('object.title.footer.fontSize', '10');
  let fontStyle = theme.getValue('object.title.footer.fontVariant', 'italic');
  let backgroundColor = theme.getValue(
    'object.title.footer.backgroundColor',
    '#F0F0F0',
  );
  return {color, fontSize, backgroundColor, fontStyle};
};

export const Footer: React.FC<FooterType> = ({layout, theme}) => {
  const carbonTheme = useRef<CarbonTheme>(new CarbonTheme({theme}));
  const footerStyle = getFootStyle(carbonTheme.current);
  return layout?.showTitles && layout?.footnote?.length > 0 ? (
    <View style={[styles.body, {backgroundColor: footerStyle.backgroundColor}]}>
      <Text numberOfLines={1} style={[styles.footer, footerStyle]}>
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
