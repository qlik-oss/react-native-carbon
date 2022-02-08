package com.reactnativecarbon.photon;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;

public class DrawBuffer {
    Bitmap bufferBitmap;
    Canvas bufferCanvas;
    int width = 0;
    int height = 0;
    Paint paint = new Paint();
    Paint edgeBleed = new Paint();
    Bitmap backgroundBitmap;
    Bitmap clearBitmap;
    Canvas backgroundCanvas;
    Canvas whiteCanvas;
    DrawBuffer(int width, int height) {
        this.width = width;
        this.height = height;
        bufferBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        clearBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        clearBitmap.eraseColor(Color.WHITE);
        bufferCanvas = new Canvas(bufferBitmap);
        edgeBleed.setStyle(Paint.Style.FILL);
        edgeBleed.setColor(Color.WHITE);
        edgeBleed.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.SRC_OVER));
        bufferCanvas.drawARGB(255, 255, 255, 255);

        backgroundBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        backgroundCanvas = new Canvas(backgroundBitmap);
        backgroundCanvas.drawARGB(255, 255, 255, 255);
        
        whiteCanvas = new Canvas(clearBitmap);
        whiteCanvas.drawARGB(255,255,255,255);
        
    }

    public Canvas getCanvas() {
        return bufferCanvas;
    }

    public void clear() {
      bufferBitmap.eraseColor(Color.WHITE);
    }

    public void draw(Canvas canvas) {
        canvas.drawBitmap(clearBitmap, 0, 0, paint);
        canvas.drawBitmap(bufferBitmap, 0, 0, paint);
    }
}
