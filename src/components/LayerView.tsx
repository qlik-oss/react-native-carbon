import React, {useEffect, useRef, useState} from 'react';
import {
  requireNativeComponent,
  ViewProps,
  findNodeHandle,
  StyleSheet,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import {ElementProxy} from './ElementProxy';
import uuid from 'react-native-uuid';
import Element from './Element';

export type QRNLayerProps = {
  style: any;
  onElement: (_element: Element) => void;
  onLayoutChanged: () => void;
  onSelection: (_event: any) => void;
  onDoubleTap?: (_event: any) => void;
  onTouchesBegan?: (_event: any) => void;
  onLongPress?: (_event: any) => void;
  lasso?: boolean;
};

const LayerView: React.FC<QRNLayerProps> = ({
  style,
  onElement,
  onLayoutChanged,
  onSelection,
  onDoubleTap,
  onTouchesBegan,
  onLongPress,
  lasso,
}: QRNLayerProps) => {
  const nodeHandle = useRef<any>();
  const rootElementId = useRef<any>(undefined);
  const [element, setElement] = useState<Element>();

  useEffect(() => {
    return () => {
      if (rootElementId.current) {
        ElementProxy.destroyRootElement(rootElementId.current);
      }
    };
  }, []);

  const onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;

    if (!element && !rootElementId.current) {
      const id = uuid.v4();
      rootElementId.current = id;
      const el = new Element(
        id,
        layout.x,
        layout.y,
        layout.width,
        layout.height,
        nodeHandle.current,
      );
      ElementProxy.createRootElement(nodeHandle.current, id);
      onElement(el);
      setElement(el);
    } else if (element) {
      element?.clear();
      element?.setClientRect({...layout});
      if (Platform.OS === 'android') {
        onLayoutChanged();
      } else {
        element?.draw();
      }
    }
  };

  return (
    <QRNLayerView
      style={[styles.container, style]}
      onLayout={onLayout}
      onSelection={onSelection}
      onDoubleTap={onDoubleTap}
      onLongPress={onLongPress}
      onTouchesBegan={onTouchesBegan}
      lasso={lasso}
      ref={(r: any) => {
        const nodeid = findNodeHandle(r);
        if (nodeid && nodeHandle.current !== nodeid) {
          nodeHandle.current = nodeid;
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});

var QRNLayerView = requireNativeComponent<ViewProps>('QRNLayer');
export default LayerView;
