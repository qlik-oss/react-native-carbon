package com.reactnativecarbon;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;

public class QRNLayerManager extends SimpleViewManager<QRNLayer> {
    private static final String REACT_CLASS = "QRNLayer";
    private ReactApplicationContext mCallerContext;

    QRNLayerManager(ReactApplicationContext callerContext) {
        mCallerContext = callerContext;
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public QRNLayer createViewInstance(ThemedReactContext context) {
        return new QRNLayer(context);
    }

    @ReactProp(name="lasso")
    public void setLasso(View view, boolean enabled) {
        QRNLayer layer = (QRNLayer) view;
        layer.setLasso(enabled);
    }
    @Nullable
    @Override
    public Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "onSelection",
            MapBuilder.of("registrationName", "onSelection"),
            "onDoubleTap",
            MapBuilder.of("registrationName", "onDoubleTap"),
            "onTouchesBegan",
            MapBuilder.of("registrationName", "onTouchesBegan"),
            "onLongPress",
            MapBuilder.of("registrationName", "onLongPress")
        );
    }
}
