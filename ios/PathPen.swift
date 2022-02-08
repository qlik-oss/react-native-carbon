//
//  PathRender.swift
//  react-native-svg-path-renderer
//
//  Created by Vittorio Cellucci on 2021-02-20.
//

import Foundation
class PathPen {
  var commandArray = [PathCommand]()
  var currentX:Double = 0
  var currentY:Double = 0
  var pivot = CGPoint()
  var currentPen = CGPoint()
  var drawPath = UIBezierPath()
  
  func reset() {
    commandArray = [PathCommand]()
    currentX = 0
    currentY = 0
    pivot = CGPoint()
    currentPen = CGPoint()
    drawPath.removeAllPoints()
  }
  
  func setPrev(_ cmd: PathCommand) {
    currentX = cmd.args[0]
    currentY = cmd.args[1];
    currentPen = CGPoint(x: currentX, y: currentY)
    pivot = CGPoint(x: currentX, y: currentY)
  }
  
  func draw() {
    for item in commandArray {
      switch item.type {
      case "M":
        drawPath.move(to: CGPoint(x: item.args[0], y: item.args[1]))
        setPrev(item)
        break
      case "L":
        renderLine(item)
        break
      case "h":
        currentX += item.args[0]
        lineTo(item)
        break;
      case "v":
        currentY += item.args[0]
        lineTo(item)
        break;
      case "Z":
        drawPath.close()
        break;
      case "A":
        arc(item)
        break
      case "C":
        cubicCurve(item)
        break
      case "S":
        shortCubicCurve(item)
        break
      case "Q":
        shortCubicCurve(item)
        break
      case "T":
        shortQuad(item)
        break
      default:
        break
      }
    }
  }
  
  fileprivate func putPenDown(_ cmd: PathCommand) {
    currentX = cmd.args[0]
    currentY = cmd.args[1];
    currentPen = CGPoint(x: currentX, y: currentY)
  }
  
  func renderLine(_ cmd: PathCommand) {
    drawPath.addLine(to: CGPoint(x:cmd.args[0], y: cmd.args[1]))
    putPenDown(cmd)
  }
  
  func lineTo(_ cmd: PathCommand) {
    drawPath.addLine(to: CGPoint(x:currentX, y: currentY))
  }
  
  func cubicCurve(_ cmd: PathCommand) {
    let to = CGPoint(x:cmd.args[4], y:cmd.args[5])
    let p1 = CGPoint(x:cmd.args[0], y:cmd.args[1])
    let p2 = CGPoint(x:cmd.args[2], y:cmd.args[3])
    currentPen = to
    pivot = p2
    drawPath.addCurve(to: to , controlPoint1: p1, controlPoint2: p2)
  }
  
  func shortCubicCurve(_ cmd: PathCommand) {
    let x:CGFloat = CGFloat((currentPen.x * 2.0)) - pivot.x
    let y:CGFloat = CGFloat((currentPen.y * 2.0)) - pivot.y
    let to = CGPoint(x:cmd.args[2], y:cmd.args[3])
    let p1 = CGPoint(x:x, y:y)
    let p2 = CGPoint(x:cmd.args[0], y:cmd.args[1])
    currentPen = to
    pivot = p2
    drawPath.addCurve(to: to , controlPoint1: p1, controlPoint2: p2)
  }
  
  func shortQuad(_ cmd: PathCommand) {
    let x:CGFloat = CGFloat((currentPen.x * 2.0)) - pivot.x
    let y:CGFloat = CGFloat((currentPen.y * 2.0)) - pivot.y
    var p1 = CGPoint(x:x, y:y)
    var p2 = CGPoint(x:cmd.args[0], y:cmd.args[1])
    
    let ex = p2.x;
    let ey = p2.y;
    let c2x = (ex + p1.x * 2) / 3;
    let c2y = (ey + p1.y * 2) / 3;
    let c1x = (currentPen.x + p1.x * 2) / 3;
    let c1y = (currentPen.y + p1.y * 2) / 3;
    
    p1 = CGPoint(x: c1x, y: c1y)
    p2 = CGPoint(x: c2x, y: c2y)
    let to = CGPoint(x: ex, y: ey)
    currentPen = to
    pivot = p2
    drawPath.addCurve(to: to , controlPoint1: p1, controlPoint2: p2)
  }
  
  func arc(_ cmd: PathCommand) {
    // The main challenge here is to find the center point, start, and end angles from the command
    // It's a paramatric equation to get the center point and angles
    // implemenatation formulae is taken from the spec, so this code simply implements the formulae
    // https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
    svgToArc((cmd.args[0]),
             ryy: (cmd.args[1]),
             phi: (cmd.args[2]),
             fA: (cmd.args[3]),
             fS: (cmd.args[4]),
             x2: (cmd.args[5]),
             y2: (cmd.args[6]))
  }
  
  func toRad( _ deg: Double) -> Double {
    return ((deg * Double.pi) / 180.0);
  }
  
  func mult(_ A: [Double], B: [Double]) -> [Double] {
    var R:[Double] = [0, 0]
    R[0] = A[0] * B[0] + A[1] * B[1]
    R[1] = A[2] * B[0] + A[3] * B[1];
    return R
  }
  
  func svgToArc(_ rxx: Double, ryy: Double, phi: Double, fA: Double, fS:Double, x2:Double, y2: Double) {
    let x1 = Double(currentX)
    let y1 = Double(currentY)
    var rx = abs(rxx)
    var ry = abs(ryy)
    let  cosPhi = cos(phi);
    let  sinPhi = sin(phi);
    let  dx = (x1 - x2) / 2.0;
    let  dy = (y1 - y2) / 2.0;
    /*
     | a b | | I | = |aI + bS|
     | c d | | S | = |cI + dS|
     */
    var A:[Double] = [cosPhi, sinPhi, -sinPhi, cosPhi];
    var B:[Double] = [dx, dy]
    let R_ = mult(A, B: B);
    let x1_ = R_[0];
    let y1_ = R_[1];
    
    // lambda check
    let lxx = x1_ * x1_
    let lyy = y1_ * y1_
    let lrxx = rx * rx
    let lryy = ry * ry
    
    let lambda1 = lxx / lrxx
    let lambda2 = lyy / lryy
    
    let lambda = lambda1 + lambda2
    if (lambda > 1) {
      rx = sqrt(lambda) * rx
      ry = sqrt(lambda) * ry
    }
    
    // step 2
    let rx2 = rx*rx;
    let ry2 = ry*ry;
    let x1_2 = x1_*x1_;
    let y1_2 = y1_*y1_;
    
    // there is already a check, the lambda check to ensure everything fits,
    // however due to floating point errors, make sure g0 >= 0, in js,
    // some values are coming back as 10.5e-15 and bypasses the zero check
    let g0 = max((rx2*ry2 - rx2*y1_2 - ry2*x1_2), 0);
    let g1 = rx2*y1_2 + ry2*x1_2;
    var sq = sqrt(g0/g1);
    
    var sign:Double = (fA == fS) ? -1.0 : 1.0;
    sq = sq * sign;
    let cx_ = sq * ((rx*y1_)/ry);
    let cy_ = sq * -((ry*x1_)/rx);
    
    A = [cosPhi, -sinPhi, sinPhi, cosPhi]
    B = [cx_, cy_]
    let C = mult(A, B: B);
    var cx = C[0];
    var cy = C[1];
    cx += ((x1 + x2) / 2.0);
    cy += ((y1 + y2) / 2.0);
    
    let ux = (x1_ - cx_) / rx;
    let uy = (y1_ - cy_) / ry;
    let vx = (-x1_ - cx_) / rx;
    let vy = (-y1_ - cy_) / ry;
    var n = sqrt((ux*ux) + (uy*uy));
    var p = ux;
    
    sign = (uy < 0) ? -1.0 : 1.0;
    var angleStart:Double = 180.0 * (sign * acos(p/n)) / Double.pi;
    n = sqrt((ux*ux + uy*uy) * (vx*vx + vy*vy));
    p = ux*vx + uy*vy;
    sign = (ux*vy - uy*vx < 0) ? -1.0 : 1.0;
    var angleExtent:Double = 180.0 * (sign * acos(p/n)) / Double.pi;
    if( fS == 0 && angleExtent > 0 ){
      angleExtent -= 360.0;
    } else if( fS != 0 && angleExtent < 0) {
      angleExtent += 360.0;
    }
    
    angleStart = fmod(angleStart, 360.0);
    angleExtent = fmod(angleExtent, 360.0);
    
    angleStart = toRad(angleStart);
    angleExtent = toRad(angleExtent);
    let clockWise = 1 - fS;
    
    drawPath.addArc(withCenter: CGPoint(x: CGFloat(cx), y: CGFloat(cy)),
                    radius: CGFloat(rx),
                    startAngle: CGFloat(angleStart),
                    endAngle: CGFloat(angleStart + angleExtent),
                    clockwise: clockWise != 1)
    
    
    currentX = Double(x2)
    currentY = Double(y2)
    pivot = CGPoint(x: currentX, y: currentY)
    
    
  }
}
