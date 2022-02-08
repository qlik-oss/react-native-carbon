package com.reactnativecarbon.photon;

import static java.lang.Math.*;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Point;
import android.graphics.PointF;
import android.graphics.RectF;
import android.util.Log;

import com.reactnativecarbon.PixelUtils;

public class LassoPaintTask implements Task{
    final PointF startPoint;
    final LayerSurfaceView surfaceView;
    Path path = new Path();
    Paint paint = new Paint();
    Path polygonPath = new Path(); // used for collision detection later on
    Paint polygonPaint = new Paint(); // for debug
    PointF currentPoint = new PointF();
    PolygonVolume selectionShape = new PolygonVolume();
    int count = 0;
    StartCircle startCircle = new StartCircle();

    class StartCircle {
        Paint paint = new Paint();
        Paint strokePaint = new Paint();
        StartCircle() {
            paint.setStyle(Paint.Style.FILL);
            paint.setColor(Color.BLACK);
            paint.setAlpha(64);

            strokePaint.setColor(Color.BLACK);
            strokePaint.setStyle(Paint.Style.STROKE);
            strokePaint.setStrokeWidth(PixelUtils.dpToPx(2));
        }
        public void draw(Canvas canvas) {
            canvas.drawCircle(startPoint.x, startPoint.y, PixelUtils.dpToPx(16), paint);
            canvas.drawCircle(startPoint.x, startPoint.y, PixelUtils.dpToPx(16), strokePaint);
        }
    }
    LassoPaintTask(PointF pointF, LayerSurfaceView surfaceView) {
        this.surfaceView = surfaceView;
        startPoint = pointF;
        path.reset();
        path.moveTo(startPoint.x, startPoint.y);
        polygonPath.reset();
        polygonPath.moveTo(startPoint.x, startPoint.y);
        paint.setColor(Color.BLACK);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeJoin(Paint.Join.ROUND);
        paint.setStrokeCap(Paint.Cap.ROUND);
        paint.setStrokeWidth(6);

        polygonPaint.setColor(Color.RED);
        polygonPaint.setStyle(Paint.Style.STROKE);
        polygonPaint.setStrokeJoin(Paint.Join.ROUND);
        polygonPaint.setStrokeCap(Paint.Cap.ROUND);
        polygonPaint.setStrokeWidth(6);
        selectionShape.vertices.add(pointF);
    }

    public void addPoint(PointF pointF) {
        // update the ui
        path.lineTo(pointF.x, pointF.y);
        currentPoint = pointF;
        count ++;
        if (count > 3) {
            selectionShape.vertices.add(pointF);
            count = 0;
        }
        surfaceView.lassoSelect(pointF);
    }

    public void end(PointF pointF) {
        path.lineTo(startPoint.x, startPoint.y);
        polygonPath.lineTo(startPoint.x, startPoint.y);
    }

    @Override
    public boolean quite() {
        return false;
    }

    @Override
    public boolean clearsScreen() {
        return false;
    }

    @Override
    public void execute(Canvas canvas) {
        canvas.drawColor(Color.WHITE);
        surfaceView.render(canvas);
        startCircle.draw(canvas);
        canvas.drawPath(path, paint);
    }
}
