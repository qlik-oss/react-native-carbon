import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, IconButton, ToggleButton} from 'react-native-paper';
import {useAtomValue, useResetAtom} from 'jotai/utils';
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
};

const SelectionsToolbar: React.FC<SelectionsToolbarProps> = ({
  style,
  onClear,
  onConfirm,
  onCancel,
  onToggledLasso,
  visible,
  icons,
}) => {
  const [lasso, setLasso] = useState<boolean>(false);
  const selectionsConfig = useAtomValue(supernovaStateAtom);
  const resetSupernovae = useResetAtom(supernovaStateAtom);

  const handleLasso = () => {
    onToggledLasso?.(!lasso);
    setLasso(!lasso);
    selectionsConfig?.toggleLasso(!lasso);
  };

  const handleOnConfirm = () => {
    setLasso(false);
    onToggledLasso?.(false);
    selectionsConfig?.confirmSelection();
    selectionsConfig?.toggleLasso(false);
    resetSupernovae();
    onConfirm?.();
  };

  const handleOnCancel = () => {
    setLasso(false);
    selectionsConfig?.cancelSelection();
    selectionsConfig?.toggleLasso(false);
    resetSupernovae();
    onCancel?.();
  };

  const handleClear = () => {
    setLasso(false);
    selectionsConfig?.clear();
    selectionsConfig?.toggleLasso(false);
    onClear?.();
  };

  return visible && selectionsConfig.active ? (
    <Animated.View
      style={[styles.container]}
      entering={ZoomIn}
      exiting={ZoomOut}
    >
      <View style={[styles.toolbar, style]}>
        {selectionsConfig.disableLasso ? null : (
          <ToggleButton
            icon="lasso"
            onPress={handleLasso}
            status={lasso ? 'checked' : 'unchecked'}
            size={20}
          />
        )}
        <IconButton
          icon={icons?.clear || 'clear_selections'}
          onPress={handleClear}
          size={20}
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
          style={styles.confirm}
        />
      </View>
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbar: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    elevation: 5,
    paddingRight: 8,
    height: 40,
    borderRadius: 2,
  },
  cancel: {
    marginHorizontal: 8,
    height: 32,
  },
  confirm: {
    height: 32,
  },
  separator: {
    width: 2,
    backgroundColor: 'lightgrey',
    height: '100%',
    borderRadius: 1,
  },
});

export default SelectionsToolbar;
