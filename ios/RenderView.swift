//
//  RenderView.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-29.
//

import Foundation
class RenderView : UIView {
  var composites = [Composite]()
  var cached = [Composite]()
  var compositeMap = [String: [Composite]]()
  var update = false
  var animate = true
  var duration = 0.800
  var inSelections = false
  
  func toggleSelections(_ point: CGPoint, _ update: inout [Composite]) {
    var pendingSelections = Set<String>();
    for composite in composites {
      if (!inSelections) {
        composite.clearSelection();
      }
      
      if (composite.hitTest(point, &update) ) {
        pendingSelections.insert(composite.parentId);
      }
    }
    
    for id in pendingSelections {
      if let values = compositeMap[id] {
        for v in values {
          v.toggleSelection(&update)
        }
      }
    }
    inSelections = true
  }
  
  func lassoSelect(at point: CGPoint) {
      var pendingSelections = Set<String>();
      for composite in self.composites {
        if (composite.hitTestCircle(point, radius: 10) ) {
          pendingSelections.insert(composite.parentId);
        }
      }
      
      for id in pendingSelections {
        if let values = self.compositeMap[id] {
          for v in values {
            v.setSelected()
          }
        }
      }
      
      DispatchQueue.main.async {
        self.setNeedsDisplay()
      }
  }
  
  func completeLasso(with selectionPolygon: Polygon, completion: @escaping ([Composite]) -> Void) {
    DispatchQueue.global(qos: .userInteractive).async {
      var pendingSelections = Set<String>();
      var selectedComposites = [Composite]()
      for composite in self.composites {
        if (composite.hitTestPolygon(selectionPolygon) ) {
          pendingSelections.insert(composite.parentId);
        }
      }
      
      for id in pendingSelections {
        if let values = self.compositeMap[id] {
          for v in values {
            v.setSelected()
            selectedComposites.append(v)
          }
        }
      }
      
      DispatchQueue.main.async {
        self.setNeedsDisplay()
        completion(selectedComposites)
      }
    }
    
  }
  
  func add(composite c :Composite) {
    if compositeMap[c.parentId] != nil {
      compositeMap[c.parentId]!.append(c)
    } else if (c.parentId.count > 0) {
      compositeMap[c.parentId] = [c]
    }
    composites.append(c)    
  }
  
  func clear() {
    inSelections = false
    for composite in composites {
      composite.resetSelection()
    }
    composites.removeAll()
    compositeMap.removeAll()
  }
  
  func updateMode() {
    update = true;
  }
  
  func clearCaches() {
    cached.removeAll()
  }
  
  override func draw(_ rect: CGRect) {
    
    if(!update) {
      self.layer.sublayers = nil
    }
    
    CATransaction.begin()
    CATransaction.setAnimationDuration(duration)
    CATransaction.setAnimationTimingFunction(CAMediaTimingFunction(name: CAMediaTimingFunctionName.easeInEaseOut))
    
    for composite in composites {
      if let compositeLayer = composite.layer {
        if (!update) {
          composite.draw(withAnimation: animate)
        }
        self.layer.addSublayer(compositeLayer)
      }
    }
    
    for cahedComposite in cached {
      if let compositeLayer = cahedComposite.layer {
        self.layer.addSublayer(compositeLayer)
      }
    }
    
    CATransaction.commit()
    update = false
    cached.removeAll()
    
    if (composites.count > 0) {
      duration = 0.400
    }
    
  }
}
