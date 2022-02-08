package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PointF;

import com.reactnativecarbon.PixelUtils;

public class StartLassoTask implements Task {
    final PointF startPoint;
    Paint paint = new Paint();
    Paint strokePaint = new Paint();
    StartLassoTask(PointF point) {
        startPoint = point;
        paint.setStyle(Paint.Style.FILL);
        paint.setColor(Color.BLACK);
        paint.setAlpha(64);

        strokePaint.setColor(Color.BLACK);
        strokePaint.setStyle(Paint.Style.STROKE);
        strokePaint.setStrokeWidth(PixelUtils.dpToPx(2));
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
        canvas.drawCircle(startPoint.x, startPoint.y, PixelUtils.dpToPx(16), paint);
        canvas.drawCircle(startPoint.x, startPoint.y, PixelUtils.dpToPx(16), strokePaint);
    }
}
