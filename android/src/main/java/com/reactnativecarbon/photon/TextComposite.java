package com.reactnativecarbon.photon;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.os.Build;
import android.text.Layout;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.text.TextUtils;
import android.widget.TextView;

import androidx.annotation.RequiresApi;

import com.reactnativecarbon.FontObject;
import com.reactnativecarbon.TextObject;


public class TextComposite extends Composite {
    private TextObject textObject = null;
    private TextView textView = null;
    private Paint fillPaint = null;
    private StaticLayout staticLayout = null;
    private int shapeId = -1;
    TextComposite(int shapeId) {
    }

    public int getShapeId() {
        return this.shapeId;
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    public void addTextObject(TextObject textObject) {

        this.textObject = textObject;
        if (this.textObject.getFontObject().wordBreak) {
            TextPaint paint = textObject.getTextPaint();
            FontObject fontObject = textObject.getFontObject();
            StaticLayout.Builder builder = StaticLayout.Builder.obtain(textObject.text,
                    0,
                    textObject.text.length(),
                    paint,
                    (int)textObject.getFontObject().maxWidth );
            builder.setAlignment(Layout.Alignment.ALIGN_NORMAL);
            builder.setIncludePad(false);
            builder.setEllipsize(TextUtils.TruncateAt.END);
            float y = fontObject.y + (paint.ascent() - paint.descent() * 0.5f);
            textObject.getTransform().postTranslate(fontObject.x, y);
            staticLayout = builder.build();
        } else {
            staticLayout = null;
        }


    }

    public void setFill(int color) {
        if (textObject != null) {
            textObject.setFill(color);
        }
    }

    @Override
    public void update(int fill, int stroke, float strokeWidth) {
        fillPaint = textObject.getFillPaint();
        if (fillPaint != null) {
            fillPaint.setColor(fill);

        }

    }

    @Override
    public boolean hitTest(PointF point) {
        return false;
    }

    @Override
    public void draw(Canvas canvas) {

        FontObject fontObject = textObject.getFontObject();

        if(this.staticLayout != null) {
            canvas.save();
            canvas.concat(textObject.getTransform());
            staticLayout.draw(canvas);
            canvas.restore();;
        } else {
            canvas.save();
            canvas.concat(textObject.getTransform());
            CharSequence sequence = textObject.getCharSequence();
            canvas.drawText(sequence, 0, sequence.length(), fontObject.x, fontObject.y, textObject.getFillPaint() );
            canvas.restore();

        }
    }
}
