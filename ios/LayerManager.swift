//
//  LayerManager.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-20.
//

import Foundation
@objc(QRNLayerManager)
class QRNLayerManager : RCTViewManager {
  
  override init() {
    super.init()
    NotificationCenter.default.addObserver(self, selector: #selector(onCreateRootElement), name: .didCreateRootElement, object: nil)
    NotificationCenter.default.addObserver(self, selector: #selector(onCreateChildElement), name: .didCreateChildElement, object: nil)
  }
  override func view() -> UIView! {
    return LayerView()
  }
  
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc func onCreateRootElement(notification: Notification){
    if let element = notification.userInfo?["element"] as? Element {
      DispatchQueue.main.async {
        if let view = self.getView(withTag: element.reactTag) {
          view.addRootElement(element)
        }
      }
    }
  }
  
  @objc func onCreateChildElement(notification: Notification) {
    if let element = notification.userInfo?["element"] as? Element {
      if let frame = notification.userInfo?["rect"] as? CGRect {
        DispatchQueue.main.async {
          if let view = self.getView(withTag: element.reactTag) {
            view.addChildElement(element, frame: frame);
          }
        }
        
      }
    }
  }
  
  private func getView(withTag tag: NSNumber) -> LayerView? {
    let view = self.bridge.uiManager.view(forReactTag: tag)
    if let layerView = view as? LayerView {
      return layerView
    }
    return nil
  }
  
}
