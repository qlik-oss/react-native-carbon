package com.reactnativecarbon;

import android.content.Context;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import androidx.annotation.Nullable;
import com.reactnativecarbon.photon.LayerSurfaceView;

public class QRNLayer extends ViewGroup {
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

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        int childCount = getChildCount();
        for( int i = 0; i < childCount; i++ ){
            View view = getChildAt(i);
            Rect pos = new Rect(0, 0, right-left, bottom-top);
            if(view.getWidth() != 0) {
                pos.right =  view.getWidth();
            }

            if( view.getHeight() != 0 ) {
                pos.bottom = view.getHeight();
            }

            view.layout(0, 0, pos.right, pos.bottom);
        }
    }
}
