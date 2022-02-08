//
//  PathObject.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-08-09.
//

import Foundation

extension UIColor {
  public convenience init?(hex: String, withAlpha alpha:CGFloat) {
    let r, g, b, a: CGFloat
    
    if hex.hasPrefix("#") {
      let start = hex.index(hex.startIndex, offsetBy: 1)
      let hexColor = String(hex[start...])
      if hexColor.count == 6 {
        let scanner = Scanner(string: hexColor)
        var hexNumber: UInt64 = 0
        
        if scanner.scanHexInt64(&hexNumber) {
          r = CGFloat((hexNumber & 0xff0000) >> 16) / 255
          g = CGFloat((hexNumber & 0x00ff00) >> 8) / 255
          b = CGFloat(hexNumber & 0x0000ff) / 255
          a = alpha
          
          self.init(red: r, green: g, blue: b, alpha: a)
          return
        }
      }
    }
    return nil
  }
}

class PathComposite : Composite {
  var pen = PathPen()
  var shapeLayer = CAShapeLayer()
  
  func createPath(fromPathObject pathObj: PathObject) {
    shapeLayer.removeAllAnimations()
    
    CATransaction.begin()
    CATransaction.setDisableActions(true)
    pen.reset()
    if let pathString = pathObj.path {
      let pathParser = PathParser(fromPathString: pathString)
      if pathParser.success {
        pen.commandArray = pathParser.getCommandArray()
      }
    }
    pen.draw()
    shapeLayer.masksToBounds = false
    
    setupColors(fromPathObject: pathObj)
    
    shapeLayer.path = pen.drawPath.cgPath
    CATransaction.commit()
    layer = shapeLayer
  }
  
  private func setupColors(fromPathObject pathObj: PathObject) {
    shapeLayer.fillColor = UIColor.clear.cgColor
    shapeLayer.strokeColor = UIColor.black.cgColor
    shapeLayer.lineWidth = CGFloat(1.0)
    
    if let strokeDasharray = pathObj.strokeDasharray {
      let components = strokeDasharray.components(separatedBy: ",").map { Int($0.trimmingCharacters(in: .whitespacesAndNewlines))! }
      shapeLayer.lineDashPattern = components.map({NSNumber(value: $0)})
    }
  }
  
  override func cached() -> Bool {
    return true;
  }
}
