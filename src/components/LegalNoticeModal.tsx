import React from 'react';
import { X, ShieldCheck, Lock, FileText, CheckCircle2, AlertOctagon } from 'lucide-react';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-serif-title text-xl font-bold">Certificación & Propiedad Intelectual</h2>
              <p className="text-xs text-stone-400">Aviso legal oficial de Tikbook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm text-stone-300 pr-1">
          {/* Main Statement Box */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Obras Certificadas y Protegidas</span>
            </div>
            <p className="text-amber-100/90 leading-relaxed font-sans text-xs">
              Todas las obras literarias publicadas en <strong>Tikbook</strong> (novelas, relatos, microrrelatos, poesía y ensayos) están <span className="underline decoration-amber-400 font-semibold">certificadas y registradas</span> con sello de autoría.
            </p>
          </div>

          {/* Prohibitions */}
          <div className="space-y-3 pt-1">
            <h3 className="font-semibold text-stone-200 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-400">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>Prohibición Expresa de Uso no Autorizado</span>
            </h3>

            <div className="space-y-2.5 text-xs text-stone-300 leading-relaxed">
              <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-100 block mb-0.5">Sin manipulación ni alteraciones</strong>
                  Queda estrictamente prohibido modificar, transformar, recortar o adulterar el texto, trama o personajes de las obras sin autorización.
                </div>
              </div>

              <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-100 block mb-0.5">Prohibida la copia y distribución</strong>
                  No está permitida la copia, reproducción parcial o total, clonación ni distribución en otras plataformas o medios sin el permiso expreso del autor.
                </div>
              </div>

              <div className="p-3 bg-stone-950/60 border border-stone-800 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-stone-100 block mb-0.5">Uso exclusivo de lectura personal</strong>
                  Los lectores disponen de una licencia intransferible y gratuita de lectura en formato e-book dentro de Tikbook.
                </div>
              </div>
            </div>
          </div>

          {/* Sello de Autoría */}
          <div className="p-3 bg-stone-950/40 border border-stone-800/80 rounded-xl text-center text-xs text-stone-400 font-mono">
            <span>Registro Digital Tikbook · Copyright © 2026 Todos los derechos reservados por sus autores</span>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-3 border-t border-stone-800 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md shadow-amber-400/20 active:scale-[0.99] cursor-pointer"
          >
            Entendido y Acepto las Condiciones
          </button>
        </div>
      </div>
    </div>
  );
};
