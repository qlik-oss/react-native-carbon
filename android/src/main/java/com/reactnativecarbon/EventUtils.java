package com.reactnativecarbon;

import android.view.View;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

public class EventUtils {
    public static void sendEventToJSFromView(View contextView, String eventName, WritableMap event) {
        if (contextView != null) {
            ReactContext context = (ReactContext) contextView.getContext();
            // here the documentation is still using the old receiveEvent, so not sure what to use????
            context.getJSModule(RCTEventEmitter.class).receiveEvent(contextView.getId(), eventName, event);
        }
    }
}
