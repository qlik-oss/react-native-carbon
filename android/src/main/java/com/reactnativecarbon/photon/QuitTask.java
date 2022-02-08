package com.reactnativecarbon.photon;

import android.graphics.Canvas;

public class QuitTask implements Task {
    
    public void execute(Canvas canvas) {}

    public boolean quite() {
      return true;
    }

    @Override
    public boolean clearsScreen() {
        return false;
    }
}
