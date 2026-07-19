"use client";

import { TextArea } from "@/components/ui/form";

export function EditableList({
  title,
  singular,
  items,
  onChange,
  help,
}: {
  title: string;
  singular: string;
  items: string[];
  onChange: (items: string[]) => void;
  help?: string;
}) {
  function updateItem(index: number, v: string) {
    const next = [...items];
    next[index] = v;
    onChange(next);
  }
  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  function addItem() {
    onChange([...items, ""]);
  }

  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
        >
          + Agregar {singular.toLowerCase()}
        </button>
      </div>
      {help && <p className="text-xs text-slate-500">{help}</p>}
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-2 w-6 shrink-0 text-right text-sm font-medium text-slate-400">
              {i + 1}.
            </span>
            <TextArea
              rows={2}
              value={item}
              onChange={(e) => updateItem(i, e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              aria-label={`Eliminar ${singular.toLowerCase()} ${i + 1}`}
              className="mt-1 shrink-0 rounded p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
              title="Eliminar"
            >
              ✕
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-sm text-slate-400">
            No hay {title.toLowerCase()}. Agrega al menos uno.
          </li>
        )}
      </ol>
    </section>
  );
}
