package com.reactnativecarbon;

import android.app.Activity;

import androidx.annotation.NonNull;

import android.os.Looper;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.TypedValue;

import com.facebook.react.bridge.JavaScriptContextHolder;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.UIManagerModule;
import com.reactnativecarbon.photon.Kpi;
import com.reactnativecarbon.photon.LayerElement;
import com.reactnativecarbon.photon.LayerSurfaceView;
import com.reactnativecarbon.photon.ShapeModifier;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.function.Function;


@ReactModule(name = ElementProxyModule.NAME)
public class ElementProxyModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ElementProxy";
    protected HashMap<String, LayerElement> elementMap = new HashMap<>();
    protected HashMap<String, LayerSurfaceView> rootElements = new HashMap<>();

    static {
        try {
            System.loadLibrary("carbon");
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    private native void nativeInstall(long jsi);

    public void installLib(JavaScriptContextHolder reactContext) {
        if(reactContext.get() != 0) {
            this.nativeInstall(reactContext.get());
        }
    }

    ElementProxyHandler handler = null;
    private static ReactApplicationContext reactApplicationContext;
    private float dpScale = 0.0f;
    private DisplayMetrics displayMetrics = null;


    public ElementProxyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactApplicationContext = reactContext;
        dpScale = reactContext.getResources().getDisplayMetrics().density;
        displayMetrics = reactContext.getResources().getDisplayMetrics();
        handler = new ElementProxyHandler(Looper.getMainLooper(), reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    protected void add(LayerElement element) {
        elementMap.put(element.getProxyID(), element);
    }
    protected void add(LayerSurfaceView view) {
        rootElements.put(view.getProxyID(), view);
    }

    protected LayerElement getElement(String pid) {
        return elementMap.get(pid);
    }
    protected LayerSurfaceView getRootElement(String id) {
        return rootElements.get(id);
    }

    protected void remove(LayerElement element) {
        if (elementMap.containsKey(element.getProxyID())) {
            elementMap.remove(element.getProxyID());
        }
    }

    protected void remove(LayerSurfaceView view) {
        if (rootElements.containsKey(view.getProxyID())) {
            rootElements.remove(view.getProxyID());
        }
    }

    private float toPx(float dp) {
        return PixelUtils.dpToPx(dp);
    }

    protected QRNLayer getLayer(int id) {
      try {
        UIManagerModule uiManagerModule = reactApplicationContext.getNativeModule(UIManagerModule.class);
        if (uiManagerModule != null) {
          QRNLayer layer = (QRNLayer) uiManagerModule.resolveView(id);
          return layer;
        }        
      } catch(Exception ex) {
        Log.w("ElementProxyModule", "Could not resolve view group");
      }

      Activity activity = reactApplicationContext.getCurrentActivity();
      return (QRNLayer) activity.findViewById(id);
    }

    private void queueFunction(Function<Void, Void> f) {
        handler.sendMessage(handler.obtainMessage(0, f));
    }

    @ReactMethod
    public void createRootElement(int id, String proxyId) {
        queueFunction((Void) -> {
            QRNLayer layer = getLayer(id);
            if (layer != null) {
                LayerSurfaceView view = new LayerSurfaceView(reactApplicationContext, proxyId);
                add(view);
                layer.addRoot(view);
                
            }
            return null;
        });
    }

    @ReactMethod
    public void clear(String proxyId) {
     
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                element.requestClear();
            }
            return null;
        });

    }

    @ReactMethod
    public void draw(String proxyId) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                element.requestDraw();
            }
            return null;
        });
    }

    @ReactMethod
    public void addRect(String proxyId, int id, String parentId, float x, float y, float width, float height, ReadableMap colors, ReadableMap stroke, float strokeWidth) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                ColorComponentDecoder fillColor = new ColorComponentDecoder(colors);
                ColorComponentDecoder strokeColor = new ColorComponentDecoder(stroke);
                element.addRect(id, parentId, toPx(x), toPx(y), toPx(width), toPx(height), fillColor, strokeColor, toPx(strokeWidth));
            }
            return null;
        });
    }

    @ReactMethod
    public void createChildElement(String id, String proxyId, float x, float y, float width, float height) {
        queueFunction((Void) -> {
            LayerSurfaceView view = getRootElement(id);
            if (view != null) {
                LayerElement element = new LayerElement(proxyId,
                        toPx(x),
                        toPx(y),
                        toPx(width),
                        toPx(height));
                view.add(element);
                add(element);
            }
            return null;
        });
    }
    @ReactMethod
    public void destroyRootElement(String id) {
        queueFunction((Void) -> {
            Log.d(NAME, "destroying root element");
            LayerSurfaceView surfaceView = getRootElement(id);
            if (surfaceView != null) {
                remove(surfaceView);
            }
            return null;
        });
    }

    @ReactMethod
    public void destroy(String id) {
        queueFunction((Void) -> {
            LayerElement element = getElement(id);
            if (element != null) {
                remove(element);
                LayerSurfaceView view = element.getParent();
                view.removeLayer(element);
            }
            return null;
        });
    }

    @ReactMethod
    public void addLine(String proxyId, int id, float x1, float x2, float y1, float y2, ReadableMap stroke, float strokeWidth) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                ColorComponentDecoder strokeColor = new ColorComponentDecoder(stroke);
                element.addLine(id, toPx(x1), toPx(x2), toPx(y1), toPx(y2), strokeColor.getColor(), toPx(strokeWidth));
            }
            return null;
        });
    }

    @ReactMethod
    public  void addCircle(String proxyId, int id, float cx, float cy, float r,  ReadableMap fill,  ReadableMap stroke, float strokeWidth) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                ColorComponentDecoder fillColor = new ColorComponentDecoder(fill);
                ColorComponentDecoder strokeColor = new ColorComponentDecoder(stroke);
                element.addCircle(id, toPx(cx), toPx(cy), toPx(r), fillColor, strokeColor, strokeWidth);
            }
            return null;
        });
    }

    @ReactMethod
    public void addText(String proxyId, int id,
                        ReadableMap textObject,
                        ReadableMap fill,
                        ReadableMap stroke,
                        float strokeWidth) {
        queueFunction((Void) -> {
            try {
                ColorComponentDecoder fillColor = new ColorComponentDecoder(fill);
                ColorComponentDecoder strokeColor = new ColorComponentDecoder(stroke);
                TextObject text = new TextObject(textObject,
                        fillColor.getColor(),
                        strokeColor.getColor(),
                        strokeWidth);
                LayerElement element = getElement(proxyId);
                if (element != null) {
                    element.addTextObject(text, id);
                }
            }catch (Exception ex) {

            }
            return null;
        });
    }

    @ReactMethod
    public void addPath(String proxyId, int id, ReadableMap pathObject) {
        queueFunction((Void) -> {
            try {
                PathObject po = new PathObject(pathObject);
                LayerElement element = getElement(proxyId);
                if (element != null) {
                    element.addPathObject(po, id);
                }
            }catch (Exception ex) {

            }
            return null;
        });
    }

    @ReactMethod
    public void updateShape(String proxyId, int id, ReadableMap colors, ReadableMap strokeColor, float strokeWidth) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                ColorComponentDecoder fill = new ColorComponentDecoder(colors);
                ColorComponentDecoder stroke = new ColorComponentDecoder(strokeColor);
                element.updateShape(id,
                        fill,
                        stroke,
                        strokeWidth);
            }
            return null;
        });
    }

    @ReactMethod
    public void batchUpdate(String proxyId, ReadableArray shapes) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                ArrayList<ShapeModifier> modifiers = new ArrayList<>();
                for(int i = 0; i < shapes.size(); i++) {
                    ReadableType t = shapes.getType(i);
                    if (t == ReadableType.Map) {
                        ReadableMap map = shapes.getMap(i);
                        int id = map.getInt("id");
                        float strokeWidth = (float) map.getDouble("strokeWidth");
                        ColorComponentDecoder fill = new ColorComponentDecoder(map.getMap("colors"));
                        ColorComponentDecoder stroke = new ColorComponentDecoder(map.getMap("strokeColors"));
                        modifiers.add(new ShapeModifier(id, toPx(strokeWidth), fill, stroke));
                    }
                }
                element.updateShapes(modifiers);
            }
            return null;
        });
    }

    @ReactMethod
    public void useCache(String proxyId) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                element.useCache();
            }
            return null;
        });
    }

    @ReactMethod
    public void clearCache(String proxyId) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                element.clearCache();
            }
            return null;
        });
    }

    @ReactMethod
    public void enableMotion(String proxyId, boolean val) {
        // does nothing on android
    }
    
    @ReactMethod
    public void flush(String proxyId) {
        // does nothing on android
    }

    @ReactMethod
    public void disableLoadAnimations(String proxyId) {
        // does nothing on android
    }

    @ReactMethod
    public  void resize(String proxyId, float x, float y, float width, float height) {
        queueFunction((Void) -> {
            LayerElement element = getElement(proxyId);
            if (element != null) {
                element.resize(toPx(x), toPx(y), toPx(width), toPx(height));
            } else {
              LayerSurfaceView view = getRootElement(proxyId);
              if (view != null) {
                view.resize(toPx(x), toPx(y), toPx(width), toPx(height));
              }
            }
            return null;
        });
    }

    @ReactMethod
    public void kpi(String proxyId, String kpiConfig) {
        queueFunction((Void) -> {
            LayerElement layerElement = getElement(proxyId);
            if (layerElement != null) {
                layerElement.kpi(kpiConfig, displayMetrics);
            }
            return  null;
        });
    }

}
