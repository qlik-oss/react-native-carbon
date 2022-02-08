package com.reactnativecarbon;

import android.util.Log;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.reactnativecarbon.photon.Composite;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

public class SelectionsEngine {
    Set<Integer> currentSelections = new HashSet<>();
    public void update(Composite composite) {
        if (composite.getSelectionStatus()) {
            currentSelections.add(composite.getShapeId());
        } else {
            currentSelections.remove(composite.getShapeId());
        }
    }

    public void add(Composite composite) {
        currentSelections.add(composite.getShapeId());
    }

    public void signal(View contextView) {
        Integer[] selected = currentSelections.toArray(new Integer[0]);
        WritableArray selectedArray = Arguments.createArray();
        for(int i = 0; i < selected.length; i++) {
            selectedArray.pushInt(selected[i]);
        }
        WritableMap event = Arguments.createMap();
        event.putArray("selections", selectedArray);
        EventUtils.sendEventToJSFromView(contextView,"onSelection", event);

    }

    public void clear() {
        currentSelections.clear();
    }
}
