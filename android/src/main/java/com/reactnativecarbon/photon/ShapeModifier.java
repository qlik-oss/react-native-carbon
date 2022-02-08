package com.reactnativecarbon.photon;

import com.reactnativecarbon.ColorComponentDecoder;

public class ShapeModifier {
    float strokeWidth;
    int id ;
    ColorComponentDecoder fill;
    ColorComponentDecoder stroke ;

    public int getId() {
        return id;
    }

    public float getStrokeWidth() {
        return strokeWidth;
    }

    public ColorComponentDecoder getFill() {
        return fill;
    }

    public ColorComponentDecoder getStroke() {
        return stroke;
    }

    public ShapeModifier(int id, float strokeWidth, ColorComponentDecoder fill, ColorComponentDecoder stroke) {
        this.id = id;
        this.strokeWidth = strokeWidth;
        this.fill = fill;
        this.stroke = stroke;
    }

}
