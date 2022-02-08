package com.reactnativecarbon;

import android.graphics.Paint;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.graphics.Rect;
import android.text.TextPaint;
import android.text.TextUtils;

import com.facebook.react.bridge.ReadableMap;

import org.json.JSONException;

public class TextObject extends DecodableObject{

    protected FontObject fontObject = new FontObject();
    protected TextPaint textPaint = new TextPaint();

    public FontObject getFontObject() {
        return fontObject;
    }

    protected TextPaint createTextPaint(String text, int fill) {
        if (fillPaint == null) {
            textPaint.setStyle(Paint.Style.FILL);
            textPaint.setAntiAlias(true);
            textPaint.setColor(fill);
            fillPaint = textPaint;
            return textPaint;
        }
        return (TextPaint)fillPaint;
    }

    public  void setFill(int color) {
        if (fillPaint != null) {

            fillPaint.setColor(color);
        }
    }

    public CharSequence getCharSequence() {
        CharSequence txt = TextUtils.ellipsize(text, (TextPaint)fillPaint, fontObject.maxWidth, TextUtils.TruncateAt.END);
        return txt;
    }

    public TextPaint getTextPaint() {
        return textPaint;
    }

    TextObject(ReadableMap from, int fill, int stroke, float strokeWidth) throws JSONException {

        if (from.hasKey("text")) {
            text = from.getString("text");
            if (from.hasKey("boudingRect")) {
                ReadableMap boundingRectObject = from.getMap("boundingRect");
                if (boundingRectObject != null) {
                    buildBoundingRect(boundingRectObject);
                }
            }

            this.textPaint = createTextPaint(text, fill);

            ReadableMap fontObjectMap = from.getMap("font");
            buildFontObject(fontObjectMap);

            if (from.hasKey("transform")) {
                parseTransform(from.getString("transform"));
            }
        }
    }

    protected void buildBoundingRect(ReadableMap obj) throws JSONException {
        float x = (float) obj.getDouble("x");
        float y = (float) obj.getDouble("y");
        float w = (float) obj.getDouble("width");
        float h = (float) obj.getDouble("height");
        RectF boundingRect = new RectF(x * mScale, y * mScale, (x + w) * mScale, (y + h) * mScale);
        transform.preTranslate(boundingRect.left, boundingRect.bottom - boundingRect.height() * 0.25f);
    }

    protected void buildFontObject(ReadableMap obj ) throws JSONException {

        if (obj.hasKey("fontSize")) {
            fontObject.fontSize = (float) obj.getDouble("fontSize") * mScale;
            textPaint.setTextSize(fontObject.fontSize);
        }
        if (obj.hasKey("fontFamily")) {
            String fontFamily = obj.getString("fontFamily");
            String[] fonts = fontFamily.split(",");
            Typeface t = null;
            int index = 0;
            while (t == null && index < fonts.length) {
                t = Typeface.create(fonts[index], Typeface.NORMAL);
            }
            if (t != null) {
                textPaint.setTypeface(t);
            }
        }
        Rect bounds = new Rect();
        textPaint.getTextBounds(this.text, 0, this.text.length(), bounds);
        int maxWidth = Math.max(bounds.width(), (int)(fontObject.maxWidth * mScale));

        if (obj.hasKey("x")) {
            fontObject.x = (float) obj.getDouble("x") * mScale;
        }
        if (obj.hasKey("y")) {
            fontObject.y = (float) obj.getDouble("y") * mScale;
        }

        if(obj.hasKey("dx")) {
            fontObject.x += (float)obj.getDouble("dx") * mScale;
        }

        if(obj.hasKey("dy")) {
            fontObject.y += (float)obj.getDouble("dy") * mScale;
        }

        // override max width here
        if (obj.hasKey("maxWidth")) {
            fontObject.maxWidth = (float)obj.getDouble("maxWidth") * mScale;
        }

        if(obj.hasKey("wordBreak")) {
            fontObject.wordBreak = true;
        }

        if (obj.hasKey("anchor")) {
            String anchor = obj.getString("anchor");
            if (anchor.compareTo("middle") == 0) {
                textPaint.setTextAlign(Paint.Align.CENTER);
            }
            if (anchor.compareTo("start") == 0) {
                textPaint.setTextAlign(Paint.Align.LEFT);
            }
            if (anchor.compareTo("end") == 0) {
                textPaint.setTextAlign(Paint.Align.RIGHT);
            }

        }
        if (obj.hasKey("baseline")) {
            fontObject.baseline = obj.getString("baseline");
            if (fontObject.baseline.compareTo("text-before-edge") == 0) {
                fontObject.y -= fillPaint.ascent();
            } else if (fontObject.baseline.compareTo("middle") == 0 || fontObject.baseline.compareTo("central") == 0) {
                fontObject.y -= (fillPaint.descent() + fillPaint.ascent()) * 0.5; // add half x-height
            }
        } else  {
            fontObject.y -= (fillPaint.descent() + fillPaint.ascent()) * 0.5;
        }
    }
}
