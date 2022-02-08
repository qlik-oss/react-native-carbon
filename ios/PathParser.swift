//
//  PathParser.swift
//  SvgPathRenderer
//
//

import Foundation
extension String {
  func tokenize(splitMarks: String) -> [String] {
    let cs = CharacterSet(charactersIn: splitMarks)
    var result = [String]()
    var pos = startIndex
    while let range = rangeOfCharacter(from: cs, range: pos..<endIndex) {
      if range.lowerBound != pos {
        let found = String(self[pos..<range.lowerBound])
        result.append(found)
      }
      result.append(String(self[range]))
      pos = range.upperBound
    }
    if pos != endIndex {
      result.append(String(self[pos..<endIndex]))
    }
    return result
  }
}

class PathParser {
  var pathString:String
  var commandArray = [PathCommand]()
  var success = true
  init(fromPathString path: String) {
    pathString = path
    tokenizePath();
  }
  
  func tokenizePath() -> Void {
    let deliminators = "MZLHVCSQTAmzlhvcsqta"
    let results = pathString.tokenize(splitMarks: deliminators)
    success = parseCommands(rawArray: results)
  }
  
  func parseCommands(rawArray: [String]) -> Bool {
    var index = 0
    let count = rawArray.count
    for item in rawArray {
      let c = index % 2
      if (c == 0 && index + 1 < count) {
        var pathCommand = PathCommand()
        var args = rawArray[index+1].tokenize(splitMarks: ", ")
        if (args.count == 0) {
          args = rawArray[index+1].components(separatedBy: CharacterSet(charactersIn: ", "))
        }
        args = args.filter{$0 != " " && $0 != "," }
        pathCommand.type = item
        pathCommand.valid = true
        pathCommand.args = args.map({ (string) -> Double in
          if let arg = Double(string) {
            return arg
          }
          pathCommand.valid = false
          return 0
        })
        if pathCommand.valid {
          commandArray.append(pathCommand)
        } else {
          return false
        }
      } else {
        var pathCommand = PathCommand()
        pathCommand.type = item
        commandArray.append(pathCommand)
      }
      index += 1
    }
    return true
  }
  
  func getCommandArray() -> [PathCommand] {
    return self.commandArray
  }
}
