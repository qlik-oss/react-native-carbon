import {__DO_NOT_USE__ as NebulaInternals} from '@nebula.js/stardust';
import '@qlik/react-native-helium';

const {
  theme: {},
} = NebulaInternals;

const CanvasPollyFill = {
  getContext: (_c) => {
    return {
      measureText: (text) => {
        console.log('what??', text);
        // const fontFamily = opt.fontFamily.split(',')[0];
        // const fontSize = parseInt(opt.fontSize, 10);
        // const text = opt.text.length > 0 ? opt.text : 'M';
        // // eslint-disable-next-line no-undef
        // const result = HeliumCanvasApi.measureText({fontFamily, fontSize, text});
        // return result;
        return {width: 0, height: 12};
      },
    };
  },
};

export const enableCarbon = () => {
  if (!global.document) {
    global.document = {
      createElement: (_e) => {
        return CanvasPollyFill;
      },
    };
  }
};
