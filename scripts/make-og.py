"""Generate the default Open Graph image (1200x630) for the site.

Run: python scripts/make-og.py
Requires Pillow (available in the DSH bundled Python). Output: public/og/default.png
"""
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1200, 630
BG = (11, 15, 20)
FG = (230, 237, 243)
MUTED = (154, 167, 178)
ACCENT = (88, 166, 255)
GOLD = (214, 168, 74)
TEAL = (45, 196, 180)

base = Image.new("RGB", (W, H), BG)

overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)


def glow(cx, cy, radius, color, strength=0.55):
    steps = 60
    for i in range(steps):
        f = i / steps
        r = radius * (1 - f)
        alpha = int(255 * strength * f ** 2)
        od.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))


glow(930, 130, 430, GOLD, 0.5)
glow(170, 560, 380, TEAL, 0.35)
glow(620, 700, 480, ACCENT, 0.35)
overlay = overlay.filter(ImageFilter.GaussianBlur(70))
base = Image.alpha_composite(base.convert("RGBA"), overlay)

# Faint grid, faded towards the edges with a radial mask.
grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(grid)
for x in range(0, W, 56):
    gd.line([(x, 0), (x, H)], fill=(230, 237, 243, 18), width=1)
for y in range(0, H, 56):
    gd.line([(0, y), (W, y)], fill=(230, 237, 243, 18), width=1)
mask = Image.new("L", (W, H), 0)
md = ImageDraw.Draw(mask)
md.ellipse([-260, -260, W + 260, H + 260], fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(160))
grid.putalpha(Image.composite(grid.getchannel("A"), Image.new("L", (W, H), 0), mask))
base = Image.alpha_composite(base, grid)

# Vignette: darken the edges with a blurred inverted radial mask.
vign = Image.new("L", (W, H), 0)
vd = ImageDraw.Draw(vign)
vd.ellipse([140, 70, W - 140, H - 70], fill=255)
vign = vign.filter(ImageFilter.GaussianBlur(200))
vig = Image.new("RGBA", (W, H), (5, 8, 12, 0))
vig.putalpha(Image.eval(vign, lambda v: int(120 * (1 - v / 255))))
base = Image.alpha_composite(base, vig)

d = ImageDraw.Draw(base)

font_brand = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 34)
font_role = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 23)
font_head = ImageFont.truetype("C:/Windows/Fonts/msyhbd.ttc", 84)
font_small = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 21)
font_tiny = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 17)

x = 96
d.text((x, 72), "warm", font=font_brand, fill=FG)
brand_w = d.textlength("warm", font=font_brand)
d.ellipse([x + brand_w + 10, 92, x + brand_w + 20, 102], fill=ACCENT)

d.text((x, 156), "全栈开发者 / VIBE CODER", font=font_role, fill=ACCENT)
d.text((x, 224), "把想法变成", font=font_head, fill=FG)
d.text((x, 330), "能用的产品", font=font_head, fill=MUTED)

d.text((x, 512), "个人作品集 · 项目 · 联系", font=font_small, fill=MUTED)
domain = "vibe-coding-personal-protfolio-webs.vercel.app"
dw = d.textlength(domain, font=font_tiny)
d.text((W - 96 - dw, 522), domain, font=font_tiny, fill=(120, 134, 148))

d.rectangle([x, 470, x + 64, 474], fill=ACCENT)

base.convert("RGB").save("public/og/default.png", "PNG", optimize=True)
print("wrote public/og/default.png")
