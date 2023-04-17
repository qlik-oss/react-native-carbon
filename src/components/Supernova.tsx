import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
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
import SelectionsToolbar from '@qlik/react-native-carbon/src/components/SelectionsToolbar';
import CalcConditionErrorView from './CalcConditionErrorView';

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
  properties?: any;
  disableTooltips?: boolean;
  disableTopBar?: boolean;
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
  disableTooltips,
  disableTopBar,
  disableSelectionToolbar,
  log = defaultLogger,
}) => {
  const [layout, setLayout] = useState(snapshot || loadLayout);
  const [lasso, setLasso] = useState(false);
  const [selectionsToolbarVisible, setSelectionsToolbarVisible] =
    useState(false);
  const setToolTip = useUpdateAtom(writeOnlySupernovaToolTipAtom);
  const setSelectionsConfig = useUpdateAtom(writeOnlySupernovaStateAtom);
  const resetSelectionsConfig = useResetAtom(supernovaStateAtom);
  const [componentData, setComponentData] = useState(undefined);
  const containerRef = useRef<any>(undefined);
  const elementRef = useRef<Element>(undefined);
  const bodyRef = useRef<any>(undefined);
  const titleLayout = useRef(undefined);
  const mounted = useRef(true);

  const isSnapshot = useMemo(() => {
    return !!snapshot;
  }, [snapshot]);



  const onLayout = (newLayout: any) => {
    if (mounted.current) {
      setLayout(newLayout);
    }
  };

  const onLongPress = (data: SupernovaToolTipAtom) => {
    if (!disableTooltips) {
      data.layout = layout;
      data.visible = true;
      setToolTip(data);
    }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
        nebulaEngineRef.current?.destroy?.();
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
      if(elementRef.current && jsxComponent) {
        return;
      }
      if (!elementRef.current) {
        elementRef.current = new Element(canvas);
      }
      const element = elementRef.current;

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
            setSelectionsToolbarVisible(false);
            nebulaEngineRef.current.selectionsApi.cancel();
            resetSelectionsConfig();
          };

          const handleConfirmSelections = () => {
            setSelectionsToolbarVisible(false);
            nebulaEngineRef.current.confirmSelections();
            resetSelectionsConfig();
          };

          const handleClearSelections = () => {
            nebulaEngineRef.current.clearSelections();
          };

          const handleToggleLasso = (val: boolean) => {
            setLasso(val);
          };

          const config = {
            confirmSelection: handleConfirmSelections,
            cancelSelection: handleCancelSelections,
            clear: handleClearSelections,
            element: nebulaEngineRef.current.canvasElement,
            toggleLasso: handleToggleLasso,
            id,
            active: true,
            disableLasso:
              nebulaEngineRef.current.properties.initial.disableLasso,
          };
          setSelectionsConfig(config);
          setSelectionsToolbarVisible(true);
        },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, invalidMessage, resetSelectionsConfig, setSelectionsConfig, sn, theme, isSnapshot, jsxComponent],
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
      // @ts-ignore
      return comp({...componentData, themeData: theme});
    }
    return null;
  }, [componentData, theme]);

  return (
    <View style={[styles.layer]} ref={bodyRef} collapsable={false}>
      <Title
        style={titleBarStyle}
        layout={layout}
        onLayout={handleTitleLayout}
        topPadding={topPadding}
        theme={theme}
        disableTopBar={disableTopBar}
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
        {layout?.qHyperCube?.qCalcCondMsg?.length > 1 ? (
          <CalcConditionErrorView layout={layout} />
        ) : null}
      </View>
      {jsxComponent ? (
        <>
          <View
            style={[
              styles.components,
              style,
              // eslint-disable-next-line react-native/no-inline-styles
              {marginTop: disableTopBar ? 0 : 36},
            ]}
            pointerEvents="box-none"
          >
            {renderJsxComponent()}
            <Footer layout={layout} theme={theme} />
            {layout?.qHyperCube?.qCalcCondMsg?.length > 1 ? (
              <CalcConditionErrorView layout={layout} />
            ) : null}
          </View>
        </>
      ) : (
        <Footer layout={layout} theme={theme} />
      )}
      {disableSelectionToolbar ? null : (
        <SelectionsToolbar visible={selectionsToolbarVisible} />
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
    marginTop: 36,
    zIndex: 1,
  },
  supernovaView: {
    flex: 1,
  },
});

export default Supernova;
