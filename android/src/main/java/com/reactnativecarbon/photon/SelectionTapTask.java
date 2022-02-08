package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PointF;
import android.graphics.PorterDuff;

public class SelectionTapTask implements Task{
    final PointF point;
    final LayerSurfaceView surfaceView;

    SelectionTapTask(PointF point, LayerSurfaceView surfaceView) {
        this.point = point;
        this.surfaceView = surfaceView;
    }

    @Override
    public boolean quite() {
        return false;
    }

    @Override
    public boolean clearsScreen() {
        return true;
    }

    @Override
    public void execute(Canvas canvas) {
        surfaceView.hitTest(this.point);
        surfaceView.render(canvas);
    }
}
