//
//  ElementProxy.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-22.
//

import Foundation
@objc(ElementProxy)
class ElementProxy : NSObject {
  var elementMap: [NSString: Element] = [:];
  let serialQueue = DispatchQueue(label: "elementQueue")
  
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func createRootElement(_ reactTag: NSNumber, proxyID: NSString) {
    serialQueue.async {
      let element = Element(withTag: reactTag, id: proxyID)
      self.addElement(proxyID, element: element)
      NotificationCenter.default.post(name: .didCreateRootElement, object: nil, userInfo: ["element": element])
    }
    
  }
  
  @objc func destroyRootElement(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.destroy()
        }
        self.elementMap.removeValue(forKey: element.uuid)
        let children = element.children
        for child in children {
          self.elementMap.removeValue(forKey: child.uuid)
        }
      }
    }
  }
  
  @objc func createChildElement(_ uuid: NSString, childId: NSString, x:Double, y:Double, width:Double, height:Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        let childElement = Element(withTag: element.reactTag, id: childId)
        self.addElement(childId, element: childElement)
        NotificationCenter.default.post(name: .didCreateChildElement,
                                        object: nil,
                                        userInfo: ["element": childElement,
                                                   "rect": CGRect(x: x, y: y, width: width, height: height)])
        
      }
    }
    
  }
  
  @objc func destroy(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.destroy();
        }
      }
    }
  }
  
  @objc func useCache(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.useCache();
        }
      }
    }
  }
  
  @objc func clearCache(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.clearCaches();
        }
      }
    }
  }
  
  @objc func flush(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.flush();
        }
      }
    }
  }
  
  @objc func enableMotion(_ uuid: NSString, value: Bool) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.enableMotion(value);
        }
      }
    }
  }
  
  @objc func disableLoadAnimations(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.disableLoadAnimation();
        }
      }
    }
  }
  
  @objc func addRect(_ uuid: NSString,
                     shapeId: NSNumber,
                     parentId: NSString,
                     x:Double,
                     y:Double,
                     width:Double,
                     height:Double,
                     fill:NSDictionary,
                     stroke:NSDictionary,
                     strokeWidth: Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.addRect(shapeId,
                          parentId: parentId,
                          x: x,
                          y: y,
                          width: width,
                          height: height,
                          fill: fill,
                          stroke: stroke,
                          strokeWidth: strokeWidth)
        }
      }
    }
  }
  
  @objc func addLine(_ uuid: NSString,
                     shapeId: NSNumber,
                     x1:Double,
                     x2:Double,
                     y1:Double,
                     y2:Double,
                     stroke:NSDictionary,
                     strokeWidth: Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.addLine(shapeId,
                          x1: x1,
                          x2: x2,
                          y1: y1,
                          y2: y2,
                          stroke: stroke,
                          strokeWidth: strokeWidth)
        }
      }
    }
  }
  
  @objc func addCircle(_ uuid: NSString,
                       shapeId: NSNumber,
                       cx:Double,
                       cy:Double, r:Double,
                       fill:NSDictionary,
                       stroke:NSDictionary,
                       strokeWidth: Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.addCircle(shapeId: shapeId,
                            cx: cx,
                            cy: cy,
                            r: r,
                            fill: fill,
                            stroke: stroke,
                            strokeWidth: strokeWidth)
        }
      }
    }
  }
  
  @objc func addText(_ uuid: NSString,  shapeId: NSNumber, textObject: NSDictionary, fill: NSDictionary, stroke:NSDictionary, strokeWidth: Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.addText(shapeId, textObj: textObject, fill: fill, stroke: stroke, strokeWidth: strokeWidth)
        }
      }
    }
  }
  
  @objc func addPath(_ uuid: NSString, shapeId: NSNumber, pathObject: NSDictionary) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.addPath(shapeId, pathObject: pathObject)
        }
      }
    }
  }
  
  @objc func draw(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.draw()
        }
      }
    }
  }
  
  @objc func clear(_ uuid: NSString) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.clear()
        }
      }
    }
  }
  
  @objc func updateShape(_ uuid: NSString, index: NSNumber, fill: NSDictionary, stroke: NSDictionary, strokeWidth: Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.updateShape(index, fill: fill, stroke: stroke, strokeWidth: strokeWidth)
        }
      }
    }
  }
  
  @objc func batchUpdate(_ uuid: NSString, list: NSArray) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.batchUpdate(list);
          //                    element.updateShape(index, fill: fill, stroke: stroke, strokeWidth: strokeWidth)
        }
      }
    }
  }
  
  @objc func resize(_ uuid: NSString, x:Double, y:Double, width:Double, height:Double) {
    serialQueue.async {
      if let element = self.getElement(uuid) {
        DispatchQueue.main.async {
          element.resize( x: x,
                          y: y,
                          width: width,
                          height: height)
          
        }
      }
    }
  }
  
  private func addElement(_ uuid: NSString, element: Element) {
    elementMap[uuid] = element
  }
  
  private func getElement(_ uuid: NSString) -> Element? {
    if let element = elementMap[uuid] {
      return element
    }
    return nil
  }
}

