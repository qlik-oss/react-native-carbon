/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
import {Title} from './Title';
import {Footer} from './Footer';
import {defaultLogger} from '../defaultLogger';
// import {createHyperCubeDef} from '../core/createHyperCubeDef';
// import CatLegend from './CatLegend';
import {useResetAtom, useUpdateAtom} from 'jotai/utils';
import {supernovaStateAtom} from '../carbonAtoms';
import NebulaEngine from '../core/NebulaEngine';
import {Canvas} from '@qlik/react-native-helium';
import {Element} from '@qlik/carbon-core';
import {Tooltip} from './Tooltip';
import Animated from 'react-native-reanimated';

export type SupernovaProps = {
  sn: any;
  app: any;
  style?: any;
  theme: any;
  id?: string;
  fields?: [string];
  measures: [string];
  showLegend?: boolean;
  invalidMessage?: string;
  object: any;
  topPadding?: any;
  onLongPress?: () => void;
  snapshot?: any;
  titleBarStyle?: any;
  onLoaded?: () => void;
  log?: any;
  disableLasso: boolean;
  jsxComponent?: boolean;
  appLayout?: any;
  disableSelections?: boolean;
};

export const Supernova: React.FC<SupernovaProps> = ({
  sn,
  app,
  theme,
  id,
  fields,
  measures,
  showLegend,
  invalidMessage,
  object,
  topPadding,
  onLongPress,
  snapshot,
  titleBarStyle,
  onLoaded,
  jsxComponent,
  appLayout,
  disableSelections,
  log = defaultLogger,
  disableLasso = false,
}) => {
  const [layout, setLayout] = useState(snapshot);
  const [lasso, setLasso] = useState(false);
  const setSelectionsConfig = useUpdateAtom(supernovaStateAtom);
  const resetSelectionsConfig = useResetAtom(supernovaStateAtom);
  const [componentData, setComponentData] = useState(undefined);
  const containerRef = useRef<any>(undefined);
  const bodyRef = useRef<any>(undefined);
  const titleLayout = useRef(undefined);
  const [suspended, setSuspended] = useState(false);
  const [tooltipConfig, setToolTipConfig] = useState({
    visible: false,
    content: {},
  });
  const mounted = useRef(true);

  const onLayout = (newLayout: any) => {
    if (mounted.current) {
      setLayout(newLayout);
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
      appLayout,
      onLayout,
    }),
  );

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      nebulaEngineRef.current.destroy();
    };
  }, []);

  // useEffect(() => {
  //   const onResumed = () => {
  //     setSuspended(false);
  //     if( model) {
  //       model.on('changed', changed);
  //     }
  //   };
  //   const onSuspended = () => {
  //     log.debug('Supernova suspended');
  //     if( model) {
  //       model.removeListener('changed', changed);
  //     }
  //     setSuspended(true);
  //   };
  //   if (app.session) {
  //     app.session.on('resumed', onResumed);
  //     app.session.on('suspended', onSuspended);
  //   }

  //   return () => {
  //     log.debug('unmounting app');
  //     if (app.session) {
  //       app.removeListener('resumed', onResumed);
  //       app.removeListener('suspended', onSuspended);
  //     }
  //   };
  // }, [app]);

  // useEffect(() => {
  //   const fetchModel = async () => {
  //     try {
  //       const m = await app.getObject(id);
  //       setModel(m);
  //     } catch (error) {
  //       log.error('Error fetching model', error);
  //     }
  //   };
  //   if (object) {
  //     setModel(object);
  //   } else if (id && app) {
  //     fetchModel();
  //   }
  // }, [id, app, object]);

  // useEffect(() => {
  //   const fetchModel = async () => {
  //     try {
  //       const type = Math.random().toString(32).substring(8);
  //       const props = createHyperCubeDef({fields, measures, type});
  //       const m = await app.createSessionObject(props);
  //       setModel(m);
  //     } catch (error) {
  //       log.error('error', error);
  //     }
  //   };
  //   if (fields && app) {
  //     fetchModel();
  //   }
  // }, [fields, app]);

  const handleTitleLayout = ({nativeEvent}: any) => {
    titleLayout.current = nativeEvent.layout;
  };

  const handleOnLongPressBegan = useCallback((event: any) => {
    const touchesListener =
      nebulaEngineRef.current.canvasElement.getTouchesStartListener();
    if (touchesListener) {
      const touches = [event.nativeEvent.x, event.nativeEvent.y];
      touchesListener(touches);
    }
  }, []);

  const handleOnLongPressEnded = useCallback(() => {
    setToolTipConfig({visible: false, content: {}});
  }, []);

  const onCanvas = useCallback(async (canvas: any) => {
    const element = new Element(canvas);
    element.addEventListener('onTooltipData', (data: any) => {
      setToolTipConfig({visible: true, content: data});
    });

    element.addEventListener('renderComponentWithData', (data: any) => {
      setComponentData(data);
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
          nebulaEngineRef.current.selectionsApi.clear();
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
            };
            setSelectionsConfig(config);
          },
        );
      },
    );
  }, []);

  const onResized = useCallback(() => {
    nebulaEngineRef.current.resizeView();
  }, []);

  const onBeganSelections = useCallback(
    (_event: any) => {
      if (disableSelections) {
        return;
      }
      nebulaEngineRef.current.beginSelections();
    },
    [disableSelections],
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
      <Animated.View
        style={[styles.supernovaView]}
        ref={containerRef}
        collapsable={false}
      >
        <Canvas
          onCanvas={onCanvas}
          onResized={onResized}
          onBeganSelections={onBeganSelections}
          lasso={lasso}
          onLongPressBegan={handleOnLongPressBegan}
          onLongPressEnded={handleOnLongPressEnded}
        />
      </Animated.View>
      {/* {showLegend ? <CatLegend layout={layout} element={element} /> : null} */}
      <Footer layout={layout} theme={theme} />
      {jsxComponent ? (
        <View style={styles.components} pointerEvents="box-none">
          {renderJsxComponent()}
        </View>
      ) : null}
      <Tooltip show={tooltipConfig.visible} content={tooltipConfig.content} />
    </View>
  );
};

const styles = StyleSheet.create({
  layer: {
    flex: 1,
  },
  components: {
    ...StyleSheet.absoluteFillObject,
  },
  supernovaView: {
    flex: 1,
  },
  overlay: {
    ...(StyleSheet.absoluteFill as {}),
    backgroundColor: 'white',
  },
});
