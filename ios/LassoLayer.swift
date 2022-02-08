//
//  LassoLayer.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2022-01-29.
//

import Foundation
import UIKit
class LassoLayer : UIView {
  var circlePath = UIBezierPath()
  var linePath = UIBezierPath()
  var polygonPath = UIBezierPath()
  var initialCenter = CGPoint.zero
  var startPoint = CGPoint.zero
  var selectionPolygon = Polygon()
  var count = 0
  override init(frame: CGRect) {
    super.init(frame: frame)
    let panGesture = UIPanGestureRecognizer(target: self, action: #selector(onPan(_:)))
    addGestureRecognizer(panGesture)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  public func reset() {
    circlePath = UIBezierPath()
    linePath = UIBezierPath()
    polygonPath = UIBezierPath()
    initialCenter = CGPoint.zero
    startPoint = CGPoint.zero
    selectionPolygon.vertices.removeAll()
    
    count = 0
  }
  
  @objc private func onPan(_ sender: UIPanGestureRecognizer) {
    
    guard sender.view != nil else {return}
    let point = sender.location(in: self.superview)
    
    switch sender.state {
    case .began:
      startPoint = point
      createCircleShape(at: point)
      createLineShape(at: point);
      break
    case .possible:
      break
    case .changed:
      linePath.addLine(to: point)
      count += 1
      if (count > 3 ) {
        polygonPath.addLine(to: point)
        selectionPolygon.vertices.append(point)
        count = 0;
      }
      self.setNeedsDisplay()
      if let view = superview as? LayerView {
        view.lassoSelect(at: point)
      }
      break
    case .ended:
      linePath.addLine(to: startPoint)
      polygonPath.addLine(to: startPoint)
      self.setNeedsDisplay()
      if let view = superview as? LayerView {
        view.completeLasso(with: selectionPolygon)
      }
      break
    case .cancelled:
      break
    case .failed:
      break
    @unknown default:
      break
    }
  }
  
  fileprivate func createCircleShape(at point :CGPoint) {
    self.layer.sublayers = nil;
    circlePath = UIBezierPath(arcCenter: point, radius:20, startAngle: 0, endAngle: CGFloat(Double.pi * 2), clockwise: true);
  }
  
  fileprivate func createLineShape(at point: CGPoint) {
    linePath = UIBezierPath();
    linePath.move(to: point)
    linePath.lineWidth = 2
    linePath.lineCapStyle = .round
    
    polygonPath = UIBezierPath();
    polygonPath.move(to: point)
    polygonPath.lineWidth = 2
    polygonPath.lineCapStyle = .round
    
  }
  
  override func draw(_ rect: CGRect) {
    guard let ctx = UIGraphicsGetCurrentContext() else { return }

    ctx.setFillColor(UIColor(red: 0, green: 0, blue: 0, alpha: 0.25).cgColor)
    circlePath.fill()
    
    ctx.setStrokeColor(UIColor.black.cgColor)
    circlePath.stroke()
    linePath.stroke()
    
    // for debug
//    ctx.setStrokeColor(UIColor.red.cgColor)
//    polygonPath.stroke()
  }
}
