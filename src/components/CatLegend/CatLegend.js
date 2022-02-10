import {LegendItem} from './LegendItem';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-paper';
import {ScrollView} from 'react-native-gesture-handler';

export const CatLegend = ({element, layout}) => {
  const [data, setData] = useState(undefined);
  const bottom = layout?.showTitles && layout?.footnote?.length > 0 ? 36 : 0;
  useEffect(() => {
    if (element) {
      element.setCatLegendListener((_data) => {
        setData(_data);
      });
    }
  }, [element]);
  return layout?.legend?.show && element?.catLegendMounted ? (
    <View style={[styles.main, {bottom}]}>
      {layout.legend.showTitle ? (
        <Text numberOfLines={1} style={styles.title}>
          {element.catLegendTitle}
        </Text>
      ) : null}
      <ScrollView
        style={styles.scroll}
        horizontal={true}
        contentContainerStyle={styles.content}
      >
        {data
          ? data.map((item, index) => <LegendItem key={index} item={item} />)
          : null}
      </ScrollView>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    bottom: 36,
    left: 0,
    right: 0,
    height: 64,
    width: '100%',
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});
