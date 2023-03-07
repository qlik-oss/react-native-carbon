import {getValue} from '../components/internalTheme';

export type CarbonThemeType = {
  theme: any;
};

export default class CarbonTheme {
  theme: any;
  constructor({theme}: CarbonThemeType) {
    this.theme = theme;
  }

  getValue(path: string, defaultValue: string | null) {
    return getValue(this.theme, path, defaultValue);
  }

  getFont(path: string, defaultValue: string) {
    const ff = getValue(this.theme, path, defaultValue);
    return parseInt(ff, 10);
  }

  resolveBackgroundColor(layout: any, defaultValue: string) {
    const component = layout.components?.find((x: {key: string}) => {
      return x?.key === 'general';
    });
    if (!component?.bgColor?.color) {
      return defaultValue;
    }

    if (!component.bgColor.color.index) {
      return component.bgColor.color?.color || defaultValue;
    }

    if (!this.theme?.palettes?.ui) {
      return defaultValue;
    }

    let colorPalettes = this.theme.palettes.ui?.[0]?.colors;
    if (!colorPalettes) {
      return defaultValue;
    }

    let index = Math.max(component.bgColor.color.index - 1, 0);
    if (index < colorPalettes.length) {
      return colorPalettes[index];
    }
    return defaultValue;
  }
}
