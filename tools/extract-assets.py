import sys, numpy as np, cv2
from PIL import Image, ImageFilter, ImageEnhance
A, OUT, PREV = sys.argv[1], sys.argv[2], sys.argv[3]
MODELS = sys.argv[4]
_sr = {}
def _model(n):
    if n not in _sr:
        m = cv2.dnn_superres.DnnSuperResImpl_create(); m.readModel(f"{MODELS}/EDSR_x{n}.pb"); m.setModel('edsr', n); _sr[n] = m
    return _sr[n]
def superres(rgb, target_w):
    # rgb: numpy RGB uint8. Limpia compresion, EDSR x4 (y x2 si hace falta), enfoque suave.
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    bgr = cv2.fastNlMeansDenoisingColored(bgr, None, 3, 3, 5, 15)
    bgr = _model(4).upsample(bgr)
    if bgr.shape[1] * 1.4 < target_w:
        bgr = _model(2).upsample(bgr)
    bl = cv2.GaussianBlur(bgr, (0,0), 2.0); bgr = cv2.addWeighted(bgr, 1.45, bl, -0.45, 0)
    h = round(bgr.shape[0] * target_w / bgr.shape[1])
    interp = cv2.INTER_AREA if bgr.shape[1] > target_w else cv2.INTER_LANCZOS4
    bgr = cv2.resize(bgr, (target_w, h), interpolation=interp)
    return cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
b = Image.open(f"{A}/394b96fb-image.png").convert('RGB')
m = Image.open(f"{A}/61ba40e3-image.png").convert('RGB')

def up(im, target_w):
    return Image.fromarray(superres(np.asarray(im), target_w))

photos = {
  # name: (src, box, target width)
  'hero-burger':     (m, (540, 0, 1024, 358), 1400),
  'burger-stack':    (m, (18, 925, 245, 1150), 900),
  'burger-wrap':     (m, (250, 925, 425, 1037), 800),
  'fries':           (m, (432, 927, 551, 1027), 700),
  'nuggets':         (m, (250, 1042, 425, 1150), 800),
  'shake-cup':       (m, (430, 1042, 553, 1150), 700),
  'shake-cherry':    (b, (855, 135, 980, 440), 600),
  'catering-tent':   (b, (1024, 262, 1196, 545), 700),
  'storefront':      (b, (1212, 158, 1370, 362), 800),
  'storefront-sign': (m, (357, 455, 575, 555), 900),
  'hand-burger':     (b, (1380, 238, 1534, 440), 700),
  'p-bacon-double':  (b, (21, 763, 132, 880), 560),
  'p-double-cheese': (b, (135, 763, 232, 880), 560),
  'p-classic':       (b, (235, 763, 330, 880), 560),
  'p-fries-cup':     (b, (333, 763, 403, 880), 480),
  'p-onion-rings':   (b, (405, 763, 465, 880), 480),
  'p-shake-choco':   (b, (467, 763, 524, 880), 480),
  'p-shake-straw':   (b, (527, 763, 585, 880), 480),
  'p-shake-splash':  (b, (587, 763, 664, 880), 480),
  'sauces':          (m, (522, 1238, 662, 1372), 700),
  'combo-shack':     (b, (728, 314, 843, 406), 640),
  'g-mascot':        (m, (578, 929, 759, 1147), 700),
  'g-nunca':         (m, (767, 928, 926, 1029), 600),
  'g-cup':           (m, (765, 1035, 855, 1150), 400),
  'g-goodvibes':     (m, (934, 1037, 1005, 1148), 360),
  'g-star':          (m, (934, 928, 1005, 1030), 360),
}
for k, (src, box, w) in photos.items():
    up(src.crop(box), w).save(f"{OUT}/photos/{k}.webp", quality=86)

# --- logo: key out orange from manual top logo → white logo on transparent
logo = m.crop((55, 30, 398, 197))
arr = np.asarray(logo).astype(np.float32)
whiteness = arr.min(axis=2)  # white => high min channel
alpha = np.clip((whiteness - 120) / (230 - 120), 0, 1)
rgba = np.dstack([np.full(arr.shape[:2], 255), np.full(arr.shape[:2], 255), np.full(arr.shape[:2], 255), alpha*255]).astype(np.uint8)
L = Image.fromarray(rgba, 'RGBA'); L = L.resize((L.width*3, L.height*3), Image.LANCZOS)
L.save(f"{OUT}/brand/logo-white.png")

# --- ingredient layers from the checkerboard strip
layers = {
  'top-bun':     (686, 763, 797, 812),
  'sauce':       (801, 760, 916, 806),
  'bacon':       (921, 760, 1066, 806),
  'cheese':      (1071, 760, 1192, 826),
  'patty':       (686, 815, 797, 870),
  'tomato':      (801, 809, 931, 872),
  'lettuce':     (931, 812, 1066, 875),
  'bottom-bun':  (1071, 820, 1192, 875),
}
def cutout(img):
    a = np.asarray(img)
    hsv = cv2.cvtColor(a, cv2.COLOR_RGB2HSV)
    S, V = hsv[...,1].astype(int), hsv[...,2].astype(int)
    fg = ((S > 55) | (V < 150)).astype(np.uint8)
    fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((2,2),np.uint8))
    fg = cv2.morphologyEx(fg, cv2.MORPH_CLOSE, np.ones((5,5),np.uint8))
    # keep components > 3% of the largest
    n, lab, st, _ = cv2.connectedComponentsWithStats(fg)
    if n > 1:
        big = st[1:, cv2.CC_STAT_AREA].max()
        keep = np.zeros_like(fg)
        for i in range(1, n):
            if st[i, cv2.CC_STAT_AREA] > 0.12*big: keep[lab==i] = 1
        fg = keep
    # fill holes
    ff = np.pad(fg, 1); h, w = ff.shape; msk = np.zeros((h+2,w+2),np.uint8)
    cv2.floodFill(ff, msk, (0,0), 1); holes = (ff[1:-1,1:-1]==0); fg[holes] = 1
    # grabcut refine
    gc = np.where(fg==1, cv2.GC_PR_FGD, cv2.GC_PR_BGD).astype(np.uint8)
    er = cv2.erode(fg, np.ones((3,3),np.uint8)); gc[er==1] = cv2.GC_FGD
    di = cv2.dilate(fg, np.ones((5,5),np.uint8)); gc[di==0] = cv2.GC_BGD
    bgd, fgd = np.zeros((1,65)), np.zeros((1,65))
    try:
        cv2.grabCut(cv2.cvtColor(a, cv2.COLOR_RGB2BGR), gc, None, bgd, fgd, 4, cv2.GC_INIT_WITH_MASK)
        fg = np.where((gc==1)|(gc==3), 1, 0).astype(np.uint8)
        whiteish = (S < 40) & (V > 185)
        fg[whiteish] = 0
        fg = cv2.morphologyEx(fg, cv2.MORPH_OPEN, np.ones((3,3),np.uint8))
    except Exception as e:
        print('grabcut fail', e)
    alpha = fg.astype(np.float32)
    # crop to bbox
    ys, xs = np.where(fg > 0)
    y0, y1, x0, x1 = ys.min(), ys.max()+1, xs.min(), xs.max()+1
    rgb = a[y0:y1, x0:x1]; al = alpha[y0:y1, x0:x1]
    # bleed colors into transparent px to avoid halos
    bled = cv2.inpaint(rgb, ((al < 0.5)*255).astype(np.uint8), 3, cv2.INPAINT_TELEA)
    return bled, al
W = 900
for k, box in layers.items():
    rgb, al = cutout(b.crop(box))
    s = W / rgb.shape[1]
    size = (W, round(rgb.shape[0]*s))
    rgb2 = superres(np.ascontiguousarray(rgb), W)
    rgb2 = cv2.resize(rgb2, size, interpolation=cv2.INTER_AREA)
    al2 = cv2.resize(al, size, interpolation=cv2.INTER_LINEAR)
    al2 = cv2.GaussianBlur(al2, (0,0), s*0.5)
    t = np.clip((al2 - 0.35) / 0.3, 0, 1); al2 = t*t*(3-2*t)
    im = Image.fromarray(np.dstack([rgb2, (al2*255).astype(np.uint8)]), 'RGBA')
    im.save(f"{OUT}/layers/{k}.webp", quality=90, lossless=False)
    print(k, im.size)

# preview sheet on dark + checker
sheet = Image.new('RGB', (1900, 900), (32,26,23))
x, y = 20, 20
for k in layers:
    im = Image.open(f"{OUT}/layers/{k}.webp"); im.thumbnail((440, 400))
    sheet.paste(im, (x, y), im)
    x += 470
    if x > 1500: x, y = 20, y + 440
sheet.save(PREV)
