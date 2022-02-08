//
//  Shape.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-23.
//

import Foundation
class Shape : Composite {
  var hasGradient = false
  var shapePaths = [UIBezierPath(), UIBezierPath()]
  var fillColors = [UIColor.clear.cgColor, UIColor.clear.cgColor]
  var strokeColors = [UIColor.white.cgColor, UIColor.white.cgColor]
  var shapeLayer = CAShapeLayer()
  var gradientLayer = CAGradientLayer()
  
  func removeAllAnimations() {
    shapeLayer.removeAllAnimations()
  }
  
  override func draw(withAnimation animate: Bool) {
    removeAllAnimations()
    if (animate == true) {
      if (!hasGradient) {
        self.animate()
        self.fillAnimation()
      }
    } else {
      CATransaction.begin()
      CATransaction.setDisableActions(true)
      shapeLayer.path = shapePaths[0].cgPath
      shapeLayer.fillColor = fillColors[0]
      CATransaction.commit()
    }
  }
  
  func animate() {
    shapeLayer.path = shapePaths[0].cgPath
    
    let animation = CABasicAnimation(keyPath: "path")
    animation.fromValue = shapePaths[1].cgPath
    animation.toValue = shapePaths[0].cgPath
    animation.isRemovedOnCompletion = true
    shapeLayer.add(animation, forKey: "path")
  }
  
  func fillAnimation() {
    
    shapeLayer.fillColor = fillColors[0]
    
    let animcolor = CABasicAnimation(keyPath: "fillColor")
    animcolor.fromValue = fillColors[1]
    animcolor.toValue = fillColors[0]
    animcolor.isRemovedOnCompletion = true
    shapeLayer.add(animcolor, forKey: "fillColor")
  }
  
  override func update(withFill fill: ColorComponent, stroke: ColorComponent, strokeWidth: Double) {
    shapeLayer.removeAllAnimations()
    fillColors[0] = fill.toCGColor()
    fillColors[1] = fill.toCGColor()
    shapeLayer.fillColor = fillColors[0]
    shapeLayer.masksToBounds = false
    shapeLayer.strokeColor = stroke.toCGColor()
    shapeLayer.lineWidth = CGFloat(strokeWidth)
  }
  
}
