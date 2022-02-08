//
//  Rectangle.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-28.
//

import Foundation
class Rectangle : Shape {
  var firstTime = true;
  var rect = CGRect.zero
  init(withFrame parentRect: CGRect) {
    super.init()
    compType = .rect
    rect = CGRect.zero
    let x = Int.random(in: 0..<Int(parentRect.width))
    let y = Int.random(in: 0..<Int(parentRect.height))
    let center = CGPoint(x: CGFloat(x), y: CGFloat(y) )
    rect.origin = center
    shapePaths = [UIBezierPath(rect: rect), UIBezierPath(rect: rect)]
  }
  
  func createRect( withColorComponent fillComponent: ColorComponent,
                   strokeComponent: ColorComponent,
                   strokeWidth: Double,
                   x: Double,
                   y:Double,
                   width:Double,
                   height:Double) {
    removeAllAnimations()
    shapePaths.swapAt(0, 1)
    fillColors.swapAt(0, 1)
    rect = CGRect(x: x, y: y, width: width, height: height)
    boundRect = rect
    if (fillComponent.colorType == .Gradient) {
      hasGradient = true
      fillColors[0] = UIColor.red.cgColor
      shapeLayer.frame = rect
      shapePaths[0] = UIBezierPath(rect: CGRect(x: 0, y: 0, width: width, height: height))
      shapeLayer.fillColor = fillColors[0];
      shapeLayer.path = shapePaths[0].cgPath
      gradientLayer = fillComponent.getGradient()
      gradientLayer.frame = shapeLayer.frame
      layer = gradientLayer
    } else {
      fillColors[0] = fillComponent.toCGColor();
      shapePaths[0] = UIBezierPath(rect: rect)
      
      shapeLayer.masksToBounds = false
      shapeLayer.strokeColor = strokeComponent.toCGColor()
      shapeLayer.lineWidth = CGFloat(strokeWidth)
      
      layer = shapeLayer
    }
  }
  
  func updateFrom(_ r: Rectangle?) {
    if let rect = r {
      shapePaths[0] = rect.shapePaths[0].copy() as! UIBezierPath
    }
  }
  
  override func hitTest(_ point: CGPoint, _ update: inout [Composite]) -> Bool {
    if( rect.contains(point) ) {
      return true
    }
    return false
  }
  
  override func hitTest(_ point: CGPoint) -> Bool {
    return rect.contains(point)
  }
  
  override func hitTestCircle(_ center: CGPoint, radius: CGFloat) -> Bool {
    if (rect.contains(center)) {
      return true;
    }
    
    return test(center.x, cy: center.y, radius: radius, rx: rect.origin.x, ry: rect.origin.y, rw: rect.width, rh: rect.height)
    
  }
  
  func test(_ cx: CGFloat, cy: CGFloat, radius: CGFloat, rx: CGFloat, ry: CGFloat, rw: CGFloat, rh: CGFloat) -> Bool {
    var testX = cx;
    var testY = cy;
    
    if (cx < rx) {
      testX = rx;
    } else if (cx > rx+rw){
      testX = rx+rw
    }
    
    if (cy < ry){
      testY = ry
    }
    else if (cy > ry+rh) {
      testY = ry+rh
    }
    
    // get distance from closest edges
    let distX = cx-testX;
    let distY = cy-testY;
    let distance = sqrt( (distX*distX) + (distY*distY) );
    
    // if the distance is less than the radius, collision!
    if (distance <= radius) {
      return true;
    }
    return false;
  }
  
  override func hitTestPolygon(_ polygon: Polygon) -> Bool {
    if selected {
      return true;
    }
    
    return polygon.test(rect);
  }
  
  override func toggleSelection(_ update: inout [Composite]) {
    selected = !selected
    shapeLayer.opacity = selected ? 1 : 0.25
    if let index = update.firstIndex(where: {$0.shapeId == self.shapeId}) {
      if (!selected) {
        update.remove(at: index)
      }
    } else if selected{
      update.append(self)
    }
  }
  
  override func stopAnimations() {
    super.removeAllAnimations()
  }
}
