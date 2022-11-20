import React, {useEffect, useRef, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {Footer} from './Footer';
import {defaultLogger} from '../defaultLogger';
import {useResetAtom, useUpdateAtom} from 'jotai/utils';
import {
  supernovaStateAtom,
  SupernovaToolTipAtom,
  writeOnlySupernovaStateAtom,
  writeOnlySupernovaToolTipAtom,
} from '../carbonAtoms';
import NebulaEngine from '../core/NebulaEngine';
import {Canvas} from '@qlik/react-native-helium';
import {Element} from '@qlik/carbon-core';

export type SupernovaProps = {
  sn: any;
  app?: any;
  style?: any;
  theme: any;
  id?: string;
  fields?: [string];
  measures?: [string];
  showLegend?: boolean;
  invalidMessage?: string;
  object?: any;
  topPadding?: any;
  onLongPress?: () => void;
  onPress?: () => void;
  snapshot?: any;
  loadLayout?: any;
  titleBarStyle?: any;
  onLoaded?: () => void;
  log?: any;
  disableLasso?: boolean;
  jsxComponent?: boolean;
  appLayout?: any;
  disableSelections?: boolean;
  translator?: (value: any) => string;
  properties: any;
};

const Supernova: React.FC<SupernovaProps> = ({
  sn,
  app,
  theme,
  id,
  invalidMessage,
  object,
  topPadding,
  onPress,
  snapshot,
  loadLayout,
  titleBarStyle,
  jsxComponent,
  appLayout,
  style,
  disableSelections,
  translator,
  properties,
  log = defaultLogger,
}) => {
  const [layout, setLayout] = useState(snapshot || loadLayout);
  const [lasso, setLasso] = useState(false);
  const setToolTip = useUpdateAtom(writeOnlySupernovaToolTipAtom);
  const setSelectionsConfig = useUpdateAtom(writeOnlySupernovaStateAtom);
  const resetSelectionsConfig = useResetAtom(supernovaStateAtom);
  const [componentData, setComponentData] = useState(undefined);
  const containerRef = useRef<any>(undefined);
  const bodyRef = useRef<any>(undefined);
  const titleLayout = useRef(undefined);
  const mounted = useRef(true);

  const onLayout = (newLayout: any) => {
    if (mounted.current) {
      setLayout(newLayout);
    }
  };

  const onLongPress = (data: SupernovaToolTipAtom) => {
    data.layout = layout;
    data.visible = true;
    setToolTip(data);
  };

  const nebulaEngineRef = useRef(
    new NebulaEngine({
      app,
      log,
      theme,
      model: object,
      modelId: id,
      snapshot,
      loadLayout,
      appLayout,
      onLayout,
      translator,
      qaeProps: properties,
    }),
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      try {
        nebulaEngineRef.current.destroy();
      } catch (error) {
        log.debug(error);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (nebulaEngineRef.current && snapshot && mounted.current) {
      nebulaEngineRef.current.renderSnapshot(snapshot);
    }
  }, [snapshot]);

  const handleTitleLayout = ({nativeEvent}: any) => {
    titleLayout.current = nativeEvent.layout;
  };

  const onCanvas = useCallback(
    async (canvas: any) => {
      const element = new Element(canvas);

      element.setLongPressHandler(onLongPress);

      element.addEventListener('renderComponentWithData', (data: any) => {
        if (mounted.current) {
          setComponentData(data);
        }
      });

      await nebulaEngineRef.current.loadSupernova(
        element,
        sn,
        invalidMessage,
        false,
        theme,
        () => {
          const handleCancelSelections = () => {
            nebulaEngineRef.current.selectionsApi.cancel();
            resetSelectionsConfig();
          };

          const handleConfirmSelections = () => {
            nebulaEngineRef.current.confirmSelections();
            resetSelectionsConfig();
          };

          const handleClearSelections = () => {
            nebulaEngineRef.current.clearSelections();
          };

          const handleToggleLasso = (val: boolean) => {
            setLasso(val);
          };

          bodyRef.current.measure(
            (
              _x: number,
              _y: number,
              width: number,
              height: number,
              pageX: number,
              pageY: number,
            ) => {
              const config = {
                confirmSelection: handleConfirmSelections,
                cancelSelection: handleCancelSelections,
                clear: handleClearSelections,
                element: nebulaEngineRef.current.canvasElement,
                toggleLasso: handleToggleLasso,
                position: {
                  x: pageX,
                  y: pageY,
                  height,
                  width,
                },
                id,
                active: true,
                disableLasso:
                  nebulaEngineRef.current.properties.initial.disableLasso,
              };
              setSelectionsConfig(config);
            },
          );
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, invalidMessage, resetSelectionsConfig, setSelectionsConfig, sn, theme],
  );

  const onResized = useCallback(() => {
    nebulaEngineRef.current.resizeView();
  }, []);

  const onBeganSelections = useCallback(
    (_event: any) => {
      if (disableSelections) {
        onPress?.();
        return;
      }
      nebulaEngineRef.current.beginSelections();
    },
    [disableSelections, onPress],
  );

  const renderJsxComponent = useCallback(() => {
    const comp = nebulaEngineRef?.current?.getJsxComponent();
    if (comp && componentData) {
      return comp(componentData);
    }
    return null;
  }, [componentData]);

  return (
    <View style={[styles.layer]} ref={bodyRef} collapsable={false}>
      <Title
        style={titleBarStyle}
        layout={layout}
        onLayout={handleTitleLayout}
        topPadding={topPadding}
        theme={theme}
      />
      <View
        style={[styles.supernovaView]}
        ref={containerRef}
        collapsable={false}
      >
        <Canvas
          onCanvas={onCanvas}
          onResized={onResized}
          onBeganSelections={onBeganSelections}
          lasso={lasso}
          disableSelections={disableSelections}
        />
      </View>
      {jsxComponent ? (
        <View style={[styles.components, style]} pointerEvents="box-none">
          {renderJsxComponent()}
          <Footer layout={layout} theme={theme} />
        </View>
      ) : (
        <Footer layout={layout} theme={theme} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    flex: 1,
  },
  components: {
    ...StyleSheet.absoluteFillObject,
    marginTop: 40,
  },
  supernovaView: {
    flex: 1,
  },
});

export default Supernova;
