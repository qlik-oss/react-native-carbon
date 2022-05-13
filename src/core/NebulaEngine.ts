import {__DO_NOT_USE__ as NebulaInternals} from '@nebula.js/stardust';
import {SelectionsApi} from './selectionsApi';
const {generator, theme: themeFn} = NebulaInternals;

export type TranslationType = {
  add: () => void;
  language: () => string;
};

export type NebulaModelType = {
  app: any;
  model: any;
  modelId?: string;
  theme: any;
  initialLayout?: any;
  log: any;
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

  constructor({
    app,
    model,
    theme,
    initialLayout,
    log,
    modelId,
    onLayout,
  }: NebulaModelType) {
    this.generator = generator;
    this.theme = themeFn;
    this.translation = {add: () => {}, language: () => 'english'};
    this.nebulaModel = {
      app,
      model,
      theme,
      initialLayout,
      log,
      modelId,
      onLayout,
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
      console.log('foobar', error);
    }
  }

  private async getInitialLayout() {
    try {
      if (this.nebulaModel.initialLayout) {
        return this.nebulaModel.initialLayout;
      }
      if (!this.nebulaModel.model && this.nebulaModel.modelId) {
        this.nebulaModel.model = await this.nebulaModel.app.getObject(
          this.nebulaModel.modelId,
        );
      }

      const layout = await this.nebulaModel.model.getLayout();
      return layout;
    } catch (error) {
      console.log('oops', error);
    }
  }

  private async loadData() {
    const _layout = await this.getInitialLayout();
    this.nebulaModel.model.removeAllListeners();
    if (this.selectionsApi) {
      this.selectionsApi.destroy();
    }
    this.selectionsApi = SelectionsApi({...this.nebulaModel});
    this.renderContext = {
      app: this.nebulaModel.app,
      model: this.nebulaModel.model,
      layout: _layout,
      appLayout: {},
    };
    this.changed = this.layoutChanged.bind(this);
    this.nebulaModel.model.on('changed', this.changed);
  }

  async loadSupernova(
    element: any,
    supernova: any,
    invalidMessage: string,
    showLegend: boolean,
    vizTheme: any,
  ) {
    await this.loadData();
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
      theme: this.externalTheme,
    };
    this.snComponent.render({
      ...this.renderContext,
      context,
      layout: {...layout},
    });
  }

  resizeView() {
    if (this.canvasElement) {
      this.canvasElement.clear();
      this.canvasElement.resetSize();
      this.snComponent.resize();
    }
  }

  destroy() {}
}