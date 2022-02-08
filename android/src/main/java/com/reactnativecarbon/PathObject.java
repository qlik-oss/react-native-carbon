package com.reactnativecarbon;

import com.facebook.react.bridge.ReadableMap;

import org.json.JSONException;

import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.PointF;
import android.graphics.Path;

import java.util.ArrayList;
import java.util.List;

public class PathObject extends DecodableObject {
    private final List<PathCommand> pathCommandList = new ArrayList<>();
    protected Paint strokePaint = null;
    protected Gradient strokeGradient = null;
    protected Gradient fillGradient = null;
    private float currentX = 0f;
    private float currentY = 0f;
    private PointF currentPen = new PointF(0f, 0f);
    private PointF pivot = new PointF(0f, 0f);
    private Path path = null;

    public Path getPath() {
        return path;
    }

    public Paint getStrokePaint() {
        return strokePaint;
    }

    PathObject(ReadableMap from) throws JSONException {
        if (from.hasKey("stroke")) {
            String colorString = from.getString("stroke");

            float strokeWidth = 1f;
            if (from.hasKey("strokeWidth")) {
                strokeWidth = (float) from.getDouble("strokeWidth");
            }
            strokePaint = new Paint();
            strokePaint.setStrokeWidth(toPx(strokeWidth));
            strokePaint.setStyle(Paint.Style.STROKE);
            strokePaint.setAntiAlias(true);
            strokeGradient = parseColorInto(colorString, strokePaint);
            if (from.hasKey("strokeDasharray")) {
                String dashArray = from.getString("strokeDasharray");
                String[] separated = dashArray.split(",");
                float[] dashArrayValues = new float[separated.length];
                for (int i = 0; i < separated.length; i++) {
                    dashArrayValues[i] = Float.parseFloat(separated[i]) * mScale;
                }
                strokePaint.setPathEffect(new DashPathEffect(dashArrayValues, 0));
            }
        }
        if (from.hasKey("fill")) {
            String colorString = from.getString("fill");
            createFillPaint();
            fillGradient = parseColorInto(colorString, fillPaint);
        }

        if (from.hasKey("path")) {
            String pathString = from.getString("path");
            parsePath(pathString);
            renderPath();
        }
    }

    private Gradient parseColorInto(String colorString, Paint p) {
        try {
            int color = Color.parseColor(colorString);
            p.setColor(color);
        } catch (Exception ex) {
            p.setColor(Color.TRANSPARENT);
        }
        return null;
    }

    private void parsePath(String pathString) {
        // tokenize
        String mPathDel = "(?=[MZLHVCSQTAmzlhvcsqta])";
        String[] tokens = pathString.split(mPathDel);
        for (String token : tokens) {
            String[] commandArray = token.split("[\\s,]+");
            PathCommand pathCommand = new PathCommand(commandArray);
            pathCommandList.add(pathCommand);
        }
    }

    private void renderPath() {
        path = new Path();
        for (PathCommand cmd : pathCommandList) {
            renderCommand(cmd);
        }
    }

    private void renderCommand(PathCommand cmd) {
        switch (cmd.commandType) {
            case 'M':
                setCurrent(cmd.args.get(0), cmd.args.get(1));
                path.moveTo(currentX * mScale, currentY * mScale);
                break;
            case 'L':
                path.lineTo(cmd.args.get(0) * mScale, cmd.args.get(1) * mScale);
                putPenDown(cmd.args.get(0), cmd.args.get(1));
                break;
            case 'h':
                currentX += cmd.args.get(0);
                lineTo();
                break;
            case 'v':
                currentY += cmd.args.get(0);
                lineTo();
                break;
            case 'A':
                svgToArc(cmd.args.get(0),
                        cmd.args.get(1),
                        cmd.args.get(2),
                        cmd.args.get(3),
                        cmd.args.get(4),
                        cmd.args.get(5),
                        cmd.args.get(6));
                break;
            case 'C':
                curve(cmd);
                break;
            case 'S':
            case 'Q':
                shortCubicCurve(cmd);
                break;
            case 'T':
                shortQuad(cmd);
                break;
            case 'Z':
                path.close();
                break;
            default:
                break;
        }
    }

    private void setCurrent(Float x, Float y) {
        currentX = x;
        currentY = y;
        currentPen.x = x;
        currentPen.y = y;
        pivot.x = x;
        pivot.y = y;
    }

    private void putPenDown(Float x, Float y) {
        currentX = x;
        currentY = y;
        currentPen.x = x;
        currentPen.y = y;
    }

    private void lineTo() {
        path.lineTo(currentX * mScale, currentY * mScale);

    }

    private void curve(PathCommand cmd) {
        path.cubicTo(cmd.args.get(0) * mScale,
                cmd.args.get(1) * mScale,
                cmd.args.get(2) * mScale,
                cmd.args.get(3) * mScale,
                cmd.args.get(4) * mScale,
                cmd.args.get(5) * mScale);
        currentPen.x = cmd.args.get(4);
        currentPen.y = cmd.args.get(5);
        pivot.x = cmd.args.get(2);
        pivot.y = cmd.args.get(3);
    }

    private void shortCubicCurve(PathCommand cmd) {
        float x = ((currentPen.x * 2.0f) - pivot.x);
        float y = ((currentPen.y * 2.0f) - pivot.y);
        PointF to = new PointF(cmd.args.get(2), cmd.args.get(3));
        PointF p1 = new PointF(x, y);
        PointF p2 = new PointF(cmd.args.get(0), cmd.args.get(1));
        currentPen = to;
        pivot = p2;
        path.cubicTo(
                p1.x * mScale,
                p1.y * mScale,
                p2.x * mScale,
                p2.y * mScale,
                to.x * mScale,
                to.y * mScale);
    }

    private void shortQuad(PathCommand cmd) {
        float x = ((currentPen.x * 2.0f) - pivot.x);
        float y = ((currentPen.y * 2.0f) - pivot.y);
        PointF p1 = new PointF(x, y);
        PointF p2 = new PointF(cmd.args.get(0), cmd.args.get(1));

        float ex = p2.x;
        float ey = p2.y;
        float c2x = (ex + p1.x * 2f) / 3f;
        float c2y = (ey + p1.y * 2f) / 3f;
        float c1x = (currentPen.x + p1.x * 2f) / 3f;
        float c1y = (currentPen.y + p1.y * 2f) / 3f;

        p1 = new PointF(c1x, c1y);
        p2 = new PointF(c2x, c2y);
        PointF to = new PointF(ex, ey);
        currentPen = to;
        pivot = p2;
        path.cubicTo(
                p1.x * mScale,
                p1.y * mScale,
                p2.x * mScale,
                p2.y * mScale,
                to.x * mScale,
                to.y * mScale);
    }

    private void svgToArc(float rx, float ry, float phi, float fA, float fS, float x2, float y2) {
        // Slightly different than iOS but sill impelments
        // the formulae from the spec
        // https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
        float tX = currentX;
        float tY = currentY;
        float x = x2;
        float y = y2;
        boolean outer = fA == 1.0f;
        boolean clockwise = fS == 1.0f;

        ry = Math.abs(ry == 0 ? (rx == 0 ? (y - tY) : rx) : ry);
        rx = Math.abs(rx == 0 ? (x - tX) : rx);

        if (rx == 0 || ry == 0 || (x == tX && y == tY)) {
            return;
        }

        float rad = (float) Math.toRadians(phi);
        float cosTheta = (float) Math.cos(rad);
        float sinTheta = (float) Math.sin(rad);
        x -= tX;
        y -= tY;

        float cx = cosTheta * x / 2f + sinTheta * y / 2f;
        float cy = -sinTheta * x / 2f + cosTheta * y / 2f;
        float rxry = rx * rx * ry * ry;
        float rycx = ry * ry * cx * cx;
        float rxcy = rx * rx * cy * cy;
        float a = rxry - rxcy - rycx;

        if (a < 0) {
            a = (float) Math.sqrt(1 - a / rxry);
            rx *= a;
            ry *= a;
            cx = x / 2f;
            cy = y / 2f;
        } else {
            a = (float) Math.sqrt(a / (rxcy + rycx));

            if (outer == clockwise) {
                a = -a;
            }
            float cxd = -a * cy * rx / ry;
            float cyd = a * cx * ry / rx;
            cx = cosTheta * cxd - sinTheta * cyd + x / 2;
            cy = sinTheta * cxd + cosTheta * cyd + y / 2;
        }

        float xx = cosTheta / rx;
        float yx = sinTheta / rx;
        float xy = -sinTheta / ry;
        float yy = cosTheta / ry;

        float startAngle = (float) Math.atan2(xy * -cx + yy * -cy, xx * -cx + yx * -cy);
        float endAngle = (float) Math.atan2(xy * (x - cx) + yy * (y - cy), xx * (x - cx) + yx * (y - cy));

        cx += tX;
        cy += tY;
        x += tX;
        y += tY;

        currentX = x;
        currentY = y;

        float start = (float) Math.toDegrees(startAngle);
        float end = (float) Math.toDegrees(endAngle);
        float sweep = Math.abs((start - end) % 360);

        if (outer) {
            if (sweep < 180f) {
                sweep = 360f - sweep;
            }
        } else {
            if (sweep > 180f) {
                sweep = 360f - sweep;
            }
        }

        if (!clockwise) {
            sweep = -sweep;
        }

        RectF oval = new RectF(
                (cx - rx) * mScale,
                (cy - ry) * mScale,
                (cx + rx) * mScale,
                (cy + ry) * mScale);

        path.arcTo(oval, start, sweep);
    }
}
