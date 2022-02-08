package com.reactnativecarbon.photon;

import android.graphics.PointF;
import android.graphics.RectF;

public class CircleVolume {
    PointF center;
    float radius;

    CircleVolume(PointF center, float radius) {
        this.center = center;
        this.radius = radius;
    }

    public boolean test(RectF rectangle) {
        return  test(center.x, center.y, radius, rectangle.left, rectangle.top, rectangle.width(), rectangle.height());
    }

    public boolean test(float cx, float cy, float radius, float rx, float ry, float rw, float rh) {
        float testX = cx;
        float testY = cy;

        // which edge is closest?
        if (cx < rx)         testX = rx;      // test left edge
        else if (cx > rx+rw) testX = rx+rw;   // right edge
        if (cy < ry)         testY = ry;      // top edge
        else if (cy > ry+rh) testY = ry+rh;   // bottom edge

        // get distance from closest edges
        float distX = cx-testX;
        float distY = cy-testY;
        float distance = (float) Math.sqrt( (distX*distX) + (distY*distY) );

        // if the distance is less than the radius, collision!
        if (distance <= radius) {
            return true;
        }
        return false;
    }

}
