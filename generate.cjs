const fs = require('fs');

function makePoly(points, idPrefix, colorId) {
  const pts = points.map(p => `${p[0]},${p[1]}`);
  const d = 'M' + pts.join(' L') + ' Z';
  let cx = 0, cy = 0;
  for (const p of points) { cx += p[0]; cy += p[1]; }
  cx = Math.round(cx / points.length);
  cy = Math.round(cy / points.length);
  return { id: idPrefix + '-' + Math.random().toString(36).substr(2, 5), colorId, d, textX: cx, textY: cy };
}

function generateDiamond() {
  const regions = [];
  regions.push({ id: 'bg1', colorId: 1, d: 'M0,0 L200,0 L40,160 L0,160 Z', textX: 40, textY: 40 });
  regions.push({ id: 'bg2', colorId: 1, d: 'M200,0 L400,0 L400,160 L360,160 Z', textX: 360, textY: 40 });
  regions.push({ id: 'bg3', colorId: 2, d: 'M0,160 L40,160 L200,360 L0,400 Z', textX: 60, textY: 340 });
  regions.push({ id: 'bg4', colorId: 2, d: 'M400,160 L360,160 L200,360 L400,400 Z', textX: 340, textY: 340 });
  regions.push(makePoly([[120, 80], [280, 80], [200, 120]], 'cr', 3));
  regions.push(makePoly([[120, 80], [200, 40], [280, 80]], 'cr', 4));
  regions.push(makePoly([[40, 160], [120, 80], [200, 120]], 'cr', 5));
  regions.push(makePoly([[360, 160], [280, 80], [200, 120]], 'cr', 6));
  regions.push(makePoly([[40, 160], [200, 120], [200, 260]], 'bd', 7));
  regions.push(makePoly([[360, 160], [200, 120], [200, 260]], 'bd', 8));
  regions.push(makePoly([[40, 160], [200, 260], [200, 360]], 'bt', 3));
  regions.push(makePoly([[360, 160], [200, 260], [200, 360]], 'bt', 4));
  return { id: 'diamond', name: 'Magic Diamond', palette: { 1: '#0F172A', 2: '#1E293B', 3: '#6EE7B7', 4: '#34D399', 5: '#10B981', 6: '#059669', 7: '#047857', 8: '#064E3B' }, regions };
}

function generateMandala() {
  const regions = [];
  const cx = 200, cy = 200, numRays = 8, radii = [40, 80, 140, 200];
  const colorSets = [[1, 2], [3, 4], [5, 6], [7, 8]];
  regions.push({ id: 'bg1', colorId: 8, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 20, textY: 20 });
  regions.push({ id: 'bg2', colorId: 8, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 380, textY: 20 });
  regions.push({ id: 'bg3', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 20, textY: 380 });
  regions.push({ id: 'bg4', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 380, textY: 380 });
  for (let rIdx = 0; rIdx < radii.length; rIdx++) {
    const rOuter = radii[rIdx], rInner = rIdx === 0 ? 0 : radii[rIdx - 1];
    for (let i = 0; i < numRays; i++) {
      const a1 = (i / numRays) * Math.PI * 2, a2 = ((i + 1) / numRays) * Math.PI * 2;
      const p1 = [cx + rInner * Math.cos(a1), cy + rInner * Math.sin(a1)], p2 = [cx + rOuter * Math.cos(a1), cy + rOuter * Math.sin(a1)];
      const p3 = [cx + rOuter * Math.cos(a2), cy + rOuter * Math.sin(a2)], p4 = [cx + rInner * Math.cos(a2), cy + rInner * Math.sin(a2)];
      const cIdx = (i % 2 === 0) ? colorSets[rIdx][0] : colorSets[rIdx][1];
      regions.push(rInner === 0 ? makePoly([p1, p2, p3], 'md', cIdx) : makePoly([p1, p2, p3, p4], 'md', cIdx));
    }
  }
  return { id: 'mandala', name: 'Sunburst Mandala', palette: { 1: '#FEF08A', 2: '#FDE047', 3: '#FBBF24', 4: '#F59E0B', 5: '#EA580C', 6: '#C2410C', 7: '#9A3412', 8: '#1E293B' }, regions };
}

function generateQuilt() {
  const regions = [], p = { 1: '#EF4444', 2: '#3B82F6', 3: '#10B981', 4: '#F59E0B', 5: '#8B5CF6', 6: '#EC4899', 7: '#14B8A6', 8: '#F97316' };
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = c * 100, y = r * 100, c1 = (r * 4 + c) % 8 + 1, c2 = (r * 4 + c + 1) % 8 + 1, c3 = (r * 4 + c + 2) % 8 + 1, c4 = (r * 4 + c + 3) % 8 + 1;
      regions.push(makePoly([[x, y], [x+100, y], [x+50, y+50]], 'q', c1));
      regions.push(makePoly([[x+100, y], [x+100, y+100], [x+50, y+50]], 'q', c2));
      regions.push(makePoly([[x+100, y+100], [x, y+100], [x+50, y+50]], 'q', c3));
      regions.push(makePoly([[x, y+100], [x, y], [x+50, y+50]], 'q', c4));
    }
  }
  return { id: 'quilt', name: 'Patchwork Quilt', palette: p, regions };
}

function generateSpiderweb() {
  const regions = [], cx = 200, cy = 200, radii = [30, 80, 140, 200];
  regions.push({ id: 'bg1', colorId: 8, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 20, textY: 20 });
  regions.push({ id: 'bg2', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 380, textY: 20 });
  regions.push({ id: 'bg3', colorId: 7, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 20, textY: 380 });
  regions.push({ id: 'bg4', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 380, textY: 380 });
  for (let rIdx = 0; rIdx < radii.length; rIdx++) {
    const rOuter = radii[rIdx], rInner = rIdx === 0 ? 0 : radii[rIdx - 1];
    for (let i = 0; i < 10; i++) {
      const a1 = (i / 10) * Math.PI * 2, a2 = ((i + 1) / 10) * Math.PI * 2;
      const p1 = [cx + rInner * Math.cos(a1), cy + rInner * Math.sin(a1)], p2 = [cx + rOuter * Math.cos(a1), cy + rOuter * Math.sin(a1)];
      const p3 = [cx + rOuter * Math.cos(a2), cy + rOuter * Math.sin(a2)], p4 = [cx + rInner * Math.cos(a2), cy + rInner * Math.sin(a2)];
      const colorId = (i + rIdx) % 6 + 1;
      regions.push(rInner === 0 ? makePoly([p1, p2, p3], 'sw', colorId) : makePoly([p1, p2, p3, p4], 'sw', colorId));
    }
  }
  return { id: 'web', name: 'Rainbow Web', palette: { 1: '#FCA5A5', 2: '#FCD34D', 3: '#86EFAC', 4: '#93C5FD', 5: '#C4B5FD', 6: '#F9A8D4', 7: '#1E293B', 8: '#0F172A' }, regions };
}

function generateIllusion() {
  const regions = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const x = c * 80, y = r * 80, cx = x + 40, cy = y + 40;
      if ((r + c) % 2 === 0) {
        regions.push(makePoly([[x,y], [x+80,y], [cx,cy]], 'il', 1), makePoly([[x+80,y], [x+80,y+80], [cx,cy]], 'il', 2));
        regions.push(makePoly([[x+80,y+80], [x,y+80], [cx,cy]], 'il', 3), makePoly([[x,y+80], [x,y], [cx,cy]], 'il', 4));
      } else {
        regions.push(makePoly([[x,y], [x+80,y], [cx,cy]], 'il', 5), makePoly([[x+80,y], [x+80,y+80], [cx,cy]], 'il', 6));
        regions.push(makePoly([[x+80,y+80], [x,y+80], [cx,cy]], 'il', 7), makePoly([[x,y+80], [x,y], [cx,cy]], 'il', 8));
      }
    }
  }
  return { id: 'illusion', name: 'Optical Illusion', palette: { 1: '#000000', 2: '#FFFFFF', 3: '#000000', 4: '#FFFFFF', 5: '#EF4444', 6: '#3B82F6', 7: '#EF4444', 8: '#3B82F6' }, regions };
}

function generateHexHive() {
  const regions = [], r = 40, w = Math.sqrt(3) * r, h = 2 * r;
  regions.push({ id: 'bg1', colorId: 8, d: 'M0,0 L400,0 L400,200 L0,200 Z', textX: 20, textY: 20 });
  regions.push({ id: 'bg2', colorId: 8, d: 'M0,200 L400,200 L400,400 L0,400 Z', textX: 20, textY: 380 });
  let count = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const cx = col * w + (row % 2 === 1 ? w/2 : 0), cy = row * h * 0.75;
      if (cx > -20 && cx < 420 && cy > -20 && cy < 420) {
        const pts = [];
        for (let i=0; i<6; i++) pts.push([cx + r * Math.cos(i * Math.PI / 3), cy + r * Math.sin(i * Math.PI / 3)]);
        regions.push(makePoly([[cx,cy], pts[0], pts[1], pts[2]], 'hx', (count % 6) + 1));
        regions.push(makePoly([[cx,cy], pts[2], pts[3], pts[4]], 'hx', ((count + 3) % 6) + 1));
        regions.push(makePoly([[cx,cy], pts[4], pts[5], pts[0]], 'hx', 7));
        count++;
      }
    }
  }
  return { id: 'hive', name: 'Hexagon Hive', palette: { 1: '#D97706', 2: '#F59E0B', 3: '#FBBF24', 4: '#FCD34D', 5: '#B45309', 6: '#78350F', 7: '#FEF3C7', 8: '#27272A' }, regions };
}

function generateCrystalPyramid() {
  const regions = [{ id: 'bg', colorId: 8, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 20, textY: 20 }];
  const cx = 200, cy = 200, pts = [], inPts = [];
  for (let i=0; i<6; i++) pts.push([cx + 160 * Math.cos(i * Math.PI / 3), cy + 160 * Math.sin(i * Math.PI / 3)]);
  for (let i=0; i<6; i++) inPts.push([cx + 80 * Math.cos(i * Math.PI / 3), cy + 80 * Math.sin(i * Math.PI / 3)]);
  for(let i=0; i<6; i++) regions.push(makePoly([pts[i], pts[(i+1)%6], inPts[(i+1)%6], inPts[i]], 'py', (i%3)+1));
  for(let i=0; i<6; i++) regions.push(makePoly([inPts[i], inPts[(i+1)%6], [cx,cy]], 'py', (i%3)+4));
  return { id: 'pyramid', name: 'Crystal Pyramid', palette: { 1: '#A78BFA', 2: '#8B5CF6', 3: '#7C3AED', 4: '#C4B5FD', 5: '#DDD6FE', 6: '#EDE9FE', 7: '#F5F3FF', 8: '#0F172A' }, regions };
}

function generateStar() {
  const regions = [{ id: 'bg', colorId: 8, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 20, textY: 20 }], cx = 200, cy = 200, pts = [];
  for(let i=0; i<20; i++) {
    const r = i%2===0 ? 180 : 60, a = (i / 20) * Math.PI * 2;
    pts.push([cx + r * Math.sin(a), cy - r * Math.cos(a)]);
  }
  for(let i=0; i<20; i++) regions.push(makePoly([pts[i], pts[(i+1)%20], [cx,cy]], 'st', (i%7)+1));
  return { id: 'star', name: 'Exploding Star', palette: { 1: '#EF4444', 2: '#F97316', 3: '#F59E0B', 4: '#EAB308', 5: '#84CC16', 6: '#22C55E', 7: '#10B981', 8: '#020617' }, regions };
}

function generateCompass() {
  const regions = [];
  regions.push({ id: 'bg1', colorId: 1, d: 'M0,0 L200,0 L0,200 Z', textX: 40, textY: 40 }, { id: 'bg2', colorId: 2, d: 'M200,0 L400,0 L400,200 Z', textX: 360, textY: 40 });
  regions.push({ id: 'bg3', colorId: 1, d: 'M400,200 L400,400 L200,400 Z', textX: 360, textY: 360 }, { id: 'bg4', colorId: 2, d: 'M0,200 L200,400 L0,400 Z', textX: 40, textY: 360 });
  regions.push({ id: 'bg5', colorId: 3, d: 'M0,200 L200,0 L200,200 Z', textX: 160, textY: 60 }, { id: 'bg6', colorId: 4, d: 'M200,0 L200,200 L400,200 Z', textX: 240, textY: 60 });
  regions.push({ id: 'bg7', colorId: 3, d: 'M400,200 L200,200 L200,400 Z', textX: 240, textY: 340 }, { id: 'bg8', colorId: 4, d: 'M200,400 L200,200 L0,200 Z', textX: 160, textY: 340 });
  const cx = 200, cy = 200, N = [200, 40], S = [200, 360], E = [360, 200], W = [40, 200], NE = [280, 120], SE = [280, 280], SW = [120, 280], NW = [120, 120];
  regions.push(makePoly([[cx,cy], N, NE], 'cp', 5), makePoly([[cx,cy], NE, E], 'cp', 6), makePoly([[cx,cy], E, SE], 'cp', 5), makePoly([[cx,cy], SE, S], 'cp', 6));
  regions.push(makePoly([[cx,cy], S, SW], 'cp', 5), makePoly([[cx,cy], SW, W], 'cp', 6), makePoly([[cx,cy], W, NW], 'cp', 5), makePoly([[cx,cy], NW, N], 'cp', 6));
  return { id: 'compass', name: 'Nautical Compass', palette: { 1: '#0F172A', 2: '#1E293B', 3: '#334155', 4: '#475569', 5: '#FCD34D', 6: '#D97706', 7: '#B45309', 8: '#78350F' }, regions };
}

function generatePinwheel() {
  const regions = [{ id: 'bg', colorId: 8, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 20, textY: 20 }];
  const cx = 200, cy = 200, r = 160;
  for(let i=0; i<6; i++) {
    const a1 = (i/6)*Math.PI*2, a2 = ((i+0.5)/6)*Math.PI*2, a3 = ((i+1)/6)*Math.PI*2;
    const p1 = [cx + r*Math.cos(a1), cy + r*Math.sin(a1)], p2 = [cx + r*Math.cos(a2), cy + r*Math.sin(a2)], p3 = [cx + r*Math.cos(a3), cy + r*Math.sin(a3)];
    regions.push(makePoly([[cx,cy], p1, p2], 'pw', (i%7)+1), makePoly([[cx,cy], p2, p3], 'pw', ((i+1)%7)+1));
  }
  return { id: 'pinwheel', name: 'Spinning Pinwheel', palette: { 1: '#F43F5E', 2: '#D946EF', 3: '#8B5CF6', 4: '#3B82F6', 5: '#0EA5E9', 6: '#10B981', 7: '#F59E0B', 8: '#F8FAFC' }, regions };
}

const templates = [
  generateDiamond(), generateMandala(), generateQuilt(), generateSpiderweb(),
  generateIllusion(), generateHexHive(), generateCrystalPyramid(), generateStar(),
  generateCompass(), generatePinwheel()
];

let fileContent = fs.readFileSync('src/activities/letters/colorByCodeTemplates.ts', 'utf8');
const exportString = "export const TEMPLATES = [\n  ...HAND_CRAFTED,\n  ...JSON.parse('" + JSON.stringify(templates).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "')\n];\n";
fileContent = fileContent.replace(/export const TEMPLATES = \[[\s\S]*$/, '') + exportString;
fs.writeFileSync('src/activities/letters/colorByCodeTemplates.ts', fileContent);
