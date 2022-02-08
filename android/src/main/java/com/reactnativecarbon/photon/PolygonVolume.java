package com.reactnativecarbon.photon;

import android.graphics.PointF;
import android.graphics.RectF;

import java.util.ArrayList;
import java.util.List;

public class PolygonVolume {
    List<PointF> vertices;
    PolygonVolume() {
        vertices = new ArrayList<>();
    }

    boolean test(RectF rect) {
        PointF topLeft = new PointF(rect.left, rect.top);
        PointF topRight = new PointF(rect.right, rect.top);
        PointF bottomLeft = new PointF(rect.left, rect.bottom);
        PointF bottomRight = new PointF(rect.right, rect.bottom);
        if (test(topLeft)) {
            return true;
        }

        if (test(topRight)) {
            return true;
        }

        if (test(bottomLeft)) {
            return true;
        }

        if (test(bottomRight)) {
            return true;
        }
        return false;
    }

    boolean test(PointF p) {
        boolean collided = false;
        int next = 0;
        for(int i = 0; i < vertices.size(); i++) {
            next++;
            if (next == vertices.size()) {
                next = 0;
            }

            PointF vc = vertices.get(i);
            PointF vn = vertices.get(next);
            if (((vc.y >= p.y && vn.y < p.y) || (vc.y < p.y && vn.y >= p.y)) &&
                    (p.x < (vn.x-vc.x)*(p.y-vc.y) / (vn.y-vc.y)+vc.x)) {
                collided = !collided;
            }
        }
        return collided;
    }
}
