import {ElementProxy} from './ElementProxy';
import rgba from 'color-rgba';
import uuid from 'react-native-uuid';
import getPixelWidth from 'string-pixel-width';
import EventEmitter from 'eventemitter3';
import {transformEvent} from '../core/transformEvent';

type ElementBoundingRect = {
  width: number;
  height: number;
  x: number;
  y: number;
  left: number;
  right: number;
  bottom: number;
  top: number;
};

export default class Element {
  id: string | number[];
  children: Element[];
  jsxComponent: any;
  boundingRect: ElementBoundingRect;
  eventEmitter: any;
  composites: any[];
  immediate: boolean;
  shapesBuffer: any;
  throttle: any;
  pendingUpdates: any;
  panning: boolean;
  catLegendData: any;
  catLegendListener: any;
  catLegendMounted: boolean;
  catLegendTitle: string;
  nativeHandle: any;
  selectionsListener: any;
  touchesStartListener: any;

  constructor(
    id: string | number[],
    x: number,
    y: number,
    width: number,
    height: number,
    nativeHandle?: any,
  ) {
    this.throttle = 30;
    this.immediate = false;
    this.panning = false;
    this.eventEmitter = new EventEmitter();
    this.id = id;
    this.children = [];
    this.composites = [];
    this.jsxComponent = undefined;
    this.shapesBuffer = [];
    this.pendingUpdates = [];
    this.catLegendData = undefined;
    this.catLegendListener = undefined;
    this.catLegendMounted = false;
    this.catLegendTitle = '';
    this.nativeHandle = nativeHandle;
    this.boundingRect = {
      x,
      y,
      width,
      height,
      top: y,
      left: x,
      bottom: y + height,
      right: x + width,
    };
  }

  // the following two methods are to signal Picasso.js that this is mobile and will
  // be recieving touchxxxx events
  ontouchstart() {}
  ontouchend() {}

  // stub
  appendChild() {}

  getColorFromString(value: string, opacity: number | undefined) {
    const colors = rgba(value);
    for (let i = 0; i < 3; i++) {
      colors[i] /= 255;
    }
    if (opacity !== undefined) {
      colors[3] = opacity;
    }
    return {type: 'color', colors};
  }

  getColorGradientFrom(fill: any) {
    const gradient = {
      type: 'gradient',
      degree: fill.degree,
      stops: fill.stops.map((stop: any) => ({
        color: this.getColorFromString(stop.color, undefined),
        offset: stop.offset,
      })),
    };
    return gradient;
  }

  measureText(opt: any) {
    if (!opt.text) {
      return {width: getPixelWidth(opt, {size: 12}), height: 12};
    }
    let size = parseInt(opt.fontSize, 10);
    if (isNaN(size)) {
      size = 12;
    }

    let sourceFont = opt.fontFamily || 'arial';

    const fontFamily = sourceFont
      .split(',')
      .map((s: any) => s?.trim()?.toLowerCase());
    const font = fontFamily.length > 1 ? fontFamily[1] : fontFamily[0];
    const dims = opt.fontSize
      ? {width: getPixelWidth(opt.text, {size, font}), height: size}
      : {width: getPixelWidth(opt.text, {size: 12, font})};
    return dims;
  }

  createElement(rect: any, _key: any) {
    return this.createChild(rect.x, rect.y, rect.width, rect.height);
  }

  getBoundingClientRect() {
    return this.boundingRect;
  }

  setClientRect(rect: any) {
    this.boundingRect.width = rect.width;
    this.boundingRect.height = rect.height;
    this.boundingRect.x = rect.x;
    this.boundingRect.y = rect.y;
    this.boundingRect.top = rect.y;
    this.boundingRect.left = rect.x;
    this.boundingRect.bottom = rect.y + rect.height;
    this.boundingRect.right = rect.x + rect.width;
    ElementProxy.resize(this.id, rect.x, rect.y, rect.width, rect.height);
  }

  createChild(x: number, y: number, width: number, height: number): Element {
    const childId = uuid.v4();
    const child = new Element(childId, x, y, width, height);
    ElementProxy.createChildElement(this.id, childId, x, y, width, height);
    this.children.push(child);
    return child;
  }

  addEventListener(type: string, listener: any) {
    const c = this.eventEmitter.addListener(type, listener);
    return c;
  }

  removeEventListener(type: string, listener: any) {
    this.eventEmitter.removeListener(type, listener);
  }

  emit(type: string, event: any) {
    const transformedEvent = transformEvent(event, this.children);
    this.eventEmitter.emit(type, transformedEvent);
  }

  emitSingle(type: string) {
    this.eventEmitter.emit(type);
  }

  addRect(
    shapeId: number,
    parentId: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fill: any,
    opacity = 1.0,
    stroke = 'white',
    strokeWidth = 0.0,
  ) {
    let colors;
    if (fill.type === 'gradient') {
      colors = this.getColorGradientFrom(fill);
    } else {
      colors = this.getColorFromString(fill, opacity);
    }
    const strokeColors = this.getColorFromString(stroke, undefined);
    ElementProxy.addRect(
      this.id,
      shapeId,
      parentId,
      x,
      y,
      width,
      height,
      colors,
      strokeColors,
      strokeWidth,
    );
  }

  updateShape(composite: any) {
    const colors = this.getColorFromString(composite.fill, composite.opacity);
    const stroke = composite?.stroke || 'white';
    const strokeWidth = composite?.strokeWidth || 0.0;
    const strokeColors = this.getColorFromString(stroke, undefined);
    return {colors, strokeColors, strokeWidth, id: composite.shapeId};
  }

  addLine(
    shapeId: number,
    x1: number,
    x2: number,
    y1: number,
    y2: number,
    stroke: string,
    strokeWidth: number,
  ) {
    const strokeColor = this.getColorFromString(stroke, undefined);
    ElementProxy.addLine(
      this.id,
      shapeId,
      x1,
      x2,
      y1,
      y2,
      strokeColor,
      strokeWidth,
    );
  }

  addCircle(
    shapeId: number,
    cx: number,
    cy: number,
    r: number,
    fill: string,
    opacity: number | undefined,
    stroke = 'white',
    strokeWidth = 0.0,
  ) {
    const colors = this.getColorFromString(fill, opacity);
    const strokeColors = this.getColorFromString(stroke, undefined);
    ElementProxy.addCircle(
      this.id,
      shapeId,
      cx,
      cy,
      r,
      colors,
      strokeColors,
      strokeWidth,
    );
  }

  addText(
    shapeId: number,
    textObj: any,
    fill: string,
    opacity: number | undefined,
    stroke = 'white',
    strokeWidth = 0.0,
  ) {
    const colors = this.getColorFromString(fill, opacity);
    const strokeColors = this.getColorFromString(stroke, undefined);
    ElementProxy.addText(
      this.id,
      shapeId,
      textObj,
      colors,
      strokeColors,
      strokeWidth,
    );
  }

  addPath(shapeId: number, pathObj: any) {
    ElementProxy.addPath(this.id, shapeId, pathObj);
  }

  add(composite: any) {
    this.composites.push(composite);
  }

  draw() {
    if (!this.immediate) {
      ElementProxy.clearCache(this.id);
      for (let i = 0; i < this.composites.length; i++) {
        this.createShape(this.composites[i]);
      }

      ElementProxy.draw(this.id);

      this.children.forEach((child) => {
        child.draw();
      });

      this.shapesBuffer = this.composites.map((c) => ({...c}));
    }
  }

  createShape(shape: any) {
    // do individual properties because in react-native
    // these objects are transfered over the bridge.  The bridge
    // serializes the object into JSON, when there's 1000's of objects, every little bit helps.
    switch (shape.type) {
      case 'line': {
        this.addLine(
          shape.shapeId,
          shape.x1,
          shape.x2,
          shape.y1,
          shape.y2,
          shape.stroke,
          shape.strokeWidth,
        );
        break;
      }
      case 'path': {
        const obj = {} as any;
        if (shape.d) {
          obj.path = shape.d;
          obj.opacity = shape?.opacity;
          obj.fill = shape?.fill;
          obj.stroke = shape?.stroke;
          obj.strokeWidth = shape?.strokeWidth;
          if (shape.transform) {
            obj.transform = shape.transform;
          }
          if (shape.strokeDasharray) {
            obj.strokeDasharray = shape.strokeDasharray;
          }
          this.addPath(shape.shapeId, obj);
        }
        break;
      }
      case 'circle': {
        this.addCircle(
          shape.shapeId,
          shape.cx,
          shape.cy,
          shape.r,
          shape.fill,
          shape.opacity,
          shape.stroke,
          shape.strokeWidth,
        );
        break;
      }
      case 'text': {
        const obj = {} as any;
        if (shape.text && shape.text.length > 0) {
          obj.text = shape.text;
          obj.transform = shape?.transform;

          obj.font = {
            boundingRect: shape?.boundingRect,
            fontFamily: shape.fontFamily,
            fontSize: parseFloat(shape.fontSize),
            anchor: shape.anchor,
            x: shape.x,
            y: shape.y,
            maxWidth: shape?.maxWidth,
            maxHeight: shape?.maxHeight,
            baseline: shape?.baseline,
            dy: shape?.dy,
            dx: shape?.dx,
          };
          if (shape.wordBreak) {
            obj.font.wordBreak = shape.wordBreak;
          }

          if (shape.fontWeight) {
            obj.font.fontWeight = shape.fontWeight;
          }
          this.addText(
            shape.shapeId,
            obj,
            shape.fill,
            shape.opacity,
            shape.stroke,
            shape.strokeWidth,
          );
        }
        break;
      }
      case 'rect': {
        this.addRect(
          shape.shapeId,
          shape?.data?.path || '',
          shape.x,
          shape.y,
          shape.width,
          shape.height,
          shape.fill,
          shape.opacity === undefined ? 1.0 : shape.opacity,
          shape?.stroke || 'white',
          shape?.strokeWidth || 0.0,
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  clear() {
    this.composites = [];
    if (!this.immediate) {
      this.shapesBuffer = [];
      ElementProxy.clearCache(this.id);
    }
    ElementProxy.clear(this.id);
  }

  destroy() {
    this.children.forEach((child) => child.destroy());
    this.eventEmitter.emit('destroyed');
    this.eventEmitter.removeAllListeners();
    ElementProxy.destroy(this.id);
  }

  removeAllTouchListeners() {
    this.touchesStartListener = undefined;
    this.selectionsListener = undefined;
  }

  getImmediate() {
    return this.immediate;
  }

  setImmediate(value: boolean) {
    this.immediate = value;
    this.children.forEach((child) => {
      child.setImmediate(value);
    });
  }

  enableMotion(value: boolean) {
    ElementProxy.enableMotion(this.id, value);
    this.children.forEach((child) => child.enableMotion(value));
  }

  flush() {
    this.children.forEach((child) => child.flush());
    ElementProxy.flush(this.id);
  }

  disableLoadAnimations() {
    ElementProxy.disableLoadAnimations(this.id);
  }

  mountCatLegend(title: string) {
    this.catLegendMounted = true;
    this.catLegendTitle = title;
  }

  setCatLegendListener(listener: any) {
    this.catLegendListener = listener;
  }

  setCatLegendData(data: any) {
    this.catLegendData = data;

    if (this.catLegendListener) {
      this.catLegendListener(data);
    }
  }

  getCatLengendData() {
    return this.catLegendData;
  }

  mount(component: any) {
    this.jsxComponent = component;
  }

  renderComponent(data: any) {
    this.eventEmitter.emit('renderComponentWithData', data);
  }

  getJsxComponent() {
    return this.jsxComponent;
  }

  kpi(kpiConfig: any) {
    ElementProxy.kpi(this.id, JSON.stringify(kpiConfig));
  }

  onSelections(selections: [number]) {
    if (this.selectionsListener) {
      const currentSelections: any[] = [];
      selections.forEach((selection) => {
        const comp = this.composites[selection];
        if (comp?.data) {
          currentSelections.push(comp.data);
        }
      });
      if (currentSelections.length > 0) {
        this.selectionsListener(currentSelections);
      }
    }
    this.children.forEach((element) => element.onSelections(selections));
  }

  setSelectionsListener(listener: any) {
    this.selectionsListener = listener;
    this.children.forEach((element) => element.setSelectionsListener(listener));
  }

  setTouchesStartListener(listener: any) {
    this.touchesStartListener = listener;
  }

  getTouchesStartListener() {
    return this.touchesStartListener;
  }
}
