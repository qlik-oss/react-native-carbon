import { __DO_NOT_USE__ as NebulaInternals } from "@nebula.js/stardust";
import pixelWidth from "string-pixel-width";

const {
  theme: {},
} = NebulaInternals;

const CanvasPollyFill = {
  getContext: (_c) => {
    return {
      measureText: (text) => {
        return { width: pixelWidth(text, { size: 12 }), height: 12 };
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
