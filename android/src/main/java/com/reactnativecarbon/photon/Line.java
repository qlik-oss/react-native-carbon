package com.reactnativecarbon.photon;

import android.animation.ValueAnimator;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;

public class Line extends Composite{
    ValueAnimator animator = null;
    float x1, x2, y1, y2;
    int shapeId = -1;
    Paint strokePaint = new Paint();
    boolean dirty = false;
    int color = 0;

    Line(int shapeId, float x1, float x2, float y1, float y2) {
        this.shapeId = shapeId;
        this.setLine(x1, x2, y1, y2);
        strokePaint.setStyle(Paint.Style.STROKE);
    }

    public void setLine(float x1, float x2, float y1, float y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    public void setStroke(int color, float width) {
        this.color = color;
        strokePaint.setColor(color);
        strokePaint.setStrokeWidth(width);
    }

    public void update(int color, int stroke, float strokeWidth) {
        dirty = true;
        this.color = color;
        strokePaint.setColor(color);
    }

    @Override
    public boolean hitTest(PointF point) {
        return false;
    }

    public int getShapeId() {
        return shapeId;
    }

    public void draw(Canvas canvas) {
        canvas.drawLine(x1, y1, x2, y2, strokePaint);
    }
}

