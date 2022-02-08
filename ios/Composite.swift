//
//  Composite.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-23.
//

import Foundation
class Composite {
  enum CompositeType {
    case base, text, path, rect, circle, line
  }
  let animationDuration = 0.350
  let fillAnimationDuration = 0.350;
  var selected = false
  var path: UIBezierPath?
  var layer: CALayer?
  var fill = UIColor.blue.cgColor
  var compType = CompositeType.base
  var shapeId = -1;
  var parentId = "";
  var boundRect = CGRect.zero
  init (){}
  func draw(withAnimation animate: Bool){}
  func update(withFill fill: ColorComponent, stroke: ColorComponent, strokeWidth: Double){}
  func stopAnimations(){}
  func hitTest(_ point: CGPoint, _ update: inout [Composite]) -> Bool {return false}
  func hitTest(_ point: CGPoint) -> Bool { return false }
  func hitTestCircle( _ center: CGPoint, radius: CGFloat) -> Bool { return false }
  func hitTest(composite: Composite) -> Bool { return false}
  func hitTestPolygon(_ polygon: Polygon) -> Bool { return false }
  func clearSelection() {
    selected = false
    if let layer = layer {
      layer.opacity = 0.25
    }
  }
  
  func setSelected(_ update : inout [Composite]) {
    selected = true
    if let layer = layer {
      layer.opacity = 1
    }
    let index = update.firstIndex(where: {$0.shapeId == self.shapeId})
    if index == nil {
      update.append(self)
    }
  }
  
  func setSelected() {
    selected = true
    if let layer = layer {
      layer.opacity = 1
    }
  }
  
  func add(to: inout [Composite]) {
    if to.firstIndex(where: {$0.shapeId == self.shapeId}) == nil {
      to.append(self)
    }
  }
  
  func toggleSelection(_ update : inout [Composite]) {}
  
  func resetSelection() {
    selected = false
    if let layer = layer {
      layer.opacity = 1
    }
  }
  
  func cached () -> Bool {
    return false;
  }
  
  func removeFromLayer() {
    if let sublayer = layer {
      sublayer.removeFromSuperlayer()
    }
  }
}
