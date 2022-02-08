package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Rect;
import android.text.TextPaint;

class KpiElement {
    public String text = "";
    Rect frameRect = new Rect();
    Rect computedRect = new Rect();
    Rect tempRect = new Rect();
    TextPaint paint = new TextPaint();
    float width;
    float height;
    Paint strokePaint = new Paint();
    float maxTextSize = Float.MAX_VALUE;

    Rect getComputedBounds() {
        paint.getTextBounds(this.text, 0, this.text.length(), computedRect);
        return computedRect;
    }
    
    Rect getFrameRect() {
      return frameRect;
    }

    public void setMaxTextSize(float textSize) {
        float current = paint.getTextSize();
        if (current > textSize) {
            paint.setTextSize(textSize);
        }
        maxTextSize = textSize;
    }

    public float getHeight() {
        return height;
    }
    public float getTextHeight() {
        Paint.FontMetrics fm = paint.getFontMetrics();
        return paint.getTextSize();
    }

    KpiElement(float w, float h, int color, String t) {
        this.text = t;
        set(w, h, color, t);
        strokePaint.setStyle(Paint.Style.STROKE);
        strokePaint.setColor(Color.RED);
        strokePaint.setStrokeWidth(4);
    }

    public void set(float w, float h, int color, String t){
        this.text = t;
        setDims(w, h);
        paint.setStyle(Paint.Style.FILL);
        paint.setAntiAlias(true);
        paint.setColor(color);
    }

    public void setDims(float w, float h){
        width = w;
        height = h;
        frameRect = new Rect(0, 0, (int)width, (int)height);
        float area = width * height;
        double textSize = Math.sqrt(area / text.length());


        paint.setTextSize((float) textSize);
        paint.getTextBounds(this.text, 0, this.text.length(), computedRect);

        if (computedRect.width() > frameRect.width() ) {
            final float testTextSize = 48f;

            // Get the bounds of the text, using our testTextSize.
            paint.setTextSize(testTextSize);
            paint.getTextBounds(text, 0, text.length(), computedRect);

            // Calculate the desired size as a proportion of our testTextSize.
            float desiredTextSize = (float) testTextSize * w / computedRect.width();

            // Set the paint for that size.
            paint.setTextSize(desiredTextSize);
        }
        if (computedRect.height() > maxTextSize || computedRect.height() > frameRect.height()) {
            paint.setTextSize(Math.min(frameRect.height(), maxTextSize));
        }
    }

    public float getTop() {
      calcMetrics();

      return tempRect.top ;
    }

  public void calcMetrics() {
    paint.setTextAlign(Paint.Align.CENTER);
    paint.getTextBounds(text, 0, text.length(), tempRect);
    float x = getX();
    float y = getY();
    tempRect.offset((int)x - tempRect.width() /2, (int)y);
  }

  public void calcLeftMetrics() {
    paint.setTextAlign(Paint.Align.LEFT);
    paint.getTextBounds(text, 0, text.length(), tempRect);
    float x = getLeftX();
    float y = getY();
    tempRect.offset((int)x - tempRect.width() /2, (int)y);
  }
  
  float getX() {
      return frameRect.centerX();
  }
  
  float getLeftX() {
      return frameRect.left;
  }
  
  float getY() {
    return frameRect.bottom;
  }
  float getCenteredY() {
        return frameRect.bottom - tempRect.height();
  }

  public void setPos(int x, int y) {
        frameRect.offsetTo(x, y);
    }
    public void centerFrom(Rect r, int yOffset) {
        int cx = r.centerX();
        int cy = r.top + yOffset - frameRect.height() / 3;
        setPos(cx - frameRect.width() / 2, cy );
    }

    public void drawCenter(Canvas canvas) {

        int cHeight = frameRect.height();
        int cWidth = frameRect.width();
        paint.setTextAlign(Paint.Align.LEFT);
        paint.getTextBounds(text, 0, text.length(), tempRect);
        float x = cWidth / 2f - tempRect.width() / 2f - tempRect.left;
        float y = cHeight / 2f + tempRect.height() / 2f - tempRect.bottom;
        canvas.drawText(text, x, y, paint);
    }

    public void drawAt(Canvas canvas, boolean baseline) {
       calcMetrics();

        float x = getX();
        float y = frameRect.bottom;
        canvas.drawText(text, x, y, paint);
//        drawDebugRects(canvas);

    }

    private void drawDebugRects(Canvas canvas) {
        strokePaint.setColor(Color.RED);
        canvas.drawRect(frameRect, strokePaint);
        strokePaint.setColor(Color.GREEN);
//        canvas.drawRect(tempRect, strokePaint);
    }
    
    public void drawLeft(Canvas canvas) {
        calcLeftMetrics();
        float top =  getY();
        float left = frameRect.left + frameRect.width() - tempRect.width();
        canvas.drawText(text, left, top, paint); 
//        drawDebugRects(canvas);
    }


    public void drawRight(Canvas canvas, int padding) {
        calcLeftMetrics();
        float top = frameRect.bottom;
        float left = frameRect.left + padding;
        canvas.drawText(text, left, top, paint);
//        drawDebugRects(canvas);
    }

    public void drawRightVCentered(Canvas canvas, int padding) {
        calcLeftMetrics();
        float top = frameRect.bottom - frameRect.height() / 2 + padding;
        float left = frameRect.left + padding;
        canvas.drawText(text, left, top, paint);
    }

    public void setLeft(float x) {
        frameRect.offsetTo((int)x, frameRect.top);
    }

    public void setSecondElement() {
        setDims(this.width * 0.5f, this.height);
    }

}

