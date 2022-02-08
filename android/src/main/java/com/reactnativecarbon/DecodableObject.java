package com.reactnativecarbon;

import android.graphics.Matrix;
import android.graphics.Paint;
import android.text.TextPaint;
import android.util.Log;
import android.graphics.PorterDuff.Mode;
import android.graphics.PorterDuffXfermode;

import com.facebook.react.uimanager.DisplayMetricsHolder;

public class DecodableObject  {
    protected final float mScale = DisplayMetricsHolder.getScreenDisplayMetrics().density;
    public String text;
    public Matrix transform = new Matrix();

    protected float toPx(float dp) {
        return dp * mScale;
    }

    public Matrix getTransform() {
        return transform;
    }

    public String getText() {
        return text;
    }

    public Paint getFillPaint() {
        return fillPaint;
    }

    protected void createFillPaint() {
        if(fillPaint == null) {
            fillPaint = new Paint();
            fillPaint.setAntiAlias(true);
        }
    }

    protected void parseTransform(String transformString) {
        String[] transforms = transformString.split("\\s(?=\\S+\\(.*?\\))");
        for (int i = 0; i < transforms.length; i++) {
            Log.d("QSVG", "parseTransform: " + transforms[i]);
            String op = transforms[i];
            if (op.startsWith("rotate(")) {
                String start = op.substring("rotate(".length());
                int end = start.indexOf(')');
                String[] argsString = start.substring(0, end).split(",");
                float angle = Float.parseFloat(argsString[0]);
                float px;
                float py;
                if (argsString.length == 3) {
                    px = Float.parseFloat(argsString[1]) * mScale;
                    py = Float.parseFloat(argsString[2]) * mScale;

                    Matrix m = new Matrix();
                    m.preRotate(angle, px, py);
                    m.preConcat(transform);
                    transform = m;
                }
            } else if (op.startsWith("translate")) {
                String start = op.substring("translate(".length());
                int end = start.indexOf(')');
                String[] argsString = start.substring(0, end).split(",");
                if (argsString.length == 2) {
                    float x = Float.parseFloat(argsString[0]) * mScale;
                    float y = Float.parseFloat(argsString[1]) * mScale;
                    Matrix m = new Matrix();
                    m.preTranslate(x, y);
                    m.preConcat(transform);
                    transform = m;
                }
            }
        }
    }

    protected Paint fillPaint = null;

}
