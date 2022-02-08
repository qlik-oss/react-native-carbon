//
//  ElementProxy.m
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-22.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ElementProxy, NSObject)
RCT_EXTERN_METHOD(createRootElement:(nonnull NSNumber*)reactTag proxyID:(NSString*)proxyID)
RCT_EXTERN_METHOD(destroyRootElement:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(createChildElement:(nonnull NSString*)uuid childId:(NSString*)childId x:(double)x y:(double)y width:(double)width height:(double)height)
RCT_EXTERN_METHOD(destroy:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(useCache:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(clearCache:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(enableMotion:(nonnull NSString*)uuid value:(BOOL)value)
RCT_EXTERN_METHOD(draw:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(clear:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(flush:(nonnull NSString*)uuid)
RCT_EXTERN_METHOD(disableLoadAnimations:(nonnull NSString*)uuid)


RCT_EXTERN_METHOD(resize:(nonnull NSString*)uuid x:(double)x y:(double)y width:(double)width height:(double)height)

RCT_EXTERN_METHOD(addRect:(nonnull NSString*)uuid shapeId:(nonnull NSNumber*)shapeId parentId:(nonnull NSString*)parentId x:(double)x y:(double)y width:(double)width height:(double)height fill:(NSDictionary*)fill stroke:(NSDictionary*)stroke strokeWidth:(double)strokeWidth)

RCT_EXTERN_METHOD(updateShape:(nonnull NSString*)uuid index:(nonnull NSNumber*)index fill:(NSDictionary*)fill stroke:(NSDictionary*)stroke strokeWidth:(double)strokeWidth )

RCT_EXTERN_METHOD(batchUpdate:(nonnull NSString*)uuid list:(NSArray*)list)

RCT_EXTERN_METHOD(addLine:(nonnull NSString*)uuid shapeId:(nonnull NSNumber*)shapeId x1:(double)x1 x2:(double)x2 y1:(double)y1 y2:(double)y2 stroke:(NSDictionary*)stroke strokeWidth:(double)strokeWidth)

RCT_EXTERN_METHOD(addCircle:(nonnull NSString*)uuid shapeId:(nonnull NSNumber*)shapeId cx:(double)cx cy:(double)cy r:(double)r fill:(NSDictionary*)fill stroke:(NSDictionary*)stroke strokeWidth:(double)strokeWidth)

RCT_EXTERN_METHOD(addText:(nonnull NSString*)uuid shapeId:(nonnull NSNumber*)shapeId textObject:(NSDictionary*)textObject fill:(NSDictionary*)fill stroke:(NSDictionary*)stroke strokeWidth:(double)strokeWidth)

RCT_EXTERN_METHOD(addPath:(nonnull NSString*)uuid shapeId:(nonnull NSNumber*)shapeId pathObject:(NSDictionary*)pathObject)


@end
