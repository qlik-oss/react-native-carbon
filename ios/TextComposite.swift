//
//  TextComposite.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-28.
//

import Foundation
class TextComposite : Composite {
  var textLayers = [CATextLayer(), CATextLayer()]
  var opacities = [Float(1), Float(1)]
  var fills = [UIColor.white.cgColor, UIColor.white.cgColor]
  var transform:CATransform3D?
  var rotation = CGFloat(0)
  var translation = CGPoint.zero
  var position = CGPoint.zero
  var centerPoint = CGPoint.zero
  var string = ""
  var offset = CGPoint.zero
  
  init(withFrame frame: CGRect){
    super.init()
    centerPoint = CGPoint(x: frame.width * 0.5, y: frame.height * 0.5)
    for tc in textLayers {
      tc.position = centerPoint
      tc.opacity = 1
    }
  }
  
  override func clearSelection() {
  }
  
  func creatText(from textObj: TextObject, withFrame frame: CGRect, fill: CGColor, opacity: Float, stroke: CGColor, strokeWidth: Double) {
    self.stopAnimations()
    textLayers.swapAt(0, 1)
    opacities.swapAt(0, 1)
    fills.swapAt(0, 1)
    if let M = textObj.transform {
      parseTransform(M);
    }
    if let fontObject = textObj.font {
      
      opacities[0] = opacity
      fills[0] = fill;
      self.string = textObj.text!
      let textLayer = textLayers[0]
      textLayer.masksToBounds = false
      textLayer.contentsScale =  UIScreen.main.scale
      textLayer.shouldRasterize = true
      textLayer.rasterizationScale = UIScreen.main.scale
      textLayer.fontSize = CGFloat(fontObject.fontSize)
      textLayer.string = textObj.text
      textLayer.frame = measureText(text: textObj.text ?? "", fontObject: fontObject)
      textLayer.alignmentMode = .natural
      textLayer.font = getFont(fontObject)
      textLayer.opacity = opacity
      textLayer.foregroundColor = fill
      textLayer.fillMode = .forwards
      textLayer.sublayers = nil;
      
      setupAttributes(from: textObj, withStroke: stroke, strokeWidth: strokeWidth, fontObject: fontObject)
      setupAnchorPoint(textObj, fontObject: fontObject)
      setupTransform(fontObject: fontObject, frame: frame)
      //addDebugFrame(textLayer.frame)
      layer = textLayer
    }
  }
  
  func addDebugFrame(_ frame: CGRect) {
    let bs = CAShapeLayer();
    bs.path = UIBezierPath(rect: CGRect(x: 0, y: 0, width: frame.width, height: frame.height)).cgPath
    bs.strokeColor  = UIColor.black.cgColor
    bs.lineWidth = 1;
    bs.fillColor = UIColor.clear.cgColor
    textLayers[0].addSublayer(bs);
  }
  
  func setupAttributes(from textObj: TextObject, withStroke stroke: CGColor, strokeWidth: Double, fontObject: FontObject) {
    if (strokeWidth > 0) {
      let textAttributes: [NSAttributedString.Key : Any] = [
        NSAttributedString.Key.strokeColor: UIColor(cgColor: stroke),
        NSAttributedString.Key.strokeWidth: -strokeWidth,
        NSAttributedString.Key.font: getFont(fontObject),
        NSAttributedString.Key.foregroundColor: UIColor(cgColor: fills[0])
      ]
      textLayers[0].string = NSAttributedString(string: textObj.text!, attributes: textAttributes)
    }
    
  }
  
  override func draw(withAnimation animate: Bool) {
    self.stopAnimations()
    textLayers[0].foregroundColor = fills[0]
    textLayers[0].position = position
    textLayers[0].opacity = opacities[0]
    if (animate) {
      self.animate()
    }
  }
  
  override func stopAnimations() {
    for tl in textLayers {
      tl.removeAllAnimations()
    }
  }
  
  override func update(withFill fill: ColorComponent, stroke: ColorComponent, strokeWidth: Double) {
    
    let color = fill.toCGColor()
    let alpha = Float(color.alpha)
    
    opacities[0] = alpha
    opacities[1] = alpha
    fills[0] = color
    fills[1] = color
    for tl in textLayers {
      tl.removeAllAnimations()
      tl.foregroundColor = color
      tl.opacity = alpha
    }
  }
  
  func animate() {
    textLayers[0].position = self.position
    let animation = CABasicAnimation(keyPath: "position")
    animation.fromValue = textLayers[1].position
    animation.toValue = textLayers[0].position
    animation.isRemovedOnCompletion = true
    animation.fillMode = .both
    textLayers[0].add(animation, forKey: "position")
  }
  
  func getFont(_ fontObject: FontObject) -> UIFont {
    if let fontWeight = fontObject.fontWeight {
      if (fontWeight == "bold") {
        return UIFont(name: "Arial-Bold", size: CGFloat(fontObject.fontSize)) ?? UIFont.systemFont(ofSize: CGFloat(fontObject.fontSize), weight: UIFont.Weight.bold)
      }
    }
    return UIFont(name: "Arial", size: CGFloat(fontObject.fontSize)) ?? UIFont.systemFont(ofSize: CGFloat(fontObject.fontSize))
  }
  
  func measureText(text: String, fontObject: FontObject) -> CGRect {
    
    let font = UIFont(name: "Arial", size: CGFloat(fontObject.fontSize)) ?? UIFont.systemFont(ofSize: CGFloat(fontObject.fontSize))
    var truncated = false
    var size = text.size(withAttributes:[.font: font])
    size.width = ceil(size.width)  // go to floor
    if let maxWidth = fontObject.maxWidth {
      // account for floating errors in JS land
      // this is very inaccurate right now until we can get JSI
      if (size.width > CGFloat(maxWidth + 1)) {
        size.width = CGFloat(maxWidth + 1)
        textLayers[0].truncationMode = .end
        truncated = true
      }
    }
    
    if let wordBreak = fontObject.wordBreak {
      if (wordBreak == "break-word") {
        textLayers[0].isWrapped = true
        if (truncated == true) {
          let maxSize = CGSize(width: size.width, height: ceil(size.height * 2) + 1)
          return  CGRect(origin: CGPoint.zero, size: maxSize)
        }
      }
    }
    
    return CGRect(origin: CGPoint.zero, size: size)
    
  }
  
  func setupAnchorPoint(_ textObject: TextObject, fontObject: FontObject){
    if let fontObject = textObject.font {
      textLayers[0].anchorPoint = getAnchorPoint(fontObject.anchor ?? "start", baseline: fontObject.baseline ?? "central", fontObject: fontObject )
      
    }
  }
  
  func getAnchorPoint(_ name: String, baseline: String, fontObject: FontObject) -> CGPoint {
    if (name == "start" || name == "left" ) {
      if (baseline == "text-after-edge" ) {
        return CGPoint(x: 0, y: 1);
      }
      if (baseline == "text-before-edge") {
        return CGPoint(x: 0, y: 0.0);
      }
      if (baseline == "central" ){
        return CGPoint(x:0, y:0.5)
      }
      if (baseline == "alphabetical") {
        offset.y = -CGFloat(fontObject.fontSize)
      }
      return CGPoint(x: 0, y: 0);
    }
    if (name == "end") {
      if (baseline == "alphabetical") {
        offset.y = -CGFloat(fontObject.fontSize)
      }
      if (baseline == "central" ){
        return CGPoint(x:1, y:0.5)
      }
      if (baseline == "text-after-edge") {
        return CGPoint(x: 1, y: 1);
      }
      if (baseline == "text-before-edge") {
        
        return CGPoint(x: 1, y: 0.0)
      }
      return CGPoint(x: 1, y: 0)
    }
    if (name == "middle") {
      if (baseline == "text-after-edge") {
        return CGPoint(x: 0.5, y: 1);
      }
      if (baseline == "text-before-edge") {
        return CGPoint(x: 0.5, y: 0.0)
      }
      if (baseline == "alphabetical") {
        offset.y = -CGFloat(fontObject.fontSize)
      }
      if (baseline == "central" ){
        return CGPoint(x:1, y:0.5)
      }
      return CGPoint(x: 0.5, y: 0)
    }
    return CGPoint(x: 0, y: 0)
  }
  
  func setupTransform(fontObject: FontObject, frame: CGRect) {
    position = CGPoint(x: CGFloat(fontObject.x), y: CGFloat(fontObject.y))
    position.y = position.y + offset.y + CGFloat(fontObject.dy ?? 0)
    
    
    textLayers[0].position = position
    if transform != nil {
      textLayers[0].position = CGPoint.zero
      let T = CATransform3DMakeTranslation(0, 0, 0);
      let R = CATransform3DRotate(T, self.rotation, 0, 0, 1)
      textLayers[0].transform = R
    }
  }
  
  func parseTransform(_ M: String) {
    // ([a-zA-Z]+)\(((-?\d+\.?\d*e?-?\d*,?)+)\)
    self.transform = CATransform3DIdentity
    let scanner = Scanner(string: M);
    let letters = CharacterSet(charactersIn: "a"..."z")
      .union(CharacterSet(charactersIn: "A"..."Z"))
  stop: while(!scanner.isAtEnd) {
    guard let opName = scanner.scannedCharacters(from: letters),
          scanner.scannedString("(") != nil,
          let argsString = scanner.scannedUpToString(")"),
          scanner.scannedString(")") != nil
    else {
      break stop
    }
    let args = getTransformArgs(from: argsString)
    buildTransformFrom(args:args, withOp:opName)
  }
  }
  
  private func getTransformArgs(from argsString: String) -> [String] {
    let args = argsString.components(separatedBy: ",")
    return args
  }
  
  func deg2rad(_ number: Double) -> Double {
    return number * .pi / 180
  }
  
  private func buildTransformFrom(args _a: [String], withOp:String) {
    switch(withOp) {
    case "rotate":
      let args = _a.map { (String) -> Double in
        return (Double(String.trimmingCharacters(in: .whitespaces)) ?? 0)
      }
      buildRotation(args)
      break;
    case "translate" :
      let args = _a.map { (String) -> Double in
        return (Double(String.trimmingCharacters(in: .whitespaces)) ?? 0)
      }
      buildTranslate(args);
      break;
    default:
      break;
    }
  }
  
  private func buildRotation(_ args: [Double]) {
    let angle = CGFloat(deg2rad(args[0]));
    var point = CGPoint(x: 0, y: 0);
    if (args.count == 3) {
      point.x = CGFloat(args[1]);
      point.y = CGFloat(args[2]);
    }
    let rotation = CGAffineTransform(rotationAngle: angle);
    let translation = CGAffineTransform(translationX: point.x, y: point.y)
    transform = CATransform3DMakeAffineTransform(rotation.concatenating(translation))
    self.rotation = angle
    self.translation = point
  }
  
  private func buildTranslate(_ args: [Double]) {
    let translation = CGAffineTransform(translationX: CGFloat(args[0]), y: CGFloat(args[1]));
    let temp = CATransform3DMakeAffineTransform(translation);
    transform = CATransform3DConcat(transform ?? CATransform3DIdentity, temp);
  }
}

fileprivate extension Scanner {
  func scannedCharacters(from set: CharacterSet) -> String? {
    var string: NSString?
    return scanCharacters(from: set, into: &string) ? string as String? : nil
  }
  
  func scannedString(_ searchString: String) -> String? {
    var string: NSString?
    return scanString(searchString, into: &string) ? string as String? : nil
  }
  
  func scannedUpToString(_ substring: String) -> String? {
    var string: NSString?
    return scanUpTo(substring, into: &string) ? string as String? : nil
  }
}

extension String {
  func measure(OfFont font: UIFont) -> CGSize {
    return (self as NSString).size(withAttributes: [NSAttributedString.Key.font: font])
  }
}
