//
//  DecoableText.swift
//  react-native-carbon
//
//  Created by Vittorio Cellucci on 2021-07-28.
//

import Foundation
//
//  PathElement.swift
//  react-native-svg-path-renderer
//
//  Created by Vittorio Cellucci on 2021-01-13.
//

import Foundation

struct ColorContent: Decodable {
  let colors: String?
  let opacity: Double?
  let offset: Double?
}

struct ColorObject: Decodable {
  let colors: String?
  let opacity: Double?
  let type: String?
  let x1: Double?
  let y1: Double?
  let x2: Double?
  let y2: Double?
  let stops: [ColorContent]?
  let viewBound: Bool?
}

struct StopColor: Decodable {
  let color: DecodableColor
  let offset: Double?
}

struct DecodableColor: Decodable {
  let type: String
  let degree: Double?
  let stops: [StopColor]?
  let colors: [Double]?
}

struct BoundingRect: Decodable {
  let height: Double?
  let width: Double?
  let x: Double?
  let y: Double?
}

struct FontObject: Decodable {
  let boundingRect: BoundingRect?
  let fontFamily: String
  let fontSize: Double
  let fontWeight:String?
  let x: Double
  let y: Double
  let dx: Double?
  let dy: Double?
  let anchor: String?
  let maxWidth: Double?
  let maxHeight: Double?
  let baseline: String?
  let wordBreak:String?
  let fitToView:Bool?
  
}

struct TextObject: Decodable {
  let text: String?
  let font: FontObject?
  let transform: String?
  
}

struct PathObject: Decodable {
  let path: String?
  let stroke: String?
  let strokeWidth: Double?
  let opacity: Double?
  let fill: String?
  let boundingRect: BoundingRect?
  let transform: String?
  let strokeDasharray:String?
}

struct UpdateShape: Decodable {
  let id: Double?
  let colors: DecodableColor?
  let strokeColors: DecodableColor?
  let strokeWidth: Double?
}
