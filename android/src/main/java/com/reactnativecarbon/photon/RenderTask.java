package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Color;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

public class RenderTask implements Task{
    LayerSurfaceView surfaceView;
    final boolean clear;
    RenderTask(LayerSurfaceView view, boolean clear) {
        this.surfaceView = view;
        this.clear = clear;
    }

    public void execute(Canvas canvas) {
      this.surfaceView.render(canvas);
    }

    public boolean quite() {
      return false;
    }

    @Override
    public boolean clearsScreen() {
        return clear;
    }
}