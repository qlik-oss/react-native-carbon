/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState, useCallback} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import {__DO_NOT_USE__ as NebulaInternals} from '@nebula.js/stardust';
import LayerView from './LayerView';
import {SelectionsApi} from '../core/selectionsApi';
import {Title} from './Title';
import {Footer} from './Footer';
import {defaultLogger} from '../defaultLogger';
import {createHyperCubeDef} from '../core/createHyperCubeDef';
import {CatLegend} from './CatLegend';
import {useResetAtom, useUpdateAtom} from 'jotai/utils';
import {
  supernovaStateAtom,
  supernovaToolTipStateAtom,
  supernovaToolTipVisible,
} from '../carbonAtoms';
import {ActivityIndicator} from 'react-native-paper';

export const Supernova = ({
  sn,
  app,
  style,
  theme,
  id,
  disableLoadAnimations,
  fields,
  showLegend,
  invalidMessage,
  object,
  onDoubleTap,
  topPadding,
  onLongPress,
  disableIcon,
  loadLayout,
  titleBarStyle,
  onLoaded,
  log = defaultLogger,
}) => {
  const {generator, theme: themeFn} = NebulaInternals;
  const translator = {add: () => {}, language: () => 'english'};
  const [element, setElement] = useState(undefined);
  const [snRenderContext, setSnRenderContext] = useState(undefined);
  const [layout, setLayout] = useState(loadLayout);
  const [componentData, setComponentData] = useState(undefined);
  const [lasso, setLasso] = useState(false);
  const snComponent = useRef(undefined);
  const themeRef = useRef(undefined);
  const selectionsApiImpl = useRef(undefined);
  const containerRef = useRef(undefined);
  const bodyRef = useRef(undefined);
  const initialized = useRef(false);
  const mounted = useRef(true);
  const titleLayout = useRef(undefined);
  const [model, setModel] = useState(undefined);
  const setSelectionsConfig = useUpdateAtom(supernovaStateAtom);
  const resetConfig = useResetAtom(supernovaStateAtom);
  const setToolTipConfig = useUpdateAtom(supernovaToolTipStateAtom);
  const setTooltipVisible = useUpdateAtom(supernovaToolTipVisible);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const m = await app.getObject(id);
        setModel(m);
      } catch (error) {
        log.error('Error fetching model', error);
      }
    };
    if (object) {
      setModel(object);
    } else if (id && app) {
      fetchModel();
    }
  }, [id, app, object]);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const type = Math.random().toString(32).substring(8);
        const props = createHyperCubeDef({fields, type});
        const m = await app.createSessionObject(props);
        setModel(m);
      } catch (error) {
        log.error('error', error);
      }
    };
    if (fields && app) {
      fetchModel();
    }
  }, [fields, app]);

  const onToggledLasso = (value) => {
    element?.enableMotion(!value);
    setLasso(value);
  };

  const handleCancelSelections = async () => {
    element?.flush();
    resetInputState();
    selectionsApiImpl.current.cancel();
  };

  const handleConfirmSelections = () => {
    resetInputState();
    selectionsApiImpl.current.confirm();
  };

  const handleClearSelections = async () => {
    await selectionsApiImpl.current.clear();
  };

  const resetInputState = () => {
    element?.setImmediate(false);
    element?.enableMotion(true);
    setLasso(false);
  };

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (element) {
        element.destroy();
      }
    };
  }, [element]);

  const onElement = (e) => {
    if (disableLoadAnimations) {
      e.disableLoadAnimations();
    }

    e.addEventListener('renderComponentWithData', (data) => {
      setComponentData(data);
    });

    e.addEventListener('onTooltipData', (event) => {
      containerRef.current.measure((x, y, width, height, pageX, pageY) => {
        const config = {
          ...event,
          pageLocation: {
            x,
            y,
            width,
            height,
            pageX,
            pageY,
            titleLayout: titleLayout.current,
          },
        };
        setToolTipConfig({config});
      });
    });

    setElement(e);
  };

  useEffect(() => {
    const changed = async () => {
      try {
        const l = await model.getLayout();
        if (
          !l?.qSelectionInfo.qInSelections &&
          selectionsApiImpl?.current?.isActive()
        ) {
          selectionsApiImpl.current.noModal();
          selectionsApiImpl.current.eventEmitter.emit('aborted');
        }
        setLayout(l);
      } catch (error) {
        if (error.code !== 15) {
          log.error('Failed to get layout', error);
        }
      }
    };

    const getInitialLayout = async () => {
      let needend = false;
      let firstLayout;
      try {
        if (!loadLayout) {
          firstLayout = await model.getLayout();
        } else {
          firstLayout = loadLayout;
        }
        if (firstLayout.qSelectionInfo.qInSelections) {
          await model.endSelections(false);
        }
      } catch (error) {
        if (error.code === 15) {
          needend = true;
        }
      }
      if (needend) {
        try {
          await model.endSelections(true);
          firstLayout = await model.getLayout();
        } catch (error) {
          log.error('complete fail');
        }
      }
      return firstLayout;
    };

    const initialize = async () => {
      try {
        const initialLayout = await getInitialLayout();
        selectionsApiImpl.current = SelectionsApi({model, app, log});
        selectionsApiImpl.current.eventEmitter.addListener('activated', () => {
          // check for position here to avoid the data race when
          // initialized is called before onlayout
          bodyRef.current.measure((x, y, width, height, pageX, pageY) => {
            let py = pageY;
            if (topPadding === 'none') {
              py = pageY - 30;
            }
            const position = {
              x,
              y,
              pageX,
              pageY: py,
              width,
              height,
              titleLayout: titleLayout.current,
            };
            const config = {
              toggleLasso: onToggledLasso,
              confirmSelection: handleConfirmSelections,
              cancelSelection: handleCancelSelections,
              clear: handleClearSelections,
              element,
              position,
              id,
              active: true,
            };
            setSelectionsConfig(config);
          });
        });
        selectionsApiImpl.current.on('canceled', () => {
          resetConfig();
        });
        model.on('changed', changed);
        setSnRenderContext({
          app,
          model,
          appLayout: {},
          layout: initialLayout,
        });
        if (!loadLayout) {
          changed();
        } else {
          setLayout(loadLayout);
        }
      } catch (error) {
        log.error('Failed to initialize', error);
      }
    };

    if (model && element && !initialized.current) {
      initialized.current = true;
      initialize();
    }

    return () => {
      if (!mounted.current && model) {
        model.removeListener('changed', changed);
        if (selectionsApiImpl.current) {
          selectionsApiImpl.current.destroy();
        }
        if (element) {
          element.destroy();
        }
      }
    };
  }, [element, model, app, setSelectionsConfig]);

  useEffect(() => {
    const selections = selectionsApiImpl.current;

    if (sn && snRenderContext && element && !snComponent.current) {
      const options = {
        renderer: 'carbon',
        carbon: true,
        showLegend,
        invalidMessage: invalidMessage || 'Undefined',
      };
      const t = themeFn();
      t.internalAPI.setTheme(theme, 'horizon');
      themeRef.current = t;
      const supernova = generator(sn, {
        translator,
        sense: true,
        theme: t.externalAPI,
        ...options,
      });
      const {component} = supernova.create({
        ...snRenderContext,
        selections,
        theme: t,
      });
      snComponent.current = component;
      snComponent.current.created();
      snComponent.current.mounted(element);
      if (onLoaded) {
        onLoaded();
      }
    }

    return () => {
      if (snComponent.current) {
        snComponent.current.willUnmount();
        snComponent.current.destroy();
        snComponent.current = undefined;
      }
    };
  }, [sn, snRenderContext, element, theme]);

  useEffect(() => {
    renderSupernovaLayout(layout);
  }, [snRenderContext, renderSupernovaLayout, layout]);

  const renderSupernovaLayout = useCallback(
    (renderLayout) => {
      async function renderSupernova() {
        try {
          const context = {
            ...snComponent.current.context,
            theme: themeRef.current.externalAPI,
          };

          await snComponent.current.render({
            ...snRenderContext,
            context,
            layout: {...renderLayout},
          });
          if (
            renderLayout &&
            !renderLayout?.qSelectionInfo.qInSelections &&
            !lasso
          ) {
            element?.draw();
          }
        } catch (error) {
          log.error('error while rendering');
        }
      }
      if (snComponent.current && renderLayout !== undefined) {
        renderSupernova();
      }
    },
    [element, lasso],
  );

  const handleTitleLayout = ({nativeEvent}) => {
    titleLayout.current = nativeEvent.layout;
  };

  const renderJsxComponent = useCallback(() => {
    if (!element) {
      return null;
    }
    const comp = element.getJsxComponent();
    if (comp && componentData) {
      return comp(componentData);
    }
    return null;
  }, [componentData, element]);

  const onSelection = (selections) => {
    if (element) {
      element.setImmediate(true);
      element.onSelections(selections.nativeEvent.selections);
    }
  };

  const onTouchesBegan = (_event) => {
    setTooltipVisible(false);
  };

  const handleLongPress = (event) => {
    if (element) {
      const touchesListener = element.getTouchesStartListener();
      if (touchesListener) {
        touchesListener(event.nativeEvent.touches);
      }
    }
    if (onLongPress) {
      onLongPress();
    }
  };

  return (
    <View style={[styles.layer, style]} ref={bodyRef} collapsable={false}>
      <Title
        style={titleBarStyle}
        layout={layout}
        onLayout={handleTitleLayout}
        topPadding={topPadding}
        disableIcon={disableIcon}
        theme={theme}
      />
      <Animated.View style={[styles.layer]} ref={containerRef}>
        <LayerView
          style={styles.layer}
          onElement={onElement}
          onLayoutChanged={renderSupernovaLayout}
          onSelection={onSelection}
          onDoubleTap={onDoubleTap}
          onTouchesBegan={onTouchesBegan}
          onLongPress={handleLongPress}
          lasso={lasso}
        />
        <View style={styles.components} pointerEvents="box-none">
          {renderJsxComponent()}
        </View>
      </Animated.View>
      {showLegend ? <CatLegend layout={layout} element={element} /> : null}
      <Footer layout={layout} theme={theme} />
      {layout === undefined ? (
        <ActivityIndicator style={styles.loader} size="large" color="grey" />
      ) : null}
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
  loader: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
