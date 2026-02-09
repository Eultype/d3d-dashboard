"use client";

export function PrintRecap() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
            Imprimer le récapitulatif
        </button>
    );
}