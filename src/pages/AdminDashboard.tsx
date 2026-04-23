import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase"; // Usiamo direttamente Supabase client

const GREEN = "#2D5A27";

interface Category {
  id: string; name: string; slug: string; seo_description: string; image_url?: string;
}

interface Template {
  id: string; title: string; slug: string; category_id: string | null;
  description: string; seo_meta_description: string;
  thumbnail_url: string; carousel_url_1: string; carousel_url_2: string; carousel_url_3: string;
  youtube_url: string; download_url: string;
}

type Tab = "Templates" | "Categories" | "Site Configuration" | "Ad Slots" | "Legal";
const TABS: Tab[] = ["Templates","Categories","Site Configuration","Ad Slots","Legal"];
const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
const inputCls = "border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-700/30 w-full bg-white";

// FUNZIONE MAGICA: Carica direttamente su Supabase Storage
async function uploadToSupabase(file: File, bucket: string = "templates"): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function TInput({ label, value, onChange, required, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; placeholder?: string; hint?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <input className={inputCls} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder ?? ""} />
    </Field>
  );
}

function TArea({ label, value, onChange, required, rows = 3, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; rows?: number; placeholder?: string; hint?: string;
}) {
  return (
    <Field label={label} required={required} hint={hint}>
      <textarea className={inputCls + " resize-none"} value={value}
        onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder ?? ""} />
    </Field>
  );
}

function UploadField({ label, value, onChange, required }: {
  label: string; value: string; onChange: (url: string) => void;
  required?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const url = await uploadToSupabase(file);
      onChange(url);
    } catch (ex: any) {
      setErr(ex.message || "Upload failed");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <Field label={label} required={required}>
      <div className="flex items-center gap-3 flex-wrap">
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          style={{ borderColor: GREEN, color: uploading ? "#9ca3af" : GREEN }}
          className="px-3 py-2 text-xs font-semibold border-2 rounded bg-white hover:bg-green-50 disabled:opacity-50 whitespace-nowrap transition-colors"
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </button>
        {value && !uploading && (
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <img
              src={value} alt="preview"
              className="h-10 w-16 object-cover rounded border border-gray-200 shrink-0"
            />
            <button type="button" onClick={() => onChange("")}
              className="text-gray-300 hover:text-red-500 text-lg leading-none shrink-0">
              &times;
            </button>
          </div>
        )}
      </div>
      {err && <p className="text-xs text-red-500 mt-1">{err}</p>}
    </Field>
  );
}

function GBtn({ children, onClick, disabled }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      style={{ backgroundColor: disabled ? "#9ca3af" : GREEN }}
      className="px-4 py-2 text-sm font-semibold text-white rounded hover:opacity-90 disabled:cursor-not-allowed transition-opacity">
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }: {
  title: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 className="text-base font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

// --- LOGICA TAB TEMPLATES ---
function TemplatesTab() {
  const [rows, setRows] = useState<Template[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "new" | Template>(null);
  const [form, setForm] = useState<any>({});

  const load = async () => {
    setLoading(true);
    const { data: tpls } = await supabase.from('templates').select('*').order('created_at', { ascending: false });
    const { data: ctgs } = await supabase.from('categories').select('*');
    setRows(tpls || []);
    setCats(ctgs || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.title || !form.slug) return alert("Title and Slug are required");
    const isNew = modal === "new";
    
    if (isNew) {
      await supabase.from('templates').insert([form]);
    } else {
      await supabase.from('templates').update(form).eq('id', (modal as Template).id);
    }
    setModal(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from('templates').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-bold">Templates</h2>
        <GBtn onClick={() => { setForm({}); setModal("new"); }}>+ New Template</GBtn>
      </div>
      
      <div className="bg-white rounded border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 text-left">Thumb</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(t => (
              <tr key={t.id} className="border-b">
                <td className="p-3"><img src={t.thumbnail_url} className="h-10 w-16 object-cover rounded" /></td>
                <td className="p-3 font-medium">{t.title}</td>
                <td className="p-3 text-right">
                  <button onClick={() => { setForm(t); setModal(t); }} className="mr-3">Edit</button>
                  <button onClick={() => del(t.id)} className="text-red-500">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal title="Template" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <TInput label="Title" value={form.title || ""} onChange={v => setForm({...form, title: v, slug: toSlug(v)})} />
            <TInput label="Slug" value={form.slug || ""} onChange={v => setForm({...form, slug: v})} />
            <TArea label="Description" value={form.description || ""} onChange={v => setForm({...form, description: v})} />
            <UploadField label="Thumbnail" value={form.thumbnail_url || ""} onChange={v => setForm({...form, thumbnail_url: v})} />
            <TInput label="Google Sheets URL" value={form.download_url || ""} onChange={v => setForm({...form, download_url: v})} />
            <GBtn onClick={save}>Save Template</GBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <TemplatesTab />
    </div>
  );
}
