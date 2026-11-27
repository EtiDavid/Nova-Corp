// Draws the social preview image (public/og-image.png, 1200x630) from the Nova line-map look. Run: node scripts/make-og-image.mjs
import { chromium } from "playwright-core";
import { execFileSync } from "node:child_process";
const bin = process.env.CHROME_PATH || execFileSync("which", ["google-chrome"]).toString().trim();
const st = (x, y, label, a = "middle", dy = 38) => `<circle cx="${x}" cy="${y}" r="13" fill="#FFFFFF" stroke="#17202A" stroke-width="5"/><text x="${x}" y="${y + dy}" text-anchor="${a}" font-size="22" font-weight="600" fill="#17202A">${label}</text>`;
const line = (c, d, dash = "") => `<path d="${d}" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" ${dash}/>`;
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;width:1200px;height:630px;background:#FAF8F3;font-family:'IBM Plex Sans',system-ui,Arial,sans-serif;position:relative;overflow:hidden">
<div style="position:absolute;left:70px;top:70px;width:500px">
 <div style="font-size:18px;letter-spacing:.1em;text-transform:uppercase;color:#47525E;font-weight:600">Nova Corp · by David Eti</div>
 <div style="font-size:56px;line-height:1.1;font-weight:700;color:#17202A;margin-top:22px">I built the infrastructure. Then I broke it.</div>
 <div style="font-size:25px;line-height:1.4;color:#47525E;margin-top:26px">Windows Server, Active Directory, pfSense and Proxmox, with the incidents and the proof.</div>
</div>
<svg style="position:absolute;left:600px;top:70px" width="560" height="490" viewBox="0 0 560 490" font-family="IBM Plex Sans, system-ui, Arial, sans-serif">
 ${line("#E69F00", "M60 110 H250")}
 ${line("#CC79A7", "M250 110 V270 H60")}
 ${line("#009E73", "M250 270 H470")}
 ${line("#0072B2", "M60 270 V390 H470 V270")}
 ${line("#56B4E9", "M470 270 V110", 'stroke-dasharray="2 20"')}
 ${st(60, 110, "Workstation", "start", -26)}${st(250, 110, "Firewall", "start", -26)}${st(250, 270, "DC01", "middle", 40)}${st(60, 270, "DC02", "start", -26)}${st(470, 270, "FILES01", "end", 40)}${st(470, 110, "Backups", "end", -26)}${st(265, 390, "PROX01", "middle", 40)}
 <circle cx="355" cy="270" r="22" fill="#B24400"/><text x="355" y="278" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">!</text>
</svg>
<div style="position:absolute;left:70px;bottom:40px;font-size:24px;color:#47525E">novacorp.davideti.dev</div></body>`;
const b = await chromium.launch({ executablePath: bin, args: ["--no-sandbox"] });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html); await p.waitForTimeout(300);
await p.screenshot({ path: "public/og-image.png" }); await b.close(); console.log("wrote public/og-image.png");
