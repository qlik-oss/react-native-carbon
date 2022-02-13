package com.reactnativecarbon;

import android.content.Context;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.Nullable;
import com.reactnativecarbon.photon.LayerSurfaceView;

public class QRNLayer extends FrameLayout {
    LayerSurfaceView root = null;
    boolean lasso = false;
    QRNLayer(Context context) {
        super(context);
    }

    public QRNLayer(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public QRNLayer(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setLasso(boolean value) {
        if (root != null) {
            root.setLasso(value);
        }
    }

    public void addRoot(LayerSurfaceView view) {
        root = view;
        view.setContextView(this);
        this.addView(view);
        view.layout(0, 0, this.getWidth(), this.getHeight());
    }

   


}
