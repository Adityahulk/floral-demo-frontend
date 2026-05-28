import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Search, X, Check, Tag, Layers, Upload } from "lucide-react";
import { api } from "../../../api/client";
import { API } from "../../../api/endpoints";

const EMPTY = { name: "", emoji: "", desc: "", img: "", color: "var(--color-olive)", tags: "" };

function Toast({ msg, onClose }) {
  if (!msg) return null;
  const isErr = msg.startsWith("error:");
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold"
      style={{ background: isErr ? "#fee2e2" : "#dcfce7", color: isErr ? "#dc2626" : "#16a34a" }}
    >
      {isErr ? <X size={16} /> : <Check size={16} />}
      {isErr ? msg.slice(6) : msg}
    </div>
  );
}

function FieldError({ show, text }) {
  if (!show) return null;
  return <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{text}</p>;
}

function CategoryImageUploader({ value, onChange, onUploadingChange, hasError }) {
  const [uploading,   setUploading]   = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver,    setDragOver]    = useState(false);
  const inputRef = useRef(null);

  function setUploadingState(v) {
    setUploading(v);
    onUploadingChange?.(v);
  }

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    setUploadingState(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("image", file);
      const data = await api(API.upload.image, { method: "POST", body: fd, multipart: true });
      if (!data.success) throw new Error(data.message || "Upload failed");
      onChange(data.url);
    } catch (e) {
      setUploadError(e.message || "Upload failed");
    } finally {
      setUploadingState(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  const fileInput = (
    <input ref={inputRef} type="file" accept="image/*" className="hidden"
      onChange={e => { const f = e.target.files[0]; e.target.value = ""; if (f) handleFile(f); }} />
  );

  if (value) {
    return (
      <div>
        <div className="relative w-fit">
          <img src={value} alt="" className="h-32 w-52 object-cover rounded-xl border"
            style={{ borderColor: "var(--color-border)" }} />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl"
              style={{ background: "rgba(255,255,255,0.75)" }}>
              <div className="w-6 h-6 border-2 rounded-full animate-spin"
                style={{ borderColor: "var(--color-olive)", borderTopColor: "transparent" }} />
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold border disabled:opacity-60"
            style={{ borderColor: "var(--color-border)", color: "var(--color-charcoal)" }}>
            Replace
          </button>
          <button type="button" onClick={() => { onChange(""); setUploadError(""); }} disabled={uploading}
            className="text-xs px-3 py-1.5 rounded-lg font-semibold disabled:opacity-60"
            style={{ background: "#fee2e2", color: "#dc2626" }}>
            Remove
          </button>
        </div>
        {uploadError && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{uploadError}</p>}
        {fileInput}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer py-8 select-none"
        style={{
          borderColor:  hasError ? "#dc2626" : dragOver ? "var(--color-olive)" : "var(--color-border)",
          background:   dragOver ? "var(--color-beige)" : "var(--color-beige)",
        }}
      >
        {uploading ? (
          <div className="w-7 h-7 border-2 rounded-full animate-spin"
            style={{ borderColor: "var(--color-olive)", borderTopColor: "transparent" }} />
        ) : (
          <>
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "var(--color-beige)" }}>
              <Upload size={18} style={{ color: "var(--color-olive)" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: "var(--color-charcoal)" }}>Click or drag image here</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-olive)" }}>PNG, JPG, WEBP supported</p>
            </div>
          </>
        )}
      </div>
      {uploadError && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{uploadError}</p>}
      {fileInput}
    </div>
  );
}

export default function CategoriesTab() {
  const [categories,    setCategories]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState("");
  const [search,        setSearch]        = useState("");
  const [editing,       setEditing]       = useState(null); // null | "new" | category._id
  const [form,          setForm]          = useState(EMPTY);
  const [touched,       setTouched]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [imgUploading,  setImgUploading]  = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toast,         setToast]         = useState(null);
  const toastTimer = useRef(null);
  const formRef    = useRef(null);

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  useEffect(() => {
    loadCategories();
    return () => clearTimeout(toastTimer.current);
  }, []);

  function loadCategories() {
    setLoading(true);
    setError("");
    api(API.categories.list)
      .then(d => { setCategories(Array.isArray(d.data) ? d.data : []); setLoading(false); })
      .catch(() => { setError("Failed to load categories."); setLoading(false); });
  }

  function openNew() {
    setForm(EMPTY);
    setTouched(false);
    setImgUploading(false);
    setEditing("new");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function openEdit(cat) {
    setForm({
      name:  cat.name  || "",
      emoji: cat.emoji || "",
      desc:  cat.desc  || "",
      img:   cat.img   || "",
      color: cat.color || "var(--color-olive)",
      tags:  (cat.tags || []).join(", "),
    });
    setTouched(false);
    setEditing(cat._id);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  }

  function cancelEdit() {
    setEditing(null);
    setTouched(false);
    setImgUploading(false);
  }

  function setField(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function validateForm() {
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    return form.name.trim() && form.desc.trim() && form.img.trim() && form.color && tagsArr.length > 0;
  }

  async function handleSave() {
    setTouched(true);
    if (!validateForm()) return;
    const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
    const body = {
      name:  form.name.trim(),
      emoji: form.emoji.trim(),
      desc:  form.desc.trim(),
      img:   form.img.trim(),
      color: form.color,
      tags:  tagsArr,
    };
    setSaving(true);
    try {
      if (editing === "new") {
        const data = await api(API.categories.create, { method: "POST", body });
        if (!data.success) throw new Error(data.message || "Failed to create");
        setCategories(prev => [data.data, ...prev]);
        showToast("Category created successfully");
      } else {
        const data = await api(API.categories.update(editing), { method: "PUT", body });
        if (!data.success) throw new Error(data.message || "Failed to update");
        setCategories(prev => prev.map(c => c._id === editing ? data.data : c));
        showToast("Category updated successfully");
      }
      setEditing(null);
      setTouched(false);
    } catch (e) {
      showToast("error: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const data = await api(API.categories.delete(id), { method: "DELETE" });
      if (!data.success) throw new Error(data.message || "Delete failed");
      setCategories(prev => prev.filter(c => c._id !== id));
      setDeleteConfirm(null);
      showToast("Category deleted");
    } catch (e) {
      showToast("error: " + e.message);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase())
  );

  const isNew = editing === "new";
  const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);

  return (
    <div className="max-w-5xl">
      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* ── Form ── */}
      {editing !== null && (
        <div ref={formRef} className="bg-white rounded-2xl border mb-6 overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-beige)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "var(--color-beige)" }}>
                <Layers size={16} style={{ color: "var(--color-olive)" }} />
              </div>
              <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="font-bold">
                {isNew ? "Add New Category" : "Edit Category"}
              </h2>
            </div>
            <button onClick={cancelEdit} className="p-1.5 rounded-full hover:opacity-60" style={{ color: "var(--color-olive)" }}>
              <X size={18} />
            </button>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">
                Name <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                placeholder="e.g. Fresh Bouquets"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: touched && !form.name.trim() ? "#dc2626" : "var(--color-border)", background: "var(--color-beige)", color: "var(--color-charcoal)" }}
              />
              <FieldError show={touched && !form.name.trim()} text="Name is required" />
            </div>

            {/* Emoji */}
            <div>
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">Emoji</label>
              <input
                value={form.emoji}
                onChange={e => setField("emoji", e.target.value)}
                placeholder="e.g. 💐"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: "var(--color-border)", background: "var(--color-beige)", color: "var(--color-charcoal)" }}
              />
            </div>

            {/* Description — full width */}
            <div className="sm:col-span-2">
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">
                Description <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <textarea
                value={form.desc}
                onChange={e => setField("desc", e.target.value)}
                rows={2}
                placeholder="Short description shown on the category page"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ borderColor: touched && !form.desc.trim() ? "#dc2626" : "var(--color-border)", background: "var(--color-beige)", color: "var(--color-charcoal)" }}
              />
              <FieldError show={touched && !form.desc.trim()} text="Description is required" />
            </div>

            {/* Image upload — full width */}
            <div className="sm:col-span-2">
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">
                Image <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <CategoryImageUploader
                value={form.img}
                onChange={v => setField("img", v)}
                onUploadingChange={setImgUploading}
                hasError={touched && !form.img.trim()}
              />
              <FieldError show={touched && !form.img.trim()} text="Image is required" />
            </div>

            {/* Color */}
            <div>
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">
                Accent Color <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setField("color", e.target.value)}
                  className="w-10 h-10 rounded-lg border cursor-pointer"
                  style={{ borderColor: "var(--color-border)", padding: "2px" }}
                />
                <input
                  value={form.color}
                  onChange={e => setField("color", e.target.value)}
                  placeholder="var(--color-olive)"
                  maxLength={7}
                  className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none font-mono"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-beige)", color: "var(--color-charcoal)" }}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label style={{ color: "var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">
                Tags <span style={{ color: "#dc2626" }}>*</span>
                <span style={{ color: "var(--color-olive)" }} className="font-normal ml-1">(comma separated)</span>
              </label>
              <input
                value={form.tags}
                onChange={e => setField("tags", e.target.value)}
                placeholder="Birthday, Wedding, Romance"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{
                  borderColor: touched && tagsArr.length === 0 ? "#dc2626" : "var(--color-border)",
                  background: "var(--color-beige)", color: "var(--color-charcoal)"
                }}
              />
              <FieldError show={touched && tagsArr.length === 0} text="At least one tag is required" />
              {tagsArr.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tagsArr.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: "var(--color-beige)", color: "var(--color-olive)" }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 px-6 pb-5">
            <button onClick={handleSave} disabled={saving || imgUploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: "var(--color-olive)" }}>
              {imgUploading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading…</>
                : saving
                  ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving…</>
                  : <><Check size={14} /> {isNew ? "Create Category" : "Save Changes"}</>
              }
            </button>
            <button onClick={cancelEdit}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: "var(--color-border)", color: "var(--color-olive)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── List header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-olive)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search categories…"
            className="pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none w-56"
            style={{ borderColor: "var(--color-border)", background: "white", color: "var(--color-charcoal)" }}
          />
        </div>
        {editing === null && (
          <button onClick={openNew}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--color-olive)" }}>
            <Plus size={15} /> Add Category
          </button>
        )}
      </div>

      {/* ── States ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 rounded-full animate-spin"
            style={{ borderColor: "var(--color-olive)", borderTopColor: "transparent" }} />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p style={{ color: "#dc2626" }} className="font-semibold mb-3">{error}</p>
          <button onClick={loadCategories} style={{ color: "var(--color-olive)" }} className="text-sm font-semibold hover:underline">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">⌕</span>
          <p style={{ color: "var(--color-olive)" }}>
            {search ? `No categories matching "${search}"` : "No categories yet. Add your first one!"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cat => (
            <div key={cat._id}
              className="bg-white rounded-2xl border overflow-hidden transition-shadow hover:shadow-md"
              style={{ borderColor: "var(--color-border)" }}>

              {/* Image */}
              <div className="relative h-36 overflow-hidden">
                <img src={cat.img} alt={cat.name}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                />
                <div className="hidden w-full h-full items-center justify-center text-4xl"
                  style={{ background: cat.color + "22" }}>
                  {cat.emoji || "💻"}
                </div>
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }} />
                <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                  <span className="text-lg">{cat.emoji}</span>
                  <span className="text-white font-bold text-sm drop-shadow"
                    style={{ fontFamily: "Georgia,serif" }}>{cat.name}</span>
                </div>
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-white shadow-sm"
                  style={{ background: cat.color }} />
              </div>

              {/* Body */}
              <div className="p-4">
                <p style={{ color: "var(--color-olive)" }} className="text-xs leading-relaxed mb-3 line-clamp-2">{cat.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(cat.tags || []).slice(0, 4).map(t => (
                    <span key={t} className="flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--color-beige)", color: "var(--color-olive)" }}>
                      <Tag size={9} /> {t}
                    </span>
                  ))}
                  {(cat.tags || []).length > 4 && (
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--color-beige)", color: "var(--color-olive)" }}>
                      +{cat.tags.length - 4}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <button onClick={() => openEdit(cat)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:opacity-80"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-charcoal)" }}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(cat._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
                    style={{ background: "#fee2e2", color: "#dc2626" }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "#fee2e2" }}>
              <Trash2 size={22} style={{ color: "#dc2626" }} />
            </div>
            <h3 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }}
              className="font-bold text-lg text-center mb-2">Delete Category?</h3>
            <p style={{ color: "var(--color-olive)" }} className="text-sm text-center mb-5">
              This will permanently remove{" "}
              <strong style={{ color: "var(--color-charcoal)" }}>
                {categories.find(c => c._id === deleteConfirm)?.name}
              </strong>
              . This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ borderColor: "var(--color-border)", color: "var(--color-olive)" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} disabled={deleting}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "#dc2626" }}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
