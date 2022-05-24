/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
// @ts-ignore
// import LayerView from './LayerView';
import {Title} from './Title';
import {Footer} from './Footer';
import {defaultLogger} from '../defaultLogger';
// import {createHyperCubeDef} from '../core/createHyperCubeDef';
import CatLegend from './CatLegend';
import {useResetAtom, useUpdateAtom} from 'jotai/utils';
import {
  supernovaStateAtom,
  supernovaToolTipStateAtom,
  supernovaToolTipVisible,
} from '../carbonAtoms';
import {OverlayView} from './OverlayView';
import NebulaEngine from '../core/NebulaEngine';
import {Canvas} from '@qlik/react-native-helium';
import {Element} from '@qlik/carbon-core';
import SelectionsToolbar from './SelectionsToolbar';
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
  lasso: boolean;
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
  lasso,
  log = defaultLogger,
  disableLasso = false,
}) => {
  const nebulaEngineRef = useRef(
    new NebulaEngine({
      app,
      log,
      theme,
      model: object,
      modelId: id,
      snapshot,
      onLayout: (l) => setLayout(l),
    }),
  );
  const [layout, setLayout] = useState(snapshot);
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

  useEffect(() => {
    return () => {
      nebulaEngineRef.current.destroy();
    };
  }, []);

  // const changed = useCallback( async () => {
  //   try {
  //     const l = await model.getLayout();
  //     if (
  //       !l?.qSelectionInfo.qInSelections &&
  //       selectionsApiImpl?.current?.isActive()
  //     ) {
  //       selectionsApiImpl.current.noModal();
  //       selectionsApiImpl.current.eventEmitter.emit('aborted');
  //     }
  //     setLayout(l);
  //   } catch (error: any) {
  //     if (error.code !== 15) {
  //       log.error('Failed to get layout', error);
  //     }
  //   }
  // }, [model]);

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

  // useEffect(() => {
  //   return () => {
  //     mounted.current = false;
  //   };
  // }, []);

  // const onElement = (e: Element) => {
  //   if (disableLoadAnimations) {
  //     e.disableLoadAnimations();
  //   }

  //   e.addEventListener('renderComponentWithData', (data: any) => {
  //     setComponentData(data);
  //   });

  //   e.addEventListener('onTooltipData', (event: any) => {
  //     containerRef.current.measure(
  //       (
  //         x: number,
  //         y: number,
  //         width: number,
  //         height: number,
  //         pageX: number,
  //         pageY: number,
  //       ) => {
  //         const config = {
  //           ...event,
  //           pageLocation: {
  //             x,
  //             y,
  //             width,
  //             height,
  //             pageX,
  //             pageY,
  //             titleLayout: titleLayout.current,
  //           },
  //         };
  //         setToolTipConfig({config});
  //       },
  //     );
  //   });

  //   setElement(e);
  // };

  // useEffect(() => {
  //   const getInitialLayout = async () => {
  //     let needend = false;
  //     let firstLayout;
  //     try {
  //       if (!loadLayout) {
  //         firstLayout = await model.getLayout();
  //       } else {
  //         firstLayout = loadLayout;
  //       }
  //       if (firstLayout.qSelectionInfo.qInSelections) {
  //         await model.endSelections(false);
  //       }
  //     } catch (error: any) {
  //       if (error.code === 15) {
  //         needend = true;
  //       }
  //     }
  //     if (needend) {
  //       try {
  //         await model.endSelections(true);
  //         firstLayout = await model.getLayout();
  //       } catch (error) {
  //         log.error('complete fail');
  //       }
  //     }
  //     return firstLayout;
  //   };

  //   const initialize = async () => {
  //     try {
  //       const initialLayout = await getInitialLayout();
  //       if(selectionsApiImpl.current) {
  //         selectionsApiImpl.current.destroy();
  //       }
  //       selectionsApiImpl.current = SelectionsApi({model, app, log});
  //       selectionsApiImpl.current.eventEmitter.addListener('activated', () => {
  //         // check for position here to avoid the data race when
  //         // initialized is called before onLayout
  //         bodyRef.current.measure(
  //           (
  //             x: any,
  //             y: any,
  //             width: any,
  //             height: any,
  //             pageX: any,
  //             pageY: number,
  //           ) => {
  //             let py = pageY;
  //             if (topPadding === 'none') {
  //               py = pageY - 30;
  //             }
  //             const position = {
  //               x,
  //               y,
  //               pageX,
  //               pageY: py,
  //               width,
  //               height,
  //               titleLayout: titleLayout.current,
  //             };
  //             const config = {
  //               toggleLasso: onToggledLasso,
  //               confirmSelection: handleConfirmSelections,
  //               cancelSelection: handleCancelSelections,
  //               clear: handleClearSelections,
  //               element,
  //               position,
  //               id,
  //               active: true,
  //               disableLasso,
  //             };
  //             setSelectionsConfig(config);
  //           },
  //         );
  //       });
  //       selectionsApiImpl.current.on('canceled', () => {
  //         resetConfig();
  //       });
  //       model.on('changed', changed);
  //       setSnRenderContext({
  //         app,
  //         model,
  //         appLayout: {},
  //         layout: initialLayout,
  //       });
  //       if (!loadLayout) {
  //         changed();
  //       } else {
  //         setLayout(loadLayout);
  //       }
  //     } catch (error) {
  //       log.error('Failed to initialize', error);
  //     }
  //   };

  //   if (model && element && !initialized.current) {
  //     initialized.current = true;
  //     initialize();
  //   } else if (model && element && initialized.current) {
  //     changed();
  //   }

  //   return () => {
  //     if (!mounted.current && model) {
  //       model.removeListener('changed', changed);
  //       if (selectionsApiImpl.current) {
  //         selectionsApiImpl.current.destroy();
  //       }
  //       if (element) {
  //         element.destroy();
  //       }
  //     }
  //   };
  // }, [element, model, app, setSelectionsConfig]);

  const handleTitleLayout = ({nativeEvent}: any) => {
    titleLayout.current = nativeEvent.layout;
  };

  const renderJsxComponent = useCallback(() => {
    const comp = nebulaEngineRef?.current?.getJsxComponent();
    if (comp && componentData) {
      return comp(componentData);
    }
    return null;
  }, [componentData]);

  // const onTouchesBegan = (_event: any) => {
  //   setTooltipVisible(false);
  // };

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

    nebulaEngineRef.current.loadSupernova(
      element,
      sn,
      invalidMessage,
      false,
      theme,
    );
  }, []);

  const onResized = useCallback(() => {
    nebulaEngineRef.current.resizeView();
  }, []);

  const onBeganSelections = useCallback((_event: any) => {
    nebulaEngineRef.current.beginSelections();

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
  }, []);

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
      {/* <SelectionsToolbar
        selectionsApi={nebulaEngineRef.current.selectionsApi}
        icons={selectionsToolbarIcons}
        onToggledLasso={handleToggleLasso}
        onConfirm={handleOnConfirm}
      /> */}
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
