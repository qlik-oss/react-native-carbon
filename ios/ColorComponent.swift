//
//  ColorComponent.swift
//  react-native-carbon
//
//

import Foundation
class ColorComponent {
  
  enum ColorType {
    case Gradient, Paint
  }
  
  var colorType = ColorType.Paint
  var paintColor = UIColor.black.cgColor;
  var gradient = CAGradientLayer()
  var alpha:CGFloat = 0
  
  func deg2rad(_ number: CGFloat) -> CGFloat {
    return number * .pi / 180
  }
  
  init(withDecodedColor decodedColor: DecodableColor) {
    if (decodedColor.type == "color") {
      paintColor = getCgColor(from: decodedColor.colors ?? [0,0,0,0])
    }
  }
  
  init(withDecoadbleColor decodableColor: NSDictionary) {
    do {
      let json = try JSONSerialization.data(withJSONObject: decodableColor)
      let decodableColor: DecodableColor = try JSONDecoder().decode(DecodableColor.self, from: json)
      if (decodableColor.type == "color") {
        paintColor = getCgColor(from: decodableColor.colors ?? [0, 0, 0, 0])
      } else {
        colorType = .Gradient
        gradient = CAGradientLayer()
        if let stops = decodableColor.stops {
          let stopColors = stops.map({ sp in
            getCgColor(from: sp.color.colors ?? [0, 0, 0, 0])
          })
          let offsets = stops.map {sp in
            NSNumber(value: sp.offset ?? 0)
          }
          gradient.colors = stopColors
          gradient.locations = offsets
          gradient.type = .axial
          // rotate
          let degree = decodableColor.degree ?? 0
          var end = CGPoint(x: 1, y:1)
          let rad = deg2rad(CGFloat(degree + 180));
          end.x = abs(end.x * cos(rad));
          end.y = abs(end.y * sin(rad));
          gradient.startPoint = CGPoint.zero
          gradient.endPoint = end          
        }
        
      }
    } catch {
      print(error)
    }
  }
  
  func getGradient() -> CAGradientLayer {
    return gradient
  }
  
  func toCGColor() -> CGColor {
    return paintColor
  }
  
  func  getAlpha() -> CGFloat {
    return alpha
  }
  
  private func getCgColor(from fill: [Double]) -> CGColor {
    alpha = CGFloat(fill[3])
    return UIColor.init(red: CGFloat(fill[0]),
                        green: CGFloat(fill[1]),
                        blue: CGFloat(fill[2]),
                        alpha: alpha).cgColor
  }
}
