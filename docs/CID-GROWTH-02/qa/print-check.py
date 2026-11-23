"""Inspect the actual browser-produced PDFs using the bundled review runtime."""
from pathlib import Path
import json
import pdfplumber
from pypdf import PdfReader

out = Path('docs/CID-GROWTH-02/evidence')
results = []
for name in ['catch-log-a4-landscape.pdf', 'catch-log-no-js.pdf']:
    reader = PdfReader(out / name)
    assert len(reader.pages) == 1
    page = reader.pages[0]
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    assert abs(width * 25.4 / 72 - 297) < 0.2
    assert abs(height * 25.4 / 72 - 210) < 0.2
    text = ' '.join(page.extract_text().split())
    fields = ['Date and time', 'Species', 'Venue', 'Method', 'Bait, lure or fly', 'Weight and unit', 'Length and unit', 'Notes or photo reference']
    for field in fields:
        assert field in text, field
    for unwanted in ['CatchID', 'Google Play', 'analytics', 'http', 'FIELD NOTES', 'Paper or phone']:
        assert unwanted not in text, unwanted
    assert 'Number of fish caught (including zero)' in text
    assert not page.get('/Annots'), 'No links or form annotations in the worksheet'
    with pdfplumber.open(out / name) as pdf:
        table = pdf.pages[0].find_tables()[0]
        # Skia's page rectangle and the trip-note rules can join the detected
        # table. Require exactly six complete eight-cell rows: header + 5 catches.
        complete = [(row, values) for row, values in zip(table.rows, table.extract()) if len(row.cells) == 8 and all(cell is not None for cell in row.cells)]
        rows = [values for _, values in complete]
        assert len(rows) == 6 and all(len(row) == 8 for row in rows)
        assert all(all(not cell for cell in row) for row in rows[1:])
        heights = [round((row.bbox[3]-row.bbox[1])*25.4/72, 2) for row, _ in complete[1:]]
        assert all(h >= 16.5 for h in heights), heights
        assert all(char['x0'] >= 25 and char['x1'] < width-25 and char['top'] >= 25 and char['bottom'] < height-25 for char in pdf.pages[0].chars)
    results.append(dict(file=name, pages=1, widthPt=width, heightPt=height, catchRows=5, columns=8, rowHeightsMm=heights, blankRows=True, excludedSiteChrome=True, textWithinMargins=True, text=text))
assert results[0]['text'] == results[1]['text'], 'JS and no-JS print output contains the same worksheet'
(out / 'print-verification.json').write_text(json.dumps(results, indent=2)+'\n', encoding='utf-8')
print('PASS: both actual print PDFs: one landscape A4 page, five blank 17 mm catch rows, eight fields, separate trip notes, no site chrome, content inside margins.')
