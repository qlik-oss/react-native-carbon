package com.reactnativecarbon.photon;

import android.graphics.Canvas;

public class DrawTask implements Task {
    LayerElement element;
    public DrawTask(LayerElement element) {
        this.element = element;
    }

    public void execute(Canvas canvas) {
        LayerSurfaceView parent = element.getParent();
        if (parent != null) {
            parent.render(canvas);
        }
    }

    public boolean quite() {
      return false;
    }

    @Override
    public boolean clearsScreen() {
        return true;
    }
}
