#!/usr/bin/env python3
"""Publish only visually selected real screenshots from existing public PDF journals.

Strict source integrity: original PDF SHA, real PDF page, exact image block
and original compressed image SHA must all match the committed review map.
No private files, screenshot creation, OCR, generated substitute or guessed
journal results. Output bytes equal the original PDF image blocks.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
import fitz

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

here=Path(__file__).resolve().parent.parent
repo=here.parent
source=repo/"docs/Documentation/Change-Requests"
approved=here/"src/data/approvedPdfEvidence.json"
dest=here/"public/pdf-evidence"
data=json.loads(approved.read_text(encoding="utf-8"))
images=data["entries"]
dest.mkdir(parents=True,exist_ok=True)
pdfs={}
manifest=[]
for item in images:
    name=item["pdf"]
    if name not in pdfs:
        path=source/name
        if not path.is_file():raise RuntimeError(f"Missing original published PDF {name}")
        raw=path.read_bytes()
        if sha(raw)!=item["pdfSha256"]:raise RuntimeError(f"Journal changed without review: {name}")
        pdfs[name]=fitz.open(path)
    original=pdfs[name]
    page_number=item["page"]
    if not 1<=page_number<=len(original):raise RuntimeError("Invalid PDF page: "+item["id"])
    blocks=original[page_number-1].get_text("dict")["blocks"]
    block_number=item["block"]
    if not 0<=block_number<len(blocks):raise RuntimeError("Invalid PDF screenshot block: "+item["id"])
    block=blocks[block_number]
    if block.get("type")!=1:raise RuntimeError("Not an original image: "+item["id"])
    raw=block.get("image",b"")
    if sha(raw)!=item["sourceImageSha256"]:raise RuntimeError("Screenshot bytes changed or wrong original page: "+item["id"])
    if block.get("ext")!=item["ext"]:raise RuntimeError("Original screenshot extension changed: "+item["id"])
    ext={"jpeg":"jpg","png":"png"}.get(item["ext"])
    if not ext:raise RuntimeError("Unexpected original screenshot encoding: "+item["id"])
    target=dest/(item["id"]+"."+ext)
    target.write_bytes(raw)
    if sha(target.read_bytes())!=sha(raw):raise RuntimeError("Output copy changed: "+item["id"])
    manifest.append({
     "id":item["id"],"image":"/pdf-evidence/"+target.name,
     "pdfSource":"docs/Documentation/Change-Requests/"+name,
     "pdfPage":page_number,"pdfBlock":block_number,
     "pdfSha256":item["pdfSha256"],"originalImageSha256":sha(raw),
     "title":item["title"],"caption":item["caption"],"alt":item["alt"],
     "subject":item["subject"],"classification":item["classification"]
    })
for original in pdfs.values():original.close()
(dest/"manifest.json").write_text(json.dumps({
 "purpose":"Real, individually reviewed, already-public screenshot blocks byte-copied from original Nova Corp change-request PDF journals",
 "source":"checked-out public docs/Documentation/Change-Requests/*.pdf",
 "count":len(manifest),"images":manifest
},indent=2)+"\n",encoding="utf-8")
print(f"Published {len(manifest)} original reviewed PDF screenshots as byte-identical files, from {len(pdfs)} exact source journals.")
