import {__DO_NOT_USE__ as NebulaInternals} from '@nebula.js/stardust';
import {SelectionsApi} from './selectionsApi';
const {generator, theme: themeFn} = NebulaInternals;
import {debounce} from 'lodash';
import IconsPath from '../IconPaths.json';
import { SupernovaToolTipAtom } from '@qlik/react-native-carbon/src/carbonAtoms';

export type TranslationType = {
  add: () => void;
  language: () => string;
  translate?: (value: any) => string;
};

export type NebulaModelType = {
  app: any;
  model: any;
  modelId?: string;
  theme: any;
  snapshot?: any;
  loadLayout?: any;
  log: any;
  appLayout?: any;
  onLayout: (layout: any) => void;
  translator?: (value: any) => string;
  qaeProps: any;
};

export default class NebulaEngine {
  generator: any;
  theme: () => void;
  translation: TranslationType;
  selectionsApi: any;
  nebulaModel: NebulaModelType;
  renderContext: any;
  snComponent: any;
  canvasElement: any;
  externalTheme: any;
  changed: any;
  currentLayout: any | undefined;
  debouncedResize: () => void;
  panning: boolean;
  properties: any;
  supernovaTitle: string | undefined;
  icons: any;
  qaeProps: any;
  onLongPress?: (t: SupernovaToolTipAtom, l: any) => void;
  layout?: any;

  constructor({
    app,
    model,
    theme,
    log,
    modelId,
    onLayout,
    snapshot,
    loadLayout,
    appLayout,
    translator,
    qaeProps,
  }: NebulaModelType) {
    this.qaeProps = qaeProps;
    this.icons = IconsPath;
    this.panning = false;
    this.generator = generator;
    this.theme = themeFn;
    this.translation = {
      add: () => {},
      language: () => 'english',
      translate: translator,
    };
    this.debouncedResize = debounce(
      () => {
        if (this.canvasElement) {
          this.canvasElement.resetSize();
          this.snComponent.resize();
        }
      },
      100,
      {trailing: true},
    );

    this.nebulaModel = {
      app,
      model,
      theme,
      snapshot,
      loadLayout,
      log,
      modelId,
      onLayout,
      appLayout,
      translator,
      qaeProps,
    };
  }

  unwrapLayout(layout: any) {
    if (layout?.qUndoExclude?.generated) {
      return layout.qUndoExclude.generated;
    }
    return layout;
  }

  async layoutChanged() {
    try {
      this.layout = await this.nebulaModel.model.getLayout();
      if (
        !this.layout.qSelectionInfo.qInSelections &&
        this.selectionsApi?.isActive()
      ) {
        this.selectionsApi.noModal();
        this.selectionsApi.eventEmitter.emit('aborted');
      }
      if (this.snComponent) {
        if (this.layout.visualization === 'auto-chart') {
          this.layout = this.unwrapLayout(this.layout);
        }
        this.currentLayout = this.layout;
        this.renderSupernova(this.layout);
        this.nebulaModel.onLayout(this.layout);
      }
    } catch (error) {
      this.nebulaModel.log.error('Error', error);
    }
  }

  private async getInitialLayout() {
    try {
      if (this.nebulaModel.loadLayout) {
        return this.nebulaModel.loadLayout;
      }
      if (this.nebulaModel.snapshot) {
        return this.nebulaModel.snapshot;
      }

      if (!this.nebulaModel.model && this.nebulaModel.modelId) {
        this.nebulaModel.model = await this.nebulaModel.app.getObject(
          this.nebulaModel.modelId,
        );
      }

      const layout = await this.nebulaModel.model.getLayout();
      return layout;
    } catch (error) {
      this.nebulaModel.log.error('Error', error);
    }
  }

  async renderSnapshot(snapshotData: any) {
    const _layout = await this.getInitialLayout();
    this.nebulaModel.snapshot = snapshotData;
    this.renderContext = {
      app: undefined,
      model: {},
      layout: _layout,
      snapshotData: this.nebulaModel.snapshot,
      appLayout: {
        qLocaleInfo: this.nebulaModel.snapshot.snapshotData.appLocaleInfo,
      },
    };
    if (this.snComponent) {
      this.currentLayout = snapshotData;
      this.renderSupernova(snapshotData);
      this.nebulaModel.onLayout(snapshotData);
    }
  }

  private async loadData() {
    const _layout = await this.getInitialLayout();
    if (this.nebulaModel.snapshot) {
      this.renderContext = {
        app: undefined,
        model: {},
        layout: _layout,
        snapshotData: this.nebulaModel.snapshot,
        appLayout: {
          qLocaleInfo: this.nebulaModel.snapshot.snapshotData.appLocaleInfo,
        },
      };
    } else {
      this.changed = this.layoutChanged.bind(this);
      if (this.selectionsApi) {
        this.selectionsApi.destroy();
      }
      this.selectionsApi = SelectionsApi({...this.nebulaModel});
      this.renderContext = {
        app: this.nebulaModel.app,
        model: this.nebulaModel.model,
        layout: _layout,
        appLayout: this.nebulaModel.appLayout,
      };
      this.nebulaModel.model.on('changed', this.changed);
    }
  }


  onLongPressHandler(data: SupernovaToolTipAtom) {
    if( this.onLongPress) {
      console.log('ll - ', this.layout)
      this.onLongPress(data, this.layout);
    }
  }

  async loadSupernova(
    element: any,
    supernova: any,
    invalidMessage: string | undefined,
    showLegend: boolean,
    vizTheme: any,
    onSelectionsActivated: () => void,
    onLongPress: (t: SupernovaToolTipAtom, l: any) => void,
  ) {
    this.onLongPress = onLongPress;
    element.setLongPressHandler(this.onLongPressHandler.bind(this));
    // android destroys the opengl surface when switching navigation screens, when comming back
    // it will re-create the surface, so make sure to clean everythng up first
    if (this.nebulaModel.model && this.changed) {
      this.nebulaModel.model.removeListener('changed', this.changed);
    }
    await this.loadData();
    if (this.selectionsApi) {
      this.selectionsApi.addListener('activated', onSelectionsActivated);
    }
    const options = {
      renderer: 'carbon',
      carbon: true,
      icons: this.icons,
      showLegend,
      invalidMessage: invalidMessage || 'Undefined',
      qaeProps: this.qaeProps,
    };
    const theme = this.theme();
    theme.internalAPI.setTheme(vizTheme, 'horizon');
    this.externalTheme = theme.externalAPI;
    const sn = generator(supernova, {
      sense: true,
      theme: this.externalTheme,
      translator: this.translation,
      ...options,
    });
    this.properties = sn.qae.properties;
    const {component} = sn.create({
      ...this.renderContext,
      selections: this.selectionsApi,
      theme,
    });
    this.canvasElement = element;
    this.snComponent = component;
    this.snComponent.created();
    this.snComponent.mounted(element);
    if (this.nebulaModel.snapshot) {
      this.renderSupernova(this.nebulaModel.snapshot);
    } else {
      this.changed();
    }
  }

  unloadSupernova() {
    if (this.snComponent) {
      this.snComponent.willUnmount();
      this.snComponent.destroy();
      this.snComponent = undefined;
    }
  }

  private async renderSupernova(layout: any) {
    const context = {
      ...this.snComponent.context,
      ...this.renderContext,
      theme: this.externalTheme,
    };
    this.snComponent.render({
      ...this.renderContext,
      context,
      layout,
    });
  }

  resizeView() {
    this.debouncedResize();
  }

  onTapped(val: any) {
    if (this.canvasElement) {
      this.canvasElement.emit('touchstart', val);
      this.canvasElement.emit('touchend', val);
    }
  }

  beginSelections() {
    if (this.selectionsApi) {
      if (!this.selectionsApi.isActive()) {
        this.selectionsApi.begin(['/qHyperCubeDef']);
      }
    }
  }

  confirmSelections() {
    this.canvasElement.confirmSelections();
    this.selectionsApi.confirm();
  }

  destroy() {
    if (this.nebulaModel.model && !this.nebulaModel.snapshot && this.changed) {
      this.nebulaModel.model.removeListener('changed', this.changed);
    }
    if (this.selectionsApi) {
      this.selectionsApi.destroy();
    }
  }

  getJsxComponent() {
    return this?.canvasElement?.getJsxComponent();
  }

  getSupernovaTitle() {
    return this.supernovaTitle;
  }

  clearSelections() {
    this.canvasElement.clearSelections();
    this.selectionsApi.clear();
  }
}
