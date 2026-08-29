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
  
  // Create Left Verts by mirroring Right Verts (excluding center)
  const leftVerts = {};
  for (const key in rightVerts) {
    const v = rightVerts[key];
    leftVerts[key] = [400 - v[0], v[1]];
  }
  const allLeftVerts = { ...centerVerts, ...leftVerts };

  for (let i = 0; i < rightFaces.length; i++) {
    const face = rightFaces[i];
    const colorId = face[face.length - 1];
    const vertNames = face.slice(0, face.length - 1);
    
    // Build Right Face
    const ptsR = vertNames.map(n => allRightVerts[n]);
    regions.push(makePoly(ptsR, id + 'r' + i, colorId));

    // Build Left Face
    // If a face is entirely on the center line, don't duplicate it. But faces shouldn't be entirely on the center line.
    let isCenterEdge = true;
    for (const n of vertNames) {
      if (!centerVerts[n]) isCenterEdge = false;
    }
    if (!isCenterEdge) {
      const ptsL = vertNames.map(n => allLeftVerts[n]);
      regions.push(makePoly(ptsL, id + 'l' + i, colorId));
    }
  }

  return { id, name, palette, regions };
}

const templates = [];

// 1. Faceted Fox
templates.push(buildSymmetrical('fox', 'Faceted Fox', 
  { 1: '#EA580C', 2: '#C2410C', 3: '#FFFFFF', 4: '#F3F4F6', 5: '#1F2937', 6: '#0284C7', 7: '#38BDF8' },
  { C_Top: [200, 100], C_Fore: [200, 160], C_MuzTop: [200, 220], C_MuzMid: [200, 260], C_Nose: [200, 300], C_Chin: [200, 340] },
  { R_EarTop: [280, 60], R_EarIn: [230, 140], R_EarOut: [300, 160], R_EyeIn: [220, 220], R_EyeOut: [260, 200], R_SnoutSide: [240, 280], R_Cheek: [280, 280], R_NoseOut: [220, 290] },
  [
    ['C_Top', 'R_EarIn', 'R_EarTop', 1],
    ['R_EarIn', 'R_EarOut', 'R_EarTop', 2],
    ['C_Top', 'C_Fore', 'R_EarIn', 1],
    ['C_Fore', 'R_EyeIn', 'R_EarIn', 2],
    ['R_EarIn', 'R_EyeOut', 'R_EarOut', 1],
    ['R_EarIn', 'R_EyeIn', 'R_EyeOut', 1],
    ['C_Fore', 'C_MuzTop', 'R_EyeIn', 1],
    ['C_MuzTop', 'R_EyeOut', 'R_EyeIn', 2],
    ['R_EyeOut', 'R_Cheek', 'R_EarOut', 1],
    ['C_MuzTop', 'C_MuzMid', 'R_SnoutSide', 1],
    ['C_MuzTop', 'R_SnoutSide', 'R_EyeOut', 1],
    ['R_SnoutSide', 'R_Cheek', 'R_EyeOut', 3],
    ['C_MuzMid', 'C_Nose', 'R_NoseOut', 4],
    ['C_MuzMid', 'R_NoseOut', 'R_SnoutSide', 3],
    ['C_Nose', 'C_Chin', 'R_NoseOut', 5],
    ['R_NoseOut', 'C_Chin', 'R_SnoutSide', 4],
    ['R_SnoutSide', 'C_Chin', 'R_Cheek', 3]
  ],
  [
    { id: 'bg1', colorId: 6, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 7, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 6, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 2. Faceted Bear
templates.push(buildSymmetrical('bear', 'Faceted Bear',
  { 1: '#78350F', 2: '#92400E', 3: '#B45309', 4: '#FDE68A', 5: '#D97706', 6: '#1E293B', 7: '#10B981', 8: '#34D399' },
  { C_Top: [200, 80], C_Fore: [200, 140], C_MuzTop: [200, 200], C_MuzMid: [200, 240], C_Nose: [200, 260], C_Mouth: [200, 280], C_Chin: [200, 320] },
  { R_EarTop: [280, 80], R_EarIn: [240, 120], R_EarOut: [320, 140], R_EyeIn: [230, 180], R_EyeOut: [280, 180], R_CheekHi: [320, 220], R_CheekLo: [300, 280], R_Snout: [240, 240] },
  [
    ['C_Top', 'R_EarIn', 'R_EarTop', 3],
    ['R_EarIn', 'R_EarOut', 'R_EarTop', 2],
    ['C_Top', 'C_Fore', 'R_EarIn', 2],
    ['C_Fore', 'R_EyeIn', 'R_EarIn', 3],
    ['R_EarIn', 'R_EyeOut', 'R_EarOut', 2],
    ['R_EarIn', 'R_EyeIn', 'R_EyeOut', 1],
    ['C_Fore', 'C_MuzTop', 'R_EyeIn', 2],
    ['C_MuzTop', 'R_Snout', 'R_EyeIn', 4],
    ['R_EyeIn', 'R_EyeOut', 'R_Snout', 3],
    ['R_EyeOut', 'R_CheekHi', 'R_EarOut', 1],
    ['R_EyeOut', 'R_CheekHi', 'R_Snout', 2],
    ['C_MuzTop', 'C_MuzMid', 'R_Snout', 5],
    ['C_MuzMid', 'C_Nose', 'R_Snout', 6],
    ['C_Nose', 'C_Mouth', 'R_Snout', 4],
    ['R_Snout', 'R_CheekHi', 'R_CheekLo', 3],
    ['C_Mouth', 'C_Chin', 'R_Snout', 5],
    ['R_Snout', 'C_Chin', 'R_CheekLo', 2]
  ],
  [
    { id: 'bg1', colorId: 7, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 8, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 7, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 3. Faceted Cat
templates.push(buildSymmetrical('cat', 'Faceted Cat',
  { 1: '#64748B', 2: '#94A3B8', 3: '#CBD5E1', 4: '#F472B6', 5: '#FBCFE8', 6: '#1E293B', 7: '#A78BFA', 8: '#C4B5FD' },
  { C_Top: [200, 120], C_Fore: [200, 160], C_NoseTop: [200, 220], C_Nose: [200, 240], C_Mouth: [200, 260], C_Chin: [200, 300] },
  { R_EarTop: [280, 60], R_EarIn: [230, 120], R_EarOut: [320, 140], R_EyeIn: [220, 190], R_EyeOut: [260, 180], R_CheekHi: [300, 220], R_CheekLo: [260, 280], R_Snout: [230, 240] },
  [
    ['R_EarIn', 'R_EarOut', 'R_EarTop', 4],
    ['C_Top', 'R_EarIn', 'R_EarTop', 2],
    ['C_Top', 'C_Fore', 'R_EarIn', 1],
    ['C_Fore', 'R_EyeIn', 'R_EarIn', 2],
    ['R_EarIn', 'R_EyeOut', 'R_EarOut', 1],
    ['R_EarIn', 'R_EyeIn', 'R_EyeOut', 3],
    ['C_Fore', 'C_NoseTop', 'R_EyeIn', 2],
    ['C_NoseTop', 'R_Snout', 'R_EyeIn', 3],
    ['R_EyeIn', 'R_EyeOut', 'R_Snout', 1],
    ['R_EyeOut', 'R_CheekHi', 'R_EarOut', 2],
    ['R_EyeOut', 'R_CheekHi', 'R_Snout', 3],
    ['C_NoseTop', 'C_Nose', 'R_Snout', 4],
    ['C_Nose', 'C_Mouth', 'R_Snout', 5],
    ['R_Snout', 'R_CheekHi', 'R_CheekLo', 2],
    ['C_Mouth', 'C_Chin', 'R_Snout', 3],
    ['R_Snout', 'C_Chin', 'R_CheekLo', 1]
  ],
  [
    { id: 'bg1', colorId: 7, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 8, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 7, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 4. Faceted Turtle
templates.push(buildSymmetrical('turtle', 'Sea Turtle',
  { 1: '#059669', 2: '#10B981', 3: '#34D399', 4: '#6EE7B7', 5: '#065F46', 6: '#0284C7', 7: '#38BDF8', 8: '#BAE6FD' },
  { C_HeadTop: [200, 40], C_Neck: [200, 100], C_ShellTop: [200, 120], C_ShellMid1: [200, 180], C_ShellMid2: [200, 260], C_ShellBot: [200, 320], C_TailBot: [200, 360] },
  { R_Head: [230, 60], R_Neck: [220, 100], R_FlipperTop: [340, 80], R_FlipperMid: [360, 140], R_FlipperBot: [280, 160], R_Shell1: [260, 140], R_Shell2: [280, 220], R_Shell3: [250, 300], R_FootOut: [280, 380], R_FootIn: [230, 350] },
  [
    ['C_HeadTop', 'C_Neck', 'R_Head', 2],
    ['R_Head', 'R_Neck', 'C_Neck', 3],
    ['C_Neck', 'C_ShellTop', 'R_Neck', 1],
    ['R_Neck', 'R_Shell1', 'C_ShellTop', 5],
    ['R_Neck', 'R_FlipperTop', 'R_Shell1', 2],
    ['R_FlipperTop', 'R_FlipperMid', 'R_Shell1', 3],
    ['R_FlipperMid', 'R_FlipperBot', 'R_Shell1', 4],
    ['C_ShellTop', 'C_ShellMid1', 'R_Shell1', 1],
    ['C_ShellMid1', 'C_ShellMid2', 'R_Shell2', 2],
    ['C_ShellMid1', 'R_Shell2', 'R_Shell1', 1],
    ['R_Shell1', 'R_Shell2', 'R_FlipperBot', 5],
    ['C_ShellMid2', 'C_ShellBot', 'R_Shell3', 1],
    ['C_ShellMid2', 'R_Shell3', 'R_Shell2', 2],
    ['C_ShellBot', 'C_TailBot', 'R_FootIn', 3],
    ['C_ShellBot', 'R_FootIn', 'R_Shell3', 2],
    ['R_Shell3', 'R_FootIn', 'R_FootOut', 4],
    ['R_Shell2', 'R_Shell3', 'R_FootOut', 5]
  ],
  [
    { id: 'bg1', colorId: 6, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 7, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 5. Faceted Unicorn
templates.push(buildSymmetrical('unicorn', 'Mystic Unicorn',
  { 1: '#FFFFFF', 2: '#F3F4F6', 3: '#E5E7EB', 4: '#A78BFA', 5: '#F472B6', 6: '#34D399', 7: '#FBBF24', 8: '#FDF4FF' },
  { C_HornTop: [200, 20], C_HornMid: [200, 60], C_HornBot: [200, 100], C_Fore: [200, 140], C_MuzTop: [200, 200], C_MuzMid: [200, 260], C_Nose: [200, 300], C_Chin: [200, 340] },
  { R_HornMid: [215, 60], R_HornBot: [220, 100], R_EarTop: [260, 80], R_EarIn: [230, 130], R_EarOut: [280, 140], R_EyeIn: [220, 190], R_EyeOut: [260, 190], R_Cheek: [280, 260], R_SnoutSide: [240, 280], R_Mane1: [280, 180], R_Mane2: [320, 240] },
  [
    ['C_HornTop', 'C_HornMid', 'R_HornMid', 7],
    ['C_HornMid', 'C_HornBot', 'R_HornBot', 4],
    ['C_HornMid', 'R_HornBot', 'R_HornMid', 5],
    ['C_HornBot', 'C_Fore', 'R_EarIn', 1],
    ['C_HornBot', 'R_EarIn', 'R_HornBot', 2],
    ['R_HornBot', 'R_EarIn', 'R_EarTop', 1],
    ['R_EarIn', 'R_EarOut', 'R_EarTop', 5],
    ['C_Fore', 'R_EyeIn', 'R_EarIn', 2],
    ['R_EarIn', 'R_EyeOut', 'R_EarOut', 1],
    ['R_EarIn', 'R_EyeIn', 'R_EyeOut', 3],
    ['C_Fore', 'C_MuzTop', 'R_EyeIn', 1],
    ['C_MuzTop', 'R_SnoutSide', 'R_EyeIn', 2],
    ['R_EyeIn', 'R_EyeOut', 'R_SnoutSide', 3],
    ['R_EyeOut', 'R_Mane1', 'R_EarOut', 4],
    ['R_EyeOut', 'R_Cheek', 'R_Mane1', 6],
    ['R_Mane1', 'R_Mane2', 'R_Cheek', 5],
    ['R_EyeOut', 'R_SnoutSide', 'R_Cheek', 2],
    ['C_MuzTop', 'C_MuzMid', 'R_SnoutSide', 1],
    ['C_MuzMid', 'C_Nose', 'R_SnoutSide', 5],
    ['C_Nose', 'C_Chin', 'R_SnoutSide', 3],
    ['R_SnoutSide', 'C_Chin', 'R_Cheek', 1]
  ],
  [
    { id: 'bg1', colorId: 8, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 8, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 6. Faceted Tree
templates.push(buildSymmetrical('tree', 'Faceted Tree',
  { 1: '#065F46', 2: '#059669', 3: '#10B981', 4: '#34D399', 5: '#78350F', 6: '#92400E', 7: '#BAE6FD', 8: '#7DD3FC' },
  { C_Top: [200, 40], C_Mid1: [200, 100], C_Mid2: [200, 160], C_Mid3: [200, 220], C_TrunkTop: [200, 280], C_TrunkBot: [200, 360] },
  { R_L1_Out: [260, 120], R_L1_In: [230, 140], R_L2_Out: [300, 200], R_L2_In: [240, 220], R_L3_Out: [340, 280], R_L3_In: [260, 280], R_Trunk: [220, 360] },
  [
    ['C_Top', 'C_Mid1', 'R_L1_Out', 3],
    ['C_Mid1', 'R_L1_In', 'R_L1_Out', 2],
    ['C_Mid1', 'C_Mid2', 'R_L1_In', 4],
    ['C_Mid2', 'R_L2_Out', 'R_L1_In', 2],
    ['R_L1_In', 'R_L2_Out', 'R_L1_Out', 1],
    ['C_Mid2', 'C_Mid3', 'R_L2_In', 3],
    ['C_Mid3', 'R_L3_Out', 'R_L2_In', 2],
    ['R_L2_In', 'R_L3_Out', 'R_L2_Out', 1],
    ['C_Mid3', 'C_TrunkTop', 'R_L3_In', 4],
    ['C_TrunkTop', 'R_L3_Out', 'R_L3_In', 3],
    ['C_TrunkTop', 'C_TrunkBot', 'R_Trunk', 6],
    ['C_TrunkTop', 'R_Trunk', 'R_L3_In', 5]
  ],
  [
    { id: 'bg1', colorId: 7, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 8, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 7, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 7. Mountain Landscape (Non-symmetrical, done manually)
const generateMountain = () => {
  const regions = [];
  regions.push({ id: 'sky', colorId: 7, d: 'M0,0 L400,0 L400,240 L0,240 Z', textX: 350, textY: 50 });
  regions.push(makePoly([[200, 60], [300, 240], [100, 240]], 'mt', 1));
  regions.push(makePoly([[200, 60], [240, 120], [160, 120]], 'sn', 8));
  regions.push(makePoly([[100, 120], [180, 240], [20, 240]], 'mt', 2));
  regions.push(makePoly([[100, 120], [130, 160], [70, 160]], 'sn', 8));
  regions.push(makePoly([[320, 100], [400, 240], [240, 240]], 'mt', 3));
  regions.push(makePoly([[320, 100], [350, 140], [290, 140]], 'sn', 8));
  regions.push(makePoly([[0, 240], [200, 240], [100, 320], [0, 320]], 'gr', 4));
  regions.push(makePoly([[200, 240], [400, 240], [400, 320], [300, 320]], 'gr', 5));
  regions.push(makePoly([[100, 320], [300, 320], [200, 240]], 'lk', 6));
  regions.push(makePoly([[0, 320], [400, 320], [400, 400], [0, 400]], 'gr', 4));
  regions.push(makePoly([[120, 320], [280, 320], [260, 400], [140, 400]], 'lk', 6));
  regions.push(makePoly([[40, 40], [80, 20], [120, 40], [100, 80], [60, 80]], 'su', 5));
  return { id: 'mountain', name: 'Mountain Peaks', palette: { 1: '#64748B', 2: '#475569', 3: '#94A3B8', 4: '#22C55E', 5: '#FCD34D', 6: '#3B82F6', 7: '#BAE6FD', 8: '#FFFFFF' }, regions };
};

// 8. Abstract Bird
templates.push(buildSymmetrical('bird', 'Flying Bird',
  { 1: '#EF4444', 2: '#F97316', 3: '#F59E0B', 4: '#10B981', 5: '#3B82F6', 6: '#8B5CF6', 7: '#1E293B', 8: '#F8FAFC' },
  { C_Beak: [200, 40], C_Head: [200, 100], C_Chest: [200, 180], C_TailBot: [200, 360] },
  { R_Eye: [220, 80], R_Neck: [230, 140], R_WingIn1: [280, 120], R_WingIn2: [260, 200], R_WingOut1: [360, 60], R_WingOut2: [380, 160], R_WingOut3: [320, 260], R_TailOut: [240, 320] },
  [
    ['C_Beak', 'C_Head', 'R_Eye', 3],
    ['C_Head', 'R_Neck', 'R_Eye', 2],
    ['C_Head', 'C_Chest', 'R_Neck', 1],
    ['R_Neck', 'R_WingIn1', 'R_Eye', 4],
    ['R_WingIn1', 'R_WingOut1', 'R_Eye', 5],
    ['R_Neck', 'R_WingIn2', 'R_WingIn1', 2],
    ['R_WingIn1', 'R_WingOut2', 'R_WingOut1', 6],
    ['R_WingIn1', 'R_WingIn2', 'R_WingOut2', 4],
    ['C_Chest', 'R_WingIn2', 'R_Neck', 1],
    ['C_Chest', 'R_TailOut', 'R_WingIn2', 2],
    ['R_WingIn2', 'R_WingOut3', 'R_WingOut2', 5],
    ['R_WingIn2', 'R_TailOut', 'R_WingOut3', 3],
    ['C_Chest', 'C_TailBot', 'R_TailOut', 1]
  ],
  [
    { id: 'bg1', colorId: 8, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 8, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 9. Faceted Whale
templates.push(buildSymmetrical('whale', 'Ocean Whale',
  { 1: '#0284C7', 2: '#0369A1', 3: '#38BDF8', 4: '#7DD3FC', 5: '#E0F2FE', 6: '#0C4A6E', 7: '#BAE6FD', 8: '#F8FAFC' },
  { C_Spout: [200, 60], C_HeadTop: [200, 140], C_Mouth: [200, 220], C_Belly: [200, 280], C_TailTop: [200, 340], C_TailBot: [200, 380] },
  { R_SpoutDrop: [240, 80], R_HeadSide: [280, 180], R_Eye: [260, 200], R_MouthCorner: [280, 240], R_BellySide: [260, 300], R_FinTip: [360, 260], R_TailTip: [280, 360] },
  [
    ['C_Spout', 'C_HeadTop', 'R_SpoutDrop', 5],
    ['C_HeadTop', 'R_HeadSide', 'R_SpoutDrop', 4],
    ['C_HeadTop', 'C_Mouth', 'R_HeadSide', 1],
    ['C_Mouth', 'R_Eye', 'R_HeadSide', 2],
    ['C_Mouth', 'R_MouthCorner', 'R_Eye', 6],
    ['C_Mouth', 'C_Belly', 'R_MouthCorner', 3],
    ['C_Belly', 'R_BellySide', 'R_MouthCorner', 4],
    ['R_MouthCorner', 'R_FinTip', 'R_BellySide', 2],
    ['R_HeadSide', 'R_FinTip', 'R_MouthCorner', 1],
    ['C_Belly', 'C_TailTop', 'R_BellySide', 3],
    ['C_TailTop', 'R_TailTip', 'R_BellySide', 2],
    ['C_TailTop', 'C_TailBot', 'R_TailTip', 1]
  ],
  [
    { id: 'bg1', colorId: 7, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 7, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 7, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

// 10. Crystal Mushroom (Nature/Mystic)
templates.push(buildSymmetrical('mushroom', 'Magic Mushroom',
  { 1: '#EC4899', 2: '#BE185D', 3: '#FBCFE8', 4: '#831843', 5: '#FDE047', 6: '#FEF08A', 7: '#1E293B', 8: '#0F172A' },
  { C_CapTop: [200, 60], C_CapMid: [200, 140], C_CapBot: [200, 200], C_StemTop: [200, 200], C_StemMid: [200, 280], C_StemBot: [200, 360] },
  { R_CapTop1: [260, 80], R_CapTop2: [320, 140], R_CapBot1: [280, 180], R_CapBot2: [360, 200], R_Stem1: [230, 240], R_Stem2: [250, 340], R_Spot: [260, 120] },
  [
    ['C_CapTop', 'C_CapMid', 'R_Spot', 1],
    ['C_CapTop', 'R_Spot', 'R_CapTop1', 2],
    ['R_CapTop1', 'R_Spot', 'R_CapTop2', 1],
    ['R_Spot', 'R_CapBot1', 'R_CapTop2', 2],
    ['C_CapMid', 'R_CapBot1', 'R_Spot', 3],
    ['C_CapMid', 'C_CapBot', 'R_CapBot1', 2],
    ['R_CapBot1', 'R_CapBot2', 'R_CapTop2', 1],
    ['C_StemTop', 'C_StemMid', 'R_Stem1', 5],
    ['C_StemTop', 'R_Stem1', 'R_CapBot1', 6],
    ['C_StemMid', 'C_StemBot', 'R_Stem2', 5],
    ['C_StemMid', 'R_Stem2', 'R_Stem1', 6]
  ],
  [
    { id: 'bg1', colorId: 8, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
    { id: 'bg2', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
    { id: 'bg3', colorId: 7, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
    { id: 'bg4', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 }
  ]
));

templates.push(generateMountain());

let fileContent = fs.readFileSync('src/activities/letters/colorByCodeTemplates.ts', 'utf8');
const exportString = "\nexport const TEMPLATES = [\n  ...HAND_CRAFTED,\n  ...JSON.parse('" + JSON.stringify(templates).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "')\n];\n";

// Remove the existing export block
fileContent = fileContent.replace(/export const TEMPLATES = \[[\s\S]*$/, '') + exportString;
fs.writeFileSync('src/activities/letters/colorByCodeTemplates.ts', fileContent);
