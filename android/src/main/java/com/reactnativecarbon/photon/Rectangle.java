package com.reactnativecarbon.photon;

import android.animation.ValueAnimator;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PointF;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;

public class Rectangle extends Composite{
    ValueAnimator animator = null;
    RectF rectangle;
    Path path = new Path();
    Paint fillPaint = new Paint();
    Paint strokePaint = new Paint();
    Paint unselectedPaint = new Paint();
    Rect frame = new Rect();
    boolean dirty = false;
    int color = 0;
    int alpha;
    LineSegment[] lines;

    Rectangle(int shapeId, RectF rectangle) {
        this.shapeId = shapeId;
        this.rectangle = rectangle;
        path.addRect(rectangle, Path.Direction.CW);
        fillPaint.setStyle(Paint.Style.FILL);
        strokePaint.setStyle(Paint.Style.STROKE);

        createLines();

    }

    private void createLines() {
        // top line
        float x0 = rectangle.left;
        float y0 = rectangle.top;
        float x1 = rectangle.right;
        float y1 = rectangle.top;
        LineSegment top = new LineSegment(new PointF(x0, y0), new PointF(x1, y1));

        // left line
        float x2 = rectangle.left;
        float y2 = rectangle.top;
        float x3 = rectangle.left;
        float y3 = rectangle.bottom;
        LineSegment left = new LineSegment(new PointF(x2, y2), new PointF(x3, y3));

        // bottom
        float x4 = rectangle.left;
        float y4 = rectangle.bottom;
        float x5 = rectangle.right;
        float y5 = rectangle.bottom;
        LineSegment bottom = new LineSegment(new PointF(x4, y4), new PointF(x5, y5));

        // right line
        float x6 = rectangle.right;
        float y6 = rectangle.top;
        float x7 = rectangle.right;
        float y7 = rectangle.bottom;
        LineSegment right = new LineSegment(new PointF(x6, y6), new PointF(x7, y7));

        lines = new LineSegment[]{top, left, bottom, right};
    }

    public void setMetrics(int width, int height) {
        frame = new Rect(0, 0, width, height);
    }

    public void setShader(LinearGradient linearGradient) {
        fillPaint = new Paint();
        fillPaint.setShader(linearGradient);
    }

    public void setRect(RectF rect) {
        path.reset();
        path.addRect(rectangle, Path.Direction.CW);
    }
    public void setFill(int color) {
        this.color = color;
        fillPaint.setColor(color);
    }

    public void setStroke(int color, float width) {
        strokePaint.setStrokeWidth(width);
        strokePaint.setColor(color);
    }

    public void update(int color, int stroke, float strokeWidth) {
        dirty = true;
        this.color = color;
        fillPaint.setColor(color);
        strokePaint.setColor(stroke);
        strokePaint.setStrokeWidth(strokeWidth);
    }

    @Override
    public boolean hitTest(PointF point) {
        if (rectangle.contains(point.x, point.y)){
            return true;
        }
        return false;
    }

    @Override
    public boolean hitTest(LineSegment lineSegment) {
        // early exit, if any of the points are in the rect, then it's in
        if(rectangle.contains(lineSegment.a.x, lineSegment.a.y)) {
            return true;
        }

        if(rectangle.contains(lineSegment.b.x, lineSegment.b.y)) {
            return true;
        }
        for(int i = 0; i < 4; i++) {
            if(lineSegment.test(lines[i])) {
                return true;
            }
        }
        return false;
    }

    @Override
    public boolean hitTest(CircleVolume circleVolume) {
        return circleVolume.test(this.rectangle);
    }

    @Override public boolean hitTest(PolygonVolume polygonVolume) {
        return polygonVolume.test(this.rectangle);
    }

    @Override
    public void toggleSelection() {
        selected = !selected;
        toggleColor();
    }

    @Override
    public void setSelected(boolean value) {
        selected = value;
        toggleColor();
    }

    private void toggleColor() {
        if (selected) {
            fillPaint.setColor(color);
            fillPaint.setAlpha(alpha);
        } else {
            fillPaint.setAlpha(32);
        }
    }

    @Override
    public void beginSelection() {
        selected = false;
        alpha = fillPaint.getAlpha();
        fillPaint.setAlpha(32);
    }

    public int getShapeId() {
        return shapeId;
    }

    public void draw(Canvas canvas) {
        canvas.drawPath(path, fillPaint);
        if(strokePaint.getStrokeWidth() > 0) {
            canvas.drawPath(path, strokePaint);
        }
    }
}
