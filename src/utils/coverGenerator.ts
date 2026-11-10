/**
 * Generador de portadas literarias con IA / Canvas procedural
 * Crea portadas artísticas en proporción 3:4 con tipografía editorial,
 * marcos ornamentales y paletas de color estilizadas.
 */

export interface CoverStyle {
  id: string;
  name: string;
  bgGradient: [string, string, string];
  accentColor: string;
  frameColor: string;
  genre: string;
  ornament: 'classic' | 'stars' | 'geometric' | 'minimal' | 'vintage';
}

export const COVER_STYLES: CoverStyle[] = [
  {
    id: 'gothic_dark',
    name: 'Misterio Gótico',
    bgGradient: ['#0f0d13', '#1e1b24', '#08070a'],
    accentColor: '#d4af37',
    frameColor: '#8c7843',
    genre: 'Misterio & Gótico',
    ornament: 'vintage',
  },
  {
    id: 'celestial_fantasy',
    name: 'Fantasía Astral',
    bgGradient: ['#120c24', '#2a1a4a', '#441d4f'],
    accentColor: '#fde047',
    frameColor: '#eab308',
    genre: 'Fantasía Épica',
    ornament: 'stars',
  },
  {
    id: 'cyberpunk_scifi',
    name: 'Speculative Sci-Fi',
    bgGradient: ['#05151b', '#0b2e38', '#030c0f'],
    accentColor: '#38bdf8',
    frameColor: '#0284c7',
    genre: 'Ciencia Ficción',
    ornament: 'geometric',
  },
  {
    id: 'romantic_ocean',
    name: 'Poesía del Mar',
    bgGradient: ['#0c1b26', '#1a3a4d', '#284e60'],
    accentColor: '#f1f5f9',
    frameColor: '#94a3b8',
    genre: 'Poesía',
    ornament: 'minimal',
  },
  {
    id: 'surreal_gold',
    name: 'Surrealismo Ámbar',
    bgGradient: ['#1c1006', '#3b220c', '#150903'],
    accentColor: '#fbbf24',
    frameColor: '#b45309',
    genre: 'Microrrelato',
    ornament: 'classic',
  },
];

export function generateAICoverCanvas(
  title: string,
  authorName: string,
  subtitle: string = '',
  style: CoverStyle,
  promptKeyword: string = ''
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800; // 3:4 book cover aspect ratio
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const w = canvas.width;
  const h = canvas.height;

  // 1. Fondo en gradiente dramático
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, style.bgGradient[0]);
  grad.addColorStop(0.5, style.bgGradient[1]);
  grad.addColorStop(1, style.bgGradient[2]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // 2. Textura y nebulosa artística procedural
  ctx.save();
  for (let i = 0; i < 40; i++) {
    const rx = Math.random() * w;
    const ry = Math.random() * h;
    const rad = 40 + Math.random() * 120;
    const alpha = 0.03 + Math.random() * 0.08;
    const radial = ctx.createRadialGradient(rx, ry, 5, rx, ry, rad);
    radial.addColorStop(0, style.accentColor);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(rx, ry, rad, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Destellos estelares / partículas si aplica
  if (style.ornament === 'stars') {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * (h * 0.7);
      const sRad = Math.random() * 2;
      ctx.globalAlpha = Math.random() * 0.8;
      ctx.beginPath();
      ctx.arc(sx, sy, sRad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Marco ornamental clásico de libro encuadernado
  ctx.save();
  ctx.strokeStyle = style.frameColor;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2;
  // Marco exterior
  ctx.strokeRect(30, 30, w - 60, h - 60);

  // Marco interior con esquinas
  ctx.strokeStyle = style.accentColor;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 1;
  ctx.strokeRect(42, 42, w - 84, h - 84);

  // Pequeños remates en las esquinas
  const cornerSize = 14;
  const corners = [
    [42, 42],
    [w - 42, 42],
    [42, h - 42],
    [w - 42, h - 42],
  ];
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = style.accentColor;
    ctx.fill();
  });
  ctx.restore();

  // 5. Lomo y sombra de encuadernación lateral
  const spineGrad = ctx.createLinearGradient(0, 0, 35, 0);
  spineGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
  spineGrad.addColorStop(0.7, 'rgba(0,0,0,0.15)');
  spineGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = spineGrad;
  ctx.fillRect(0, 0, 35, h);

  // 6. Tipografía Editorial: Título, Subtítulo y Autor
  ctx.textAlign = 'center';

  // Género Kicker en parte superior
  ctx.fillStyle = style.accentColor;
  ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.globalAlpha = 0.9;
  ctx.fillText(style.genre.toUpperCase(), w / 2, 90);

  // Línea divisoria sutil
  ctx.strokeStyle = style.accentColor;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 50, 105);
  ctx.lineTo(w / 2 + 50, 105);
  ctx.stroke();

  // Título principal
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 1;
  ctx.font = 'bold 36px "Cormorant Garamond", Georgia, serif';

  // Auto-ajuste de líneas si el título es largo
  const words = (title || 'Título de la Obra').split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width > w - 140) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) lines.push(currentLine);

  let startY = 220;
  lines.forEach((line, idx) => {
    // Sombra sutil
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillText(line, w / 2 + 1, startY + idx * 42 + 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(line, w / 2, startY + idx * 42);
  });

  // Subtítulo
  if (subtitle) {
    ctx.font = 'italic 16px "Lora", Georgia, serif';
    ctx.fillStyle = style.accentColor;
    ctx.globalAlpha = 0.85;
    ctx.fillText(subtitle, w / 2, startY + lines.length * 42 + 15);
  }

  // Medallón / Insignia central estilizada
  ctx.save();
  ctx.translate(w / 2, h / 2 + 40);
  ctx.strokeStyle = style.accentColor;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, 36, 0, Math.PI * 2);
  ctx.stroke();

  ctx.font = '22px "Cormorant Garamond", serif';
  ctx.fillStyle = style.accentColor;
  ctx.globalAlpha = 0.8;
  ctx.fillText('✦', 0, 8);
  ctx.restore();

  // Autor en la parte inferior
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.font = 'bold 20px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(authorName || 'Autor de Tikbook', w / 2 + 1, h - 90 + 1);

  ctx.fillStyle = style.accentColor;
  ctx.fillText(authorName || 'Autor de Tikbook', w / 2, h - 90);

  ctx.font = '500 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.globalAlpha = 0.7;
  ctx.letterSpacing = '1px';
  ctx.fillText('TIKBOOK EDICIÓN ORIGINAL', w / 2, h - 65);

  return canvas.toDataURL('image/jpeg', 0.92);
}
