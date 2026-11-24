#!/usr/bin/env python3
"""Audit already-public original engineering PDF journals for candidate screenshots.

CI runs this as an *internal review artifact*, not a public site build step.
No guessed evidence, no OCR, no blind PDF screenshot publishing.
Outputs exact PDF SHA, image xref/page/bbox, image SHA, short surrounding
native page text, and thumbnail contact sheets for explicit human review.
"""
import argparse
import hashlib
import io
import json
import re
from collections import defaultdict
from pathlib import Path
import fitz
from PIL import Image,ImageOps,ImageDraw,ImageFont

def digest(raw): return hashlib.sha256(raw).hexdigest()
def sanitize(name):return re.sub(r"[^A-Za-z0-9_-]","_",name)
def resize(img,max_width=850,max_height=650):
    img.thumbnail((max_width,max_height),Image.Resampling.LANCZOS)
    if img.mode not in ("RGB","RGBA"):img=img.convert("RGB")
    return img
def audit(docs,output):
    output.mkdir(parents=True,exist_ok=True)
    report=[]
    for path in sorted(docs.glob("*.pdf")):
        with fitz.open(path) as doc:
            collection=[]
            seen=set()
            name=sanitize(path.stem)
            folder=output/name
            folder.mkdir(exist_ok=True)
            imageCandidates=[]
            securityHits=[]
            for i in range(len(doc)):
                page=doc[i]
                text=page.get_text("text") or ""
                for term in ("private key","secret","password","api token","wan ip","public ip","myfritz","bearer"):
                    if term in text.lower():securityHits.append({"page":i+1,"term":term})
                items=[]
                # Actual visible image blocks have page coordinates even when
                # Word-generated PDFs share image XObjects on page 1. Using
                # page.get_images(full=True) alone assigns dozens of unused
                # resources to the wrong page; image blocks avoid this.
                for block_number,block in enumerate(page.get_text("dict")["blocks"]):
                    if block.get("type")!=1:continue
                    try:
                        raw=block.get("image",b"")
                        if not raw:continue
                        im=Image.open(io.BytesIO(raw))
                        width,height=im.size
                        if width<360 or height<175 or width*height<100000:continue
                        h=digest(raw)
                        if h in seen:continue
                        seen.add(h)
                        bbox=[round(v,1) for v in block["bbox"]]
                        identifier=f"p{i+1:03d}-b{block_number:03d}"
                        im=resize(im.copy())
                        im=ImageOps.exif_transpose(im)
                        target=folder/(identifier+".jpg")
                        if im.mode=="RGBA":im=Image.alpha_composite(Image.new("RGBA",im.size,(244,244,244,255)),im).convert("RGB")
                        im.save(target,quality=85,optimize=True)
                        items.append({
                          "id":identifier,"pdf":path.name,"page":i+1,
                          "block":block_number,"sourceImageSha256":h,"sourceImageFormat":block.get("ext","unknown"),
                          "size":[width,height],"pdfPageRectangles":[bbox],
                          "thumbnail":name+"/"+target.name,"pageTextStart":text[:1200],
                          "reviewStatus":"UNREVIEWED: DO NOT PUBLISH AS TEST EVIDENCE"
                        })
                    except Exception as e:items.append({"error":f"page {i+1} block {block_number}: {type(e).__name__}: {e}"})
                # Selected real rendered PDF pages are review candidates when
                # journals put screenshots in complex forms/vector layers.
                # Never call a page render a validated test screenshot.
                flags=("restore","recovery","replication","ldap","kerberos","firewall","hash","sysvol","backup","handshake","error","fail","dns")
                matched=[term for term in flags if term in text.lower()]
                if matched and (len([c for c in imageCandidates if c.get("pageRender")])+len([c for c in items if c.get("pageRender")])<14):
                    pix=page.get_pixmap(matrix=fitz.Matrix(1.25,1.25),alpha=False)
                    thumb=Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
                    thumb=resize(thumb,950,1150)
                    target=folder/(f"p{i+1:03d}-page-render.jpg")
                    thumb.save(target,quality=78,optimize=True)
                    items.append({
                     "id":f"p{i+1:03d}-render","pdf":path.name,"page":i+1,
                     "pageRender":True,"sourceImageSha256":None,"size":[pix.width,pix.height],
                     "pdfPageRectangles":[],"thumbnail":name+"/"+target.name,
                     "pageTextStart":text[:1200],"matchingNativeTextTerms":matched,
                     "reviewStatus":"UNREVIEWED FULL PDF PAGE: DO NOT PUBLISH WITHOUT REDACTION"
                    })
                imageCandidates.extend(items)
            record={
              "name":path.name,"pdfSha256":digest(path.read_bytes()),
              "pages":len(doc),"candidateCount":len([v for v in imageCandidates if v.get("thumbnail")]),
              "securityKeywordPages":securityHits[:100],
              "candidates":imageCandidates,
              "warning":"Public repo PDF source is not proof a candidate image is safe for independent web publication. Review/redact and relate to specific test before approving."
            }
            report.append(record)
            tiles=[]
            for c in imageCandidates:
                if "thumbnail" not in c:continue
                im=Image.open(output/c["thumbnail"]).convert("RGB")
                im.thumbnail((350,215),Image.Resampling.LANCZOS)
                tile=Image.new("RGB",(380,268),(248,247,242))
                x=(380-im.width)//2;y=10+(210-im.height)//2
                tile.paste(im,(x,y))
                ImageDraw.Draw(tile).text((11,232),c["id"]+f"  {c['size'][0]}x{c['size'][1]}",fill=(22,23,20))
                tiles.append(tile)
            if tiles:
                cols=3;rows=(len(tiles)+cols-1)//cols
                sheet=Image.new("RGB",(cols*380,rows*268),(220,220,215))
                for n,im in enumerate(tiles):sheet.paste(im,((n%cols)*380,(n//cols)*268))
                sheet.save(output/(name+"-CONTACT-SHEET.jpg"),quality=87,optimize=True)
            print(f"{path.name}: {len(doc)} pages, {record['candidateCount']} large embedded candidate images, {len(securityHits)} keyword hits")
    (output/"PDF-ORIGINAL-IMAGE-REVIEW.json").write_text(json.dumps({
      "purpose":"Audited original already-public PDF journal images; review before publishing",
      "pdfCount":len(report),"candidateCount":sum(v["candidateCount"] for v in report),
      "reports":report},indent=2),encoding="utf-8")
    summary=[
     "# Source PDF screenshot audit — NOT automatically published",
     "Images below were extracted bytewise from original public GitHub PDF journals.",
     "They remain UNREVIEWED candidate evidence until page association, secret redaction, and human visual approval.",
     ""
    ]
    for v in report:summary.append(f"- {v['name']}: {v['pages']} pages / {v['candidateCount']} candidates / {len(v['securityKeywordPages'])} keyword warnings")
    (output/"README.md").write_text("\n".join(summary)+"\n",encoding="utf-8")

if __name__=="__main__":
    ap=argparse.ArgumentParser()
    ap.add_argument("--docs",type=Path,default=Path("../docs/Documentation/Change-Requests"))
    ap.add_argument("--output",type=Path,default=Path("pdf-evidence-review"))
    opt=ap.parse_args()
    audit(opt.docs.resolve(),opt.output.resolve())
