package com.reactnativecarbon.photon;


import static com.facebook.react.bridge.UiThreadUtil.runOnUiThread;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapShader;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.PixelFormat;
import android.graphics.PointF;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.Rect;
import android.graphics.Shader;
import android.util.Log;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.reactnativecarbon.EventUtils;
import com.reactnativecarbon.PixelUtils;
import com.reactnativecarbon.SelectionsEngine;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingDeque;;
import java.util.concurrent.BlockingDeque;

public class LayerSurfaceView extends SurfaceView implements SurfaceHolder.Callback, Runnable {
    private SurfaceHolder holder;
    private Thread drawThread;
    private boolean surfaceReady = false;
    private boolean drawingActive = false;
    private static final String LOGTAG = "surface";
    private BlockingDeque<Task> taskQueue = new LinkedBlockingDeque<Task>();
    private List<LayerElement> elements = Collections.synchronizedList(new ArrayList<>());
    private Bitmap presentBitmap = null;
    private Canvas presentCanvas = null;
    private Paint presentPaint;
    private Paint clearPaint;
    private Rect presentRect;
    private DrawBuffer drawBuffer;
    private DrawBuffer d0;
    private DrawBuffer d1;
    private boolean firstDraw = true;
    private GestureDetector gestureDetector;
    private View contextView;
    String proxyID = "";
    private boolean lasso = false;
    private LassoPaintTask currentLasso = null;
    ExecutorService threadPool = Executors.newFixedThreadPool(16);

    private SelectionsEngine selectionsEngine = new SelectionsEngine();
    class TapListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onDown(MotionEvent motionEvent) {
          sendTouches(motionEvent.getX(), motionEvent.getY());
          return false;
        }
        @Override
        public boolean onSingleTapConfirmed(MotionEvent motionEvent) {
            PointF point = new PointF(motionEvent.getX(), motionEvent.getY());
            handleSingleTap(point);
            return true;
        }

        @Override
        public void onLongPress(MotionEvent motionEvent) {
          PointF point = new PointF(motionEvent.getX(), motionEvent.getY());
          WritableMap event = Arguments.createMap();
          WritableArray positions = Arguments.createArray();
          positions.pushDouble(PixelUtils.pxToDp(point.x));
          positions.pushDouble(PixelUtils.pxToDp(point.y));
          event.putArray("touches", positions);
          EventUtils.sendEventToJSFromView(contextView, "onLongPress", event);
        }
    }

    public String getProxyID() {
        return proxyID;
    }

    public void setLasso(boolean value) {
        this.lasso = value;
    }
    
    public void setContextView(View view) {
      this.contextView = view;
    }

    public LayerSurfaceView(Context context, String proxyID) {
        super(context);
        this.proxyID = proxyID;
        SurfaceHolder holder = getHolder();
        holder.setFormat(PixelFormat.TRANSPARENT);
        holder.addCallback(this);

        gestureDetector = new GestureDetector(getContext(), new TapListener());
    }

    public void handleSingleTap(PointF point) {
        try {
            SelectionTapTask task = new SelectionTapTask(point, this);
            taskQueue.put(task);
        } catch (InterruptedException exception) {
            Log.d(LOGTAG, "exe");
        }
    }

    @Override
    public boolean onTouchEvent(MotionEvent e) {
        if (!lasso) {
//            if(e.getAction() == MotionEvent.ACTION_DOWN) {
//                sendTouches(e.getX(), e.getY());
//            }
            gestureDetector.onTouchEvent(e);
        } else {
            if(e.getAction() == MotionEvent.ACTION_DOWN) {
                PointF point = new PointF(e.getX(), e.getY());
                StartLassoTask startLassoTask = new StartLassoTask(point);
                currentLasso = new LassoPaintTask(point, this);
                try {
                    taskQueue.put(startLassoTask);
                } catch (InterruptedException exception) {
                    exception.printStackTrace();
                }
            }
            if(e.getAction() == MotionEvent.ACTION_MOVE) {
                if (currentLasso != null) {
                    PointF point = new PointF(e.getX(), e.getY());
                    currentLasso.addPoint(point);
                    try {
                        taskQueue.put(currentLasso);
                    } catch (InterruptedException exception) {
                        exception.printStackTrace();
                    }
                }
            }
            if (e.getAction() == MotionEvent.ACTION_UP || e.getAction() == MotionEvent.ACTION_CANCEL) {
                if (currentLasso != null) {
                    currentLasso.end(new PointF(e.getX(), e.getY()));
                    try {
                        taskQueue.put(currentLasso);
                        completeLassoSelection();
                    } catch (InterruptedException exception) {
                        exception.printStackTrace();
                    }
                }
            }
        }
        return true;
    }

    private void sendTouches(float x, float y) {
        View contextView = this.contextView;

        threadPool.execute(() -> {
           PointF point = new PointF(x, y);
           WritableMap event = Arguments.createMap();
           WritableArray positions = Arguments.createArray();
           positions.pushDouble(PixelUtils.pxToDp(point.x));
           positions.pushDouble(PixelUtils.pxToDp(point.y));
           event.putArray("touches", positions);
           EventUtils.sendEventToJSFromView(contextView, "onTouchesBegan", event);
        });
    }

    public void add(LayerElement element) {
        element.setQueue(taskQueue);
        element.setParent(this);
        elements.add(element);
    }

    public void removeLayer(LayerElement element) {
        elements.remove(element);
    }

    public void render(Canvas canvas) {
        for(LayerElement element: elements) {
            element.draw(canvas);
        }
    }

    public void draw() {
        try {
            RenderTask task = new RenderTask(this, false);
            taskQueue.put(task);
        } catch (InterruptedException exception) {
            Log.d(LOGTAG, "exe");
        }
    }
    
    public void clearScreen() {
      try {
        RenderTask task = new RenderTask(this, true);
        taskQueue.put(task);
      } catch (InterruptedException exception) {
        Log.d(LOGTAG, "exe");
      }
    }

    public void hitTest(PointF point) {
        for(LayerElement element : elements) {
            element.toggleSelection(point, selectionsEngine);
        }
        selectionsEngine.signal(contextView);
    }

    public void lassoSelect(PointF pointF) {
        threadPool.execute(new Runnable() {
            @Override
            public void run() {
                for(LayerElement element : elements) {
                    element.select(pointF, selectionsEngine);
                }
            }
        });
    }

    public void completeLassoSelection() {
        if(currentLasso != null) {
           threadPool.execute(new Runnable() {
                @Override
                public void run() {
                    for(LayerElement element : elements) {
                        element.completeSelection(currentLasso.selectionShape, selectionsEngine);
                    }
                    selectionsEngine.signal(contextView);
                }
            });
        }
    }
    public void clearSelections() {
        selectionsEngine.clear();
    }

    @Override
    public void surfaceCreated(SurfaceHolder surfaceHolder) {
        this.holder = surfaceHolder;
        if (drawThread != null) {
            try{
                drawThread.join();
            } catch (InterruptedException e) {
                Log.d(LOGTAG, "Interupted");
            }
        }
        createSurfaces(surfaceHolder);
        surfaceReady = true;

        Log.d(LOGTAG, "Started.");
    }

    private void createSurfaces(SurfaceHolder surfaceHolder) {
        Rect newRect = surfaceHolder.getSurfaceFrame();
        boolean frameUpdated = presentRect == null || newRect.width() != presentRect.width() || newRect.height() != presentRect.height();
        if (presentBitmap == null || frameUpdated) {
            Rect rect = surfaceHolder.getSurfaceFrame();
            presentBitmap = Bitmap.createBitmap(rect.width(), rect.height(), Bitmap.Config.ARGB_8888);
            presentCanvas = new Canvas(presentBitmap);
            presentPaint = new Paint();
            clearPaint = new Paint();
            clearPaint.setStyle(Paint.Style.FILL);
            clearPaint.setColor(Color.WHITE);
            clearPaint.setXfermode(new PorterDuffXfermode(PorterDuff.Mode.CLEAR));
            presentRect = rect;
            presentPaint.setShader(new BitmapShader(presentBitmap, Shader.TileMode.CLAMP, Shader.TileMode.CLAMP));
            d0 = new DrawBuffer(rect.width(), rect.height());
            d1 = new DrawBuffer(rect.width(), rect.height());
            drawBuffer = d0;
        }
    }

    public void startDrawThread() {
        if (surfaceReady && drawThread == null) {
            drawThread = new Thread(this, "Carbon render thread");
            drawingActive = true;
            drawThread.start();
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {
        Canvas canvas = holder.lockCanvas();
        if (canvas != null) {

            createSurfaces(surfaceHolder);
            if (firstDraw) {
                canvas.drawARGB(255, 255, 255, 255);
                draw();
            } else {
                drawBuffer.draw(canvas);
            }
            holder.unlockCanvasAndPost(canvas);
            startDrawThread();
            Log.d(LOGTAG, "Started.");
        }

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder surfaceHolder) {
        Canvas canvas = holder.lockCanvas();

        stopDrawThread();
        if (canvas != null) {
            holder.unlockCanvasAndPost(canvas);
        }
        holder.getSurface().release();
        this.holder = null;
        surfaceReady = false;
        Log.d(LOGTAG, "destroyed");
    }

    public void stopDrawThread()
    {
        drawingActive = false;
        if (drawThread == null)
        {
            Log.d(LOGTAG, "DrawThread is null");
            return;
        }
        while (true)
        {
            try
            {
                taskQueue.put(new QuitTask());
                Log.d(LOGTAG, "Request last frame");
                drawThread.join(5000);
                break;
            } catch (Exception e) {
                Log.e(LOGTAG, "Could not join with draw thread");
            }
        }
        drawThread = null;
    }


    @Override
    public void run() {
        Log.d(LOGTAG, "Thread started");
        List<Task> pending = new ArrayList<>();
        while (drawingActive) {
            if(holder == null) {
                return;
            }

            try {
                Task task = taskQueue.take();
                if (task != null && !task.quite() ) {
//                    taskQueue.drainTo(pending);
                        Canvas canvas = holder.lockCanvas();
                        if (task.clearsScreen()) {
                          drawBuffer.clear();
                        }
                        task.execute(drawBuffer.getCanvas());
                        if (canvas != null && drawingActive) {
                            try {
//                                if (ta)
                                drawBuffer.draw(canvas);
                            } finally {
                                holder.unlockCanvasAndPost(canvas);
                            }
                        }

                }
            } catch (InterruptedException exception) {
                Log.d(LOGTAG, "Thread interrupted");
            }
        }
        Log.d(LOGTAG, "Thread ended");
    }

    public void resize(float x, float y, float width, float height) {
        if (!elements.isEmpty()) {
            LayerElement element = elements.get(0);
            element.resize(x, y, width, height);
            draw();
        }
    }

    public boolean some() {
        for(LayerElement element : elements) {
            if (element.some()) {
                return true;
            }
        }
        return false;
    }

}
