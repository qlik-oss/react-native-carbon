package com.reactnativecarbon.photon;

import android.graphics.Canvas;

public class ClearScreenTask implements Task{
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

  }
}
