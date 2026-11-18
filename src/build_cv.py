"""Build the one-page CV. Requires reportlab and Pillow; run from any directory."""

from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import json
import os

ROOT = Path(__file__).resolve().parents[1]
FONT_DIR = Path(os.environ.get("CV_FONT_DIR", "/System/Library/Fonts/Supplemental"))
for face, filename in {
    "CV": "Times New Roman.ttf",
    "CV-Bold": "Times New Roman Bold.ttf",
    "CV-Italic": "Times New Roman Italic.ttf",
    "CV-BoldItalic": "Times New Roman Bold Italic.ttf",
}.items():
    pdfmetrics.registerFont(TTFont(face, str(FONT_DIR / filename)))
pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold", italic="CV-Italic", boldItalic="CV-BoldItalic")

DATA = json.loads((ROOT / "docs/cv/chengqi-shi-cv.json").read_text())
OUT = ROOT / "output/pdf/chengqi-shi-cv.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = A4
LEFT, RIGHT, BODY = 40, W - 40, 137
INK, BLUE, MUTED = "#17212b", "#365f73", "#617080"
c = canvas.Canvas(str(OUT), pagesize=A4)
c.setTitle("Chengqi Shi | Curriculum Vitae")
c.setAuthor("Chengqi Shi")


def paragraph(text, x, top, width, size=10.1, leading=12.1, color=INK, font="CV"):
    style = ParagraphStyle("cv", fontName=font, fontSize=size, leading=leading,
                           textColor=HexColor(color), alignment=TA_LEFT,
                           allowWidows=0, allowOrphans=0)
    p = Paragraph(text, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, top - height)
    return top - height


def link(label, url):
    return f'<a href="{url}" color="{BLUE}">{label}</a>'


def section(title, entries, top):
    c.setFillColor(HexColor(BLUE))
    c.rect(LEFT, top - 13, 2.1, 13, fill=1, stroke=0)
    paragraph(title.upper(), LEFT + 8, top - 1, BODY - LEFT - 20,
              size=9.2, leading=11.1, color=BLUE)
    y = top
    for entry in entries:
        date = entry.get("date")
        if date:
            date_width = pdfmetrics.stringWidth(date, "CV", 9.2)
            paragraph(date, RIGHT - date_width, y - 1, date_width + 1,
                      size=9.2, leading=11, color=MUTED)
        else:
            date_width = 0
        title_width = RIGHT - BODY - date_width - (12 if date else 0)
        y = paragraph(entry["title"], BODY, y, title_width,
                      size=10.4, leading=12.2)
        for line in entry.get("lines", []):
            y = paragraph(line, BODY, y - 2, RIGHT - BODY,
                          size=9.7, leading=11.6)
        y -= entry.get("gap", 4)
    return y + 2


# Circular portrait and compact contact header, following the supplied reference.
photo_x, photo_y, diameter = LEFT, H - 119, 88
c.saveState()
p = c.beginPath()
p.circle(photo_x + diameter / 2, photo_y + diameter / 2, diameter / 2)
c.clipPath(p, stroke=0, fill=0)
c.drawImage(str(ROOT / "asserts/avatar.jpg"), photo_x, photo_y,
            width=diameter, height=diameter, mask="auto")
c.restoreState()
c.setStrokeColor(HexColor(BLUE))
c.setLineWidth(0.6)
c.circle(photo_x + diameter / 2, photo_y + diameter / 2, diameter / 2, stroke=1, fill=0)
y = H - 35
y = paragraph("Chengqi Shi", BODY, y, RIGHT - BODY, size=28, leading=30)
y = paragraph("Undergraduate Student", BODY, y - 2, RIGHT - BODY,
              size=11.5, leading=14, color=BLUE)
y = paragraph("Embodied Intelligence &amp; Humanoid Robotics", BODY, y - 3,
              RIGHT - BODY, size=10.1, leading=12, color=MUTED)
y = paragraph("Xi'an Jiaotong University | Xi'an / Shanghai, China", BODY, y - 3,
              RIGHT - BODY, size=9.8, leading=12, color=BLUE)
y = paragraph(link("cqshi@stu.xjtu.edu.cn", "mailto:cqshi@stu.xjtu.edu.cn")
              + " | " + link("Homepage", "https://1scq.github.io/")
              + " | " + link("GitHub", "https://github.com/lnscq")
              + " | " + link("Google Scholar", "https://scholar.google.com/citations?user=kj8WqooAAAAJ"),
              BODY, y - 3, RIGHT - BODY, size=9.5, leading=12)
y = min(y - 13, H - 136)
c.setStrokeColor(HexColor("#d6dfe5"))
c.setLineWidth(0.6)
c.line(LEFT, y, RIGHT, y)
y -= 16
for item in DATA["sections"]:
    y = section(item["title"], item["entries"], y) - 4
if y < 26:
    raise ValueError(f"CV content overflows the page: bottom={y:.1f}")
c.save()
print(f"Created {OUT}; content bottom: {y:.1f} pt")
