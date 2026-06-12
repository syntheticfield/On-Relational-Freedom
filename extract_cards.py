#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extrait les pages-diagrammes du PDF source (textes_et_diagrammes.pdf),
recadre automatiquement (suppression des marges blanches) et applique
une correction duotone bleu-violet pour rester fidèle au design
graphique original tout en respectant la palette du site.
"""

import os
from PIL import Image, ImageOps

SRC_DIR = "/home/claude/pages"
OUT_DIR = "/mnt/user-data/outputs/edition-liberte/assets/images/cards"
os.makedirs(OUT_DIR, exist_ok=True)

# couleurs du site
INK    = (0x2e, 0x33, 0xa6)   # #2e33a6
PAPER  = (0xff, 0xff, 0xff)   # blanc

# page (dans textes_et_diagrammes.pdf, 1-indexé) -> id de carte
PAGE_TO_ID = {
    4:  "berlin",
    6:  "davis",
    8:  "kropotkine",
    10: "morin",
    12: "hayles",
    14: "newton",
    16: "berardi",
    18: "combahee",
    20: "steyerl",
    22: "wittig",
    24: "guell",
    26: "blanc",
    28: "lonzi",
    30: "drucker",
    32: "bakunin",
    34: "lorde",
    36: "boss",
    2:  "arendt",
}

# page (texte original) -> id de carte — pour le 3e panneau (verso fidèle au PDF)
TEXT_PAGE_TO_ID = {
    1:  "arendt",
    3:  "berlin",
    5:  "davis",
    7:  "kropotkine",
    9:  "morin",
    11: "hayles",
    13: "newton",
    15: "berardi",
    17: "combahee",
    19: "steyerl",
    21: "wittig",
    23: "guell",
    25: "blanc",
    27: "lonzi",
    29: "drucker",
    31: "bakunin",
    33: "lorde",
    35: "boss",
}

PAD = 24  # marge blanche ajoutée autour du recadrage


def duotone(im_rgb):
    """Mappe une image en niveaux de gris vers un duotone blanc -> bleu-violet."""
    gray = ImageOps.grayscale(im_rgb)
    # léger renforcement du contraste pour préserver les pointillés fins
    gray = ImageOps.autocontrast(gray, cutoff=1)
    lut_r, lut_g, lut_b = [], [], []
    for v in range(256):
        t = 1 - (v / 255.0)  # 0 = blanc, 1 = encre pleine
        lut_r.append(int(PAPER[0] + (INK[0] - PAPER[0]) * t))
        lut_g.append(int(PAPER[1] + (INK[1] - PAPER[1]) * t))
        lut_b.append(int(PAPER[2] + (INK[2] - PAPER[2]) * t))
    r = gray.point(lut_r)
    g = gray.point(lut_g)
    b = gray.point(lut_b)
    return Image.merge("RGB", (r, g, b))


def autocrop(im_rgb, threshold=248):
    """Recadre sur le contenu non-blanc, avec une marge PAD."""
    gray = ImageOps.grayscale(im_rgb)
    # masque : pixels significativement plus sombres que le blanc
    mask = gray.point(lambda v: 255 if v < threshold else 0)
    bbox = mask.getbbox()
    if not bbox:
        return im_rgb
    l, t, r, b = bbox
    l = max(0, l - PAD)
    t = max(0, t - PAD)
    r = min(im_rgb.width, r + PAD)
    b = min(im_rgb.height, b + PAD)
    return im_rgb.crop((l, t, r, b))


def resize(im, max_w=900):
    if im.width > max_w:
        h = int(im.height * max_w / im.width)
        im = im.resize((max_w, h), Image.LANCZOS)
    return im


for page, card_id in PAGE_TO_ID.items():
    src = os.path.join(SRC_DIR, f"td-{page:02d}.png")
    im = Image.open(src).convert("RGB")
    im = autocrop(im)
    im = duotone(im)
    im = resize(im)
    out = os.path.join(OUT_DIR, f"{card_id}.png")
    im.save(out, optimize=True)
    print("wrote", out, im.size)

for page, card_id in TEXT_PAGE_TO_ID.items():
    src = os.path.join(SRC_DIR, f"td-{page:02d}.png")
    im = Image.open(src).convert("RGB")
    im = autocrop(im)
    im = duotone(im)
    im = resize(im)
    out = os.path.join(OUT_DIR, f"{card_id}-text.png")
    im.save(out, optimize=True)
    print("wrote", out, im.size)
