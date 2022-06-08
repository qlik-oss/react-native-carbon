import {__DO_NOT_USE__ as NebulaInternals} from '@nebula.js/stardust';
import {SelectionsApi} from './selectionsApi';
const {generator, theme: themeFn} = NebulaInternals;
import {debounce} from 'lodash';

export type TranslationType = {
  add: () => void;
  language: () => string;
};

export type NebulaModelType = {
  app: any;
  model: any;
  modelId?: string;
  theme: any;
  snapshot?: any;
  log: any;
  appLayout?: any;
  onLayout: (layout: any) => void;
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

  constructor({
    app,
    model,
    theme,
    log,
    modelId,
    onLayout,
    snapshot,
    appLayout,
  }: NebulaModelType) {
    this.panning = false;
    this.generator = generator;
    this.theme = themeFn;
    this.translation = {add: () => {}, language: () => 'english'};
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
      log,
      modelId,
      onLayout,
      appLayout,
    };
  }

  async layoutChanged() {
    try {
      const layout = await this.nebulaModel.model.getLayout();
      if (
        !layout.qSelectionInfo.qInSelections &&
        this.selectionsApi?.isActive()
      ) {
        this.selectionsApi.noModal();
        this.selectionsApi.eventEmitter.emit('aborted');
      }
      if (this.snComponent) {
        this.currentLayout = layout;
        this.renderSupernova(layout);
        this.nebulaModel.onLayout(layout);
      }
    } catch (error) {
      this.nebulaModel.log.error('Error', error);
    }
  }

  private async getInitialLayout() {
    try {
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

  private async loadData() {
    const _layout = await this.getInitialLayout();
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

  async loadSupernova(
    element: any,
    supernova: any,
    invalidMessage: string | undefined,
    showLegend: boolean,
    vizTheme: any,
    onSelectionsActivated: () => void,
  ) {
    // android destroys the opengl surface when switching navigation screens, when comming back
    // it will re-create the surface, so make sure to clean everythng up first
    if(this.nebulaModel.model && this.changed) {
      
      this.nebulaModel.model.removeListener('changed', this.changed)
    }
    await this.loadData();
    this.selectionsApi.addListener('activated', onSelectionsActivated);
    const options = {
      renderer: 'carbon',
      carbon: true,
      showLegend,
      invalidMessage: invalidMessage || 'Undefined',
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
    this.changed();
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
    if(this.nebulaModel.model) {
      this.nebulaModel.model.removeListener('changed', this.changed);
    }
  }

  getJsxComponent() {
    return this?.canvasElement?.getJsxComponent();
  }

  getSupernovaTitle() {
    return this.supernovaTitle;
  }
}
