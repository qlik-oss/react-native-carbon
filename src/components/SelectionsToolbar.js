import React, { useRef, useEffect, useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Button, IconButton, ToggleButton } from "react-native-paper";
import { useAtomValue } from "jotai/utils";
import { supernovaStateAtom } from "../carbonAtoms";

const SelectionsToolbar = ({
  style,
  onClear,
  onConfirm,
  onCancel,
  onToggledLasso,
  bounds,
}) => {
  const selectionsConfig = useAtomValue(supernovaStateAtom);
  const [lasso, setLasso] = useState(false);
  const viewRef = useRef(undefined);
  const layout = useRef({ width: 0, height: 0 });
  const padding = 4;
  const coords =
    selectionsConfig?.position === undefined
      ? { pageX: 0, pageY: 0, width: 0, height: 0 }
      : selectionsConfig?.position;
  const animationProgress = useRef(new Animated.Value(0));

  useEffect(() => {
    if (layout.current) {
      Animated.spring(animationProgress.current, {
        toValue: selectionsConfig?.active ? 1 : 0,
        bounciness: 5,
        speed: 14,
        useNativeDriver: true,
      }).start();
    }
  }, [selectionsConfig]);

  const opacity = animationProgress.current.interpolate({
    inputRange: [0, 0.25, 1],
    outputRange: [0, 0, 1],
  });

  const handleLasso = () => {
    if (onToggledLasso) {
      onToggledLasso(!lasso);
    }
    setLasso(!lasso);
  };

  const handleOnConfirm = () => {
    setLasso(false);
    onConfirm();
  };

  const handleOnCancel = () => {
    setLasso(false);
    onCancel();
  };

  const handleClear = () => {
    setLasso(false);
    onClear();
  };

  const onLayout = ({ nativeEvent }) => {
    layout.current = nativeEvent.layout;
  };

  const getPosition = () => {
    let top = coords.pageY;
    let left = coords.pageX + coords.width - layout.current.width;
    if (top < bounds) {
      top = bounds;
    }
    return { top, left };
  };

  return (
    <View
      onLayout={onLayout}
      ref={viewRef}
      style={[styles.conatiner, getPosition()]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.toolbar,
          style,
          { padding },
          { opacity },
          { transform: [{ scale: opacity }] },
        ]}
      >
        <ToggleButton
          icon="lasso"
          onPress={handleLasso}
          status={lasso ? "checked" : "unchecked"}
        />
        <IconButton icon="clear-selections" onPress={handleClear} />
        <View style={styles.seperator} />
        <Button
          style={styles.cancel}
          icon="cross"
          onPress={handleOnCancel}
          compact={true}
          mode="contained"
          color="#DC423F"
        />
        <Button
          icon="tick"
          onPress={handleOnConfirm}
          compact={true}
          mode="contained"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    position: "absolute",
    zIndex: 1000000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toolbar: {
    flex: 0,
    height: 36,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
    elevation: 5,
  },
  cancel: {
    marginHorizontal: 8,
  },
  seperator: {
    width: 2,
    backgroundColor: "lightgrey",
    height: "100%",
    borderRadius: 1,
  },
});

export default SelectionsToolbar;