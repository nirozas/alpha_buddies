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

function buildSymmetrical(id, name, palette, centerVerts, rightVerts, rightFaces, bgRegions = []) {
  const regions = [...bgRegions];
  const allRightVerts = { ...centerVerts, ...rightVerts };
  const leftVerts = {};
  for (const key in rightVerts) {
    leftVerts[key] = [400 - rightVerts[key][0], rightVerts[key][1]];
  }
  const allLeftVerts = { ...centerVerts, ...leftVerts };

  for (let i = 0; i < rightFaces.length; i++) {
    const face = rightFaces[i];
    const colorId = face[face.length - 1];
    const vertNames = face.slice(0, face.length - 1);
    
    regions.push(makePoly(vertNames.map(n => allRightVerts[n]), id + 'r' + i, colorId));

    let isCenterEdge = true;
    for (const n of vertNames) if (!centerVerts[n]) isCenterEdge = false;
    if (!isCenterEdge) {
      regions.push(makePoly(vertNames.map(n => allLeftVerts[n]), id + 'l' + i, colorId));
    }
  }
  return { id, name, palette, regions };
}

const bgs = (c1, c2, c3, c4) => [
  { id: 'bg1', colorId: c1, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
  { id: 'bg2', colorId: c2, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
  { id: 'bg3', colorId: c3, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
  { id: 'bg4', colorId: c4, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
];

const templates = [];

// 1. Easy Butterfly (Colors: 1=Pink, 2=Purple, 3=DarkBody, 4=Sky, 5=Grass)
templates.push(buildSymmetrical('ez-butterfly', 'Easy Butterfly',
  { 1: '#F472B6', 2: '#C084FC', 3: '#334155', 4: '#BAE6FD', 5: '#86EFAC' },
  { C_Top: [200, 100], C_Mid: [200, 200], C_Bot: [200, 320] },
  { R_WingTopOut: [360, 60], R_WingTopBot: [340, 200], R_WingBotOut: [320, 340] },
  [
    ['C_Top', 'R_WingTopOut', 'R_WingTopBot', 1],
    ['C_Top', 'R_WingTopBot', 'C_Mid', 2],
    ['C_Mid', 'R_WingTopBot', 'R_WingBotOut', 1],
    ['C_Mid', 'R_WingBotOut', 'C_Bot', 2],
    ['C_Top', 'C_Mid', 'C_Bot', 3] // center body (drawn over)
  ],
  bgs(4, 4, 5, 5)
));

// 2. Easy Frog (Colors: 1=LightGreen, 2=DarkGreen, 3=Yellow, 4=BlackEye, 5=Water)
templates.push(buildSymmetrical('ez-frog', 'Easy Frog',
  { 1: '#4ADE80', 2: '#16A34A', 3: '#FDE047', 4: '#0F172A', 5: '#7DD3FC' },
  { C_Top: [200, 120], C_Mid: [200, 180], C_Mouth: [200, 240], C_Bot: [200, 320] },
  { R_EyeTop: [260, 80], R_EyeOut: [300, 140], R_Cheek: [320, 240] },
  [
    ['C_Top', 'R_EyeTop', 'R_EyeOut', 2],
    ['C_Top', 'R_EyeOut', 'C_Mid', 1],
    ['C_Mid', 'R_EyeOut', 'R_Cheek', 2],
    ['C_Mid', 'R_Cheek', 'C_Mouth', 1],
    ['C_Mouth', 'R_Cheek', 'C_Bot', 3]
  ],
  bgs(5, 5, 5, 5)
));

// 3. Easy Cat (Colors: 1=Orange, 2=LightOrange, 3=Pink, 4=BlackNose, 5=Bg)
templates.push(buildSymmetrical('ez-cat', 'Easy Cat',
  { 1: '#F97316', 2: '#FDBA74', 3: '#F472B6', 4: '#1E293B', 5: '#E0E7FF' },
  { C_Top: [200, 140], C_Mid: [200, 200], C_Nose: [200, 240], C_Bot: [200, 300] },
  { R_EarTop: [280, 60], R_EarBot: [260, 140], R_Cheek: [320, 220] },
  [
    ['C_Top', 'R_EarTop', 'R_EarBot', 3], // Inner ear
    ['C_Top', 'R_EarBot', 'C_Mid', 1],
    ['C_Mid', 'R_EarBot', 'R_Cheek', 1],
    ['C_Mid', 'R_Cheek', 'C_Nose', 2],
    ['C_Nose', 'R_Cheek', 'C_Bot', 2]
  ],
  bgs(5, 5, 5, 5)
));

// 4. Easy Tulip (Colors: 1=Red, 2=Pink, 3=GreenLeaf, 4=GreenStem, 5=Sky)
templates.push(buildSymmetrical('ez-tulip', 'Easy Tulip',
  { 1: '#EF4444', 2: '#F472B6', 3: '#4ADE80', 4: '#16A34A', 5: '#BAE6FD' },
  { C_Tip: [200, 80], C_Base: [200, 220], C_StemBot: [200, 400] },
  { R_PetalTop: [260, 60], R_PetalMid: [280, 160], R_LeafTip: [340, 280], R_StemSide: [215, 300] },
  [
    ['C_Tip', 'R_PetalTop', 'R_PetalMid', 1],
    ['C_Tip', 'R_PetalMid', 'C_Base', 2],
    ['C_Base', 'R_StemSide', 'C_StemBot', 4],
    ['R_StemSide', 'R_LeafTip', 'C_StemBot', 3]
  ],
  bgs(5, 5, 5, 5)
));

// 5. Easy Heart (Colors: 1=Red, 2=DarkRed, 3=PinkBg)
templates.push(buildSymmetrical('ez-heart', 'Easy Heart',
  { 1: '#EF4444', 2: '#B91C1C', 3: '#FCE7F3' },
  { C_Dip: [200, 140], C_Mid: [200, 200], C_Tip: [200, 360] },
  { R_Top: [280, 60], R_Side: [360, 160] },
  [
    ['C_Dip', 'R_Top', 'R_Side', 1],
    ['C_Dip', 'R_Side', 'C_Mid', 1],
    ['C_Mid', 'R_Side', 'C_Tip', 2]
  ],
  bgs(3, 3, 3, 3)
));

// 6. Easy Sun (Colors: 1=Yellow, 2=Orange, 3=Sky)
templates.push(buildSymmetrical('ez-sun', 'Easy Sun',
  { 1: '#FDE047', 2: '#F97316', 3: '#7DD3FC' },
  { C_TopR: [200, 40], C_Top: [200, 120], C_Bot: [200, 280], C_BotR: [200, 360] },
  { R_RayOut: [360, 200], R_RayDiag: [320, 80], R_RayDiagBot: [320, 320], R_EdgeTop: [260, 140], R_EdgeMid: [280, 200], R_EdgeBot: [260, 260] },
  [
    ['C_TopR', 'R_RayDiag', 'R_EdgeTop', 2],
    ['R_RayDiag', 'R_RayOut', 'R_EdgeMid', 2],
    ['R_RayOut', 'R_RayDiagBot', 'R_EdgeBot', 2],
    ['C_Top', 'R_EdgeTop', 'C_Bot', 1],
    ['R_EdgeTop', 'R_EdgeMid', 'C_Bot', 1],
    ['R_EdgeMid', 'R_EdgeBot', 'C_Bot', 1]
  ],
  bgs(3, 3, 3, 3)
));

// 7. Easy Star (Colors: 1=Yellow, 2=LightYellow, 3=DarkSky)
templates.push(buildSymmetrical('ez-star', 'Easy Star',
  { 1: '#FDE047', 2: '#FEF08A', 3: '#1E293B' },
  { C_Top: [200, 40], C_Mid: [200, 200], C_Bot: [200, 320] },
  { R_ArmTop: [260, 160], R_ArmOut: [360, 160], R_LegOut: [320, 360], R_LegIn: [260, 260] },
  [
    ['C_Top', 'R_ArmOut', 'R_ArmTop', 1],
    ['C_Top', 'R_ArmTop', 'C_Mid', 2],
    ['R_ArmTop', 'R_ArmOut', 'R_LegIn', 2],
    ['R_ArmTop', 'R_LegIn', 'C_Mid', 1],
    ['R_LegIn', 'R_LegOut', 'C_Bot', 1],
    ['C_Mid', 'R_LegIn', 'C_Bot', 2]
  ],
  bgs(3, 3, 3, 3)
));

// 8. Easy Crown (Colors: 1=Gold, 2=DarkGold, 3=RedJewel, 4=PurpleBg)
templates.push(buildSymmetrical('ez-crown', 'Easy Crown',
  { 1: '#FDE047', 2: '#EAB308', 3: '#EF4444', 4: '#3B0764' },
  { C_Peak: [200, 80], C_Mid: [200, 220], C_Bot: [200, 320] },
  { R_PeakOut: [340, 100], R_Dip: [260, 180], R_BaseTop: [320, 260], R_BaseBot: [300, 320] },
  [
    ['C_Peak', 'R_PeakOut', 'R_Dip', 1],
    ['C_Peak', 'R_Dip', 'C_Mid', 2],
    ['R_Dip', 'R_PeakOut', 'R_BaseTop', 2],
    ['C_Mid', 'R_Dip', 'R_BaseTop', 1],
    ['C_Mid', 'R_BaseTop', 'C_Bot', 2],
    ['R_BaseTop', 'R_BaseBot', 'C_Bot', 1]
  ],
  bgs(4, 4, 4, 4)
));

// 9. Easy Apple (Colors: 1=Red, 2=DarkRed, 3=GreenLeaf, 4=BrownStem, 5=Bg)
templates.push(buildSymmetrical('ez-apple', 'Easy Apple',
  { 1: '#EF4444', 2: '#B91C1C', 3: '#22C55E', 4: '#78350F', 5: '#FDF4FF' },
  { C_StemTop: [200, 60], C_StemBot: [200, 120], C_Dip: [200, 140], C_Mid: [200, 240], C_Bot: [200, 360] },
  { R_LeafTip: [300, 60], R_LeafMid: [260, 100], R_AppleTop: [320, 140], R_AppleSide: [340, 240], R_AppleBot: [280, 340] },
  [
    ['C_StemBot', 'R_LeafTip', 'R_LeafMid', 3],
    ['C_StemTop', 'R_LeafMid', 'C_StemBot', 4], // Stem is actually center line but we build it symetrically. Let's make it brown.
    ['C_Dip', 'R_AppleTop', 'R_AppleSide', 1],
    ['C_Dip', 'R_AppleSide', 'C_Mid', 2],
    ['C_Mid', 'R_AppleSide', 'R_AppleBot', 1],
    ['C_Mid', 'R_AppleBot', 'C_Bot', 2]
  ],
  bgs(5, 5, 5, 5)
));

// 10. Easy Ice Cream (Colors: 1=Pink, 2=White, 3=Cone, 4=DarkCone, 5=Bg)
templates.push(buildSymmetrical('ez-icecream', 'Easy Ice Cream',
  { 1: '#F472B6', 2: '#FDF4FF', 3: '#FCD34D', 4: '#D97706', 5: '#BAE6FD' },
  { C_Top: [200, 60], C_ScoopBot: [200, 180], C_ConeTip: [200, 360] },
  { R_ScoopSide: [300, 120], R_Drip: [280, 220], R_ConeTop: [260, 200] },
  [
    ['C_Top', 'R_ScoopSide', 'C_ScoopBot', 1],
    ['R_ScoopSide', 'R_Drip', 'C_ScoopBot', 2],
    ['C_ScoopBot', 'R_ConeTop', 'C_ConeTip', 3],
    ['R_ConeTop', 'R_Drip', 'C_ConeTip', 4]
  ],
  bgs(5, 5, 5, 5)
));


let fileContent = fs.readFileSync('src/activities/letters/colorByCodeTemplates.ts', 'utf8');

// The file structure currently is:
// export const TEMPLATES = [
//   ...HAND_CRAFTED,
//   ...JSON.parse('...complex templates...')
// ];
// We will replace `...HAND_CRAFTED,` with `...HAND_CRAFTED,\n  ...JSON.parse('...easy templates...'),`

const easyTemplatesString = "  ...JSON.parse('" + JSON.stringify(templates).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'),\n";

fileContent = fileContent.replace('...HAND_CRAFTED,', '...HAND_CRAFTED,\n' + easyTemplatesString);

fs.writeFileSync('src/activities/letters/colorByCodeTemplates.ts', fileContent);
