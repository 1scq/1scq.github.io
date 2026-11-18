# Chengqi Shi CV

The one-page English CV follows the supplied reference's serif typography,
blue-gray palette, circular portrait, and narrow section-label column.

## Edit and rebuild

- Edit `chengqi-shi-cv.json` for CV content. Text supports ReportLab paragraph
  markup (`<b>`, `<i>`, and `<a href="...">`).
- Run `python3 src/build_cv.py` from the repository root, with `reportlab` and
  `Pillow` installed. The result is `output/pdf/chengqi-shi-cv.pdf`.
- Inspect the rendered PDF, then copy it to `asserts/CV.pdf` to update the
  homepage download.
- The script uses Times New Roman from macOS's Supplemental fonts folder.
  On other systems, set `CV_FONT_DIR` to a folder containing the four Times New
  Roman TTF files named in the script.
- The portrait is read from `asserts/avatar.jpg`.

## Content sources

- Current homepage data: education, active publications, current internships,
  contact details, and awards.
- Existing CV: IAIR internship and skills, with CET-6 updated following author confirmation.
- ScaleLab start date confirmed by the author: February 2026.
- FluxVLA's author list is abbreviated to retain a one-page layout; the author
  order and Chengqi Shi's position are preserved.
- EgoLoAF's title, full author list, and links follow the project page; its
  November 2026 under-review status was supplied by the author.
- The November 2026 LingBot award follows the homepage's existing award entry.
- No GPA, ranking, personal contribution metrics, or qualifications were inferred
  from the reference CV.

The homepage serves the reviewed copy at `asserts/CV.pdf`.
