package com.reactnativecarbon.photon;

import android.graphics.Canvas;

public interface Task {
    public boolean quite();
    public boolean clearsScreen();
    public void execute(Canvas canvas);
}
