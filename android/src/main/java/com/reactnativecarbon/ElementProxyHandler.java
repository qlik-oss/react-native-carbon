package com.reactnativecarbon;


import android.app.Activity;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import java.util.HashMap;
import java.util.function.Function;

public class ElementProxyHandler extends Handler {
    private static ReactApplicationContext reactApplicationContext;

    public ElementProxyHandler(Looper looper, ReactApplicationContext context) {
        super(looper);
        this.reactApplicationContext = context;
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    public void handleMessage(Message message) {
        if (message.obj != null) {
            Function<Void, Void> f = (Function<Void, Void>) message.obj;
            f.apply(null);
        }
    }
}
