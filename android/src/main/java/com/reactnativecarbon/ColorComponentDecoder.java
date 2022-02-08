package com.reactnativecarbon;

import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Matrix;
import android.graphics.Point;
import android.graphics.RectF;
import android.graphics.Shader;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

public class ColorComponentDecoder {

    private int color = 0;
    private float degree = 0;
    private ColorType colorType = ColorType.Color;
    private float[] gradPositions = null;
    private int[] gradColors = null;

    Point p0 = new Point(1, 1);
    Point p1 = new Point(1, 1);

    public float[] getGradPositions() {
        return gradPositions;
    }

    public int[] getGradColors() {
        return gradColors;
    }

    public float getDegree() {
        return degree;
    }

    class ColorStop {

        int color = 0;
        float position = 0;

        ColorStop(ReadableMap obj) {
            ReadableMap c = obj.getMap("color");
            ReadableArray colors = c.getArray("colors");
            color = ColorComponentDecoder.this.getColor(colors);
            position = (float) obj.getDouble("offset");
        }

        public float getPosition() {
            return position;
        }

        public int getColor() {
            return color;
        }
    }

    ColorComponentDecoder(ReadableMap obj) {
        String colorType = obj.getString("type");
        if (colorType.compareTo("color") == 0) {
            ReadableArray colors = obj.getArray("colors");
            color = getColor(colors);
        } else {
            this.colorType = ColorType.Gradient;
            if (obj.hasKey("degree")) {
                this.degree = (float) obj.getDouble("degree");
            }
            ReadableArray stops = obj.getArray("stops");
            gradColors = new int[stops.size()];
            gradPositions = new float[stops.size()];

            for (int i = 0; i < stops.size(); i++) {
                ColorStop colorStop = new ColorStop(stops.getMap(i));
                gradColors[i] = colorStop.getColor();
                gradPositions[i] = colorStop.getPosition();
            }
        }
    }


    public ColorType getColorType() {
        return colorType;
    }

    public int getColor() {
        return color;
    }

    public LinearGradient getLinearGradient(Point p0, Point p1) {
        double rad = Math.toRadians(degree + 180);
        this.p0.x = (int)Math.abs(this.p0.x * Math.cos(rad));
        this.p1.x = (int)Math.abs(this.p1.x * Math.cos(rad));
        this.p1.y = (int)Math.abs(this.p1.y * Math.sin(rad));

        return new LinearGradient(p0.x * this.p0.x,
                0,
                p1.x * this.p1.x,
                p1.y * this.p1.y,
                gradColors,
                gradPositions,
                Shader.TileMode.CLAMP);
    }


    private int getColor(ReadableArray arr) {
        float r = (float)arr.getDouble(0);
        float g = (float)arr.getDouble(1);
        float b = (float)arr.getDouble(2);
        float a = (float)arr.getDouble(3);
        return Color.argb(a, r, g, b);
    }
}
