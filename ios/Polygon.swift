//
//  Polygon.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2022-01-30.
//

import Foundation
class Polygon {
  var vertices = [CGPoint]()
  
  public func test(_ rect: CGRect) -> Bool {
    let topLeft = CGPoint(x: rect.origin.x, y: rect.origin.y)
    let topRight =  CGPoint(x: rect.origin.x + rect.width, y: rect.origin.y)
    let bottomLeft = CGPoint(x: rect.origin.x + rect.width, y: rect.origin.y + rect.height)
    let bottomRight = CGPoint(x: rect.origin.x + rect.width, y: rect.origin.y + rect.height)
    if (test(topLeft)) {
      return true;
    }
    
    if (test(topRight)) {
      return true;
    }
    
    if (test(bottomLeft)) {
      return true;
    }
    
    if (test(bottomRight)) {
      return true;
    }
    return false;
  }
  
  func test(_ p: CGPoint) -> Bool {
    var collided = false;
    var next = 0;
    
    for vc in vertices {
      next += 1;
      if (next == vertices.count) {
        next = 0;
      }
      
      let vn = vertices[next]
      if (((vc.y >= p.y && vn.y < p.y) || (vc.y < p.y && vn.y >= p.y)) &&
          (p.x < (vn.x-vc.x)*(p.y-vc.y) / (vn.y-vc.y)+vc.x)) {
        collided = !collided;
      }
      
    }
    return collided;
  }
}
