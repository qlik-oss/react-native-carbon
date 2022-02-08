package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.PointF;

public class Composite {
    boolean selected = false;
    String parentId = "";
    int shapeId = -1;
    public void draw(Canvas canvas){}
    public void update(int color, int stroke, float strokeWidth){}
    public boolean hitTest(PointF point){ return false; }
    public boolean hitTest(LineSegment lineSegment) { return  false; }
    public boolean hitTest(CircleVolume circleVolume) { return  false; }
    public boolean hitTest(PolygonVolume polygonVolume) { return  false; }

    public void toggleSelection(){}
    public void beginSelection(){}
    public void setSelected(boolean value){}

    public boolean getSelectionStatus() {
        return selected;
    }

    public int getShapeId() {
        return shapeId;
    }

}
