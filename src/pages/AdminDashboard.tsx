import React, { useState, useEffect, useRef } from "react";
// API proxy base — all calls go through Express server to avoid CORS
const API = "";

const GREEN = "#2D5A27";
const BUCKET = "assets";


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

async function uploadFile(file: File, folder = "images"): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch(`${API}/api/upload`, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Upload failed");
  return json.url;
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

// ─── UploadField: file picker → Supabase Storage → returns public URL ─────────
function UploadField({ label, value, onChange, required, folder = "images" }: {
  label: string; value: string; onChange: (url: string) => void;
  required?: boolean; folder?: string;
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
      const url = await uploadFile(file, folder);
      onChange(url);
    } catch (ex: unknown) {
      setErr(ex instanceof Error ? ex.message : "Upload failed");
    } finally {
      setUploading(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <Field label={label} required={required}>
      <div className="flex items-center gap-3 flex-wrap">
        <input ref={ref} type="file" accept="image/*,.webp" className="hidden" onChange={handleFile} />
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
              src={value} alt="preview" loading="lazy"
              className="h-10 w-16 object-cover rounded border border-gray-200 shrink-0"
              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <span className="text-xs text-gray-400 truncate">{value.split("/").pop()}</span>
            <button type="button" onClick={() => onChange("")}
              className="text-gray-300 hover:text-red-500 text-lg leading-none shrink-0" title="Remove">
              &times;
            </button>
          </div>
        )}
        {!value && !uploading && <span className="text-xs text-gray-400">No file chosen</span>}
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

function CancelBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50">
      Cancel
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

function Toast({ msg, type }: { msg: string; type: "ok" | "err" }) {
  return (
    <div className={`fixed bottom-5 right-5 z-50 px-5 py-3 rounded shadow-lg text-sm font-semibold text-white ${type === "ok" ? "bg-green-700" : "bg-red-600"}`}>
      {msg}
    </div>
  );
}

// ─── Categories Tab ───────────────────────────────────────────────────────────
const EMPTY_CAT = { name: "", slug: "", seo_description: "", image_url: "" };

function CategoriesTab() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "new" | Category>(null);
  const [form, setForm] = useState(EMPTY_CAT);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3500);
  };
  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/categories`);
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY_CAT); setModal("new"); };
  const openEdit = (c: Category) => {
    setForm({ name: c.name, slug: c.slug, seo_description: c.seo_description ?? "", image_url: c.image_url ?? "" });
    setModal(c);
  };
  const save = async () => {
    if (!form.name || !form.slug) { showToast("Name and Slug are required.", "err"); return; }
    setSaving(true);
    const isNew = modal === "new";
    const url = isNew ? `${API}/api/categories` : `${API}/api/categories/${(modal as Category).id}`;
    const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { showToast("Error: " + (json.error || res.statusText), "err"); return; }
    showToast(modal === "new" ? "Category created." : "Category updated.", "ok");
    setModal(null); load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`${API}/api/categories/${id}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json(); showToast("Error: " + (j.error || res.statusText), "err"); }
    else { showToast("Deleted.", "ok"); load(); }
  };

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">&#8592; Tracky Sheets</span>
          <span className="text-gray-300">|</span>
          <span className="text-base font-semibold text-gray-800">Manage Categories</span>
        </div>
        <GBtn onClick={openNew}>+ New Category</GBtn>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">Categories ({rows.length})</span>
        </div>
        {loading ? <div className="p-6 text-sm text-gray-400">Loading...</div> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">SEO Description</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No categories yet.</td></tr>}
              {rows.map(c => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {c.image_url
                      ? <img src={c.image_url} alt="" loading="lazy" className="h-9 w-14 object-cover rounded border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div className="h-9 w-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-300 text-xs">—</div>}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{c.seo_description || "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(c)} className="text-gray-400 hover:text-green-700 text-base">&#9998;</button>
                      <button onClick={() => del(c.id)} className="text-gray-400 hover:text-red-500 text-base">&#128465;</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal !== null && (
        <Modal title={modal === "new" ? "New Category" : "Edit Category"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <TInput label="Name" required value={form.name}
              onChange={v => setForm(f => ({ ...f, name: v, slug: modal === "new" ? toSlug(v) : f.slug }))} />
            <TInput label="Slug (SEO URL)" required value={form.slug}
              onChange={v => setForm(f => ({ ...f, slug: v }))} placeholder="auto-generated-from-name" />
            <TArea label="SEO Description" required value={form.seo_description}
              onChange={v => setForm(f => ({ ...f, seo_description: v }))} rows={3}
              placeholder="Short description for Google search results (150-160 chars)"
              hint={`${form.seo_description.length}/160 chars`} />
            <UploadField label="Category Image" value={form.image_url ?? ""}
              onChange={url => setForm(f => ({ ...f, image_url: url }))} folder="categories" />
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <CancelBtn onClick={() => setModal(null)} />
              <GBtn onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</GBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Templates Tab ────────────────────────────────────────────────────────────
const EMPTY_TPL = {
  title: "", slug: "", category_id: null as string | null,
  description: "", seo_meta_description: "",
  thumbnail_url: "", carousel_url_1: "", carousel_url_2: "", carousel_url_3: "",
  youtube_url: "", download_url: "",
};

function TemplatesTab() {
  const [rows, setRows] = useState<Template[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "new" | Template>(null);
  const [form, setForm] = useState(EMPTY_TPL);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err") => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 4000);
  };
  const load = async () => {
    setLoading(true);
    const [tr, cr] = await Promise.all([
      fetch(`${API}/api/templates`).then(r => r.json()),
      fetch(`${API}/api/categories`).then(r => r.json()),
    ]);
    setRows(Array.isArray(tr) ? tr : []);
    setCats(Array.isArray(cr) ? cr : []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const testSave = async () => {
    setTesting(true);
    const record = {
      title: "TEST SAVE — Budget Tracker",
      slug: "test-save-" + Date.now(),
      category_id: null,
      description: "Test record to verify Supabase connectivity.",
      seo_meta_description: "Test SEO meta.",
      thumbnail_url: "", carousel_url_1: "", carousel_url_2: "", carousel_url_3: "",
      youtube_url: "", download_url: "https://docs.google.com/spreadsheets",
    };
    const res = await fetch(`${API}/api/test-save`, { method: "POST" });
    const json = await res.json();
    setTesting(false);
    if (!res.ok) showToast("TEST FAILED: " + (json.error || res.statusText), "err");
    else { showToast("TEST PASSED — ID: " + json.id.slice(0, 8) + "...", "ok"); load(); }
  };

  const openNew = () => { setForm(EMPTY_TPL); setModal("new"); };
  const openEdit = (t: Template) => {
    setForm({
      title: t.title, slug: t.slug, category_id: t.category_id,
      description: t.description ?? "", seo_meta_description: t.seo_meta_description ?? "",
      thumbnail_url: t.thumbnail_url ?? "", carousel_url_1: t.carousel_url_1 ?? "",
      carousel_url_2: t.carousel_url_2 ?? "", carousel_url_3: t.carousel_url_3 ?? "",
      youtube_url: t.youtube_url ?? "", download_url: t.download_url ?? "",
    });
    setModal(t);
  };
  const save = async () => {
    if (!form.title || !form.slug) { showToast("Title and Slug are required.", "err"); return; }
    setSaving(true);
    const payload = { ...form, category_id: form.category_id || null };
    const isNew = modal === "new";
    const url = isNew ? `${API}/api/templates` : `${API}/api/templates/${(modal as Template).id}`;
    const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) { showToast("Error: " + (json.error || res.statusText), "err"); return; }
    showToast(modal === "new" ? "Template created." : "Template updated.", "ok");
    setModal(null); load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this template?")) return;
    const res = await fetch(`${API}/api/templates/${id}`, { method: "DELETE" });
    if (!res.ok) { const j = await res.json(); showToast("Error: " + (j.error || res.statusText), "err"); }
    else { showToast("Deleted.", "ok"); load(); }
  };

  const catName = (id: string | null) => cats.find(c => c.id === id)?.name ?? "—";
  const s = (k: keyof typeof EMPTY_TPL) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      {toast && <Toast msg={toast.msg} type={toast.type} />}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">&#8592; Tracky Sheets</span>
          <span className="text-gray-300">|</span>
          <span className="text-base font-semibold text-gray-800">Manage Templates</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={testSave} disabled={testing}
            style={{ borderColor: GREEN, color: testing ? "#9ca3af" : GREEN }}
            className="px-4 py-2 text-sm font-semibold border-2 rounded bg-white hover:bg-green-50 disabled:opacity-50 transition-colors">
            {testing ? "Testing..." : "Test Save"}
          </button>
          <GBtn onClick={openNew}>+ New Template</GBtn>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <span className="text-sm font-semibold text-gray-700">Templates ({rows.length})</span>
        </div>
        {loading ? <div className="p-6 text-sm text-gray-400">Loading...</div> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Thumb</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Download</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No templates yet. Click "Test Save" to verify DB, or "+ New Template" to add one.
                </td></tr>
              )}
              {rows.map(t => (
                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {t.thumbnail_url
                      ? <img src={t.thumbnail_url} alt="" loading="lazy" className="h-9 w-14 object-cover rounded border border-gray-200" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      : <div className="h-9 w-14 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-300 text-xs">—</div>}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.title}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{t.slug}</td>
                  <td className="px-4 py-3 text-gray-600">{catName(t.category_id)}</td>
                  <td className="px-4 py-3 text-xs">
                    {t.download_url
                      ? <a href={t.download_url} target="_blank" rel="noreferrer" style={{ color: GREEN }} className="hover:underline">Link</a>
                      : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(t)} className="text-gray-400 hover:text-green-700 text-base">&#9998;</button>
                      <button onClick={() => del(t.id)} className="text-gray-400 hover:text-red-500 text-base">&#128465;</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {modal !== null && (
        <Modal title={modal === "new" ? "New Template" : "Edit Template"} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <TInput label="Title" required value={form.title}
                onChange={v => setForm(f => ({ ...f, title: v, slug: modal === "new" ? toSlug(v) : f.slug }))} />
              <TInput label="Slug (SEO URL)" required value={form.slug} onChange={s("slug")}
                placeholder="auto-from-title" hint="Used in the page URL" />
            </div>
            <Field label="Category">
              <select className={inputCls} value={form.category_id ?? ""}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value || null }))}>
                <option value="">— None —</option>
                {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <TArea label="Description" required value={form.description} onChange={s("description")} rows={4}
              placeholder="Detailed content shown to users on the template page" />
            <TArea label="SEO Meta Description" required value={form.seo_meta_description}
              onChange={s("seo_meta_description")} rows={2}
              placeholder="Short description for Google (150-160 chars)"
              hint={`${form.seo_meta_description.length}/160 chars`} />
            <UploadField label="Thumbnail" value={form.thumbnail_url} onChange={s("thumbnail_url")} folder="thumbnails" />
            <div className="grid grid-cols-3 gap-3">
              <UploadField label="Carousel 1" value={form.carousel_url_1} onChange={s("carousel_url_1")} folder="carousels" />
              <UploadField label="Carousel 2" value={form.carousel_url_2} onChange={s("carousel_url_2")} folder="carousels" />
              <UploadField label="Carousel 3" value={form.carousel_url_3} onChange={s("carousel_url_3")} folder="carousels" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <TInput label="YouTube URL" value={form.youtube_url} onChange={s("youtube_url")} placeholder="https://youtube.com/watch?v=..." />
              <TInput label="Download Link" value={form.download_url} onChange={s("download_url")} placeholder="Google Sheets URL" hint="Direct link to the Google Sheets template" />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <CancelBtn onClick={() => setModal(null)} />
              <GBtn onClick={save} disabled={saving}>{saving ? "Saving..." : modal === "new" ? "Create" : "Update"}</GBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function PlaceholderTab({ name }: { name: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-10 text-center text-gray-400 text-sm">
      {name} — coming soon.
    </div>
  );
}

export default function AdminDashboard() {
  const [active, setActive] = useState<Tab>("Templates");
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div style={{ backgroundColor: GREEN }} className="px-5 py-5">
          <p className="text-white font-bold text-base leading-tight">Admin Panel</p>
          <p className="text-white/60 text-xs mt-0.5">Manage your site</p>
        </div>
        <nav className="flex flex-col mt-2">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActive(tab)}
              className={"text-left px-5 py-3 text-sm font-medium transition-colors border-l-4 " + (
                active === tab
                  ? "bg-green-50 border-green-700 text-green-800"
                  : "border-transparent text-gray-600 hover:bg-gray-50"
              )}>
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        {active === "Templates" && <TemplatesTab />}
        {active === "Categories" && <CategoriesTab />}
        {active === "Site Configuration" && <PlaceholderTab name="Site Configuration" />}
        {active === "Ad Slots" && <PlaceholderTab name="Ad Slots" />}
        {active === "Legal" && <PlaceholderTab name="Legal" />}
      </main>
    </div>
  );
}
