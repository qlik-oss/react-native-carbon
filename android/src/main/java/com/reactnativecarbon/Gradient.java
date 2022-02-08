package com.reactnativecarbon;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Shader;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public class Gradient {
    private float[] gradPositions = null;
    private int[] gradColors = null;
    private float x1 = 0;
    private float y1 = 0;
    private float x2 = 0;
    private float y2 = 1;
    private boolean viewBound = true;

    Gradient(ReadableMap obj, Paint p) {
        ReadableArray stops = obj.getArray("stops");
        gradColors = new int[stops.size()];
        gradPositions = new float[stops.size()];
        if (obj.hasKey("viewBound")) {
            viewBound = obj.getBoolean("viewBound");
        }
        if (obj.hasKey("x1")) {
            x1 = (float) obj.getDouble("x1");
        }
        if (obj.hasKey("y1")) {
            y1 = (float) obj.getDouble("y1");
        }
        if (obj.hasKey("x2")) {
            x2 = (float) obj.getDouble("x2");
        }
        if (obj.hasKey("y2")) {
            y2 = (float) obj.getDouble("y2");
        }
        for (int i = 0; i < stops.size(); i++) {
            ReadableMap stop = stops.getMap(i);
            String colorString = stop.getString("colors");
            float offset = (float) stop.getDouble("offset");
            Double opacity = stop.getDouble("opacity");
            gradColors[i] = Color.parseColor(colorString);
            gradPositions[i] = offset;
            p.setAlpha((int) (255.0 * opacity));
        }
    }

    LinearGradient getShader(Rect r) {
        float _y2 = r.height() * y2;
        if (!viewBound) {
            _y2 *= 0.5;
        }
        return new LinearGradient(r.width() * x1,
                r.height() * y1,
                r.width() * x2,
                _y2,
                gradColors,
                gradPositions,
                Shader.TileMode.REPEAT);
    }
}