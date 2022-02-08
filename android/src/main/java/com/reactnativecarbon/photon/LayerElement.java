package com.reactnativecarbon.photon;

import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.PointF;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.os.Build;
import android.util.DisplayMetrics;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.reactnativecarbon.ColorComponentDecoder;
import com.reactnativecarbon.ColorType;
import com.reactnativecarbon.PathObject;
import com.reactnativecarbon.SelectionsEngine;
import com.reactnativecarbon.TextObject;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.BlockingDeque;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedQueue;
import java.util.function.Function;

public class LayerElement {
    String proxyID = "";
    float x;
    float y;
    float width;
    float height;
    LayerSurfaceView parent;
    Matrix world = new Matrix();
    RectF boundingRect;
    Kpi kpi = null;
    boolean inSelection = false;

    boolean cache = false;
    BlockingDeque<Task> blockingQueue;
    ConcurrentLinkedQueue<Function<Canvas, Boolean> > paintQueue = new ConcurrentLinkedQueue<Function<Canvas, Boolean> >();
    ConcurrentHashMap<Integer, com.reactnativecarbon.photon.Composite> compositeHashMap = new ConcurrentHashMap<Integer, Composite>();
    ConcurrentHashMap<Integer, com.reactnativecarbon.photon.Composite> cacheMap = new ConcurrentHashMap<Integer, com.reactnativecarbon.photon.Composite>();
    ConcurrentHashMap<String, List<Composite>> parentMap = new ConcurrentHashMap<>();

    private final String LOGTAG = "LayerElement";
    private final Paint clearPaint = new Paint();

    public String getProxyID() {
        return proxyID;
    }

    public LayerElement(String proxyID, float x, float y, float width, float height) {
        this.proxyID = proxyID;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        boundingRect = new RectF(0, 0, width,  height);
        world.setTranslate(this.x, this.y);

        clearPaint.setStyle(Paint.Style.FILL);
        clearPaint.setColor(Color.WHITE);
        clearPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));

    }
    
    public void resize(float x, float y, float width, float height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      boundingRect = new RectF(0, 0, width,  height);
      world = new Matrix();
      world.setTranslate(this.x, this.y);
      if( kpi != null) {
        kpi.resize(width, height);
      }
      parent.draw();
    }

    public void setParent(LayerSurfaceView surfaceView) {
        parent = surfaceView;
    }

    public LayerSurfaceView getParent() {
        return parent;
    }

    public void setQueue(BlockingDeque<Task> queue) {
        this.blockingQueue = queue;
    }

    public void addRect(int shapeId,
                        String parentId,
                        float x,
                        float y,
                        float width,
                        float height,
                        ColorComponentDecoder fill,
                        ColorComponentDecoder stroke,
                        float strokeWidth) {

        queFunction((Canvas canvas) -> {
            RectF rect = new RectF(x, y, x + width, y + height);
            com.reactnativecarbon.photon.Composite composite = compositeHashMap.get(shapeId);
            Rectangle shape;
            if (composite == null) {
                shape = new Rectangle(shapeId, rect);
                compositeHashMap.put(shapeId, shape);
                cacheMap.put(shapeId, shape);
            } else {
                shape = (Rectangle) composite;
                shape.setRect(rect);
            }
            shape.setMetrics((int)this.width, (int)this.height);

            if (fill.getColorType() == ColorType.Color) {
                shape.setFill(fill.getColor());
            } else  {
                Point p0 = new Point((int) x, (int) (y + height));
                Point p1 = new Point((int)(x + width), (int)(y + height) );
                shape.setShader(fill.getLinearGradient(p0, p1));
            }

            shape.setStroke(stroke.getColor(), strokeWidth);
            shape.parentId = parentId;
            List<Composite> group = parentMap.get(parentId);
            if (group != null) {
                group.add(shape);
            } else {
                group = new ArrayList<>();
                group.add(shape);
                parentMap.put(parentId, group);
            }
            return false;
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void addTextObject(TextObject textObject, int id) {
        queFunction((Canvas canvas) -> {
            ;
            TextComposite textComposite = null;
            Composite composite = compositeHashMap.get(id);
            if (composite == null) {
                textComposite = new TextComposite(id);
                compositeHashMap.put(id, textComposite);
                cacheMap.put(id,textComposite);
            } else {
                textComposite = (TextComposite) composite;
            }
            textComposite.addTextObject(textObject);
            return true;
        });
    }

    public void addCircle(int shapeId, float cx, float cy, float r,
                          ColorComponentDecoder fill,
                          ColorComponentDecoder stroke, float strokeWidth) {

        queFunction((Canvas canvas) -> {
            Composite composite = compositeHashMap.get(shapeId);
            Circle shape;
            if (composite == null) {
                shape = new Circle(shapeId, cx, cy, r);
                shape.setFill(fill.getColor());
                compositeHashMap.put(shapeId, shape);
                cacheMap.put(shapeId, shape);
            } else {
                shape = (Circle) composite;
                shape.setCircle(cx, cy, r);
                shape.setFill(fill.getColor());
            }
            return true;
        });
    }

    public void addLine(int id, float x1, float x2, float y1, float y2, int stroke, float strokeWidth) {
        queFunction((Canvas canvas) -> {
            Line line = new Line(id, x1, x2, y1, y2);
            line.setStroke(stroke, strokeWidth);
            compositeHashMap.put(id, line);
            cacheMap.put(id, line);
            return  true;
        });
    }

    public void addPathObject(PathObject pathObject, int id) {
        queFunction((Canvas canvas) -> {
            PathComposite pathComposite = new PathComposite(pathObject, id);
            compositeHashMap.put(id, pathComposite);
            cacheMap.put(id, pathComposite);
            return true;
        });
    }

    public void useCache() {
        cache = true;
    }

    public void updateShape(int id,
                            ColorComponentDecoder fill,
                            ColorComponentDecoder stroke,
                            float strokeWidth) {
        queFunction((Canvas canvas) -> {
            Composite composite = cacheMap.get(id);
            if (composite != null) {
                composite.update(fill.getColor(), stroke.getColor(), strokeWidth);
            }
            return false;
        });
    }

    public void updateShapes(ArrayList<ShapeModifier> modifiers) {
        queFunction((Canvas canvas) -> {
            for(ShapeModifier modifier : modifiers) {
                Composite composite = cacheMap.get(modifier.getId());
                if (composite != null) {
                    composite.update(
                            modifier.getFill().getColor(),
                            modifier.getStroke().getColor(),
                            modifier.getStrokeWidth());
                }
            }
            return false;
        });

    }

    public void requestDraw() {
        if (this.blockingQueue != null) {
            try {
                this.blockingQueue.put(new DrawTask(this));
            } catch (InterruptedException ex) {
                Log.d(LOGTAG, ex.toString());
            }
        }
    }

    public void requestClear() {
      if (parent != null) {
        parent.clearScreen();
      }
        queFunction((Canvas canvas) -> {
            inSelection = false;
            compositeHashMap.clear();
            parentMap.clear();
            parent.clearSelections();
            return true;
        });
    }

    public void clearCache() {
        queFunction((Canvas canvas) -> {
            cacheMap.clear();
            parentMap.clear();
            parent.clearSelections();
            return true;
        });
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    public void draw(Canvas canvas) {
        canvas.save();
        canvas.setMatrix(world);

        Object [] operationList = paintQueue.toArray();
        paintQueue.clear();

        for (Object o : operationList) {
            Function<Canvas, Boolean> f = (Function<Canvas, Boolean>)o;
            f.apply(canvas);
        }

        for (Object object : compositeHashMap.values()) {
            Composite comp = (Composite) object;
            comp.draw(canvas);
        }

        for (Object object : cacheMap.values()) {
            Composite comp = (Composite) object;
            comp.draw(canvas);
        }

        if (kpi != null) {
            kpi.draw(canvas);
        }

        canvas.restore();
    }

    public void kpi(String kpiConfig, DisplayMetrics displayMetrics) {
        queFunction((Canvas canvas) -> {
            if (kpi == null) {
                kpi = new Kpi(kpiConfig, this.width, this.height, displayMetrics);
            } else {
                kpi.update(kpiConfig);
            }
            return true;
        });
    }
    
    public boolean hasKpi() {
      return kpi != null;
    }

    private void queFunction(Function<Canvas, Boolean> f) {
        paintQueue.add(f);
    }

    public void toggleSelection(PointF point, SelectionsEngine selectionsEngine) {
        if (!inSelection) {
            for (Object object : compositeHashMap.values()) {
                Composite comp = (Composite) object;
                comp.beginSelection();
            }
            inSelection = true;
        }
        Set<String> pendingSelections = getPendingSelections(point);
        for(String selectedIds: pendingSelections) {
            List<Composite> selectedComponents = parentMap.get(selectedIds);
            if (selectedComponents != null) {
                for(Composite selected : selectedComponents) {
                    selected.toggleSelection();
                    selectionsEngine.update(selected);
                }
            }
        }
    }

    public void select(PointF pointF, SelectionsEngine selectionsEngine) {
        CircleVolume circleVolume = new CircleVolume(pointF, 16.0f);
        Set<String> pendingSelections = getPendingSelections(circleVolume);
        for(String selectedIds: pendingSelections) {
            List<Composite> selectedComponents = parentMap.get(selectedIds);
            if (selectedComponents != null) {
                for(Composite selected : selectedComponents) {
                    selected.setSelected(true);
                    selectionsEngine.add(selected);
                }
            }
        }
    }

    public void completeSelection(PolygonVolume selectionShape, SelectionsEngine selectionsEngine) {
        Set<String> pendingSelections = getPendingSelections(selectionShape);
        for(String selectedIds: pendingSelections) {
            List<Composite> selectedComponents = parentMap.get(selectedIds);
            if (selectedComponents != null) {
                for(Composite selected : selectedComponents) {
                    selected.setSelected(true);
                    selectionsEngine.add(selected);
                }
            }
        }
    }

    @NonNull
    private Set<String> getPendingSelections(PointF point) {
        Set<String> pendingSelections = new HashSet<>();
        for (Object object : compositeHashMap.values()) {
            Composite comp = (Composite) object;
            if (comp.hitTest(point)) {
                pendingSelections.add(comp.parentId);
            }
        }
        return pendingSelections;
    }

    @NonNull
    private Set<String> getPendingSelections(PolygonVolume polygonVolume) {
        Set<String> pendingSelections = new HashSet<>();
        for (Object object : compositeHashMap.values()) {
            Composite comp = (Composite) object;
            if(!comp.selected) {
                if (comp.hitTest(polygonVolume)) {
                    pendingSelections.add(comp.parentId);
                }
            }
        }
        return pendingSelections;
    }

    private Set<String> getPendingSelections(CircleVolume circleVolume) {
        Set<String> pendingSelections = new HashSet<>();
        for (Object object : compositeHashMap.values()) {
            Composite comp = (Composite) object;
            if (!comp.selected) {
                if (comp.hitTest(circleVolume)) {
                    pendingSelections.add(comp.parentId);
                }
            }
        }
        return pendingSelections;
    }
    public boolean some() {
        return cacheMap.size() > 0;
    }


}
