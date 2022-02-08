package com.reactnativecarbon.photon;

import android.animation.ValueAnimator;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PointF;

public class Circle extends Composite{
    ValueAnimator animator = null;
    float cx;
    float cy;
    float r;
    Paint fillPaint = new Paint();
    boolean dirty = false;
    int color = 0;

    Circle(int shapeId, float cx, float cy, float r) {
        this.shapeId = shapeId;
        this.setCircle(cx, cy, r);
        fillPaint.setStyle(Paint.Style.FILL);
    }

    public void setCircle(float cx, float cy, float r) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    public void setFill(int color) {
        this.color = color;
        fillPaint.setColor(color);
    }

    public void setStroke(int color, float width) {

    }

    public void update(int color, int stroke, float strokeWidth) {
        dirty = true;
        this.color = color;
        fillPaint.setColor(color);
    }

    public int getShapeId() {
        return shapeId;
    }

    public void draw(Canvas canvas) {
        canvas.drawCircle(this.cx, this.cy, this.r, this.fillPaint);
    }


    @Override
    public boolean hitTest(PointF point) {
        return false;
    }
}
