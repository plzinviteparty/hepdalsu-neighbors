#!/usr/bin/env python3
"""Check approved character directional PNGs before registering in the game.
Never automatically cut or key out backgrounds from a multi-character atlas.
Example: python tools/validate-sprite-directions.py down.png left.png right.png up.png
"""
from __future__ import annotations
import sys
from pathlib import Path
from PIL import Image

def validate(paths: list[str]) -> None:
    if len(paths) != 4:
        raise ValueError("Four directional files required: down left right up")
    sizes, anchors = [], []
    for direction, name in zip(("down", "left", "right", "up"), paths):
        file = Path(name)
        if not file.is_file() or file.suffix.lower() != ".png":
            raise ValueError(f"{direction}: separate transparent PNG file required: {name}")
        im = Image.open(file)
        if im.mode != "RGBA":
            raise ValueError(f"{direction}: image must be RGBA, not {im.mode}")
        if max(im.size) > 256 or min(im.size) < 32:
            raise ValueError(f"{direction}: sheet or undersized frame detected: {im.size}")
        alpha = im.getchannel("A")
        box = alpha.getbbox()
        if not box:
            raise ValueError(f"{direction}: frame is empty")
        w, h = im.size
        if box[1] < 1 or box[0] < 1 or box[2] >= w or box[3] >= h:
            raise ValueError(f"{direction}: sprite touches canvas edge; check outline clipping")
        if box[3] < h - 5:
            raise ValueError(f"{direction}: feet are not anchored near bottom")
        opaque = sum(1 for a in alpha.getdata() if a >= 235)
        faint = sum(1 for a in alpha.getdata() if 0 < a < 50)
        if opaque < 200 or opaque > w*h*.65:
            raise ValueError(f"{direction}: suspicious alpha fill; looks like a cutout or sheet")
        if faint > opaque*.4:
            raise ValueError(f"{direction}: too many faint semi-transparent background pixels")
        sizes.append(im.size)
        anchors.append(box[3])
        print(f"{direction}: {w}x{h}, sprite bounds {box}, opaque pixels {opaque}")
    if len(set(sizes)) != 1:
        raise ValueError("Directional files must share an identical canvas size")
    if max(anchors) - min(anchors) > 2:
        raise ValueError("Inconsistent foot anchors across directions")
    print("PASS: alpha edges, dimensions and foot anchors; manual style review still required")

if __name__ == "__main__":
    try:
        validate(sys.argv[1:])
    except (ValueError, OSError) as e:
        print("FAIL:", e, file=sys.stderr)
        sys.exit(1)
