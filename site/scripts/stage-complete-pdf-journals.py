#!/usr/bin/env python3
"""Build a faithful on-site reading copy of ALL already-public CR PDF journals.

The byte-identical original PDF is always the authoritative visual record,
including 100% of pages, tables, photos and screenshots. The native selectable
text is transcribed page by page; PDF-to-text can flatten tables and columns.
No OCR, invented data, rephrasing or unreviewed separate screenshot publishing.
"""
import argparse
import hashlib
import html
import json
import re
import shutil
from pathlib import Path
import fitz

GITHUB="https://github.com/EtiDavid/Nova-Corp/blob/main/docs/Documentation/Change-Requests/"

def sha(data):
    return hashlib.sha256(data).hexdigest()

def title(name):
    raw=name.replace(".pdf","").replace("_"," ").replace("CORRECTED","(corrected)")
    hit=re.search(r"CR[- ]0?(\d+)",raw,re.I)
    if hit:
        suffix=re.sub(r"^.*?CR[- ]0?\d+[ -]*","",raw,flags=re.I).strip(" -—")
        return f"CR-{int(hit.group(1)):03d} — {suffix or 'Original change request record'}"
    return raw

def caption(native,page):
    for line in native.splitlines():
        line=re.sub(r"\s+"," ",line).strip()
        if 10<=len(line)<=110 and not line.lower().startswith("page "):
            return html.escape(line[:95],quote=True)
    return f"Original page {page}"

def create(source,content,public):
    if not source.is_dir():
        raise RuntimeError("Missing original public journal PDFs: "+str(source))
    files=sorted(source.glob("*.pdf"))
    if len(files)!=14:
        raise RuntimeError(f"Source inventory changed: expected 14 original PDF journals, found {len(files)}; review before publishing")
    for directory in (content,public):
        if directory.exists():
            shutil.rmtree(directory)
        directory.mkdir(parents=True)
    manifest=[]
    for file in files:
        raw=file.read_bytes()
        if not raw.startswith(b"%PDF"):
            raise RuntimeError(f"Not a PDF: {file}")
        pdfhash=sha(raw)
        original=GITHUB+file.name
        text_pages=[]
        sourcePages=[]
        chars=0
        images=0
        with fitz.open(stream=raw,filetype="pdf") as pdf:
            count=len(pdf)
            for index,page in enumerate(pdf):
                pnum=index+1
                native=page.get_text("text",sort=True)
                if not native.strip():
                    raise RuntimeError(f"Unextractable native text page {pnum} in {file.name}; manual review needed")
                blocks=sum(block.get("type")==1 for block in page.get_text("dict")["blocks"])
                images+=blocks
                chars+=len(native)
                text_pages.append(
                  f'<details class="native-pdf-page" id="page-{pnum}">\n'
                  f'<summary><span>Page {pnum} / {count}</span> — {caption(native,pnum)}</summary>\n'
                  f'<p class="native-pdf-page-actions"><a href="/pdf-journals/{file.name}#page={pnum}" target="_blank" rel="noopener noreferrer">View exact original PDF page with all images and layout ↗</a></p>\n'
                  f'<pre class="pdf-native-source-text">{html.escape(native).replace(chr(10), "&#10;").replace(chr(13), "&#13;")}</pre>\n'
                  '</details>\n'
                )
                sourcePages.append({"page":pnum,"nativeTextCharacters":len(native),"originalImageBlocks":blocks})
        shutil.copyfile(file,public/file.name)
        if sha((public/file.name).read_bytes())!=pdfhash:
            raise RuntimeError(f"Original bytes changed: {file.name}")
        metadata=[
         "title: "+json.dumps(title(file.name),ensure_ascii=False),
         "originalName: "+json.dumps(file.name),
         "sourceUrl: "+json.dumps(original),
         "pageCount: "+str(count),
         "originalSha256: "+json.dumps(pdfhash),
         "nativeTextCharacters: "+str(chars),
         "originalImageBlocks: "+str(images)
        ]
        body="\n".join([
         "# Original engineering record: "+title(file.name),
         "",
         "> **Source-faithful PDF reading copy.** The complete original journal, including screenshots and tables, remains available in the full PDF viewer. The native selectable text is reproduced below for **every original page** without paraphrasing. Some PDF text extraction flattens columns or tables; use the exact PDF page to verify formatting and visual evidence.",
         "",
         "**Original:** ["+file.name+"]("+original+") · **Original PDF pages:** "+str(count)+" · **Native text characters:** "+f"{chars:,}"+" · **Original embedded image blocks:** "+str(images)+" · **SHA-256:** "+pdfhash,
         "",
         "## Page-by-page native-text transcription",
         "",
         "Expand any page to see its original native text. Each page also links to its exact PDF visual, including all screenshots and diagrams.",
         "",
         "\n".join(text_pages)
        ])
        (content/(file.stem+".md")).write_text("---\n"+"\n".join(metadata)+"\n---\n\n"+body,encoding="utf-8")
        manifest.append({
          "slug":file.stem,"name":file.name,"title":title(file.name),
          "sourcePath":"docs/Documentation/Change-Requests/"+file.name,
          "sourceUrl":original,"reader":"/journals/"+file.stem+"/",
          "sitePdf":"/pdf-journals/"+file.name,
          "sha256":pdfhash,"pages":count,"nativeTextCharacters":chars,
          "originalImageBlocks":images,"nativePages":sourcePages
        })
        print(f"Faithful PDF: {file.name}: {count} pages, {chars} native text chars, {images} image blocks")
    manifest_obj={
      "description":"All original public Nova Corp change-request PDF journals, exact SHA-256 bytes, original full-page visual and non-paraphrased native text.",
      "count":len(manifest),"totalOriginalPages":sum(v["pages"] for v in manifest),
      "totalNativeCharacters":sum(v["nativeTextCharacters"] for v in manifest),
      "totalOriginalImageBlocks":sum(v["originalImageBlocks"] for v in manifest),
      "journals":manifest
    }
    (public/"manifest.json").write_text(json.dumps(manifest_obj,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(f"Original PDF mirror complete: {len(manifest)} journals / {manifest_obj['totalOriginalPages']} pages / {manifest_obj['totalOriginalImageBlocks']} embedded image blocks.")

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--source",type=Path,default=Path("../docs/Documentation/Change-Requests"))
    parser.add_argument("--content",type=Path,default=Path("src/content/pdfJournals"))
    parser.add_argument("--public",type=Path,default=Path("public/pdf-journals"))
    options=parser.parse_args()
    create(options.source.resolve(),options.content.resolve(),options.public.resolve())
