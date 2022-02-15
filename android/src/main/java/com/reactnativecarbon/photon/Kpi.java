package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PointF;
import android.graphics.Rect;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;

import org.json.JSONException;
import org.json.JSONObject;

public class Kpi extends Composite {
    float width = 0;
    float height = 0;
    Rect mainFrame = new Rect();

    DisplayMetrics displayMetrics;

    private float toPx(float dp) {
        return Math.abs(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_DIP, dp, displayMetrics));
    }

    KpiElement mainElement = null;
    KpiElement mainTitle = null;
    KpiElement secondElement = null;
    KpiElement secondTitle = null;
    String config = "";

    public Kpi(String config, float width, float height, DisplayMetrics displayMetrics) {
        this.width = width;
        this.height = height;
        this.displayMetrics = displayMetrics;
        this.config = config;
        this.update(config);
    }
    
    public void resize(float width, float height) {
      if (mainElement != null) {
        this.width = width;
        this.height = height;
        update(this.config);
      }
    }



    public void update(String config) {
      this.config = config;
      mainFrame = new Rect(0, 0, (int)width, (int)height);
        try {
            JSONObject jsonObject = new JSONObject(config);
            createMainValue(jsonObject);
            createMainTitle(jsonObject);

        } catch (JSONException e) {
            Log.e("JsonCONFIG", "Failed to get kpi data");
        }
    }

    private void createMainValue(JSONObject jsonObject) throws JSONException {
        JSONObject mainObject = jsonObject.getJSONObject("main");
        String sColor = mainObject.getString("color");
        String text = mainObject.getString("value");
        int color = Color.parseColor(sColor);
        if (mainElement == null) {
            mainElement = new KpiElement(width, height, color, text);
        } else {
            mainElement.set(width, mainElement.getHeight(), color, text);
        }
        createSecondaryValue(jsonObject);
    }

    private float getSecondaryHeight(float h) {
        return (h * 0.8f) - toPx(16);
    }
    private float getSecondaryTitleHeight(float h) {
        return (h * 0.3f) - toPx(16);
    }
    private float getHalfWidth() {
        return ((width * 0.5f) - toPx(16));
    }

    private void createSecondaryValue(JSONObject jsonObject) throws JSONException {
        if (jsonObject.has("second")) {
            JSONObject secondObject = jsonObject.getJSONObject("second");
            mainElement.setSecondElement();
            String sColor = secondObject.getString("color");
            String text = secondObject.getString("value");
            int color = Color.parseColor(sColor);
            
            Rect elementFrame = mainElement.getFrameRect();
            secondElement = new KpiElement(getHalfWidth(), getSecondaryHeight(elementFrame.height()), color, text);
            secondElement.setPos((int)getHalfWidth(), elementFrame.top);

            if (secondObject.has("title")) {
                sColor = secondObject.getString("titleColor");
                text =   secondObject.getString("title");
                color = Color.parseColor(sColor);
                secondTitle = new KpiElement(getHalfWidth(), getSecondaryTitleHeight(elementFrame.height()), color, text);
            }
        }
    }

    private void createMainTitle(JSONObject jsonObject) throws JSONException {
        JSONObject mainObject = jsonObject.getJSONObject("main");
        if (mainObject.has("title")) {
            float titleHeight = Math.min(toPx(25), (this.height * 0.20f) - toPx(8));
            titleHeight = Math.max(toPx(10), titleHeight);
            float mainHeight = (this.height * 0.80f) + toPx(4);
            String sColor = mainObject.getString("titleColor");
            String text =   mainObject.getString("title");

            int color = Color.parseColor(sColor);
            if (mainTitle == null) {
                mainTitle = new KpiElement(width, titleHeight, color, text);
            } else {
                mainTitle.set(width, titleHeight, color, text);
            }
            mainElement.setDims(width, mainHeight);
            mainElement.centerFrom(mainFrame, (int)titleHeight + (int)toPx(16));
            mainElement.setMaxTextSize(mainElement.getHeight() - mainTitle.getHeight() - toPx(16));
            float th = mainTitle.getTextHeight() + toPx(16);
            mainTitle.setPos(0, (int)(mainElement.getTop() - th));
            if (secondElement != null) {
                mainElement.setDims(getHalfWidth(), mainHeight);
                secondElement.setDims(getHalfWidth(), getSecondaryHeight(mainElement.getComputedBounds().height()));
            }
        }
    }

    @Override
    public void draw(Canvas canvas) {
        canvas.drawARGB(255, 255, 255, 255);
        if (mainTitle != null) {
            if (secondElement == null) {
                mainElement.drawAt(canvas, false);
            } else {
              center(canvas);
              mainElement.drawLeft(canvas);
              Rect m = mainElement.getFrameRect();
              int secondTop = m.bottom - secondElement.getFrameRect().height() - (int)mainElement.getTextHeight() / 2 + (int)secondElement.getTextHeight() / 2;
              secondElement.setPos(m.left + m.width(), secondTop);
              secondElement.drawRight(canvas, (int)toPx(8));
              if(secondTitle != null) {
                int secondTitleTop = secondTop + secondElement.getFrameRect().height();
                secondTitle.setPos(m.left + m.width(), secondTitleTop);
                secondTitle.drawRightVCentered(canvas, (int)toPx(8));
              }
            }
            int th = (int)mainTitle.getHeight();
            int top = (int)toPx(6);
            if (th < 56 ) {
              top = (int)toPx(56-th) / 2;
            }
            mainTitle.setPos(0, top);
            // calc top
            mainTitle.drawAt(canvas, true);

        } else if (secondElement != null) {
            mainElement.setPos(0, mainFrame.top - (int)(mainElement.getTextHeight() * 0.5f));
            secondElement.setDims(getHalfWidth(), getSecondaryHeight(mainElement.getComputedBounds().height()));
            center(canvas);
            mainElement.drawLeft(canvas);
            Rect m = mainElement.getFrameRect();
            int secondTop = m.bottom - secondElement.getFrameRect().height() - (int)mainElement.getTextHeight() / 2 + (int)secondElement.getTextHeight() / 2;
            secondElement.setPos(m.left + m.width(), secondTop);
            secondElement.drawRight(canvas, (int)toPx(8));
            if(secondTitle != null) {
                int secondTitleTop = secondTop + secondElement.getFrameRect().height();
                secondTitle.setPos(m.left + m.width(), secondTitleTop);
                secondTitle.drawRightVCentered(canvas, (int)toPx(8));
            }
        }
        else if (mainElement != null ){
            mainElement.drawCenter(canvas);
        }
    }

    private void center(Canvas canvas) {
        int totalWidth = mainElement.getComputedBounds().width();
        int secondWidth = 0;
        if (secondElement != null) {
            secondWidth = secondElement.getComputedBounds().width();
        }
        if (secondTitle != null) {
            secondWidth = Math.max(secondWidth, secondTitle.getComputedBounds().width());
        }
        totalWidth += secondWidth;
        canvas.getClipBounds(mainFrame);
        float x = (mainFrame.width() /2  - totalWidth/2) / 4;
        mainElement.setLeft(x);

    }



    @Override
    public void update(int color, int stroke, float strokeWidth) {

    }

    @Override
    public boolean hitTest(PointF point) {
        return false;
    }
}
