//
//  LayerManager.m
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-20.
//

#import <Foundation/Foundation.h>
#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"
#import "React/RCTUIManager.h"

@interface RCT_EXTERN_MODULE(QRNLayerManager, RCTViewManager)
  RCT_EXPORT_VIEW_PROPERTY(onSelection, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onDoubleTap, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onTouchesBegan, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(onLongPress, RCTDirectEventBlock)
  RCT_EXPORT_VIEW_PROPERTY(lasso, NSNumber*)
@end
