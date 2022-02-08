//
//  Line.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-28.
//

import Foundation
class Line : Shape {
    var firstTime = true
    override init() {
        super.init()
        for bezier in shapePaths {
            bezier.move(to: CGPoint.zero)
            bezier.addLine(to: CGPoint.zero)
        }
    }
    
    func createLine( _ x1: Double, x2: Double, y1: Double, y2: Double, stroke: CGColor, strokeWidth: Double ) {
        removeAllAnimations()
        shapePaths.swapAt(0, 1)
        shapePaths[0] = UIBezierPath();
        shapePaths[0].move(to: CGPoint(x: x1, y: y1))
        shapePaths[0].addLine(to: CGPoint(x: x2, y: y2))
        
        if (firstTime) {
            shapePaths[1] = UIBezierPath();
            shapePaths[1].move(to: CGPoint(x: x1, y: y1))
            shapePaths[1].addLine(to: CGPoint(x: x2, y: y2))
            firstTime = false
        }
        
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        
        shapeLayer.masksToBounds = false
        shapeLayer.strokeColor = stroke
        shapeLayer.lineWidth = CGFloat(strokeWidth)
        CATransaction.commit()
        layer = shapeLayer
    }
    
    override func animate() {
        CATransaction.begin()
        CATransaction.setDisableActions(true)
        shapeLayer.path = shapePaths[0].cgPath
        CATransaction.commit()
    }
}
