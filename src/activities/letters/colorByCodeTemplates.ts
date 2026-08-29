export interface TemplateRegion {
  id: string;
  colorId: number;
  d: string;
  textX: number;
  textY: number;
}

export interface ColorTemplate {
  id: string;
  name: string;
  palette: Record<number, string>; // Maps colorId to actual hex color
  regions: TemplateRegion[];
}

const HAND_CRAFTED: ColorTemplate[] = [
  {
    id: 'flower',
    name: 'Happy Flower',
    palette: {
      1: '#FFD700', // Yellow
      2: '#FF69B4', // Pink
      3: '#228B22', // Green
      4: '#8B4513', // Brown
      5: '#87CEEB', // Sky Blue
    },
    regions: [
      { id: 'bg', colorId: 5, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 60, textY: 60 },
      { id: 'dirt', colorId: 4, d: 'M0,320 L400,320 L400,400 L0,400 Z', textX: 300, textY: 360 },
      { id: 'stem', colorId: 3, d: 'M190,200 L210,200 L210,320 L190,320 Z', textX: 200, textY: 260 },
      { id: 'leaf1', colorId: 3, d: 'M210,260 Q260,220 280,280 Q240,300 210,280 Z', textX: 240, textY: 265 },
      { id: 'leaf2', colorId: 3, d: 'M190,280 Q140,240 120,300 Q160,320 190,300 Z', textX: 160, textY: 285 },
      { id: 'petal1', colorId: 2, d: 'M200,50 A50,50 0 1,1 200,150 A50,50 0 1,1 200,50', textX: 200, textY: 85 },
      { id: 'petal2', colorId: 2, d: 'M250,100 A50,50 0 1,1 250,200 A50,50 0 1,1 250,100', textX: 265, textY: 150 },
      { id: 'petal3', colorId: 2, d: 'M200,150 A50,50 0 1,1 200,250 A50,50 0 1,1 200,150', textX: 200, textY: 215 },
      { id: 'petal4', colorId: 2, d: 'M150,100 A50,50 0 1,1 150,200 A50,50 0 1,1 150,100', textX: 135, textY: 150 },
      { id: 'center', colorId: 1, d: 'M200,110 A40,40 0 1,1 200,190 A40,40 0 1,1 200,110', textX: 200, textY: 150 },
    ]
  },
  {
    id: 'rocket',
    name: 'Space Rocket',
    palette: {
      1: '#FF0000', // Red
      2: '#E2E8F0', // Silver
      3: '#FFA500', // Orange
      4: '#00FFFF', // Cyan
      5: '#1E1B4B', // Deep Space
    },
    regions: [
      { id: 'space', colorId: 5, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 60, textY: 60 },
      { id: 'flame', colorId: 3, d: 'M170,300 L200,380 L230,300 Z', textX: 200, textY: 330 },
      { id: 'finLeft', colorId: 1, d: 'M160,250 L120,300 L160,300 Z', textX: 145, textY: 285 },
      { id: 'finRight', colorId: 1, d: 'M240,250 L280,300 L240,300 Z', textX: 255, textY: 285 },
      { id: 'body', colorId: 2, d: 'M160,150 L240,150 L240,300 L160,300 Z', textX: 200, textY: 250 },
      { id: 'cone', colorId: 1, d: 'M160,150 L200,50 L240,150 Z', textX: 200, textY: 120 },
      { id: 'window', colorId: 4, d: 'M200,170 A20,20 0 1,1 200,210 A20,20 0 1,1 200,170', textX: 200, textY: 190 },
    ]
  },
  {
    id: 'house',
    name: 'Cozy House',
    palette: {
      1: '#991B1B', // Dark Red Roof
      2: '#FEF3C7', // House Body
      3: '#78350F', // Door
      4: '#34D399', // Grass
      5: '#38BDF8', // Sky
      6: '#FDE047', // Windows
    },
    regions: [
      { id: 'sky', colorId: 5, d: 'M0,0 L400,0 L400,280 L0,280 Z', textX: 60, textY: 60 },
      { id: 'grass', colorId: 4, d: 'M0,280 L400,280 L400,400 L0,400 Z', textX: 300, textY: 340 },
      { id: 'houseBody', colorId: 2, d: 'M100,160 L300,160 L300,320 L100,320 Z', textX: 200, textY: 220 },
      { id: 'roof', colorId: 1, d: 'M70,160 L200,60 L330,160 Z', textX: 200, textY: 120 },
      { id: 'door', colorId: 3, d: 'M175,240 L225,240 L225,320 L175,320 Z', textX: 200, textY: 280 },
      { id: 'win1', colorId: 6, d: 'M120,180 L160,180 L160,220 L120,220 Z', textX: 140, textY: 200 },
      { id: 'win2', colorId: 6, d: 'M240,180 L280,180 L280,220 L240,220 Z', textX: 260, textY: 200 },
    ]
  },
  {
    id: 'robot',
    name: 'Cute Robot',
    palette: {
      1: '#94A3B8', // Silver
      2: '#0EA5E9', // Blue
      3: '#EF4444', // Red
      4: '#F59E0B', // Yellow
      5: '#10B981', // Green
      6: '#475569', // Dark Grey
      7: '#F8FAFC', // BG
    },
    regions: [
      { id: 'bg', colorId: 7, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 50, textY: 50 },
      { id: 'ant-stick', colorId: 6, d: 'M195,55 L205,55 L205,100 L195,100 Z', textX: 200, textY: 75 },
      { id: 'ant-ball', colorId: 3, d: 'M185,40 A15,15 0 1,1 215,40 A15,15 0 1,1 185,40', textX: 200, textY: 40 },
      { id: 'left-arm', colorId: 6, d: 'M70,220 L120,220 L120,260 L70,260 Z', textX: 95, textY: 240 },
      { id: 'right-arm', colorId: 6, d: 'M280,220 L330,220 L330,260 L280,260 Z', textX: 305, textY: 240 },
      { id: 'left-leg', colorId: 6, d: 'M140,320 L180,320 L180,380 L140,380 Z', textX: 160, textY: 350 },
      { id: 'right-leg', colorId: 6, d: 'M220,320 L260,320 L260,380 L220,380 Z', textX: 240, textY: 350 },
      { id: 'head', colorId: 1, d: 'M130,100 L270,100 L270,180 L130,180 Z', textX: 200, textY: 115 },
      { id: 'eyes', colorId: 2, d: 'M150,120 L250,120 L250,160 L150,160 Z', textX: 200, textY: 140 },
      { id: 'neck', colorId: 4, d: 'M180,180 L220,180 L220,200 L180,200 Z', textX: 200, textY: 190 },
      { id: 'body', colorId: 1, d: 'M120,200 L280,200 L280,320 L120,320 Z', textX: 200, textY: 260 },
      { id: 'btn1', colorId: 3, d: 'M140,220 A20,20 0 1,1 180,220 A20,20 0 1,1 140,220', textX: 160, textY: 220 },
      { id: 'btn2', colorId: 5, d: 'M220,220 A20,20 0 1,1 260,220 A20,20 0 1,1 220,220', textX: 240, textY: 220 },
    ]
  },
  {
    id: 'sailboat',
    name: 'Sailing Boat',
    palette: {
      1: '#3B82F6', // Sky
      2: '#0369A1', // Ocean
      3: '#FCD34D', // Sun
      4: '#B45309', // Wood
      5: '#F8FAFC', // Sails
      6: '#EF4444', // Flag
      7: '#D97706', // Mast
    },
    regions: [
      { id: 'sky', colorId: 1, d: 'M0,0 L400,0 L400,300 L0,300 Z', textX: 60, textY: 60 },
      { id: 'sun', colorId: 3, d: 'M300,40 A40,40 0 1,1 380,40 A40,40 0 1,1 300,40', textX: 340, textY: 40 },
      { id: 'ocean', colorId: 2, d: 'M0,300 L400,300 L400,400 L0,400 Z', textX: 60, textY: 350 },
      { id: 'hull', colorId: 4, d: 'M80,300 L320,300 L280,360 L120,360 Z', textX: 200, textY: 330 },
      { id: 'mast', colorId: 7, d: 'M195,100 L205,100 L205,300 L195,300 Z', textX: 200, textY: 200 },
      { id: 'mainsail', colorId: 5, d: 'M205,120 L320,280 L205,280 Z', textX: 245, textY: 240 },
      { id: 'frontsail', colorId: 5, d: 'M195,140 L100,280 L195,280 Z', textX: 160, textY: 250 },
      { id: 'flag', colorId: 6, d: 'M205,80 L250,100 L205,120 Z', textX: 220, textY: 100 },
    ]
  },
  {
    id: 'butterfly',
    name: 'Beautiful Butterfly',
    palette: {
      1: '#10B981', // Leaves bg
      2: '#1E293B', // Body
      3: '#D946EF', // Wings top
      4: '#8B5CF6', // Wings bot
      5: '#FBBF24', // Spots
      6: '#2DD4BF', // Spots teal
    },
    regions: [
      { id: 'bg', colorId: 1, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 50, textY: 50 },
      { id: 'body', colorId: 2, d: 'M190,100 A10,10 0 1,1 210,100 L210,300 A10,10 0 1,1 190,300 Z', textX: 200, textY: 200 },
      { id: 'lant', colorId: 2, d: 'M195,100 Q160,40 140,60 Q150,80 190,110 Z', textX: 160, textY: 80 },
      { id: 'rant', colorId: 2, d: 'M205,100 Q240,40 260,60 Q250,80 210,110 Z', textX: 240, textY: 80 },
      { id: 'lwingtop', colorId: 3, d: 'M190,140 Q50,0 20,180 Q80,200 190,200 Z', textX: 110, textY: 130 },
      { id: 'rwingtop', colorId: 3, d: 'M210,140 Q350,0 380,180 Q320,200 210,200 Z', textX: 290, textY: 130 },
      { id: 'lwingbot', colorId: 4, d: 'M190,200 Q80,200 60,340 Q160,380 190,280 Z', textX: 130, textY: 280 },
      { id: 'rwingbot', colorId: 4, d: 'M210,200 Q320,200 340,340 Q240,380 210,280 Z', textX: 270, textY: 280 },
      { id: 'spotltop', colorId: 5, d: 'M80,130 A20,20 0 1,1 120,130 A20,20 0 1,1 80,130', textX: 100, textY: 130 },
      { id: 'spotrtop', colorId: 5, d: 'M280,130 A20,20 0 1,1 320,130 A20,20 0 1,1 280,130', textX: 300, textY: 130 },
      { id: 'spotlbot', colorId: 6, d: 'M110,280 A15,15 0 1,1 140,280 A15,15 0 1,1 110,280', textX: 125, textY: 280 },
      { id: 'spotrbot', colorId: 6, d: 'M260,280 A15,15 0 1,1 290,280 A15,15 0 1,1 260,280', textX: 275, textY: 280 },
    ]
  },
  {
    id: 'castle',
    name: 'Magic Castle',
    palette: {
      1: '#818CF8', // Sky
      2: '#4ADE80', // Grass
      3: '#CBD5E1', // Walls
      4: '#1E293B', // Gate
      5: '#F43F5E', // Roofs
      6: '#EAB308', // Sun/Flags
      7: '#60A5FA', // Moat
      8: '#334155', // Wall accents
    },
    regions: [
      { id: 'sky', colorId: 1, d: 'M0,0 L400,0 L400,320 L0,320 Z', textX: 200, textY: 60 },
      { id: 'sun', colorId: 6, d: 'M40,40 A30,30 0 1,1 100,40 A30,30 0 1,1 40,40', textX: 70, textY: 40 },
      { id: 'grass', colorId: 2, d: 'M0,320 L400,320 L400,400 L0,400 Z', textX: 50, textY: 360 },
      { id: 'moat', colorId: 7, d: 'M100,350 L300,350 L320,400 L80,400 Z', textX: 200, textY: 375 },
      { id: 'main-wall', colorId: 3, d: 'M120,200 L280,200 L280,320 L120,320 Z', textX: 140, textY: 260 },
      { id: 'left-tower', colorId: 3, d: 'M60,150 L120,150 L120,320 L60,320 Z', textX: 90, textY: 250 },
      { id: 'right-tower', colorId: 3, d: 'M280,150 L340,150 L340,320 L280,320 Z', textX: 310, textY: 250 },
      { id: 'center-roof', colorId: 5, d: 'M120,200 L200,100 L280,200 Z', textX: 200, textY: 160 },
      { id: 'left-roof', colorId: 5, d: 'M50,150 L90,80 L130,150 Z', textX: 90, textY: 130 },
      { id: 'right-roof', colorId: 5, d: 'M270,150 L310,80 L350,150 Z', textX: 310, textY: 130 },
      { id: 'gate', colorId: 4, d: 'M160,260 A40,40 0 0,1 240,260 L240,320 L160,320 Z', textX: 200, textY: 295 },
      { id: 'flag1', colorId: 6, d: 'M90,80 L130,60 L90,40 Z', textX: 105, textY: 60 },
      { id: 'flag2', colorId: 6, d: 'M310,80 L350,60 L310,40 Z', textX: 325, textY: 60 },
      { id: 'acc1', colorId: 8, d: 'M130,220 L170,220 L170,240 L130,240 Z', textX: 150, textY: 230 },
      { id: 'acc2', colorId: 8, d: 'M230,220 L270,220 L270,240 L230,240 Z', textX: 250, textY: 230 },
    ]
  },
  {
    id: 'dinosaur',
    name: 'T-Rex Dinosaur',
    palette: {
      1: '#22C55E', // Jungle
      2: '#8B4513', // Ground
      3: '#0284C7', // Sky
      4: '#16A34A', // Dark Green
      5: '#BBF7D0', // Belly
      6: '#FEF08A', // Sun
      7: '#FFFFFF', // Clouds/Teeth
    },
    regions: [
      { id: 'sky', colorId: 3, d: 'M0,0 L400,0 L400,280 L0,280 Z', textX: 150, textY: 50 },
      { id: 'ground', colorId: 2, d: 'M0,280 L400,280 L400,400 L0,400 Z', textX: 80, textY: 340 },
      { id: 'sun', colorId: 6, d: 'M50,50 A30,30 0 1,1 110,50 A30,30 0 1,1 50,50', textX: 80, textY: 50 },
      { id: 'cloud1', colorId: 7, d: 'M200,60 Q220,40 240,60 Q260,60 260,80 L200,80 Z', textX: 230, textY: 70 },
      { id: 'cloud2', colorId: 7, d: 'M300,80 Q320,60 340,80 Q360,80 360,100 L300,100 Z', textX: 330, textY: 90 },
      { id: 'body', colorId: 4, d: 'M120,280 L180,220 L180,120 L260,120 L260,160 L200,160 L200,220 L240,280 Z', textX: 200, textY: 140 },
      { id: 'belly', colorId: 5, d: 'M180,220 L200,220 L220,280 L200,280 Z', textX: 200, textY: 250 },
      { id: 'tail', colorId: 4, d: 'M180,220 L120,220 L120,280 Z', textX: 150, textY: 250 },
      { id: 'leg1', colorId: 4, d: 'M180,280 L200,280 L200,320 L180,320 Z', textX: 190, textY: 300 },
      { id: 'leg2', colorId: 4, d: 'M220,280 L240,280 L240,320 L220,320 Z', textX: 230, textY: 300 },
      { id: 'eye', colorId: 7, d: 'M215,135 A10,10 0 1,1 235,135 A10,10 0 1,1 215,135', textX: 225, textY: 135 },
      { id: 'tooth', colorId: 7, d: 'M260,160 L270,160 L265,170 Z', textX: 265, textY: 163 },
    ]
  },
  {
    id: 'firetruck',
    name: 'Firetruck',
    palette: {
      1: '#38BDF8', // Sky
      2: '#475569', // Road
      3: '#EF4444', // Red Truck
      4: '#94A3B8', // Silver
      5: '#FDE047', // Yellow Lights
      6: '#1E293B', // Tires
      7: '#DBEAFE', // Windows
    },
    regions: [
      { id: 'sky', colorId: 1, d: 'M0,0 L400,0 L400,300 L0,300 Z', textX: 200, textY: 100 },
      { id: 'road', colorId: 2, d: 'M0,300 L400,300 L400,400 L0,400 Z', textX: 200, textY: 350 },
      { id: 'truck-back', colorId: 3, d: 'M80,180 L220,180 L220,300 L80,300 Z', textX: 150, textY: 240 },
      { id: 'truck-front', colorId: 3, d: 'M220,220 L300,220 L300,300 L220,300 Z', textX: 260, textY: 270 },
      { id: 'window', colorId: 7, d: 'M240,230 L290,230 L290,260 L240,260 Z', textX: 265, textY: 245 },
      { id: 'wheel1', colorId: 6, d: 'M100,300 A30,30 0 1,1 160,300 A30,30 0 1,1 100,300', textX: 130, textY: 300 },
      { id: 'wheel2', colorId: 6, d: 'M240,300 A30,30 0 1,1 300,300 A30,30 0 1,1 240,300', textX: 270, textY: 300 },
      { id: 'ladder', colorId: 4, d: 'M60,150 L200,150 L200,170 L60,170 Z', textX: 130, textY: 160 },
      { id: 'siren', colorId: 5, d: 'M240,200 L260,200 L260,220 L240,220 Z', textX: 250, textY: 210 },
      { id: 'light', colorId: 5, d: 'M290,270 L310,270 L310,290 L290,290 Z', textX: 300, textY: 280 },
    ]
  },
  {
    id: 'submarine',
    name: 'Under the Sea',
    palette: {
      1: '#0284C7', // Ocean
      2: '#FCD34D', // Sand
      3: '#F97316', // Orange Fish
      4: '#22C55E', // Seaweed
      5: '#A855F7', // Submarine
      6: '#94A3B8', // Metal
      7: '#FFFFFF', // Bubbles/Window
    },
    regions: [
      { id: 'water', colorId: 1, d: 'M0,0 L400,0 L400,340 L0,340 Z', textX: 200, textY: 80 },
      { id: 'sand', colorId: 2, d: 'M0,340 L400,340 L400,400 L0,400 Z', textX: 200, textY: 370 },
      { id: 'sub-body', colorId: 5, d: 'M150,180 A50,50 0 1,1 150,280 L250,280 A50,50 0 1,1 250,180 Z', textX: 230, textY: 230 },
      { id: 'sub-window', colorId: 7, d: 'M180,210 A20,20 0 1,1 180,250 A20,20 0 1,1 180,210', textX: 180, textY: 230 },
      { id: 'periscope', colorId: 6, d: 'M180,180 L180,120 L220,120 L220,140 L200,140 L200,180 Z', textX: 205, textY: 130 },
      { id: 'tail-fin', colorId: 6, d: 'M100,200 L120,230 L100,260 Z', textX: 105, textY: 230 },
      { id: 'seaweed1', colorId: 4, d: 'M40,340 Q60,300 40,260 Q20,220 40,180 Q60,220 40,260 Q20,300 40,340 Z', textX: 45, textY: 260 },
      { id: 'seaweed2', colorId: 4, d: 'M360,340 Q380,300 360,260 Q340,220 360,180 Q380,220 360,260 Q340,300 360,340 Z', textX: 365, textY: 260 },
      { id: 'fish-body', colorId: 3, d: 'M260,120 L300,100 L300,140 Z', textX: 280, textY: 120 },
      { id: 'fish-tail', colorId: 3, d: 'M300,120 L330,100 L330,140 Z', textX: 320, textY: 120 },
      { id: 'bubble1', colorId: 7, d: 'M240,120 A10,10 0 1,1 240,140 A10,10 0 1,1 240,120', textX: 240, textY: 130 },
    ]
  },
  {
    id: 'balloon',
    name: 'Hot Air Balloon',
    palette: {
      1: '#38BDF8', // Sky
      2: '#FDE047', // Sun
      3: '#FFFFFF', // Clouds
      4: '#EF4444', // Red
      5: '#EAB308', // Yellow
      6: '#3B82F6', // Blue
      7: '#D97706', // Basket
    },
    regions: [
      { id: 'sky', colorId: 1, d: 'M0,0 L400,0 L400,400 L0,400 Z', textX: 60, textY: 60 },
      { id: 'sun', colorId: 2, d: 'M340,60 A40,40 0 1,1 340,140 A40,40 0 1,1 340,60', textX: 340, textY: 100 },
      { id: 'cloud1', colorId: 3, d: 'M80,120 Q100,100 120,120 Q140,120 140,140 L80,140 Z', textX: 110, textY: 130 },
      { id: 'cloud2', colorId: 3, d: 'M280,240 Q300,220 320,240 Q340,240 340,260 L280,260 Z', textX: 310, textY: 250 },
      { id: 'center', colorId: 4, d: 'M180,80 L220,80 L220,250 L180,250 Z', textX: 200, textY: 160 },
      { id: 'left', colorId: 5, d: 'M140,100 L180,80 L180,250 L160,250 Z', textX: 165, textY: 160 },
      { id: 'right', colorId: 6, d: 'M260,100 L220,80 L220,250 L240,250 Z', textX: 235, textY: 160 },
      { id: 'far-left', colorId: 6, d: 'M100,140 L140,100 L160,250 L140,250 Z', textX: 135, textY: 180 },
      { id: 'far-right', colorId: 5, d: 'M300,140 L260,100 L240,250 L260,250 Z', textX: 265, textY: 180 },
      { id: 'basket', colorId: 7, d: 'M170,300 L230,300 L230,350 L170,350 Z', textX: 200, textY: 325 },
      { id: 'rope-left', colorId: 7, d: 'M160,250 L170,300 L180,300 L170,250 Z', textX: 170, textY: 275 },
      { id: 'rope-right', colorId: 7, d: 'M240,250 L230,300 L220,300 L230,250 Z', textX: 230, textY: 275 },
    ]
  },
  {
    id: 'owl',
    name: 'Night Owl',
    palette: {
      1: '#8B4513', // Brown
      2: '#D2691E', // Light Brown
      3: '#F5DEB3', // Tan
      4: '#228B22', // Green
      5: '#FFD700', // Yellow
      6: '#191970', // Dark Night
      7: '#4169E1', // Light Night
      8: '#FFFFFF', // White
    },
    regions: [
      { id: 'sky-tl', colorId: 6, d: 'M0,0 L200,0 L200,100 L0,100 Z', textX: 100, textY: 50 },
      { id: 'sky-tr', colorId: 6, d: 'M200,0 L400,0 L400,100 L200,100 Z', textX: 250, textY: 50 },
      { id: 'sky-ml', colorId: 7, d: 'M0,100 L120,100 L120,300 L0,300 Z', textX: 60, textY: 200 },
      { id: 'sky-mr', colorId: 7, d: 'M280,100 L400,100 L400,300 L280,300 Z', textX: 340, textY: 200 },
      { id: 'moon', colorId: 5, d: 'M300,50 A40,40 0 1,1 380,50 A40,40 0 1,1 300,50', textX: 340, textY: 50 },
      { id: 'branch-l', colorId: 1, d: 'M0,300 L160,300 L160,340 L0,340 Z', textX: 80, textY: 320 },
      { id: 'branch-r', colorId: 1, d: 'M240,300 L400,300 L400,340 L240,340 Z', textX: 320, textY: 320 },
      { id: 'branch-c', colorId: 1, d: 'M160,300 L240,300 L240,340 L160,340 Z', textX: 200, textY: 320 },
      { id: 'sky-bl', colorId: 6, d: 'M0,340 L200,340 L200,400 L0,400 Z', textX: 100, textY: 370 },
      { id: 'sky-br', colorId: 6, d: 'M200,340 L400,340 L400,400 L200,400 Z', textX: 300, textY: 370 },
      { id: 'leaf1', colorId: 4, d: 'M40,300 Q60,260 80,300 Z', textX: 60, textY: 285 },
      { id: 'leaf2', colorId: 4, d: 'M320,300 Q340,260 360,300 Z', textX: 340, textY: 285 },
      { id: 'leaf3', colorId: 4, d: 'M100,340 Q120,380 140,340 Z', textX: 120, textY: 355 },
      { id: 'owl-head', colorId: 2, d: 'M160,100 L240,100 L260,160 L140,160 Z', textX: 200, textY: 120 },
      { id: 'owl-ear-l', colorId: 1, d: 'M140,100 L160,100 L140,140 Z', textX: 148, textY: 115 },
      { id: 'owl-ear-r', colorId: 1, d: 'M260,100 L240,100 L260,140 Z', textX: 252, textY: 115 },
      { id: 'owl-eye-bg-l', colorId: 8, d: 'M150,120 L195,120 L195,160 L150,160 Z', textX: 172, textY: 128 },
      { id: 'owl-eye-bg-r', colorId: 8, d: 'M205,120 L250,120 L250,160 L205,160 Z', textX: 227, textY: 128 },
      { id: 'owl-eye-l', colorId: 5, d: 'M165,130 L180,130 L180,150 L165,150 Z', textX: 172, textY: 140 },
      { id: 'owl-eye-r', colorId: 5, d: 'M220,130 L235,130 L235,150 L220,150 Z', textX: 227, textY: 140 },
      { id: 'beak', colorId: 5, d: 'M195,155 L205,155 L200,170 Z', textX: 200, textY: 162 },
      { id: 'owl-body-top', colorId: 2, d: 'M140,160 L260,160 L280,240 L120,240 Z', textX: 145, textY: 190 },
      { id: 'owl-body-bot', colorId: 2, d: 'M120,240 L280,240 L240,300 L160,300 Z', textX: 145, textY: 260 },
      { id: 'owl-belly', colorId: 3, d: 'M160,180 L240,180 L220,280 L180,280 Z', textX: 200, textY: 230 },
      { id: 'owl-wing-l', colorId: 1, d: 'M100,180 L140,160 L120,240 L100,280 Z', textX: 115, textY: 210 },
      { id: 'owl-wing-r', colorId: 1, d: 'M300,180 L260,160 L280,240 L300,280 Z', textX: 285, textY: 210 },
      { id: 'foot-l', colorId: 5, d: 'M170,300 L190,300 L190,315 L170,315 Z', textX: 180, textY: 308 },
      { id: 'foot-r', colorId: 5, d: 'M210,300 L230,300 L230,315 L210,315 Z', textX: 220, textY: 308 },
    ]
  },
  {
    id: 'train',
    name: 'Steam Train',
    palette: {
      1: '#EF4444', // Red
      2: '#3B82F6', // Blue
      3: '#10B981', // Green
      4: '#F59E0B', // Yellow
      5: '#1E293B', // Black
      6: '#94A3B8', // Grey
      7: '#60A5FA', // Sky
      8: '#4ADE80', // Grass
    },
    regions: [
      { id: 'sky1', colorId: 7, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 100, textY: 100 },
      { id: 'sky2', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 300, textY: 100 },
      { id: 'grass1', colorId: 8, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 100, textY: 300 },
      { id: 'grass2', colorId: 8, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 300, textY: 300 },
      { id: 'track', colorId: 5, d: 'M0,320 L400,320 L400,340 L0,340 Z', textX: 200, textY: 330 },
      { id: 'track-bed', colorId: 6, d: 'M0,340 L400,340 L400,360 L0,360 Z', textX: 200, textY: 350 },
      { id: 'cab-bg', colorId: 1, d: 'M240,80 L360,80 L360,200 L240,200 Z', textX: 300, textY: 180 },
      { id: 'cab-roof', colorId: 5, d: 'M220,60 L380,60 L380,80 L220,80 Z', textX: 300, textY: 70 },
      { id: 'window1', colorId: 2, d: 'M260,100 L300,100 L300,160 L260,160 Z', textX: 280, textY: 130 },
      { id: 'window2', colorId: 2, d: 'M320,100 L340,100 L340,160 L320,160 Z', textX: 330, textY: 130 },
      { id: 'boiler', colorId: 2, d: 'M80,120 L240,120 L240,200 L80,200 Z', textX: 100, textY: 160 },
      { id: 'boiler-str1', colorId: 4, d: 'M120,120 L140,120 L140,200 L120,200 Z', textX: 130, textY: 160 },
      { id: 'boiler-str2', colorId: 4, d: 'M180,120 L200,120 L200,200 L180,200 Z', textX: 190, textY: 160 },
      { id: 'funnel', colorId: 5, d: 'M100,60 L140,60 L130,120 L110,120 Z', textX: 120, textY: 90 },
      { id: 'smoke1', colorId: 6, d: 'M80,20 A15,15 0 1,1 110,20 A15,15 0 1,1 80,20', textX: 95, textY: 20 },
      { id: 'smoke2', colorId: 6, d: 'M110,40 A10,10 0 1,1 130,40 A10,10 0 1,1 110,40', textX: 120, textY: 40 },
      { id: 'dome', colorId: 4, d: 'M180,100 A20,20 0 0,1 220,100 Z', textX: 200, textY: 90 },
      { id: 'base', colorId: 1, d: 'M60,200 L380,200 L380,240 L60,240 Z', textX: 220, textY: 220 },
      { id: 'cowcatcher', colorId: 5, d: 'M40,300 L60,240 L80,240 L80,300 Z', textX: 65, textY: 270 },
      { id: 'wheel1-bg', colorId: 5, d: 'M100,240 A40,40 0 1,1 180,240 A40,40 0 1,1 100,240', textX: 115, textY: 240 },
      { id: 'wheel1-in', colorId: 1, d: 'M120,240 A20,20 0 1,1 160,240 A20,20 0 1,1 120,240', textX: 140, textY: 240 },
      { id: 'wheel2-bg', colorId: 5, d: 'M200,240 A40,40 0 1,1 280,240 A40,40 0 1,1 200,240', textX: 215, textY: 240 },
      { id: 'wheel2-in', colorId: 1, d: 'M220,240 A20,20 0 1,1 260,240 A20,20 0 1,1 220,240', textX: 240, textY: 240 },
      { id: 'wheel3-bg', colorId: 5, d: 'M300,240 A40,40 0 1,1 380,240 A40,40 0 1,1 300,240', textX: 315, textY: 240 },
      { id: 'wheel3-in', colorId: 1, d: 'M320,240 A20,20 0 1,1 360,240 A20,20 0 1,1 320,240', textX: 340, textY: 240 },
    ]
  },
  {
    id: 'lion',
    name: 'Faceted Lion',
    palette: {
      1: '#F59E0B', // Orange Mane
      2: '#D97706', // Dark Orange Mane
      3: '#FCD34D', // Yellow Face
      4: '#FFFFFF', // White
      5: '#1E293B', // Black
      6: '#8B5CF6', // Purple Bg
      7: '#C084FC', // Light Purple
    },
    regions: [
      { id: 'bg-tl', colorId: 6, d: 'M0,0 L200,0 L200,200 L0,200 Z', textX: 50, textY: 50 },
      { id: 'bg-tr', colorId: 7, d: 'M200,0 L400,0 L400,200 L200,200 Z', textX: 350, textY: 50 },
      { id: 'bg-bl', colorId: 7, d: 'M0,200 L200,200 L200,400 L0,400 Z', textX: 50, textY: 350 },
      { id: 'bg-br', colorId: 6, d: 'M200,200 L400,200 L400,400 L200,400 Z', textX: 350, textY: 350 },
      { id: 'mane1', colorId: 1, d: 'M200,40 L280,80 L200,100 Z', textX: 240, textY: 70 },
      { id: 'mane2', colorId: 2, d: 'M200,40 L120,80 L200,100 Z', textX: 160, textY: 70 },
      { id: 'mane3', colorId: 2, d: 'M280,80 L340,160 L240,160 Z', textX: 290, textY: 130 },
      { id: 'mane4', colorId: 1, d: 'M120,80 L60,160 L160,160 Z', textX: 110, textY: 130 },
      { id: 'mane5', colorId: 1, d: 'M340,160 L320,260 L240,220 Z', textX: 290, textY: 210 },
      { id: 'mane6', colorId: 2, d: 'M60,160 L80,260 L160,220 Z', textX: 110, textY: 210 },
      { id: 'mane7', colorId: 2, d: 'M320,260 L200,340 L240,260 Z', textX: 250, textY: 280 },
      { id: 'mane8', colorId: 1, d: 'M80,260 L200,340 L160,260 Z', textX: 150, textY: 280 },
      { id: 'face-top', colorId: 3, d: 'M200,100 L240,160 L160,160 Z', textX: 200, textY: 140 },
      { id: 'face-ml', colorId: 3, d: 'M160,160 L200,220 L140,220 Z', textX: 155, textY: 210 },
      { id: 'face-mr', colorId: 3, d: 'M240,160 L200,220 L260,220 Z', textX: 245, textY: 210 },
      { id: 'face-cen', colorId: 3, d: 'M160,160 L240,160 L200,220 Z', textX: 200, textY: 185 },
      { id: 'snout', colorId: 4, d: 'M160,220 L240,220 L200,280 Z', textX: 200, textY: 240 },
      { id: 'nose', colorId: 5, d: 'M180,260 L220,260 L200,290 Z', textX: 200, textY: 270 },
      { id: 'eye-bg-l', colorId: 4, d: 'M150,170 L180,170 L165,190 Z', textX: 165, textY: 172 },
      { id: 'eye-bg-r', colorId: 4, d: 'M220,170 L250,170 L235,190 Z', textX: 235, textY: 172 },
      { id: 'eye-l', colorId: 5, d: 'M160,175 L170,175 L165,185 Z', textX: 165, textY: 178 },
      { id: 'eye-r', colorId: 5, d: 'M230,175 L240,175 L235,185 Z', textX: 235, textY: 178 },
      { id: 'ear-l', colorId: 3, d: 'M120,80 L160,100 L140,140 Z', textX: 140, textY: 105 },
      { id: 'ear-r', colorId: 3, d: 'M280,80 L240,100 L260,140 Z', textX: 260, textY: 105 },
    ]
  },
  {
    id: 'stained-glass',
    name: 'Stained Glass Sun',
    palette: {
      1: '#38BDF8', // Sky Blue
      2: '#0EA5E9', // Darker Sky
      3: '#FDE047', // Yellow Sun
      4: '#F59E0B', // Orange Rays
      5: '#4ADE80', // Light Green
      6: '#16A34A', // Dark Green
      7: '#3B82F6', // River
      8: '#1D4ED8', // Dark River
    },
    regions: [
      { id: 'sky1', colorId: 1, d: 'M0,0 L100,0 L100,200 L0,200 Z', textX: 50, textY: 100 },
      { id: 'sky2', colorId: 2, d: 'M100,0 L200,0 L200,200 L100,200 Z', textX: 150, textY: 50 },
      { id: 'sky3', colorId: 1, d: 'M200,0 L300,0 L300,200 L200,200 Z', textX: 250, textY: 50 },
      { id: 'sky4', colorId: 2, d: 'M300,0 L400,0 L400,200 L300,200 Z', textX: 350, textY: 100 },
      { id: 'sun-cen', colorId: 3, d: 'M150,100 A50,50 0 1,1 250,100 A50,50 0 1,1 150,100', textX: 200, textY: 100 },
      { id: 'ray1', colorId: 4, d: 'M180,40 L200,10 L220,40 Z', textX: 200, textY: 30 },
      { id: 'ray2', colorId: 4, d: 'M260,60 L300,40 L280,80 Z', textX: 280, textY: 60 },
      { id: 'ray3', colorId: 4, d: 'M280,120 L320,140 L260,140 Z', textX: 290, textY: 130 },
      { id: 'ray4', colorId: 4, d: 'M220,160 L200,190 L180,160 Z', textX: 200, textY: 175 },
      { id: 'ray5', colorId: 4, d: 'M140,140 L80,140 L120,120 Z', textX: 110, textY: 130 },
      { id: 'ray6', colorId: 4, d: 'M120,80 L100,40 L140,60 Z', textX: 120, textY: 60 },
      { id: 'hill-l1', colorId: 5, d: 'M0,200 L160,200 L100,280 L0,280 Z', textX: 80, textY: 250 },
      { id: 'hill-r1', colorId: 6, d: 'M160,200 L400,200 L400,280 L300,280 Z', textX: 320, textY: 250 },
      { id: 'hill-l2', colorId: 6, d: 'M0,280 L100,280 L180,340 L0,340 Z', textX: 60, textY: 310 },
      { id: 'hill-r2', colorId: 5, d: 'M100,280 L300,280 L400,340 L220,340 Z', textX: 280, textY: 310 },
      { id: 'riv1', colorId: 7, d: 'M160,200 L200,200 L160,280 L100,280 Z', textX: 150, textY: 240 },
      { id: 'riv2', colorId: 8, d: 'M100,280 L160,280 L220,340 L180,340 Z', textX: 160, textY: 310 },
      { id: 'riv3', colorId: 7, d: 'M180,340 L220,340 L160,400 L80,400 Z', textX: 160, textY: 370 },
      { id: 'gnd-l', colorId: 5, d: 'M0,340 L180,340 L80,400 L0,400 Z', textX: 60, textY: 380 },
      { id: 'gnd-r', colorId: 6, d: 'M220,340 L400,340 L400,400 L160,400 Z', textX: 340, textY: 380 },
    ]
  }
];

export const TEMPLATES = [
  ...HAND_CRAFTED,
  ...JSON.parse('[{"id":"ez-butterfly","name":"Easy Butterfly","palette":{"1":"#F472B6","2":"#C084FC","3":"#334155","4":"#BAE6FD","5":"#86EFAC"},"regions":[{"id":"bg1","colorId":4,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":4,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":5,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":5,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-butterflyr0-1gdtv","colorId":1,"d":"M200,100 L360,60 L340,200 Z","textX":300,"textY":120},{"id":"ez-butterflyl0-u7nu1","colorId":1,"d":"M200,100 L40,60 L60,200 Z","textX":100,"textY":120},{"id":"ez-butterflyr1-fda53","colorId":2,"d":"M200,100 L340,200 L200,200 Z","textX":247,"textY":167},{"id":"ez-butterflyl1-tcdv8","colorId":2,"d":"M200,100 L60,200 L200,200 Z","textX":153,"textY":167},{"id":"ez-butterflyr2-y1cml","colorId":1,"d":"M200,200 L340,200 L320,340 Z","textX":287,"textY":247},{"id":"ez-butterflyl2-nj07s","colorId":1,"d":"M200,200 L60,200 L80,340 Z","textX":113,"textY":247},{"id":"ez-butterflyr3-t9412","colorId":2,"d":"M200,200 L320,340 L200,320 Z","textX":240,"textY":287},{"id":"ez-butterflyl3-7iz4q","colorId":2,"d":"M200,200 L80,340 L200,320 Z","textX":160,"textY":287},{"id":"ez-butterflyr4-buxsl","colorId":3,"d":"M200,100 L200,200 L200,320 Z","textX":200,"textY":207}]},{"id":"ez-frog","name":"Easy Frog","palette":{"1":"#4ADE80","2":"#16A34A","3":"#FDE047","4":"#0F172A","5":"#7DD3FC"},"regions":[{"id":"bg1","colorId":5,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":5,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":5,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":5,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-frogr0-hf8m2","colorId":2,"d":"M200,120 L260,80 L300,140 Z","textX":253,"textY":113},{"id":"ez-frogl0-70zum","colorId":2,"d":"M200,120 L140,80 L100,140 Z","textX":147,"textY":113},{"id":"ez-frogr1-wxo6g","colorId":1,"d":"M200,120 L300,140 L200,180 Z","textX":233,"textY":147},{"id":"ez-frogl1-87oik","colorId":1,"d":"M200,120 L100,140 L200,180 Z","textX":167,"textY":147},{"id":"ez-frogr2-xi766","colorId":2,"d":"M200,180 L300,140 L320,240 Z","textX":273,"textY":187},{"id":"ez-frogl2-fo69t","colorId":2,"d":"M200,180 L100,140 L80,240 Z","textX":127,"textY":187},{"id":"ez-frogr3-zrc2m","colorId":1,"d":"M200,180 L320,240 L200,240 Z","textX":240,"textY":220},{"id":"ez-frogl3-6wv9a","colorId":1,"d":"M200,180 L80,240 L200,240 Z","textX":160,"textY":220},{"id":"ez-frogr4-ys5kj","colorId":3,"d":"M200,240 L320,240 L200,320 Z","textX":240,"textY":267},{"id":"ez-frogl4-wij2t","colorId":3,"d":"M200,240 L80,240 L200,320 Z","textX":160,"textY":267}]},{"id":"ez-cat","name":"Easy Cat","palette":{"1":"#F97316","2":"#FDBA74","3":"#F472B6","4":"#1E293B","5":"#E0E7FF"},"regions":[{"id":"bg1","colorId":5,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":5,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":5,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":5,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-catr0-kbxhd","colorId":3,"d":"M200,140 L280,60 L260,140 Z","textX":247,"textY":113},{"id":"ez-catl0-vlryf","colorId":3,"d":"M200,140 L120,60 L140,140 Z","textX":153,"textY":113},{"id":"ez-catr1-w0ovf","colorId":1,"d":"M200,140 L260,140 L200,200 Z","textX":220,"textY":160},{"id":"ez-catl1-u2ak6","colorId":1,"d":"M200,140 L140,140 L200,200 Z","textX":180,"textY":160},{"id":"ez-catr2-sryza","colorId":1,"d":"M200,200 L260,140 L320,220 Z","textX":260,"textY":187},{"id":"ez-catl2-10950","colorId":1,"d":"M200,200 L140,140 L80,220 Z","textX":140,"textY":187},{"id":"ez-catr3-nlqhd","colorId":2,"d":"M200,200 L320,220 L200,240 Z","textX":240,"textY":220},{"id":"ez-catl3-tmbmy","colorId":2,"d":"M200,200 L80,220 L200,240 Z","textX":160,"textY":220},{"id":"ez-catr4-cv2tb","colorId":2,"d":"M200,240 L320,220 L200,300 Z","textX":240,"textY":253},{"id":"ez-catl4-xpkse","colorId":2,"d":"M200,240 L80,220 L200,300 Z","textX":160,"textY":253}]},{"id":"ez-tulip","name":"Easy Tulip","palette":{"1":"#EF4444","2":"#F472B6","3":"#4ADE80","4":"#16A34A","5":"#BAE6FD"},"regions":[{"id":"bg1","colorId":5,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":5,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":5,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":5,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-tulipr0-i8ebi","colorId":1,"d":"M200,80 L260,60 L280,160 Z","textX":247,"textY":100},{"id":"ez-tulipl0-zxsev","colorId":1,"d":"M200,80 L140,60 L120,160 Z","textX":153,"textY":100},{"id":"ez-tulipr1-bt3hm","colorId":2,"d":"M200,80 L280,160 L200,220 Z","textX":227,"textY":153},{"id":"ez-tulipl1-edvcq","colorId":2,"d":"M200,80 L120,160 L200,220 Z","textX":173,"textY":153},{"id":"ez-tulipr2-dkutn","colorId":4,"d":"M200,220 L215,300 L200,400 Z","textX":205,"textY":307},{"id":"ez-tulipl2-0ru73","colorId":4,"d":"M200,220 L185,300 L200,400 Z","textX":195,"textY":307},{"id":"ez-tulipr3-t54eg","colorId":3,"d":"M215,300 L340,280 L200,400 Z","textX":252,"textY":327},{"id":"ez-tulipl3-qtpih","colorId":3,"d":"M185,300 L60,280 L200,400 Z","textX":148,"textY":327}]},{"id":"ez-heart","name":"Easy Heart","palette":{"1":"#EF4444","2":"#B91C1C","3":"#FCE7F3"},"regions":[{"id":"bg1","colorId":3,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":3,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":3,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":3,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-heartr0-3hugu","colorId":1,"d":"M200,140 L280,60 L360,160 Z","textX":280,"textY":120},{"id":"ez-heartl0-78rl3","colorId":1,"d":"M200,140 L120,60 L40,160 Z","textX":120,"textY":120},{"id":"ez-heartr1-k4kd8","colorId":1,"d":"M200,140 L360,160 L200,200 Z","textX":253,"textY":167},{"id":"ez-heartl1-q8yvo","colorId":1,"d":"M200,140 L40,160 L200,200 Z","textX":147,"textY":167},{"id":"ez-heartr2-r9kmd","colorId":2,"d":"M200,200 L360,160 L200,360 Z","textX":253,"textY":240},{"id":"ez-heartl2-2wldr","colorId":2,"d":"M200,200 L40,160 L200,360 Z","textX":147,"textY":240}]},{"id":"ez-sun","name":"Easy Sun","palette":{"1":"#FDE047","2":"#F97316","3":"#7DD3FC"},"regions":[{"id":"bg1","colorId":3,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":3,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":3,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":3,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-sunr0-glqxh","colorId":2,"d":"M200,40 L320,80 L260,140 Z","textX":260,"textY":87},{"id":"ez-sunl0-rnyvd","colorId":2,"d":"M200,40 L80,80 L140,140 Z","textX":140,"textY":87},{"id":"ez-sunr1-j7q3r","colorId":2,"d":"M320,80 L360,200 L280,200 Z","textX":320,"textY":160},{"id":"ez-sunl1-bq0ri","colorId":2,"d":"M80,80 L40,200 L120,200 Z","textX":80,"textY":160},{"id":"ez-sunr2-ilp97","colorId":2,"d":"M360,200 L320,320 L260,260 Z","textX":313,"textY":260},{"id":"ez-sunl2-gspf1","colorId":2,"d":"M40,200 L80,320 L140,260 Z","textX":87,"textY":260},{"id":"ez-sunr3-yt7sg","colorId":1,"d":"M200,120 L260,140 L200,280 Z","textX":220,"textY":180},{"id":"ez-sunl3-0o0h7","colorId":1,"d":"M200,120 L140,140 L200,280 Z","textX":180,"textY":180},{"id":"ez-sunr4-eh911","colorId":1,"d":"M260,140 L280,200 L200,280 Z","textX":247,"textY":207},{"id":"ez-sunl4-4cfcc","colorId":1,"d":"M140,140 L120,200 L200,280 Z","textX":153,"textY":207},{"id":"ez-sunr5-c92qy","colorId":1,"d":"M280,200 L260,260 L200,280 Z","textX":247,"textY":247},{"id":"ez-sunl5-jsokp","colorId":1,"d":"M120,200 L140,260 L200,280 Z","textX":153,"textY":247}]},{"id":"ez-star","name":"Easy Star","palette":{"1":"#FDE047","2":"#FEF08A","3":"#1E293B"},"regions":[{"id":"bg1","colorId":3,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":3,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":3,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":3,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-starr0-nqxf5","colorId":1,"d":"M200,40 L360,160 L260,160 Z","textX":273,"textY":120},{"id":"ez-starl0-ntaxn","colorId":1,"d":"M200,40 L40,160 L140,160 Z","textX":127,"textY":120},{"id":"ez-starr1-nu2ql","colorId":2,"d":"M200,40 L260,160 L200,200 Z","textX":220,"textY":133},{"id":"ez-starl1-to246","colorId":2,"d":"M200,40 L140,160 L200,200 Z","textX":180,"textY":133},{"id":"ez-starr2-kk4x2","colorId":2,"d":"M260,160 L360,160 L260,260 Z","textX":293,"textY":193},{"id":"ez-starl2-ablrl","colorId":2,"d":"M140,160 L40,160 L140,260 Z","textX":107,"textY":193},{"id":"ez-starr3-tihcg","colorId":1,"d":"M260,160 L260,260 L200,200 Z","textX":240,"textY":207},{"id":"ez-starl3-wwq3f","colorId":1,"d":"M140,160 L140,260 L200,200 Z","textX":160,"textY":207},{"id":"ez-starr4-xj9o2","colorId":1,"d":"M260,260 L320,360 L200,320 Z","textX":260,"textY":313},{"id":"ez-starl4-1aiae","colorId":1,"d":"M140,260 L80,360 L200,320 Z","textX":140,"textY":313},{"id":"ez-starr5-9tng4","colorId":2,"d":"M200,200 L260,260 L200,320 Z","textX":220,"textY":260},{"id":"ez-starl5-zmesv","colorId":2,"d":"M200,200 L140,260 L200,320 Z","textX":180,"textY":260}]},{"id":"ez-crown","name":"Easy Crown","palette":{"1":"#FDE047","2":"#EAB308","3":"#EF4444","4":"#3B0764"},"regions":[{"id":"bg1","colorId":4,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":4,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":4,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":4,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-crownr0-m2q0h","colorId":1,"d":"M200,80 L340,100 L260,180 Z","textX":267,"textY":120},{"id":"ez-crownl0-uq67v","colorId":1,"d":"M200,80 L60,100 L140,180 Z","textX":133,"textY":120},{"id":"ez-crownr1-phzsn","colorId":2,"d":"M200,80 L260,180 L200,220 Z","textX":220,"textY":160},{"id":"ez-crownl1-6y5rj","colorId":2,"d":"M200,80 L140,180 L200,220 Z","textX":180,"textY":160},{"id":"ez-crownr2-1ws0n","colorId":2,"d":"M260,180 L340,100 L320,260 Z","textX":307,"textY":180},{"id":"ez-crownl2-shr3d","colorId":2,"d":"M140,180 L60,100 L80,260 Z","textX":93,"textY":180},{"id":"ez-crownr3-74nty","colorId":1,"d":"M200,220 L260,180 L320,260 Z","textX":260,"textY":220},{"id":"ez-crownl3-oe8km","colorId":1,"d":"M200,220 L140,180 L80,260 Z","textX":140,"textY":220},{"id":"ez-crownr4-jnwr6","colorId":2,"d":"M200,220 L320,260 L200,320 Z","textX":240,"textY":267},{"id":"ez-crownl4-eqln2","colorId":2,"d":"M200,220 L80,260 L200,320 Z","textX":160,"textY":267},{"id":"ez-crownr5-sx71s","colorId":1,"d":"M320,260 L300,320 L200,320 Z","textX":273,"textY":300},{"id":"ez-crownl5-xyhb0","colorId":1,"d":"M80,260 L100,320 L200,320 Z","textX":127,"textY":300}]},{"id":"ez-apple","name":"Easy Apple","palette":{"1":"#EF4444","2":"#B91C1C","3":"#22C55E","4":"#78350F","5":"#FDF4FF"},"regions":[{"id":"bg1","colorId":5,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":5,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":5,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":5,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-appler0-3lrz4","colorId":3,"d":"M200,120 L300,60 L260,100 Z","textX":253,"textY":93},{"id":"ez-applel0-bvxdn","colorId":3,"d":"M200,120 L100,60 L140,100 Z","textX":147,"textY":93},{"id":"ez-appler1-qrf9n","colorId":4,"d":"M200,60 L260,100 L200,120 Z","textX":220,"textY":93},{"id":"ez-applel1-577al","colorId":4,"d":"M200,60 L140,100 L200,120 Z","textX":180,"textY":93},{"id":"ez-appler2-6gu9a","colorId":1,"d":"M200,140 L320,140 L340,240 Z","textX":287,"textY":173},{"id":"ez-applel2-ccspn","colorId":1,"d":"M200,140 L80,140 L60,240 Z","textX":113,"textY":173},{"id":"ez-appler3-02ksv","colorId":2,"d":"M200,140 L340,240 L200,240 Z","textX":247,"textY":207},{"id":"ez-applel3-ifkeb","colorId":2,"d":"M200,140 L60,240 L200,240 Z","textX":153,"textY":207},{"id":"ez-appler4-wc8j2","colorId":1,"d":"M200,240 L340,240 L280,340 Z","textX":273,"textY":273},{"id":"ez-applel4-4uiqj","colorId":1,"d":"M200,240 L60,240 L120,340 Z","textX":127,"textY":273},{"id":"ez-appler5-xakf7","colorId":2,"d":"M200,240 L280,340 L200,360 Z","textX":227,"textY":313},{"id":"ez-applel5-8j5rk","colorId":2,"d":"M200,240 L120,340 L200,360 Z","textX":173,"textY":313}]},{"id":"ez-icecream","name":"Easy Ice Cream","palette":{"1":"#F472B6","2":"#FDF4FF","3":"#FCD34D","4":"#D97706","5":"#BAE6FD"},"regions":[{"id":"bg1","colorId":5,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":5,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":5,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":5,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"ez-icecreamr0-nsasz","colorId":1,"d":"M200,60 L300,120 L200,180 Z","textX":233,"textY":120},{"id":"ez-icecreaml0-8m981","colorId":1,"d":"M200,60 L100,120 L200,180 Z","textX":167,"textY":120},{"id":"ez-icecreamr1-x84yb","colorId":2,"d":"M300,120 L280,220 L200,180 Z","textX":260,"textY":173},{"id":"ez-icecreaml1-qon2v","colorId":2,"d":"M100,120 L120,220 L200,180 Z","textX":140,"textY":173},{"id":"ez-icecreamr2-ejn2v","colorId":3,"d":"M200,180 L260,200 L200,360 Z","textX":220,"textY":247},{"id":"ez-icecreaml2-68n3c","colorId":3,"d":"M200,180 L140,200 L200,360 Z","textX":180,"textY":247},{"id":"ez-icecreamr3-5w4xr","colorId":4,"d":"M260,200 L280,220 L200,360 Z","textX":247,"textY":260},{"id":"ez-icecreaml3-4fix7","colorId":4,"d":"M140,200 L120,220 L200,360 Z","textX":153,"textY":260}]}]'),

  ...JSON.parse('[{"id":"fox","name":"Faceted Fox","palette":{"1":"#EA580C","2":"#C2410C","3":"#FFFFFF","4":"#F3F4F6","5":"#1F2937","6":"#0284C7","7":"#38BDF8"},"regions":[{"id":"bg1","colorId":6,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":7,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":7,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":6,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"foxr0-9jrwi","colorId":1,"d":"M200,100 L230,140 L280,60 Z","textX":237,"textY":100},{"id":"foxl0-k8rhj","colorId":1,"d":"M200,100 L170,140 L120,60 Z","textX":163,"textY":100},{"id":"foxr1-raqzi","colorId":2,"d":"M230,140 L300,160 L280,60 Z","textX":270,"textY":120},{"id":"foxl1-hpp1r","colorId":2,"d":"M170,140 L100,160 L120,60 Z","textX":130,"textY":120},{"id":"foxr2-ryi5j","colorId":1,"d":"M200,100 L200,160 L230,140 Z","textX":210,"textY":133},{"id":"foxl2-bj4cr","colorId":1,"d":"M200,100 L200,160 L170,140 Z","textX":190,"textY":133},{"id":"foxr3-8b8v5","colorId":2,"d":"M200,160 L220,220 L230,140 Z","textX":217,"textY":173},{"id":"foxl3-bpa11","colorId":2,"d":"M200,160 L180,220 L170,140 Z","textX":183,"textY":173},{"id":"foxr4-be7j2","colorId":1,"d":"M230,140 L260,200 L300,160 Z","textX":263,"textY":167},{"id":"foxl4-zn5n0","colorId":1,"d":"M170,140 L140,200 L100,160 Z","textX":137,"textY":167},{"id":"foxr5-ackg6","colorId":1,"d":"M230,140 L220,220 L260,200 Z","textX":237,"textY":187},{"id":"foxl5-jqmte","colorId":1,"d":"M170,140 L180,220 L140,200 Z","textX":163,"textY":187},{"id":"foxr6-u53zr","colorId":1,"d":"M200,160 L200,220 L220,220 Z","textX":207,"textY":200},{"id":"foxl6-58bws","colorId":1,"d":"M200,160 L200,220 L180,220 Z","textX":193,"textY":200},{"id":"foxr7-i26g9","colorId":2,"d":"M200,220 L260,200 L220,220 Z","textX":227,"textY":213},{"id":"foxl7-2aoel","colorId":2,"d":"M200,220 L140,200 L180,220 Z","textX":173,"textY":213},{"id":"foxr8-ce6uk","colorId":1,"d":"M260,200 L280,280 L300,160 Z","textX":280,"textY":213},{"id":"foxl8-9f0nk","colorId":1,"d":"M140,200 L120,280 L100,160 Z","textX":120,"textY":213},{"id":"foxr9-xq1xl","colorId":1,"d":"M200,220 L200,260 L240,280 Z","textX":213,"textY":253},{"id":"foxl9-cy160","colorId":1,"d":"M200,220 L200,260 L160,280 Z","textX":187,"textY":253},{"id":"foxr10-xcau6","colorId":1,"d":"M200,220 L240,280 L260,200 Z","textX":233,"textY":233},{"id":"foxl10-18os9","colorId":1,"d":"M200,220 L160,280 L140,200 Z","textX":167,"textY":233},{"id":"foxr11-gwm3c","colorId":3,"d":"M240,280 L280,280 L260,200 Z","textX":260,"textY":253},{"id":"foxl11-9hwcs","colorId":3,"d":"M160,280 L120,280 L140,200 Z","textX":140,"textY":253},{"id":"foxr12-bh9wk","colorId":4,"d":"M200,260 L200,300 L220,290 Z","textX":207,"textY":283},{"id":"foxl12-w1qqn","colorId":4,"d":"M200,260 L200,300 L180,290 Z","textX":193,"textY":283},{"id":"foxr13-m6nng","colorId":3,"d":"M200,260 L220,290 L240,280 Z","textX":220,"textY":277},{"id":"foxl13-klna2","colorId":3,"d":"M200,260 L180,290 L160,280 Z","textX":180,"textY":277},{"id":"foxr14-5ht5d","colorId":5,"d":"M200,300 L200,340 L220,290 Z","textX":207,"textY":310},{"id":"foxl14-dlz1r","colorId":5,"d":"M200,300 L200,340 L180,290 Z","textX":193,"textY":310},{"id":"foxr15-119hx","colorId":4,"d":"M220,290 L200,340 L240,280 Z","textX":220,"textY":303},{"id":"foxl15-jte6k","colorId":4,"d":"M180,290 L200,340 L160,280 Z","textX":180,"textY":303},{"id":"foxr16-normx","colorId":3,"d":"M240,280 L200,340 L280,280 Z","textX":240,"textY":300},{"id":"foxl16-4f3oe","colorId":3,"d":"M160,280 L200,340 L120,280 Z","textX":160,"textY":300}]},{"id":"bear","name":"Faceted Bear","palette":{"1":"#78350F","2":"#92400E","3":"#B45309","4":"#FDE68A","5":"#D97706","6":"#1E293B","7":"#10B981","8":"#34D399"},"regions":[{"id":"bg1","colorId":7,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":8,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":8,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":7,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"bearr0-prm3b","colorId":3,"d":"M200,80 L240,120 L280,80 Z","textX":240,"textY":93},{"id":"bearl0-0n6xm","colorId":3,"d":"M200,80 L160,120 L120,80 Z","textX":160,"textY":93},{"id":"bearr1-jf3e4","colorId":2,"d":"M240,120 L320,140 L280,80 Z","textX":280,"textY":113},{"id":"bearl1-uo6ho","colorId":2,"d":"M160,120 L80,140 L120,80 Z","textX":120,"textY":113},{"id":"bearr2-95ftd","colorId":2,"d":"M200,80 L200,140 L240,120 Z","textX":213,"textY":113},{"id":"bearl2-ht76n","colorId":2,"d":"M200,80 L200,140 L160,120 Z","textX":187,"textY":113},{"id":"bearr3-km96i","colorId":3,"d":"M200,140 L230,180 L240,120 Z","textX":223,"textY":147},{"id":"bearl3-skjeh","colorId":3,"d":"M200,140 L170,180 L160,120 Z","textX":177,"textY":147},{"id":"bearr4-1h8iv","colorId":2,"d":"M240,120 L280,180 L320,140 Z","textX":280,"textY":147},{"id":"bearl4-i4ppq","colorId":2,"d":"M160,120 L120,180 L80,140 Z","textX":120,"textY":147},{"id":"bearr5-k9xps","colorId":1,"d":"M240,120 L230,180 L280,180 Z","textX":250,"textY":160},{"id":"bearl5-56w61","colorId":1,"d":"M160,120 L170,180 L120,180 Z","textX":150,"textY":160},{"id":"bearr6-j2c32","colorId":2,"d":"M200,140 L200,200 L230,180 Z","textX":210,"textY":173},{"id":"bearl6-jgr7q","colorId":2,"d":"M200,140 L200,200 L170,180 Z","textX":190,"textY":173},{"id":"bearr7-rfpiq","colorId":4,"d":"M200,200 L240,240 L230,180 Z","textX":223,"textY":207},{"id":"bearl7-l96yv","colorId":4,"d":"M200,200 L160,240 L170,180 Z","textX":177,"textY":207},{"id":"bearr8-gdirj","colorId":3,"d":"M230,180 L280,180 L240,240 Z","textX":250,"textY":200},{"id":"bearl8-db0k5","colorId":3,"d":"M170,180 L120,180 L160,240 Z","textX":150,"textY":200},{"id":"bearr9-2cmaq","colorId":1,"d":"M280,180 L320,220 L320,140 Z","textX":307,"textY":180},{"id":"bearl9-c7vv0","colorId":1,"d":"M120,180 L80,220 L80,140 Z","textX":93,"textY":180},{"id":"bearr10-uemsz","colorId":2,"d":"M280,180 L320,220 L240,240 Z","textX":280,"textY":213},{"id":"bearl10-87m59","colorId":2,"d":"M120,180 L80,220 L160,240 Z","textX":120,"textY":213},{"id":"bearr11-fdrky","colorId":5,"d":"M200,200 L200,240 L240,240 Z","textX":213,"textY":227},{"id":"bearl11-buu5x","colorId":5,"d":"M200,200 L200,240 L160,240 Z","textX":187,"textY":227},{"id":"bearr12-dz00x","colorId":6,"d":"M200,240 L200,260 L240,240 Z","textX":213,"textY":247},{"id":"bearl12-53siv","colorId":6,"d":"M200,240 L200,260 L160,240 Z","textX":187,"textY":247},{"id":"bearr13-7q8qe","colorId":4,"d":"M200,260 L200,280 L240,240 Z","textX":213,"textY":260},{"id":"bearl13-a564g","colorId":4,"d":"M200,260 L200,280 L160,240 Z","textX":187,"textY":260},{"id":"bearr14-anqhk","colorId":3,"d":"M240,240 L320,220 L300,280 Z","textX":287,"textY":247},{"id":"bearl14-mn7dj","colorId":3,"d":"M160,240 L80,220 L100,280 Z","textX":113,"textY":247},{"id":"bearr15-w1zrd","colorId":5,"d":"M200,280 L200,320 L240,240 Z","textX":213,"textY":280},{"id":"bearl15-bolev","colorId":5,"d":"M200,280 L200,320 L160,240 Z","textX":187,"textY":280},{"id":"bearr16-r03su","colorId":2,"d":"M240,240 L200,320 L300,280 Z","textX":247,"textY":280},{"id":"bearl16-ejkmw","colorId":2,"d":"M160,240 L200,320 L100,280 Z","textX":153,"textY":280}]},{"id":"cat","name":"Faceted Cat","palette":{"1":"#64748B","2":"#94A3B8","3":"#CBD5E1","4":"#F472B6","5":"#FBCFE8","6":"#1E293B","7":"#A78BFA","8":"#C4B5FD"},"regions":[{"id":"bg1","colorId":7,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":8,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":8,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":7,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"catr0-cbybb","colorId":4,"d":"M230,120 L320,140 L280,60 Z","textX":277,"textY":107},{"id":"catl0-uuou4","colorId":4,"d":"M170,120 L80,140 L120,60 Z","textX":123,"textY":107},{"id":"catr1-lwvzc","colorId":2,"d":"M200,120 L230,120 L280,60 Z","textX":237,"textY":100},{"id":"catl1-fwu4y","colorId":2,"d":"M200,120 L170,120 L120,60 Z","textX":163,"textY":100},{"id":"catr2-gsunu","colorId":1,"d":"M200,120 L200,160 L230,120 Z","textX":210,"textY":133},{"id":"catl2-ybavn","colorId":1,"d":"M200,120 L200,160 L170,120 Z","textX":190,"textY":133},{"id":"catr3-0wxwu","colorId":2,"d":"M200,160 L220,190 L230,120 Z","textX":217,"textY":157},{"id":"catl3-tt9a8","colorId":2,"d":"M200,160 L180,190 L170,120 Z","textX":183,"textY":157},{"id":"catr4-3816r","colorId":1,"d":"M230,120 L260,180 L320,140 Z","textX":270,"textY":147},{"id":"catl4-q47ct","colorId":1,"d":"M170,120 L140,180 L80,140 Z","textX":130,"textY":147},{"id":"catr5-lzk8a","colorId":3,"d":"M230,120 L220,190 L260,180 Z","textX":237,"textY":163},{"id":"catl5-myqod","colorId":3,"d":"M170,120 L180,190 L140,180 Z","textX":163,"textY":163},{"id":"catr6-dn7zw","colorId":2,"d":"M200,160 L200,220 L220,190 Z","textX":207,"textY":190},{"id":"catl6-gwali","colorId":2,"d":"M200,160 L200,220 L180,190 Z","textX":193,"textY":190},{"id":"catr7-342nf","colorId":3,"d":"M200,220 L230,240 L220,190 Z","textX":217,"textY":217},{"id":"catl7-3a7bv","colorId":3,"d":"M200,220 L170,240 L180,190 Z","textX":183,"textY":217},{"id":"catr8-o1wrg","colorId":1,"d":"M220,190 L260,180 L230,240 Z","textX":237,"textY":203},{"id":"catl8-0b9al","colorId":1,"d":"M180,190 L140,180 L170,240 Z","textX":163,"textY":203},{"id":"catr9-yvwb8","colorId":2,"d":"M260,180 L300,220 L320,140 Z","textX":293,"textY":180},{"id":"catl9-k415t","colorId":2,"d":"M140,180 L100,220 L80,140 Z","textX":107,"textY":180},{"id":"catr10-crrkw","colorId":3,"d":"M260,180 L300,220 L230,240 Z","textX":263,"textY":213},{"id":"catl10-2vtlw","colorId":3,"d":"M140,180 L100,220 L170,240 Z","textX":137,"textY":213},{"id":"catr11-vx8p0","colorId":4,"d":"M200,220 L200,240 L230,240 Z","textX":210,"textY":233},{"id":"catl11-yop2n","colorId":4,"d":"M200,220 L200,240 L170,240 Z","textX":190,"textY":233},{"id":"catr12-2vj3x","colorId":5,"d":"M200,240 L200,260 L230,240 Z","textX":210,"textY":247},{"id":"catl12-o7s2k","colorId":5,"d":"M200,240 L200,260 L170,240 Z","textX":190,"textY":247},{"id":"catr13-579y9","colorId":2,"d":"M230,240 L300,220 L260,280 Z","textX":263,"textY":247},{"id":"catl13-j11r6","colorId":2,"d":"M170,240 L100,220 L140,280 Z","textX":137,"textY":247},{"id":"catr14-bu92g","colorId":3,"d":"M200,260 L200,300 L230,240 Z","textX":210,"textY":267},{"id":"catl14-j5hni","colorId":3,"d":"M200,260 L200,300 L170,240 Z","textX":190,"textY":267},{"id":"catr15-qdpja","colorId":1,"d":"M230,240 L200,300 L260,280 Z","textX":230,"textY":273},{"id":"catl15-ytg5y","colorId":1,"d":"M170,240 L200,300 L140,280 Z","textX":170,"textY":273}]},{"id":"turtle","name":"Sea Turtle","palette":{"1":"#059669","2":"#10B981","3":"#34D399","4":"#6EE7B7","5":"#065F46","6":"#0284C7","7":"#38BDF8","8":"#BAE6FD"},"regions":[{"id":"bg1","colorId":6,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":7,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":7,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":8,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"turtler0-x0x97","colorId":2,"d":"M200,40 L200,100 L230,60 Z","textX":210,"textY":67},{"id":"turtlel0-rx7jp","colorId":2,"d":"M200,40 L200,100 L170,60 Z","textX":190,"textY":67},{"id":"turtler1-uupwr","colorId":3,"d":"M230,60 L220,100 L200,100 Z","textX":217,"textY":87},{"id":"turtlel1-dkpv2","colorId":3,"d":"M170,60 L180,100 L200,100 Z","textX":183,"textY":87},{"id":"turtler2-fv85c","colorId":1,"d":"M200,100 L200,120 L220,100 Z","textX":207,"textY":107},{"id":"turtlel2-m1pgh","colorId":1,"d":"M200,100 L200,120 L180,100 Z","textX":193,"textY":107},{"id":"turtler3-ao4kf","colorId":5,"d":"M220,100 L260,140 L200,120 Z","textX":227,"textY":120},{"id":"turtlel3-811ch","colorId":5,"d":"M180,100 L140,140 L200,120 Z","textX":173,"textY":120},{"id":"turtler4-g3ywc","colorId":2,"d":"M220,100 L340,80 L260,140 Z","textX":273,"textY":107},{"id":"turtlel4-mth5k","colorId":2,"d":"M180,100 L60,80 L140,140 Z","textX":127,"textY":107},{"id":"turtler5-qf4ps","colorId":3,"d":"M340,80 L360,140 L260,140 Z","textX":320,"textY":120},{"id":"turtlel5-oqc56","colorId":3,"d":"M60,80 L40,140 L140,140 Z","textX":80,"textY":120},{"id":"turtler6-6fu8b","colorId":4,"d":"M360,140 L280,160 L260,140 Z","textX":300,"textY":147},{"id":"turtlel6-jg7jb","colorId":4,"d":"M40,140 L120,160 L140,140 Z","textX":100,"textY":147},{"id":"turtler7-z2n4i","colorId":1,"d":"M200,120 L200,180 L260,140 Z","textX":220,"textY":147},{"id":"turtlel7-c85qf","colorId":1,"d":"M200,120 L200,180 L140,140 Z","textX":180,"textY":147},{"id":"turtler8-353m9","colorId":2,"d":"M200,180 L200,260 L280,220 Z","textX":227,"textY":220},{"id":"turtlel8-psmt7","colorId":2,"d":"M200,180 L200,260 L120,220 Z","textX":173,"textY":220},{"id":"turtler9-qj56l","colorId":1,"d":"M200,180 L280,220 L260,140 Z","textX":247,"textY":180},{"id":"turtlel9-gluos","colorId":1,"d":"M200,180 L120,220 L140,140 Z","textX":153,"textY":180},{"id":"turtler10-mixyn","colorId":5,"d":"M260,140 L280,220 L280,160 Z","textX":273,"textY":173},{"id":"turtlel10-dwyfs","colorId":5,"d":"M140,140 L120,220 L120,160 Z","textX":127,"textY":173},{"id":"turtler11-85nxn","colorId":1,"d":"M200,260 L200,320 L250,300 Z","textX":217,"textY":293},{"id":"turtlel11-0vkot","colorId":1,"d":"M200,260 L200,320 L150,300 Z","textX":183,"textY":293},{"id":"turtler12-txxh0","colorId":2,"d":"M200,260 L250,300 L280,220 Z","textX":243,"textY":260},{"id":"turtlel12-umgu4","colorId":2,"d":"M200,260 L150,300 L120,220 Z","textX":157,"textY":260},{"id":"turtler13-xk095","colorId":3,"d":"M200,320 L200,360 L230,350 Z","textX":210,"textY":343},{"id":"turtlel13-nep4p","colorId":3,"d":"M200,320 L200,360 L170,350 Z","textX":190,"textY":343},{"id":"turtler14-n2ayo","colorId":2,"d":"M200,320 L230,350 L250,300 Z","textX":227,"textY":323},{"id":"turtlel14-lx7e0","colorId":2,"d":"M200,320 L170,350 L150,300 Z","textX":173,"textY":323},{"id":"turtler15-lnt9s","colorId":4,"d":"M250,300 L230,350 L280,380 Z","textX":253,"textY":343},{"id":"turtlel15-irbx9","colorId":4,"d":"M150,300 L170,350 L120,380 Z","textX":147,"textY":343},{"id":"turtler16-6flby","colorId":5,"d":"M280,220 L250,300 L280,380 Z","textX":270,"textY":300},{"id":"turtlel16-nyfw9","colorId":5,"d":"M120,220 L150,300 L120,380 Z","textX":130,"textY":300}]},{"id":"unicorn","name":"Mystic Unicorn","palette":{"1":"#FFFFFF","2":"#F3F4F6","3":"#E5E7EB","4":"#A78BFA","5":"#F472B6","6":"#34D399","7":"#FBBF24","8":"#FDF4FF"},"regions":[{"id":"bg1","colorId":8,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":8,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":8,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":8,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"unicornr0-scdt6","colorId":7,"d":"M200,20 L200,60 L215,60 Z","textX":205,"textY":47},{"id":"unicornl0-hpkxs","colorId":7,"d":"M200,20 L200,60 L185,60 Z","textX":195,"textY":47},{"id":"unicornr1-h9sgg","colorId":4,"d":"M200,60 L200,100 L220,100 Z","textX":207,"textY":87},{"id":"unicornl1-u1u5i","colorId":4,"d":"M200,60 L200,100 L180,100 Z","textX":193,"textY":87},{"id":"unicornr2-jc0g0","colorId":5,"d":"M200,60 L220,100 L215,60 Z","textX":212,"textY":73},{"id":"unicornl2-dzg3r","colorId":5,"d":"M200,60 L180,100 L185,60 Z","textX":188,"textY":73},{"id":"unicornr3-w2xf7","colorId":1,"d":"M200,100 L200,140 L230,130 Z","textX":210,"textY":123},{"id":"unicornl3-opw2l","colorId":1,"d":"M200,100 L200,140 L170,130 Z","textX":190,"textY":123},{"id":"unicornr4-wc9c6","colorId":2,"d":"M200,100 L230,130 L220,100 Z","textX":217,"textY":110},{"id":"unicornl4-sq8nv","colorId":2,"d":"M200,100 L170,130 L180,100 Z","textX":183,"textY":110},{"id":"unicornr5-zun2j","colorId":1,"d":"M220,100 L230,130 L260,80 Z","textX":237,"textY":103},{"id":"unicornl5-79ho8","colorId":1,"d":"M180,100 L170,130 L140,80 Z","textX":163,"textY":103},{"id":"unicornr6-kbe0d","colorId":5,"d":"M230,130 L280,140 L260,80 Z","textX":257,"textY":117},{"id":"unicornl6-dgf8o","colorId":5,"d":"M170,130 L120,140 L140,80 Z","textX":143,"textY":117},{"id":"unicornr7-gqw0s","colorId":2,"d":"M200,140 L220,190 L230,130 Z","textX":217,"textY":153},{"id":"unicornl7-nbb8k","colorId":2,"d":"M200,140 L180,190 L170,130 Z","textX":183,"textY":153},{"id":"unicornr8-u53hi","colorId":1,"d":"M230,130 L260,190 L280,140 Z","textX":257,"textY":153},{"id":"unicornl8-9x0yp","colorId":1,"d":"M170,130 L140,190 L120,140 Z","textX":143,"textY":153},{"id":"unicornr9-jrfp5","colorId":3,"d":"M230,130 L220,190 L260,190 Z","textX":237,"textY":170},{"id":"unicornl9-asom1","colorId":3,"d":"M170,130 L180,190 L140,190 Z","textX":163,"textY":170},{"id":"unicornr10-1l0ih","colorId":1,"d":"M200,140 L200,200 L220,190 Z","textX":207,"textY":177},{"id":"unicornl10-krwol","colorId":1,"d":"M200,140 L200,200 L180,190 Z","textX":193,"textY":177},{"id":"unicornr11-5cddc","colorId":2,"d":"M200,200 L240,280 L220,190 Z","textX":220,"textY":223},{"id":"unicornl11-y0pj8","colorId":2,"d":"M200,200 L160,280 L180,190 Z","textX":180,"textY":223},{"id":"unicornr12-ujyo9","colorId":3,"d":"M220,190 L260,190 L240,280 Z","textX":240,"textY":220},{"id":"unicornl12-y4anl","colorId":3,"d":"M180,190 L140,190 L160,280 Z","textX":160,"textY":220},{"id":"unicornr13-wigxv","colorId":4,"d":"M260,190 L280,180 L280,140 Z","textX":273,"textY":170},{"id":"unicornl13-7syri","colorId":4,"d":"M140,190 L120,180 L120,140 Z","textX":127,"textY":170},{"id":"unicornr14-knw50","colorId":6,"d":"M260,190 L280,260 L280,180 Z","textX":273,"textY":210},{"id":"unicornl14-n1fvt","colorId":6,"d":"M140,190 L120,260 L120,180 Z","textX":127,"textY":210},{"id":"unicornr15-djnqh","colorId":5,"d":"M280,180 L320,240 L280,260 Z","textX":293,"textY":227},{"id":"unicornl15-69eyh","colorId":5,"d":"M120,180 L80,240 L120,260 Z","textX":107,"textY":227},{"id":"unicornr16-x3cv6","colorId":2,"d":"M260,190 L240,280 L280,260 Z","textX":260,"textY":243},{"id":"unicornl16-cl7xt","colorId":2,"d":"M140,190 L160,280 L120,260 Z","textX":140,"textY":243},{"id":"unicornr17-674k2","colorId":1,"d":"M200,200 L200,260 L240,280 Z","textX":213,"textY":247},{"id":"unicornl17-kid1v","colorId":1,"d":"M200,200 L200,260 L160,280 Z","textX":187,"textY":247},{"id":"unicornr18-nmx88","colorId":5,"d":"M200,260 L200,300 L240,280 Z","textX":213,"textY":280},{"id":"unicornl18-ijtjb","colorId":5,"d":"M200,260 L200,300 L160,280 Z","textX":187,"textY":280},{"id":"unicornr19-6b59m","colorId":3,"d":"M200,300 L200,340 L240,280 Z","textX":213,"textY":307},{"id":"unicornl19-trtmt","colorId":3,"d":"M200,300 L200,340 L160,280 Z","textX":187,"textY":307},{"id":"unicornr20-fn8ie","colorId":1,"d":"M240,280 L200,340 L280,260 Z","textX":240,"textY":293},{"id":"unicornl20-ieahx","colorId":1,"d":"M160,280 L200,340 L120,260 Z","textX":160,"textY":293}]},{"id":"tree","name":"Faceted Tree","palette":{"1":"#065F46","2":"#059669","3":"#10B981","4":"#34D399","5":"#78350F","6":"#92400E","7":"#BAE6FD","8":"#7DD3FC"},"regions":[{"id":"bg1","colorId":7,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":8,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":8,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":7,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"treer0-h8yv7","colorId":3,"d":"M200,40 L200,100 L260,120 Z","textX":220,"textY":87},{"id":"treel0-y2y69","colorId":3,"d":"M200,40 L200,100 L140,120 Z","textX":180,"textY":87},{"id":"treer1-aqq48","colorId":2,"d":"M200,100 L230,140 L260,120 Z","textX":230,"textY":120},{"id":"treel1-c6hb4","colorId":2,"d":"M200,100 L170,140 L140,120 Z","textX":170,"textY":120},{"id":"treer2-tstjx","colorId":4,"d":"M200,100 L200,160 L230,140 Z","textX":210,"textY":133},{"id":"treel2-a7lch","colorId":4,"d":"M200,100 L200,160 L170,140 Z","textX":190,"textY":133},{"id":"treer3-tvqx4","colorId":2,"d":"M200,160 L300,200 L230,140 Z","textX":243,"textY":167},{"id":"treel3-uyza1","colorId":2,"d":"M200,160 L100,200 L170,140 Z","textX":157,"textY":167},{"id":"treer4-a5dux","colorId":1,"d":"M230,140 L300,200 L260,120 Z","textX":263,"textY":153},{"id":"treel4-gab7t","colorId":1,"d":"M170,140 L100,200 L140,120 Z","textX":137,"textY":153},{"id":"treer5-t66b2","colorId":3,"d":"M200,160 L200,220 L240,220 Z","textX":213,"textY":200},{"id":"treel5-4d1i2","colorId":3,"d":"M200,160 L200,220 L160,220 Z","textX":187,"textY":200},{"id":"treer6-ly02t","colorId":2,"d":"M200,220 L340,280 L240,220 Z","textX":260,"textY":240},{"id":"treel6-qckdl","colorId":2,"d":"M200,220 L60,280 L160,220 Z","textX":140,"textY":240},{"id":"treer7-j20jo","colorId":1,"d":"M240,220 L340,280 L300,200 Z","textX":293,"textY":233},{"id":"treel7-tcfm7","colorId":1,"d":"M160,220 L60,280 L100,200 Z","textX":107,"textY":233},{"id":"treer8-15jai","colorId":4,"d":"M200,220 L200,280 L260,280 Z","textX":220,"textY":260},{"id":"treel8-aqzaq","colorId":4,"d":"M200,220 L200,280 L140,280 Z","textX":180,"textY":260},{"id":"treer9-21jby","colorId":3,"d":"M200,280 L340,280 L260,280 Z","textX":267,"textY":280},{"id":"treel9-9h5wh","colorId":3,"d":"M200,280 L60,280 L140,280 Z","textX":133,"textY":280},{"id":"treer10-e8y50","colorId":6,"d":"M200,280 L200,360 L220,360 Z","textX":207,"textY":333},{"id":"treel10-rzqk7","colorId":6,"d":"M200,280 L200,360 L180,360 Z","textX":193,"textY":333},{"id":"treer11-rl5l7","colorId":5,"d":"M200,280 L220,360 L260,280 Z","textX":227,"textY":307},{"id":"treel11-jqwzo","colorId":5,"d":"M200,280 L180,360 L140,280 Z","textX":173,"textY":307}]},{"id":"bird","name":"Flying Bird","palette":{"1":"#EF4444","2":"#F97316","3":"#F59E0B","4":"#10B981","5":"#3B82F6","6":"#8B5CF6","7":"#1E293B","8":"#F8FAFC"},"regions":[{"id":"bg1","colorId":8,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":8,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":8,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":8,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"birdr0-mxtea","colorId":3,"d":"M200,40 L200,100 L220,80 Z","textX":207,"textY":73},{"id":"birdl0-m16ik","colorId":3,"d":"M200,40 L200,100 L180,80 Z","textX":193,"textY":73},{"id":"birdr1-m2xew","colorId":2,"d":"M200,100 L230,140 L220,80 Z","textX":217,"textY":107},{"id":"birdl1-vfdgq","colorId":2,"d":"M200,100 L170,140 L180,80 Z","textX":183,"textY":107},{"id":"birdr2-d0rvu","colorId":1,"d":"M200,100 L200,180 L230,140 Z","textX":210,"textY":140},{"id":"birdl2-2kzwg","colorId":1,"d":"M200,100 L200,180 L170,140 Z","textX":190,"textY":140},{"id":"birdr3-s43vc","colorId":4,"d":"M230,140 L280,120 L220,80 Z","textX":243,"textY":113},{"id":"birdl3-x5226","colorId":4,"d":"M170,140 L120,120 L180,80 Z","textX":157,"textY":113},{"id":"birdr4-w0l3x","colorId":5,"d":"M280,120 L360,60 L220,80 Z","textX":287,"textY":87},{"id":"birdl4-95tnk","colorId":5,"d":"M120,120 L40,60 L180,80 Z","textX":113,"textY":87},{"id":"birdr5-tl6mw","colorId":2,"d":"M230,140 L260,200 L280,120 Z","textX":257,"textY":153},{"id":"birdl5-pntxm","colorId":2,"d":"M170,140 L140,200 L120,120 Z","textX":143,"textY":153},{"id":"birdr6-nz1bh","colorId":6,"d":"M280,120 L380,160 L360,60 Z","textX":340,"textY":113},{"id":"birdl6-dfjoo","colorId":6,"d":"M120,120 L20,160 L40,60 Z","textX":60,"textY":113},{"id":"birdr7-6v1gu","colorId":4,"d":"M280,120 L260,200 L380,160 Z","textX":307,"textY":160},{"id":"birdl7-7oigg","colorId":4,"d":"M120,120 L140,200 L20,160 Z","textX":93,"textY":160},{"id":"birdr8-7ml9m","colorId":1,"d":"M200,180 L260,200 L230,140 Z","textX":230,"textY":173},{"id":"birdl8-7luhx","colorId":1,"d":"M200,180 L140,200 L170,140 Z","textX":170,"textY":173},{"id":"birdr9-x8wu5","colorId":2,"d":"M200,180 L240,320 L260,200 Z","textX":233,"textY":233},{"id":"birdl9-8f7ve","colorId":2,"d":"M200,180 L160,320 L140,200 Z","textX":167,"textY":233},{"id":"birdr10-c0i2p","colorId":5,"d":"M260,200 L320,260 L380,160 Z","textX":320,"textY":207},{"id":"birdl10-5n5i0","colorId":5,"d":"M140,200 L80,260 L20,160 Z","textX":80,"textY":207},{"id":"birdr11-jibql","colorId":3,"d":"M260,200 L240,320 L320,260 Z","textX":273,"textY":260},{"id":"birdl11-l94e1","colorId":3,"d":"M140,200 L160,320 L80,260 Z","textX":127,"textY":260},{"id":"birdr12-jimgk","colorId":1,"d":"M200,180 L200,360 L240,320 Z","textX":213,"textY":287},{"id":"birdl12-tnwqc","colorId":1,"d":"M200,180 L200,360 L160,320 Z","textX":187,"textY":287}]},{"id":"whale","name":"Ocean Whale","palette":{"1":"#0284C7","2":"#0369A1","3":"#38BDF8","4":"#7DD3FC","5":"#E0F2FE","6":"#0C4A6E","7":"#BAE6FD","8":"#F8FAFC"},"regions":[{"id":"bg1","colorId":7,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":7,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":7,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":7,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"whaler0-tb8jz","colorId":5,"d":"M200,60 L200,140 L240,80 Z","textX":213,"textY":93},{"id":"whalel0-38wi3","colorId":5,"d":"M200,60 L200,140 L160,80 Z","textX":187,"textY":93},{"id":"whaler1-jp53f","colorId":4,"d":"M200,140 L280,180 L240,80 Z","textX":240,"textY":133},{"id":"whalel1-mq1pt","colorId":4,"d":"M200,140 L120,180 L160,80 Z","textX":160,"textY":133},{"id":"whaler2-xvldv","colorId":1,"d":"M200,140 L200,220 L280,180 Z","textX":227,"textY":180},{"id":"whalel2-xr5ec","colorId":1,"d":"M200,140 L200,220 L120,180 Z","textX":173,"textY":180},{"id":"whaler3-o3l6w","colorId":2,"d":"M200,220 L260,200 L280,180 Z","textX":247,"textY":200},{"id":"whalel3-rbd6j","colorId":2,"d":"M200,220 L140,200 L120,180 Z","textX":153,"textY":200},{"id":"whaler4-rfd16","colorId":6,"d":"M200,220 L280,240 L260,200 Z","textX":247,"textY":220},{"id":"whalel4-djtlq","colorId":6,"d":"M200,220 L120,240 L140,200 Z","textX":153,"textY":220},{"id":"whaler5-jfs1b","colorId":3,"d":"M200,220 L200,280 L280,240 Z","textX":227,"textY":247},{"id":"whalel5-mxvlv","colorId":3,"d":"M200,220 L200,280 L120,240 Z","textX":173,"textY":247},{"id":"whaler6-lk8ek","colorId":4,"d":"M200,280 L260,300 L280,240 Z","textX":247,"textY":273},{"id":"whalel6-bb966","colorId":4,"d":"M200,280 L140,300 L120,240 Z","textX":153,"textY":273},{"id":"whaler7-y3m7w","colorId":2,"d":"M280,240 L360,260 L260,300 Z","textX":300,"textY":267},{"id":"whalel7-ptblm","colorId":2,"d":"M120,240 L40,260 L140,300 Z","textX":100,"textY":267},{"id":"whaler8-jzx73","colorId":1,"d":"M280,180 L360,260 L280,240 Z","textX":307,"textY":227},{"id":"whalel8-a1hzi","colorId":1,"d":"M120,180 L40,260 L120,240 Z","textX":93,"textY":227},{"id":"whaler9-ooz2x","colorId":3,"d":"M200,280 L200,340 L260,300 Z","textX":220,"textY":307},{"id":"whalel9-rrnsg","colorId":3,"d":"M200,280 L200,340 L140,300 Z","textX":180,"textY":307},{"id":"whaler10-3opy3","colorId":2,"d":"M200,340 L280,360 L260,300 Z","textX":247,"textY":333},{"id":"whalel10-r9dt5","colorId":2,"d":"M200,340 L120,360 L140,300 Z","textX":153,"textY":333},{"id":"whaler11-8c8ct","colorId":1,"d":"M200,340 L200,380 L280,360 Z","textX":227,"textY":360},{"id":"whalel11-zo8a0","colorId":1,"d":"M200,340 L200,380 L120,360 Z","textX":173,"textY":360}]},{"id":"mushroom","name":"Magic Mushroom","palette":{"1":"#EC4899","2":"#BE185D","3":"#FBCFE8","4":"#831843","5":"#FDE047","6":"#FEF08A","7":"#1E293B","8":"#0F172A"},"regions":[{"id":"bg1","colorId":8,"d":"M0,0 L200,0 L200,200 L0,200 Z","textX":50,"textY":50},{"id":"bg2","colorId":7,"d":"M200,0 L400,0 L400,200 L200,200 Z","textX":350,"textY":50},{"id":"bg3","colorId":7,"d":"M0,200 L200,200 L200,400 L0,400 Z","textX":50,"textY":350},{"id":"bg4","colorId":8,"d":"M200,200 L400,200 L400,400 L200,400 Z","textX":350,"textY":350},{"id":"mushroomr0-kg9m3","colorId":1,"d":"M200,60 L200,140 L260,120 Z","textX":220,"textY":107},{"id":"mushrooml0-elq6h","colorId":1,"d":"M200,60 L200,140 L140,120 Z","textX":180,"textY":107},{"id":"mushroomr1-r87x9","colorId":2,"d":"M200,60 L260,120 L260,80 Z","textX":240,"textY":87},{"id":"mushrooml1-3c53c","colorId":2,"d":"M200,60 L140,120 L140,80 Z","textX":160,"textY":87},{"id":"mushroomr2-ijmdq","colorId":1,"d":"M260,80 L260,120 L320,140 Z","textX":280,"textY":113},{"id":"mushrooml2-4ueh2","colorId":1,"d":"M140,80 L140,120 L80,140 Z","textX":120,"textY":113},{"id":"mushroomr3-fntvm","colorId":2,"d":"M260,120 L280,180 L320,140 Z","textX":287,"textY":147},{"id":"mushrooml3-3ihbe","colorId":2,"d":"M140,120 L120,180 L80,140 Z","textX":113,"textY":147},{"id":"mushroomr4-d2pow","colorId":3,"d":"M200,140 L280,180 L260,120 Z","textX":247,"textY":147},{"id":"mushrooml4-2g7is","colorId":3,"d":"M200,140 L120,180 L140,120 Z","textX":153,"textY":147},{"id":"mushroomr5-1wfza","colorId":2,"d":"M200,140 L200,200 L280,180 Z","textX":227,"textY":173},{"id":"mushrooml5-6kjz0","colorId":2,"d":"M200,140 L200,200 L120,180 Z","textX":173,"textY":173},{"id":"mushroomr6-jtiq3","colorId":1,"d":"M280,180 L360,200 L320,140 Z","textX":320,"textY":173},{"id":"mushrooml6-gkbkm","colorId":1,"d":"M120,180 L40,200 L80,140 Z","textX":80,"textY":173},{"id":"mushroomr7-j26ea","colorId":5,"d":"M200,200 L200,280 L230,240 Z","textX":210,"textY":240},{"id":"mushrooml7-6l9jl","colorId":5,"d":"M200,200 L200,280 L170,240 Z","textX":190,"textY":240},{"id":"mushroomr8-m4ysz","colorId":6,"d":"M200,200 L230,240 L280,180 Z","textX":237,"textY":207},{"id":"mushrooml8-9y4vh","colorId":6,"d":"M200,200 L170,240 L120,180 Z","textX":163,"textY":207},{"id":"mushroomr9-xmdb2","colorId":5,"d":"M200,280 L200,360 L250,340 Z","textX":217,"textY":327},{"id":"mushrooml9-vsizg","colorId":5,"d":"M200,280 L200,360 L150,340 Z","textX":183,"textY":327},{"id":"mushroomr10-iptsu","colorId":6,"d":"M200,280 L250,340 L230,240 Z","textX":227,"textY":287},{"id":"mushrooml10-yr2ru","colorId":6,"d":"M200,280 L150,340 L170,240 Z","textX":173,"textY":287}]},{"id":"mountain","name":"Mountain Peaks","palette":{"1":"#64748B","2":"#475569","3":"#94A3B8","4":"#22C55E","5":"#FCD34D","6":"#3B82F6","7":"#BAE6FD","8":"#FFFFFF"},"regions":[{"id":"sky","colorId":7,"d":"M0,0 L400,0 L400,240 L0,240 Z","textX":350,"textY":50},{"id":"mt-p116m","colorId":1,"d":"M200,60 L300,240 L100,240 Z","textX":200,"textY":180},{"id":"sn-r3aux","colorId":8,"d":"M200,60 L240,120 L160,120 Z","textX":200,"textY":100},{"id":"mt-nd073","colorId":2,"d":"M100,120 L180,240 L20,240 Z","textX":100,"textY":200},{"id":"sn-tl3vn","colorId":8,"d":"M100,120 L130,160 L70,160 Z","textX":100,"textY":147},{"id":"mt-eydo6","colorId":3,"d":"M320,100 L400,240 L240,240 Z","textX":320,"textY":193},{"id":"sn-tlkov","colorId":8,"d":"M320,100 L350,140 L290,140 Z","textX":320,"textY":127},{"id":"gr-tlsd6","colorId":4,"d":"M0,240 L200,240 L100,320 L0,320 Z","textX":75,"textY":280},{"id":"gr-4c4b1","colorId":5,"d":"M200,240 L400,240 L400,320 L300,320 Z","textX":325,"textY":280},{"id":"lk-18qdq","colorId":6,"d":"M100,320 L300,320 L200,240 Z","textX":200,"textY":293},{"id":"gr-k1u4g","colorId":4,"d":"M0,320 L400,320 L400,400 L0,400 Z","textX":200,"textY":360},{"id":"lk-52cmv","colorId":6,"d":"M120,320 L280,320 L260,400 L140,400 Z","textX":200,"textY":360},{"id":"su-n5fhn","colorId":5,"d":"M40,40 L80,20 L120,40 L100,80 L60,80 Z","textX":80,"textY":52}]}]')
];
