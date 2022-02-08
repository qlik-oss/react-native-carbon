package com.reactnativecarbon;

import java.util.ArrayList;
import java.util.List;

class PathCommand {
    char commandType = '\0';
    List<Float> args = new ArrayList<>();


    PathCommand(String[] tokens) {
        if (tokens.length > 0) {

            String firstToken = tokens[0].trim();
            if (firstToken.length() > 0) {
                commandType = firstToken.charAt(0);
                if (firstToken.length() > 1) {
                    String rest = firstToken.substring(1);
                    args.add(Float.parseFloat(rest));
                }

                for (int i = 1; i < tokens.length; i++) {
                    String arg = tokens[i].trim();
                    if (arg.length() > 0) {
                        args.add(Float.parseFloat(arg));
                    }
                }
            }
        }
    }

}
