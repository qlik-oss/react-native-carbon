//
//  ObjectPool.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-28.
//

import Foundation
class ObjectPool {
  var shapes = [Composite]()
  var index = 0
  init(){}
  
  func reset() {
    index = 0;
  }
  
  func recycable(_ s: Composite) {
    shapes.append(s)
  }
  
  func removeAll() {
    shapes.removeAll()
  }
  
  func removeFromLayer() {
    for shape in shapes {
      shape.removeFromLayer()
    }
  }
  
  func size() -> Int {
    return shapes.count;
  }
  
  func get() -> Composite? {
    var shape:Composite? = nil
    if (index < shapes.count) {
      shape = shapes[index];
    }
    index += 1
    return shape;
  }
}
