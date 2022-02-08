//
//  Circle.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-28.
//

import Foundation
class Circle : Shape {
  var firstTime = true
  override init() {
    super.init()
    shapePaths = [
      UIBezierPath(arcCenter: CGPoint.zero, radius:0, startAngle: 0, endAngle: CGFloat(Double.pi * 2), clockwise: true),
      UIBezierPath(arcCenter: CGPoint.zero, radius:0, startAngle: 0, endAngle: CGFloat(Double.pi * 2), clockwise: true)
    ]
  }
  
  func createCircle(_ cx: Double, cy: Double, r: Double, fill: ColorComponent, stroke: ColorComponent, strokeWidth: Double) {
    removeAllAnimations()
    shapePaths.swapAt(0, 1)
    fillColors.swapAt(0, 1)
    
    shapePaths[0] = UIBezierPath(arcCenter: CGPoint(x: cx, y: cy), radius:CGFloat(r), startAngle: 0, endAngle: CGFloat(Double.pi * 2), clockwise: true)
    fillColors[0] = fill.toCGColor()
    
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    shapeLayer.masksToBounds = false
    shapeLayer.strokeColor = stroke.toCGColor()
    shapeLayer.lineWidth = CGFloat(strokeWidth)
    shapeLayer.path = shapePaths[0].cgPath
    CATransaction.commit()
    layer = shapeLayer
  }
  
  override func cached() -> Bool {
    return true;
  }
  
  override func animate() {
    super.animate()
    super.fillAnimation()
  }
}
