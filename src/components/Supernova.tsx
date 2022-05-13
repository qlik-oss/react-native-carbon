/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {StyleSheet, View} from 'react-native';
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
// import type Element from './Element';
import {OverlayView} from './OverlayView';
import NebulaEngine from '../core/NebulaEngine';
import {Canvas} from '@qlik/react-native-helium';
import {Element} from '@qlik/carbon-core';

export type SupernovaProps = {
  sn: any;
  app: any;
  style?: any;
  theme: any;
  id?: string;
  disableLoadAnimations?: boolean;
  fields?: [string];
  measures: [string];
  showLegend?: boolean;
  invalidMessage?: string;
  object: any;
  topPadding?: any;
  onLongPress?: () => void;
  loadLayout?: any;
  titleBarStyle?: any;
  onLoaded?: () => void;
  log?: any;
  disableLasso: boolean;
};

export const Supernova: React.FC<SupernovaProps> = ({
  sn,
  app,
  style,
  theme,
  id,
  disableLoadAnimations,
  fields,
  measures,
  showLegend,
  invalidMessage,
  object,
  topPadding,
  onLongPress,
  loadLayout,
  titleBarStyle,
  onLoaded,
  log = defaultLogger,
  disableLasso = false,
}) => {
  const nebulaEngineRef = useRef(
    new NebulaEngine({app, log, theme, model: object, modelId: id, onLayout: (l) => setLayout(l)}),
  );
  const [snRenderContext, setSnRenderContext] = useState<any>(undefined);
  const [layout, setLayout] = useState(loadLayout);
  const [componentData, setComponentData] = useState(undefined);
  const [lasso, setLasso] = useState(false);
  const containerRef = useRef<any>(undefined);
  const bodyRef = useRef<any>(undefined);
  const titleLayout = useRef(undefined);
  const [model, setModel] = useState<any>(undefined);
  const setSelectionsConfig = useUpdateAtom(supernovaStateAtom);
  const resetConfig = useResetAtom(supernovaStateAtom);
  const setToolTipConfig = useUpdateAtom(supernovaToolTipStateAtom);
  const setTooltipVisible = useUpdateAtom(supernovaToolTipVisible);
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    return () => {
      console.log('******* UND');
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

  // const onToggledLasso = (toggled: boolean) => {
  //   element?.enableMotion(!toggled);
  //   setLasso(toggled);
  // };

  // const handleCancelSelections = async () => {
  //   element?.flush();
  //   resetInputState();
  //   selectionsApiImpl.current.cancel();
  // };

  // const handleConfirmSelections = () => {
  //   resetInputState();
  //   selectionsApiImpl.current.confirm();
  // };

  // const handleClearSelections = async () => {
  //   await selectionsApiImpl.current.clear();
  // };

  // const resetInputState = () => {
  //   element?.setImmediate(false);
  //   element?.enableMotion(true);
  //   setLasso(false);
  // };

  // const renderSupernovaLayout = useCallback(
  //   (renderLayout) => {
  //     async function renderSupernova() {
  //       try {
  //         const context = {
  //           ...snComponent.current.context,
  //           theme: themeRef?.current?.externalAPI,
  //         };

  //         if (renderLayout) {
  //           await snComponent.current.render({
  //             ...snRenderContext,
  //             context,
  //             layout: {...renderLayout},
  //           });
  //           if (
  //             renderLayout &&
  //             !renderLayout?.qSelectionInfo?.qInSelections &&
  //             !lasso
  //           ) {
  //             element?.draw();
  //           }
  //         }
  //       } catch (error) {
  //         log.error('error while rendering');
  //       }
  //     }
  //     if (snComponent.current && renderLayout !== undefined) {
  //       renderSupernova();
  //     }
  //   },
  //   [element, lasso],
  // );

  // useEffect(() => {
  //   return () => {
  //     mounted.current = false;
  //   };
  // }, []);

  // useEffect(() => {
  //   return () => {
  //     if (element) {
  //       element.destroy();
  //     }
  //   };
  // }, [element]);

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

  // useEffect(() => {
  //   const selections = selectionsApiImpl.current;

  //   if (sn && snRenderContext && element && !snComponent.current) {
  //     const options = {
  //       renderer: 'carbon',
  //       carbon: true,
  //       showLegend,
  //       invalidMessage: invalidMessage || 'Undefined',
  //     };
  //     const t = themeFn();
  //     t.internalAPI.setTheme(theme, 'horizon');
  //     themeRef.current = t;
  //     const supernova = generator(sn, {
  //       translator,
  //       sense: true,
  //       theme: t.externalAPI,
  //       ...options,
  //     });
  //     const {component} = supernova.create({
  //       ...snRenderContext,
  //       selections,
  //       theme: t,
  //     });
  //     snComponent.current = component;
  //     snComponent.current.created();
  //     snComponent.current.mounted(element);
  //     if (onLoaded) {
  //       onLoaded();
  //     }
  //   }

  //   return () => {
  //     if (snComponent.current) {
  //       snComponent.current.willUnmount();
  //       snComponent.current.destroy();
  //       snComponent.current = undefined;
  //     }
  //   };
  // }, [sn, snRenderContext, element, theme]);

  // useEffect(() => {
  //   renderSupernovaLayout(layout);
  // }, [snRenderContext, renderSupernovaLayout, layout]);

  const handleTitleLayout = ({nativeEvent}: any) => {
    titleLayout.current = nativeEvent.layout;
  };

  // const renderJsxComponent = useCallback(() => {
  //   if (!element) {
  //     return null;
  //   }
  //   const comp = element.getJsxComponent();
  //   if (comp && componentData) {
  //     return comp(componentData);
  //   }
  //   return null;
  // }, [componentData, element]);

  // const onSelection = (selections: any) => {
  //   if (element) {
  //     element.setImmediate(true);
  //     element.onSelections(selections.nativeEvent.selections);
  //   }
  // };

  // const onTouchesBegan = (_event: any) => {
  //   setTooltipVisible(false);
  // };

  // const handleLongPress = (event: any) => {
  //   if (element) {
  //     const touchesListener = element.getTouchesStartListener();
  //     if (touchesListener) {
  //       touchesListener(event.nativeEvent.touches);
  //     }
  //   }
  //   if (onLongPress) {
  //     onLongPress();
  //   }
  // };

  // const onLayoutChanged = () => {
  //   renderSupernovaLayout(layout);
  // };

  const onCanvas = useCallback(async (canvas: any) => {
    const element = new Element(canvas);
    nebulaEngineRef.current.loadSupernova(
      element,
      sn,
      'Too bad, so sad',
      false,
      theme,
    );
  }, []);

  const onResized = useCallback(() => {
    nebulaEngineRef.current.resizeView();
  }, []);

  return (
    <View style={[styles.layer, style]} ref={bodyRef} collapsable={false}>
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
        <Canvas onCanvas={onCanvas} onResized={onResized} />
        <View style={styles.components} pointerEvents="box-none">
          {/* {renderJsxComponent()} */}
        </View>
      </View>
      {/* {showLegend ? <CatLegend layout={layout} element={element} /> : null} */}
      <Footer layout={layout} theme={theme} />
      <OverlayView suspended={suspended} />
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
