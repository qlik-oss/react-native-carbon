package com.reactnativecarbon.photon;

import android.graphics.PointF;

public class LineSegment {
    PointF a;
    PointF b;
    LineSegment(PointF start, PointF end) {
        a = start;
        b = end;
    }

    public boolean test(LineSegment lineSegment) {
       return  text(a.x, a.y, b.x, b.y, lineSegment.a.x, lineSegment.a.y, lineSegment.b.x, lineSegment.b.y);

    }

    private final boolean text(float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4) {
        float v = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y2);
        float uA = ((x4 - x3) * (y1-y3) - (y4-y3)*(x1-x3)) / v;
        float uB = ((x2-x1) * (y1-y3) - (y2-y1)*(x1-x3)) / v;
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            return true;
        }
        return false;
    }
}
