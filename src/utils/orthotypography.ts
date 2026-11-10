/**
 * Corrector ortotipográfico profesional para edición literaria en español
 * y motor de maquetación automática para formato E-Book.
 */

import { Chapter } from '../types';

export interface OrthotypographyResult {
  formattedChapters: Chapter[];
  extractedHook: string;
  report: {
    dialogueDashes: number;
    latinQuotes: number;
    punctuationMarks: number;
    ellipses: number;
    spacesFixed: number;
    totalCorrections: number;
    chapterCount: number;
    wordCount: number;
    estimatedMinutes: number;
  };
}

export function processAndTypesetText(rawText: string, defaultTitle: string = 'Obra Literaria'): OrthotypographyResult {
  let text = rawText.trim();
  let dialogueDashes = 0;
  let latinQuotes = 0;
  let punctuationMarks = 0;
  let ellipses = 0;
  let spacesFixed = 0;

  // 1. Normalizar saltos de línea (eliminar \r)
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Corregir espacios múltiples y espacios antes de puntuación
  const originalSpaces = (text.match(/ {2,}/g) || []).length;
  text = text.replace(/ {2,}/g, ' ');
  spacesFixed += originalSpaces;

  // Espacio antes de signos de cierre (. , : ; ! ? )
  text = text.replace(/ +([.,:;!?»”])/g, (match, p1) => {
    spacesFixed++;
    return p1;
  });

  // Espacio después de signos de apertura (¿ ¡ « “ )
  text = text.replace(/([¿¡«“]) +/g, (match, p1) => {
    spacesFixed++;
    return p1;
  });

  // 3. Puntos suspensivos (... -> …)
  const dotsMatches = (text.match(/\.{3,}/g) || []).length;
  text = text.replace(/\.{3,}/g, '…');
  ellipses += dotsMatches;

  // 4. Rayas de diálogo españolas (—)
  // Reemplazar guiones simples o dobles al inicio de línea o diálogo
  text = text.replace(/(^|\n)[ \t]*[-–—]+[ \t]*/gm, () => {
    dialogueDashes++;
    return '$1— ';
  });

  // Incisos de diálogo: " —dijo él— "
  text = text.replace(/ +[-–—]+ +/g, () => {
    dialogueDashes++;
    return ' —';
  });

  // 5. Comillas latinas españolas (« »)
  // Convertir comillas rectas "texto" en comillas latinas «texto»
  text = text.replace(/"([^"\n]+)"/g, (_, content) => {
    latinQuotes += 2;
    return `«${content.trim()}»`;
  });

  // 6. Signos dobles en español (¿ y ¡)
  // Si una frase termina en ? y la oración anterior no tiene ¿, añadir ¿
  const sentences = text.split(/(?<=[.!?…\n])/);
  const correctedSentences = sentences.map(sentence => {
    let s = sentence;
    // Si contiene ? y no tiene ¿
    if (s.includes('?') && !s.includes('¿')) {
      s = s.replace(/([A-ZÁÉÍÓÚÑa-záéíóúñ][^?]*\?)/g, (m) => {
        punctuationMarks++;
        return `¿${m}`;
      });
    }
    // Si contiene ! y no tiene ¡
    if (s.includes('!') && !s.includes('¡')) {
      s = s.replace(/([A-ZÁÉÍÓÚÑa-záéíóúñ][^!]*\!)/g, (m) => {
        punctuationMarks++;
        return `¡${m}`;
      });
    }
    return s;
  });
  text = correctedSentences.join('');

  // 7. MAQUETACIÓN AUTOMÁTICA EN CAPÍTULOS PARA E-BOOK
  // Intentar detectar títulos de capítulos explícitos
  const chapterRegex = /(?:^|\n\n+)(Capítulo\s+[0-9IVXLCDM]+[^\n]*|Acto\s+[0-9IVXLCDM]+[^\n]*|Parte\s+[0-9IVXLCDM]+[^\n]*|[0-9IVXLCDM]+\.\s+[^\n]*)/i;

  let chapters: Chapter[] = [];
  const rawParts = text.split(/(?:^|\n\n+)(?=Capítulo\s+[0-9IVXLCDM]+|Acto\s+[0-9IVXLCDM]+|Parte\s+[0-9IVXLCDM]+|[0-9IVXLCDM]+\.\s+)/i).filter(p => p.trim().length > 0);

  if (rawParts.length > 1) {
    // Se detectaron capítulos formales
    chapters = rawParts.map((part, index) => {
      const lines = part.trim().split('\n').filter(l => l.trim().length > 0);
      let title = `Capítulo ${index + 1}`;
      let contentLines = lines;

      if (lines[0] && (lines[0].toLowerCase().includes('capítulo') || lines[0].toLowerCase().includes('parte') || lines[0].toLowerCase().includes('acto') || /^[0-9IVXLCDM]+\./.test(lines[0]))) {
        title = lines[0].trim();
        contentLines = lines.slice(1);
      }

      // Si no quedaron párrafos, poner el contenido
      if (contentLines.length === 0) contentLines = [lines[0]];

      // Agrupar en párrafos limpios
      const paragraphs = contentLines.join('\n').split('\n\n').map(p => p.trim()).filter(Boolean);

      return {
        number: index + 1,
        title,
        content: paragraphs.length > 0 ? paragraphs : [part.trim()],
      };
    });
  } else {
    // Si no tiene capítulos explícitos, maquetar por bloques de lectura cómodos (3-5 párrafos por capítulo o por pausas * * *)
    const scenes = text.split(/(?:\n\s*[*#\-]{3,}\s*\n|\n\n{2,})/);
    const paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);

    if (paragraphs.length <= 4) {
      // Obra corta / Microrrelato o Poema
      chapters = [
        {
          number: 1,
          title: 'I. Obra Completa',
          content: paragraphs.length > 0 ? paragraphs : [text],
        },
      ];
    } else {
      // Dividir automáticamente en capítulos de 3 a 5 párrafos para lectura en eBook
      const chunkSize = 4;
      const totalChapters = Math.ceil(paragraphs.length / chunkSize);
      chapters = [];

      for (let i = 0; i < totalChapters; i++) {
        const chunk = paragraphs.slice(i * chunkSize, (i + 1) * chunkSize);
        chapters.push({
          number: i + 1,
          title: totalChapters === 1 ? 'I. Inicio' : `Capítulo ${i + 1}`,
          content: chunk,
        });
      }
    }
  }

  // 8. EXTRAER EL «GANCHO» PARA EL FEED TIKBOOK
  // Toma las primeras 2 frases o el primer párrafo potente (hasta ~220 caracteres)
  let extractedHook = '';
  if (chapters[0] && chapters[0].content[0]) {
    const firstP = chapters[0].content[0];
    if (firstP.length <= 260) {
      extractedHook = firstP;
    } else {
      const match = firstP.match(/^([^.!?…]+[.!?…][^.!?…]+[.!?…])/);
      extractedHook = match ? match[1] : firstP.slice(0, 240) + '…';
    }
  } else {
    extractedHook = text.slice(0, 200) + '…';
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / 200));

  return {
    formattedChapters: chapters,
    extractedHook,
    report: {
      dialogueDashes,
      latinQuotes,
      punctuationMarks,
      ellipses,
      spacesFixed,
      totalCorrections: dialogueDashes + latinQuotes + punctuationMarks + ellipses + spacesFixed,
      chapterCount: chapters.length,
      wordCount,
      estimatedMinutes,
    },
  };
}
