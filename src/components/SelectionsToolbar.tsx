import React, {useRef, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, IconButton, ToggleButton} from 'react-native-paper';
import {useAtomValue, useResetAtom, useUpdateAtom} from 'jotai/utils';
import {supernovaStateAtom} from '../carbonAtoms';
import Animated, {ZoomIn, ZoomOut} from 'react-native-reanimated';

export type SelectionsToolbarIconConfig = {
  clear?: string;
  confirm?: string;
  cancel?: string;
};

export type SelectionsToolbarProps = {
  style?: any;
  onClear?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  onToggledLasso?: (toggled: boolean) => void;
  bounds?: any;
  icons?: SelectionsToolbarIconConfig;
  visible: boolean;
  position: any;
};

const SelectionsToolbar: React.FC<SelectionsToolbarProps> = ({
  style,
  onClear,
  onConfirm,
  onCancel,
  onToggledLasso,
  visible,
  icons,
  position,
}) => {
  const [lasso, setLasso] = useState<boolean>(false);

  const handleLasso = () => {
    onToggledLasso?.(!lasso);
    setLasso(!lasso);
  };

  const handleOnConfirm = () => {
    setLasso(false);
    onToggledLasso?.(false);
    onConfirm?.();
  };

  const handleOnCancel = () => {
    setLasso(false);
    onCancel?.();
  };

  const handleClear = () => {
    setLasso(false);
    onClear?.();
  };

  return visible ? (
    <Animated.View
      style={[
        styles.container,
        {left: position.x + position.width - 204, top: position.y - 46},
      ]}
      exiting={ZoomOut}
      entering={ZoomIn}
    >
      <View style={[styles.toolbar, style]}>
        <ToggleButton
          icon="lasso"
          // disabled={selectionsConfig?.disableLasso}
          onPress={handleLasso}
          status={lasso ? 'checked' : 'unchecked'}
        />
        <IconButton
          icon={icons?.clear || 'clear_selections'}
          onPress={handleClear}
        />
        <View style={styles.separator} />
        <Button
          style={styles.cancel}
          icon={icons?.cancel || 'cross'}
          onPress={handleOnCancel}
          compact={true}
          mode="contained"
          color="#BA2013"
          children={undefined}
        />
        <Button
          icon={icons?.confirm || 'tick'}
          onPress={handleOnConfirm}
          compact={true}
          mode="contained"
          children={undefined}
        />
      </View>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 42,
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 5,
    paddingHorizontal: 8,
  },
  cancel: {
    marginHorizontal: 8,
  },
  separator: {
    width: 2,
    backgroundColor: 'lightgrey',
    height: '100%',
    borderRadius: 1,
  },
});

export default SelectionsToolbar;
