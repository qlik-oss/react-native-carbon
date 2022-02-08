//
//  LayerView.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-20.
//

import Foundation
class LayerView : UIView {
  var rootElement = Element()
  var selections = [Composite]()
  var inLasso = false
  weak var lassoLayer: LassoLayer?
  @objc var onSelection: RCTDirectEventBlock?
  @objc var onDoubleTap: RCTDirectEventBlock?
  @objc var onTouchesBegan: RCTDirectEventBlock?
  @objc var onLongPress: RCTDirectEventBlock?
  
  @objc var lasso: NSNumber? {
    didSet {
      if let lasso = lasso {
        inLasso = lasso.boolValue
        if let lassoLayer = lassoLayer {
          if (inLasso) {
            lassoLayer.reset()
            lassoLayer.setNeedsDisplay()
            self.bringSubviewToFront(lassoLayer)
          } else {
            self.sendSubviewToBack(lassoLayer)
          }
        }
      }
    }
  }
  
  override init(frame: CGRect) {
    super.init(frame: frame)
    createLassoLayer(frame)
    createTapGestures()
  }
  
  fileprivate func createLassoLayer(_ frame: CGRect) {
    let lassoView = LassoLayer(frame: frame);
    lassoView.backgroundColor = UIColor.clear
    addSubview(lassoView);
    self.lassoLayer = lassoView
  }
  
  fileprivate func createTapGestures() {
    let tapGesture = UITapGestureRecognizer(target: self, action: #selector(handleSingleTap(_:)))
    tapGesture.numberOfTapsRequired = 1
    
    let longPressGesture = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
    addGestureRecognizer(longPressGesture)
    addGestureRecognizer(tapGesture)
  }
  
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    super.touchesBegan(touches, with: event)
    if let onTouchesBegan = onTouchesBegan, let touch = touches.first {
      let touchPoint = touch.location(in: self)
      let touchArray = [touchPoint.x, touchPoint.y]
      onTouchesBegan(["touches": touchArray])
    }
  }
  
  @objc func handleSingleTap(_ sender: UITapGestureRecognizer) {
    let touchPoint = sender.location(in: self)
    rootElement.toggleSelections(touchPoint, update: &selections)
    if let onSelection = onSelection {
      let selectionIds = selections.map({$0.shapeId})
      onSelection(["selections": selectionIds])
    }
  }
  
  @objc func handleLongPress(_ sender: UILongPressGestureRecognizer) {
    if sender.state == .began {
      if let onLongPress = onLongPress {
        let touchPoint = sender.location(in: self)
        let touchArray = [touchPoint.x, touchPoint.y]
        onLongPress(["touches": touchArray])
      }
    }
  }
  
  func lassoSelect(at point: CGPoint) {
    rootElement.lassoSelect(at: point)
  }
  
  func completeLasso(with selectionPolygon: Polygon) {
    rootElement.completeLasso(with: selectionPolygon) { (current: [Composite]) in
      if let onSelection = self.onSelection {
        let selectionIds = current.map({$0.shapeId})
        onSelection(["selections": selectionIds])
      }
    }
  }
  
  func clear () {
    selections.removeAll()
  }
  
  func addRootElement(_ element: Element) {
    rootElement = element;
    rootElement.parentView = self
    self.clipsToBounds = true
    self.layer.masksToBounds = true
    let subview = RenderView(frame: CGRect(x: 0, y: 0, width: 100, height: 100));
    subview.backgroundColor = UIColor.white;
    rootElement.renderView = subview
    self.addSubview(subview);
  }
  
  func addChildElement(_ element: Element, frame: CGRect) {
    element.parentView = self
    let subView = RenderView(frame: frame);
    subView.clipsToBounds = true
    subView.isOpaque = true
    subView.backgroundColor = UIColor.white.withAlphaComponent(0);
    element.renderView = subView
    rootElement.addChild(element);
    self.addSubview(subView)
  }
  
  override func layoutSubviews() {
    if let view = rootElement.renderView {
      view.frame = self.frame;
    }
    
    if let lassoLayer = lassoLayer {
      lassoLayer.frame = self.frame
    }
    
    super.layoutSubviews()
  }
  
}
