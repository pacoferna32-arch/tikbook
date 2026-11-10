import React, { useState, useRef } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Plus,
  Trash2,
  Volume2,
  Upload,
  Check,
  Feather,
  Wand2,
  FileText,
  AlertCircle,
  Eye,
  Layers,
  Image as ImageIcon,
  ShieldCheck,
} from 'lucide-react';
import { Book, Genre, AmbientSoundType, Chapter, UserAccount } from '../types';
import { processAndTypesetText, OrthotypographyResult } from '../utils/orthotypography';
import { COVER_STYLES, generateAICoverCanvas, CoverStyle } from '../utils/coverGenerator';

interface PublishBookModalProps {
  currentUser: UserAccount;
  onClose: () => void;
  onPublish: (newBook: Book) => void;
  onUpgradeToAuthor: () => void;
}

const PRESET_COVERS = [
  {
    name: 'Gótico & Niebla',
    url: '/src/assets/images/cover_gothic_mystery_1794252057956.jpg',
  },
  {
    name: 'Ciudadela Celestial',
    url: '/src/assets/images/cover_fantasy_kingdom_1794252058336.jpg',
  },
  {
    name: 'Portal Cibernético',
    url: '/src/assets/images/cover_scifi_android_1794252059212.jpg',
  },
  {
    name: 'Acantilado Atlántico',
    url: '/src/assets/images/cover_ocean_poetry_1794252059515.jpg',
  },
  {
    name: 'Espejo Surrealista',
    url: '/src/assets/images/cover_surreal_mirror_1794252061044.jpg',
  },
];

export const PublishBookModal: React.FC<PublishBookModalProps> = ({
  currentUser,
  onClose,
  onPublish,
  onUpgradeToAuthor,
}) => {
  // Author & Metadata
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [genre, setGenre] = useState<Genre>('Microrrelato');
  const authorName = currentUser.penName || currentUser.name || 'Autor de Tikbook';
  const authorHandle = currentUser.username || 'tu_pluma';

  // Cover Management: 'upload' | 'ai' | 'preset'
  const [coverSource, setCoverSource] = useState<'upload' | 'ai' | 'preset'>('ai');
  const [coverImage, setCoverImage] = useState<string>(PRESET_COVERS[0].url);
  const [uploadedCoverName, setUploadedCoverName] = useState<string>('');
  const [customCoverUrl, setCustomCoverUrl] = useState<string>('');

  // AI Cover Generation State
  const [selectedAIStyle, setSelectedAIStyle] = useState<CoverStyle>(COVER_STYLES[0]);
  const [aiPromptKeyword, setAiPromptKeyword] = useState<string>('');
  const [isGeneratingCover, setIsGeneratingCover] = useState<boolean>(false);

  // Text, Orthotypography & Typesetting
  const [rawManuscript, setRawManuscript] = useState<string>('');
  const [isTypesetting, setIsTypesetting] = useState<boolean>(false);
  const [orthoReport, setOrthoReport] = useState<OrthotypographyResult['report'] | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([
    {
      number: 1,
      title: 'I. El Comienzo',
      content: [''],
    },
  ]);
  const [excerpt, setExcerpt] = useState('');
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('rain');
  const [tagsInput, setTagsInput] = useState('Literatura, Historia, Tikbook');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Uploading a Local Finished Cover (Subir portada ya hecha)
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedCoverName(file.name);
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setCoverImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle AI Cover Generation
  const handleGenerateAICover = () => {
    setIsGeneratingCover(true);
    setTimeout(() => {
      const generatedDataUrl = generateAICoverCanvas(
        title || 'Obra Sin Título',
        authorName,
        subtitle,
        selectedAIStyle,
        aiPromptKeyword
      );
      setCoverImage(generatedDataUrl);
      setIsGeneratingCover(false);
    }, 450);
  };

  // Handle Uploading a .txt or .md Manuscript
  const handleTextFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          const content = event.target.result as string;
          setRawManuscript(content);
          handleRunTypesetting(content);
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle Orthotypographic Revision & Automatic E-Book Typesetting
  const handleRunTypesetting = (textToProcess?: string) => {
    const text = textToProcess !== undefined ? textToProcess : rawManuscript;
    if (!text.trim()) return;

    setIsTypesetting(true);
    setTimeout(() => {
      const result = processAndTypesetText(text, title || 'Obra');
      setChapters(result.formattedChapters);
      setExcerpt(result.extractedHook);
      setOrthoReport(result.report);
      setIsTypesetting(false);
    }, 400);
  };

  // Chapter editing helpers
  const handleAddChapter = () => {
    const nextNum = chapters.length + 1;
    setChapters([
      ...chapters,
      {
        number: nextNum,
        title: `Capítulo ${nextNum}`,
        content: [''],
      },
    ]);
  };

  const handleRemoveChapter = (index: number) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const handleChapterContentChange = (chapIndex: number, text: string) => {
    const updated = [...chapters];
    updated[chapIndex].content = text.split('\n\n').filter(p => p.trim().length > 0);
    setChapters(updated);
  };

  // Submit and Publish
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCover = customCoverUrl.trim() || coverImage;
    const finalExcerpt = excerpt.trim() || chapters[0]?.content[0]?.slice(0, 200) || 'Una nueva historia en Tikbook.';

    const allWords = chapters.reduce((acc, ch) => {
      return acc + ch.content.join(' ').split(/\s+/).filter(Boolean).length;
    }, 0);

    const newBook: Book = {
      id: 'book-user-' + Date.now(),
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      author: {
        name: authorName,
        username: authorHandle,
        avatar: currentUser.avatar,
        bio: currentUser.bio || 'Autor en Tikbook',
        isVerified: true,
        followersCount: 1,
      },
      genre,
      coverImage: finalCover,
      excerpt: finalExcerpt,
      fullContent: {
        synopsis: finalExcerpt,
        chapters: chapters.map(ch => ({
          ...ch,
          content: ch.content.length > 0 ? ch.content : [finalExcerpt],
        })),
      },
      readingTimeMinutes: Math.max(1, Math.round(allWords / 200)),
      wordCount: Math.max(allWords, 50),
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      savesCount: 0,
      isLiked: true,
      isSaved: false,
      isFollowingAuthor: false,
      publishedAt: 'Recién publicado',
      ambientSound,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
    };

    onPublish(newBook);
  };

  // If user is currently in Reader role, prompt to upgrade to Author role
  if (currentUser.role !== 'author') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 text-stone-100 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <Feather className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-title text-2xl font-bold">Activa tu Perfil de Autor</h3>
            <p className="text-xs text-stone-400 mt-1">
              Para publicar obras literarias, crear portadas con IA y maquetar libros en Tikbook necesitas un perfil de autor.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={onUpgradeToAuthor}
              className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <Feather className="w-4 h-4" />
              <span>Convertirme en Autor de Tikbook</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-7 text-stone-100 shadow-2xl my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-xl sm:text-2xl font-bold">Estudio de Publicación</h2>
              <p className="text-xs text-stone-400">
                Firma: <span className="text-amber-400 font-semibold">{authorName}</span> (@{authorHandle})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePublish} className="flex-1 overflow-y-auto py-4 space-y-5 text-xs sm:text-sm pr-1">
          {/* Section 1: Title, Subtitle, Genre */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-300 mb-1">Título de la Obra *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. La Bruma de los Espejos"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-serif-title text-base"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">Género Literario</label>
                <select
                  value={genre}
                  onChange={e => setGenre(e.target.value as Genre)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-amber-400 cursor-pointer text-xs"
                >
                  <option value="Microrrelato">Microrrelato</option>
                  <option value="Misterio & Gótico">Misterio & Gótico</option>
                  <option value="Fantasía Épica">Fantasía Épica</option>
                  <option value="Ciencia Ficción">Ciencia Ficción</option>
                  <option value="Poesía">Poesía</option>
                  <option value="Romance">Romance</option>
                  <option value="Ensayo & Filosofía">Ensayo & Filosofía</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">Subtítulo o Lema de Portada</label>
              <input
                type="text"
                placeholder="Ej. Una novela de secretos en la corte de medianoche"
                value={subtitle}
                onChange={e => setSubtitle(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 text-xs italic font-serif"
              />
            </div>
          </div>

          {/* Section 2: Portada (Subir ya hecha o Creada con IA) - Core user request! */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Diseño de Portada de la Obra</span>
              </label>

              {/* Sub-tabs for Cover selection */}
              <div className="flex bg-stone-900 border border-stone-800 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setCoverSource('ai')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    coverSource === 'ai' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Crear con IA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverSource('upload')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 ${
                    coverSource === 'upload' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Upload className="w-3 h-3" />
                  <span>Subir archivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoverSource('preset')}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    coverSource === 'preset' ? 'bg-amber-400 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Galería
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Cover Preview (3:4 ratio) */}
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="relative w-36 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-stone-700 bg-stone-950">
                  <img
                    src={coverImage}
                    alt="Portada del libro"
                    className="w-full h-full object-cover"
                  />
                  {/* Spine shadow overlay */}
                  <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 font-mono">Proporción E-Book 3:4</span>
              </div>

              {/* Cover Controls depending on active tab */}
              <div className="sm:col-span-8 space-y-2">
                {/* 1. Crear con IA */}
                {coverSource === 'ai' && (
                  <div className="space-y-2">
                    <p className="text-xs text-stone-400">
                      Genera una portada artística con marcos dorados, gradiente cinematográfico y el título/autor tipografiados:
                    </p>

                    <div className="grid grid-cols-2 gap-1.5">
                      {COVER_STYLES.map(style => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setSelectedAIStyle(style)}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedAIStyle.id === style.id
                              ? 'border-amber-400 bg-amber-400/10 text-amber-300 font-semibold'
                              : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                          }`}
                        >
                          <div className="text-xs">{style.name}</div>
                          <div className="text-[10px] text-stone-500">{style.genre}</div>
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAICover}
                      disabled={isGeneratingCover}
                      className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isGeneratingCover ? 'Pintando Portada con IA...' : 'Generar Portada con IA'}</span>
                    </button>
                  </div>
                )}

                {/* 2. Subir archivo ya hecho */}
                {coverSource === 'upload' && (
                  <div className="space-y-2.5">
                    <p className="text-xs text-stone-400">
                      Sube una portada propia en formato JPG o PNG desde tu dispositivo:
                    </p>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-3 px-4 border-2 border-dashed border-stone-700 hover:border-amber-400 rounded-xl bg-stone-900/60 text-stone-300 text-xs flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Upload className="w-5 h-5 text-amber-400" />
                      <span>{uploadedCoverName ? uploadedCoverName : 'Seleccionar imagen desde tu equipo'}</span>
                      <span className="text-[10px] text-stone-500">JPG, PNG o WEBP (recomendado 3:4)</span>
                    </button>

                    <div className="pt-1">
                      <label className="text-[11px] text-stone-500 block mb-1">O pegar URL de imagen:</label>
                      <input
                        type="url"
                        placeholder="https://ejemplo.com/portada.jpg"
                        value={customCoverUrl}
                        onChange={e => {
                          setCustomCoverUrl(e.target.value);
                          if (e.target.value) setCoverImage(e.target.value);
                        }}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Portadas Curadas */}
                {coverSource === 'preset' && (
                  <div className="grid grid-cols-5 gap-1.5">
                    {PRESET_COVERS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCoverImage(preset.url);
                          setCustomCoverUrl('');
                        }}
                        className={`aspect-[3/4] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          coverImage === preset.url
                            ? 'border-amber-400 ring-2 ring-amber-400'
                            : 'border-stone-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Orthotypographic Revision & Automatic E-Book Typesetting */}
          <div className="p-4 bg-stone-950/70 border border-stone-800 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Manuscrito & Corrección Ortotipográfica</span>
                </label>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Pega tu relato o novela sin formato. Nuestro motor adaptará comillas latinas (« »), rayas de diálogo (—), signos dobles y maquetará los capítulos.
                </p>
              </div>

              {/* Upload text file */}
              <input
                type="file"
                ref={textFileInputRef}
                accept=".txt,.md"
                onChange={handleTextFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => textFileInputRef.current?.click()}
                className="px-2.5 py-1 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 rounded-lg text-xs transition-colors cursor-pointer shrink-0"
              >
                Cargar .txt / .md
              </button>
            </div>

            {/* Raw input area */}
            <textarea
              rows={5}
              placeholder="Pega aquí el texto completo de tu relato o capítulos... Puedes usar guiones o comillas normales; la corrección ortotipográfica los convertirá automáticamente a estándares editoriales de libros."
              value={rawManuscript}
              onChange={e => setRawManuscript(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-amber-400 font-book-body text-xs"
            />

            {/* Trigger Typesetting Action Button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-stone-500 font-mono">
                {rawManuscript.split(/\s+/).filter(Boolean).length} palabras
              </span>

              <button
                type="button"
                onClick={() => handleRunTypesetting()}
                disabled={!rawManuscript.trim() || isTypesetting}
                className="py-2 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-400/20 active:scale-[0.98] flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isTypesetting
                    ? 'Revisando y maquetando...'
                    : '✨ Revisión Ortotipográfica y Maquetación E-Book'}
                </span>
              </button>
            </div>

            {/* Orthotypographic Report Banner */}
            {orthoReport && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Revisión completada con éxito</span>
                  </span>
                  <span className="text-stone-400 font-mono tabular-nums">
                    {orthoReport.totalCorrections} mejoras editoriales aplicadas
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-300">
                  <div className="p-1.5 bg-stone-900/80 rounded-lg border border-stone-800 text-center">
                    <span className="font-bold text-amber-400 block">{orthoReport.dialogueDashes}</span>
                    <span className="text-stone-500">Rayas de diálogo (—)</span>
                  </div>
                  <div className="p-1.5 bg-stone-900/80 rounded-lg border border-stone-800 text-center">
                    <span className="font-bold text-amber-400 block">{orthoReport.latinQuotes}</span>
                    <span className="text-stone-500">Comillas latinas (« »)</span>
                  </div>
                  <div className="p-1.5 bg-stone-900/80 rounded-lg border border-stone-800 text-center">
                    <span className="font-bold text-amber-400 block">{orthoReport.punctuationMarks}</span>
                    <span className="text-stone-500">Signos ¿ / ¡</span>
                  </div>
                  <div className="p-1.5 bg-stone-900/80 rounded-lg border border-stone-800 text-center">
                    <span className="font-bold text-amber-400 block">{orthoReport.chapterCount}</span>
                    <span className="text-stone-500">Capítulos maquetados</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Hook for Tikbook Feed & Formatted Chapters */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center justify-between">
                <span>El «Gancho» para el Feed de Tikbook (Aparece en la tarjeta con letra capitular)</span>
                <span className="text-[10px] text-stone-500">Generado automáticamente</span>
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                placeholder="El extracto que enganchará a los lectores al hacer swipe en el feed..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:border-amber-400 font-book-body text-xs"
              />
            </div>

            {/* Chapters list preview & editing */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-stone-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Capítulos Maquetados para el E-Reader ({chapters.length})</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Capítulo</span>
                </button>
              </div>

              <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                {chapters.map((chap, cIdx) => (
                  <div key={cIdx} className="p-3 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={chap.title}
                        onChange={e => {
                          const updated = [...chapters];
                          updated[cIdx].title = e.target.value;
                          setChapters(updated);
                        }}
                        className="bg-transparent font-serif-title font-semibold text-stone-200 text-xs focus:outline-none border-b border-stone-800 focus:border-amber-400 flex-1"
                      />
                      {chapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChapter(cIdx)}
                          className="text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <textarea
                      rows={3}
                      value={chap.content.join('\n\n')}
                      onChange={e => handleChapterContentChange(cIdx, e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-lg p-2.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400 font-book-body"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Ambient Sound */}
          <div className="flex items-center justify-between border-t border-stone-800 pt-3">
            <span className="text-xs text-stone-300 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Ambiente sonoro para la lectura:</span>
            </span>

            <select
              value={ambientSound}
              onChange={e => setAmbientSound(e.target.value as AmbientSoundType)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="rain">🌧️ Lluvia suave</option>
              <option value="fireplace">🔥 Chimenea</option>
              <option value="library">📚 Biblioteca</option>
              <option value="silence">🔇 Silencio</option>
            </select>
          </div>

          {/* Legal Notice: Certified Intellectual Property */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Certificación de Obra y Protección Legal</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed font-sans">
              Al publicar en Tikbook, tu obra queda <strong className="text-amber-200">certificada con derechos reservados</strong> de autor/a. Queda terminantemente prohibido a terceros copiar, manipular, alterar, reproducir o utilizar esta obra sin tu autorización y consentimiento expreso por escrito.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-400/20 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              <span>Publicar Obra Maquetada en Tikbook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
