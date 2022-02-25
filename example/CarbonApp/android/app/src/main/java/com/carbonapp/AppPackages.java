package com.carbonapp;
import com.facebook.react.bridge.JSIModuleSpec;
import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.List;

// import com.reactnativecarbon.ElementProxyModule;
import com.swmansion.reanimated.ReanimatedJSIModulePackage;

public class AppPackages extends ReanimatedJSIModulePackage {

    @Override
    public List<JSIModuleSpec> getJSIModules(ReactApplicationContext reactApplicationContext, JavaScriptContextHolder jsContext) {
        // reactApplicationContext.getNativeModule(ElementProxyModule.class).installLib(jsContext);
        return super.getJSIModules(reactApplicationContext, jsContext);
    }
}

