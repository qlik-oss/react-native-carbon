//
//  Element.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-22.
//

import Foundation
enum CompositeType : Int {
  case Rects, Lines, Circles, Words, Svgs
}
class Element {
  weak var rootElement: Element?
  weak var parentView: LayerView?
  var reactTag: NSNumber = -1
  var uuid: NSString = ""
  var renderView: RenderView?
  var children = [Element]()
  var objectPools = [ObjectPool]()
  var updateMode = false
  var disableMotionOnLoad = false
  var compositeTable: [NSNumber: Composite] = [:];
  var updateHistory = [Int]()
  
  
  init (){
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
  }
  
  init(withTag tag: NSNumber, id: NSString) {
    reactTag = tag
    uuid = id
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
    objectPools.append(ObjectPool())
  }
  
  func resize(x: Double, y: Double, width: Double, height: Double) {
    if let view = renderView {
      let frame = CGRect(x: x, y: y, width: width, height: height)
      view.frame = frame;
      if let parent = parentView {
        parent.setNeedsLayout()
      }
    }
  }
  
  func addChild(_ element: Element) {
    children.append(element)
    if (self.disableMotionOnLoad) {
      element.disableLoadAnimation()
    }
  }
  
  func destroy() {
    if let view = renderView {
      view.removeFromSuperview()
    }
    
    for objectPool in objectPools {
      objectPool.removeAll()
    }
    
    clear();
    
    for child in children {
      child.destroy()
    }
    children.removeAll()
  }
  
  func addRect(_ shapeId: NSNumber,
               parentId: NSString,
               x: Double,
               y: Double,
               width: Double,
               height: Double,
               fill: NSDictionary,
               stroke: NSDictionary,
               strokeWidth:Double) {
    if let view = renderView {
      var rect: Rectangle?
      rect = objectPools[CompositeType.Rects.rawValue].get() as? Rectangle
      if (rect == nil) {
        rect = Rectangle(withFrame: view.frame)
        objectPools[CompositeType.Rects.rawValue].recycable(rect!)
      }
      if let historyIndex = updateHistory.popLast() {
        if let prevRect = compositeTable[NSNumber(value:historyIndex)] {
          if prevRect.compType == .rect {
            rect!.updateFrom(prevRect as? Rectangle ?? nil)
          }
        }
        
      }
      let color = ColorComponent(withDecoadbleColor: fill)
      let stroke = ColorComponent(withDecoadbleColor: stroke)
      rect!.shapeId = shapeId.intValue
      rect!.parentId = parentId as String
      let _ = rect!.createRect(withColorComponent: color,
                               strokeComponent: stroke,
                               strokeWidth: strokeWidth,
                               x: x,
                               y: y,
                               width: width,
                               height: height)
      compositeTable[shapeId] = rect!
      view.add(composite: rect!)
    }
  }
  
  func useCache() {
    updateMode = true;
    clearUnsportedTypesFromCache()
  }
  
  func clearCaches() {
    if let view = renderView {
      view.clearCaches();
    }
  }
  
  func clearUnsportedTypesFromCache() {
    objectPools[CompositeType.Lines.rawValue].removeFromLayer()
    objectPools[CompositeType.Svgs.rawValue].removeFromLayer()
  }
  
  func enableMotion( _ value: Bool) {
    if let view = renderView {
      view.animate = value
    }
  }
  
  func disableLoadAnimation() {
    self.disableMotionOnLoad = true
    if let view = renderView {
      view.animate = false;
    }
  }
  
  func updateShape(_ index: NSNumber, fill: NSDictionary, stroke: NSDictionary, strokeWidth: Double) {
    if let composite = compositeTable[index] {
      let color = ColorComponent(withDecoadbleColor: fill)
      let stroke = ColorComponent(withDecoadbleColor: stroke)
      composite.update(withFill: color, stroke: stroke, strokeWidth: strokeWidth)
    }
  }
  
  func batchUpdate(_ list: NSArray) {
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    do {
      let temp = list as Array
      if temp.count > 0 {
        let json = try JSONSerialization.data(withJSONObject: temp)
        let shapes: [UpdateShape] = try JSONDecoder().decode([UpdateShape].self, from: json)
        for shape in shapes {
          if let index = shape.id {
            if let composite = compositeTable[NSNumber(value: index)] {
              let color = ColorComponent(withDecodedColor: shape.colors!)
              let stroke = ColorComponent(withDecodedColor: shape.strokeColors!)
              if (color.getAlpha() == 1 && composite.compType == .rect) {
                updateHistory.append(Int(index))
              }
              composite.update(withFill: color, stroke: stroke, strokeWidth: shape.strokeWidth ?? 0)
            }
          }
        }
      }
    } catch {
      print(error)
    }
    CATransaction.commit()
  }
  
  func addLine(_ shapeId: NSNumber, x1: Double, x2: Double, y1: Double, y2: Double, stroke: NSDictionary, strokeWidth: Double) {
    if let view = renderView {
      var line: Line?
      line = objectPools[CompositeType.Lines.rawValue].get() as? Line
      if (line == nil) {
        line = Line()
        objectPools[CompositeType.Lines.rawValue].recycable(line!)
      }
      
      let stroke = ColorComponent(withDecoadbleColor: stroke)
      line!.createLine(x1, x2: x2, y1: y1, y2: y2, stroke: stroke.toCGColor(), strokeWidth: strokeWidth)
      view.add(composite: line!)
    }
  }
  
  func addCircle(shapeId: NSNumber, cx:Double, cy:Double, r:Double, fill:NSDictionary, stroke:NSDictionary, strokeWidth: Double) {
    if let view = renderView {
      var circle: Circle?
      circle = objectPools[CompositeType.Circles.rawValue].get() as? Circle
      if (circle == nil) {
        circle = Circle()
        objectPools[CompositeType.Circles.rawValue].recycable(circle!)
      }
      let fillColor = ColorComponent(withDecoadbleColor: fill)
      let strokeColor = ColorComponent(withDecoadbleColor: stroke)
      circle!.createCircle(cx, cy: cy, r: r, fill: fillColor, stroke: strokeColor, strokeWidth: strokeWidth)
      compositeTable[shapeId] = circle!
      view.add(composite: circle!)
    }
  }
  
  func addText(_ shapeId: NSNumber, textObj: NSDictionary, fill:NSDictionary, stroke: NSDictionary, strokeWidth: Double) {
    if let view = renderView {
      guard let parent = parentView else {
        return
      }
      do {
        let json = try JSONSerialization.data(withJSONObject: textObj)
        let textObject: TextObject = try JSONDecoder().decode(TextObject.self, from: json)
        let fillComponent = ColorComponent(withDecoadbleColor: fill)
        let strokeComponet = ColorComponent(withDecoadbleColor: stroke)
        let fillColor = fillComponent.toCGColor()
        let strokeColor = strokeComponet.toCGColor()
        var textComposite: TextComposite?
        textComposite = objectPools[CompositeType.Words.rawValue].get() as? TextComposite
        if (textComposite == nil) {
          textComposite = TextComposite(withFrame: view.frame)
          objectPools[CompositeType.Words.rawValue].recycable(textComposite!)
        }
        textComposite!.creatText(from: textObject,
                                 withFrame: parent.bounds,
                                 fill: fillColor,
                                 opacity: Float(fillColor.alpha),
                                 stroke: strokeColor,
                                 strokeWidth: strokeWidth)
        compositeTable[shapeId] = textComposite!
        view.add(composite: textComposite!)
      } catch {
        print(error)
      }
    }
  }
  
  func addPath(_ shapeId: NSNumber, pathObject: NSDictionary) {
    if let view = renderView {
      do {
        let json = try JSONSerialization.data(withJSONObject: pathObject)
        let path: PathObject = try JSONDecoder().decode(PathObject.self, from: json)
        var pathComposite: PathComposite?
        pathComposite = objectPools[CompositeType.Svgs.rawValue].get() as? PathComposite
        if (pathComposite == nil) {
          pathComposite = PathComposite()
          objectPools[CompositeType.Svgs.rawValue].recycable(pathComposite!)
        }
        pathComposite!.createPath(fromPathObject: path)
        view.add(composite: pathComposite!)
      } catch {
        print(error)
      }
    }
  }
  
  func draw() {
    if (updateMode) {
      if let view = renderView {
        view.updateMode();
      }
      updateMode = false
    }
    if let  view = renderView {
      view.setNeedsDisplay();
    }
  }
  
  func clear() {
    if let  view = renderView {
      view.clear()
    }
    
    if let parentView = parentView {
      parentView.clear()
    }
    
    for objectPool in objectPools {
      objectPool.reset()
    }
    
    for child in children {
      child.clear()
    }
  }
  
  func flush() {
    updateHistory.removeAll()
  }
  
  func toggleSelections(_ point : CGPoint, update: inout [Composite]) {
    if let renderView = renderView {
      renderView.toggleSelections(point, &update)
    }
    for child in children {
      child.toggleSelections(point, update: &update)
    }
  }
  
  func lassoSelect(at point: CGPoint) {
    if let renderView = renderView {
      renderView.lassoSelect(at: point)
    }
    
    for child in children {
      child.lassoSelect(at: point)
    }
  }
  
  func completeLasso(with selectionPolygon: Polygon, completion: @escaping ([Composite]) -> Void) {
    if let renderView = renderView {
      renderView.completeLasso(with: selectionPolygon, completion: completion)
    }
    
    for child in children {
      child.completeLasso(with: selectionPolygon, completion: completion)
    }
  }
}
