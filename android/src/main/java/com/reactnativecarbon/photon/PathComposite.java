package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.PointF;

import com.reactnativecarbon.PathObject;

import java.util.Stack;

public class PathComposite extends Composite {
    PathObject pathObject = null;
    int shapeId = -1;
    PathComposite(PathObject pathObject, int id) {
        this.shapeId = id;
        addPathObject(pathObject);
    }

    public void addPathObject(PathObject pathObject) {
        this.pathObject = pathObject;
    }

    public void update(int color, int stroke, float strokeWidth){

    }

    @Override
    public boolean hitTest(PointF point) {
        return false;
    }

    public void draw(Canvas canvas) {
        canvas.save();
        canvas.setMatrix(pathObject.getTransform());
        Path path = pathObject.getPath();
        Paint fillPaint = pathObject.getFillPaint();
        Paint strokePaint = pathObject.getStrokePaint();
        if (path != null) {
            if (fillPaint != null) {
                canvas.drawPath(path, fillPaint);
            }
            if (strokePaint != null) {
                canvas.drawPath(path, strokePaint);
            }
        }
        canvas.restore();
    }

}
