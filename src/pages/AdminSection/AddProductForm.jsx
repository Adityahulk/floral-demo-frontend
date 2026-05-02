import { useState, useRef, useEffect } from "react";
import { api } from "../../api/client";
import { API } from "../../api/endpoints";
import {
  ArrowLeft, Upload, X, Plus, Check, AlertCircle,
  Image, Tag, IndianRupee, Package, FileText,
  ChevronDown, Trash2, Eye, RotateCcw,
  Star, Layers, Palette, Ruler, Info
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const SIZES      = ["Small", "Medium", "Large", "Extra Large"];
const BADGES     = ["None", "New", "Popular", "Sale", "Premium", "Bestseller"];
const OCCASIONS  = ["Birthday", "Anniversary", "Wedding", "Romance", "Congratulations", "Sympathy", "Corporate", "Seasonal", "Gift", "Luxury"];
const FALLBACK_CATEGORIES = ["Bouquets", "Arrangements", "Wreaths", "Dried Flowers", "Plants", "Gift Hampers"];

const INITIAL = {
  name:               "",
  category:           "",
  description:        "",
  price:              "",
  originalPrice:      "",
  quantity:           "",
  badge:              "None",
  sizes:              [],
  colors:             [],
  delivery_time:      "Same Day",
  active:             true,
  tags:               [],
  care_instructions:  [],
  what_included:      [],
  rating_average:     0,
  rating_total:       0,
  reviews:            0,
};

function productToForm(p) {
  return {
    name:              p.name || "",
    category:          p.category?._id || p.category || "",
    description:       p.description || "",
    price:             p.price || "",
    originalPrice:     p.originalPrice || "",
    quantity:          p.quantity || "",
    badge:             p.badge || "None",
    sizes:             p.sizes || [],
    colors:            p.colors || [],
    delivery_time:     p.delivery_time || "Same Day",
    active:            p.active ?? true,
    tags:              p.tags || [],
    care_instructions: p.care_instructions || [],
    what_included:     p.what_included || [],
    rating_average:    p.rating?.average || 0,
    rating_total:      p.rating?.total || 0,
    reviews:           p.reviews || 0,
  };
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Label({ children, required, hint }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label style={{ color:"#4a3728" }} className="text-sm font-bold flex items-center gap-1">
        {children}
        {required && <span style={{ color:"#dc2626" }}>*</span>}
      </label>
      {hint && <span style={{ color:"#9c7a62" }} className="text-xs">{hint}</span>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", prefix, suffix, error }) {
  return (
    <div>
      <div className="relative flex items-center">
        {prefix && (
          <div className="absolute left-3 text-sm font-bold" style={{ color:"#9c7a62" }}>{prefix}</div>
        )}
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-3 rounded-xl border text-sm outline-none transition-all"
          style={{
            paddingLeft:  prefix  ? "2rem" : "1rem",
            paddingRight: suffix  ? "3rem" : "1rem",
            borderColor:  error   ? "#dc2626" : "#e8d5c4",
            background:   "white",
            color:        "#3a2416",
          }}
          onFocus={e => e.target.style.borderColor = "#c97d5b"}
          onBlur={e  => e.target.style.borderColor = error ? "#dc2626" : "#e8d5c4"}
        />
        {suffix && (
          <div className="absolute right-3 text-xs" style={{ color:"#9c7a62" }}>{suffix}</div>
        )}
      </div>
      {error && <p className="text-xs mt-1" style={{ color:"#dc2626" }}>{error}</p>}
    </div>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, maxLen }) {
  return (
    <div>
      <textarea
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} rows={rows}
        maxLength={maxLen}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all"
        style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }}
        onFocus={e => e.target.style.borderColor = "#c97d5b"}
        onBlur={e  => e.target.style.borderColor = "#e8d5c4"}
      />
      {maxLen && (
        <p className="text-xs text-right mt-1" style={{ color:"#9c7a62" }}>
          {value.length}/{maxLen}
        </p>
      )}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-3 rounded-xl border text-sm outline-none transition-all"
        style={{
          borderColor: "#e8d5c4", background:"white",
          color: value ? "#3a2416" : "#9c7a62",
        }}
        onFocus={e => e.target.style.borderColor = "#c97d5b"}
        onBlur={e  => e.target.style.borderColor = "#e8d5c4"}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color:"#9c7a62" }} />
    </div>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border"
      style={{ borderColor:"#e8d5c4", background:"white" }}>
      <div>
        <p style={{ color:"#3a2416" }} className="text-sm font-semibold">{label}</p>
        {sub && <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{sub}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className="w-12 h-6 rounded-full transition-all relative shrink-0"
        style={{ background: checked ? "#c97d5b" : "#e8d5c4" }}>
        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
          style={{ left: checked ? "calc(100% - 22px)" : "2px" }} />
      </button>
    </div>
  );
}

function ChipGroup({ label, options, selected, onToggle, color = "#c97d5b" }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} onClick={() => onToggle(o)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
            style={active
              ? { background: color, borderColor: color, color:"white" }
              : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
            {active && <Check size={10}/>} {o}
          </button>
        );
      })}
    </div>
  );
}

function newId() {
  return Math.random().toString(36).slice(2);
}

function DynamicListInput({ items, setItems, placeholder }) {
  const [ids, setIds] = useState(() => items.map(newId));

  function handleChange(index, value) {
    setItems(items.map((item, i) => i === index ? value : item));
  }

  function addItem() {
    setIds(prev => [...prev, newId()]);
    setItems([...items, ""]);
  }

  function removeItem(index) {
    setIds(prev => prev.filter((_, i) => i !== index));
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={ids[index]} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={e => handleChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{ borderColor: "#e8d5c4", background: "white", color: "#3a2416" }}
            onFocus={e => e.target.style.borderColor = "#c97d5b"}
            onBlur={e  => e.target.style.borderColor = "#e8d5c4"}
          />
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "#fee2e2" }}>
            <X size={13} style={{ color: "#dc2626" }} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed text-xs font-semibold hover:opacity-70 transition-opacity"
        style={{ borderColor: "#c97d5b", color: "#c97d5b" }}>
        <Plus size={13} /> Add Item
      </button>
    </div>
  );
}

function ColorPickerInput({ colors, setColors }) {
  const [name, setName] = useState("");
  const [hex,  setHex]  = useState("#e53e3e");

  function addColor() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (colors.some(c => c[0].toLowerCase() === trimmed.toLowerCase())) return;
    setColors([...colors, [trimmed, hex]]);
    setName("");
    setHex("#e53e3e");
  }

  function removeColor(colorName) {
    setColors(colors.filter(([n]) => n !== colorName));
  }

  return (
    <div className="space-y-3">
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map(([colorName, colorHex]) => (
            <span key={colorName}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2"
              style={{ borderColor: "#e8d5c4", color: "#3a2416" }}>
              <span className="w-3 h-3 rounded-full shrink-0 border border-white/50"
                style={{ background: colorHex }} />
              {colorName}
              <button type="button" onClick={() => removeColor(colorName)} className="hover:opacity-70">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addColor()}
          placeholder="Color name (e.g. Red)"
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{ borderColor: "#e8d5c4", background: "white", color: "#3a2416" }}
          onFocus={e => e.target.style.borderColor = "#c97d5b"}
          onBlur={e  => e.target.style.borderColor = "#e8d5c4"}
        />
        <input
          type="color"
          value={hex}
          onChange={e => setHex(e.target.value)}
          className="w-10 h-10 rounded-xl border-2 cursor-pointer p-0.5"
          style={{ borderColor: "#e8d5c4" }}
          title="Pick color"
        />
        <button
          type="button"
          onClick={addColor}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: "#c97d5b" }}>
          <Plus size={14} /> Add
        </button>
      </div>
      <p className="text-xs" style={{ color: "#9c7a62" }}>
        Type a name, pick a color, then click Add
      </p>
    </div>
  );
}

function SectionCard({ title, icon, children, optional }) {
  return (
    <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
      <div className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
        <div className="flex items-center gap-3">
          <div style={{ background:"#f5ede5", color:"#c97d5b" }}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h2 style={{ fontFamily:"Georgia,serif", color:"#3a2416" }} className="font-bold">{title}</h2>
        </div>
        {optional && <span style={{ color:"#9c7a62" }} className="text-xs">Optional</span>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── IMAGE UPLOADER ───────────────────────────────────────────────────────────

function ImageUploader({ images, setImages }) {
  const inputRef = useRef();

  async function uploadFile(file, id) {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("http://localhost:3001/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");
      setImages(prev => prev.map(img =>
        img.id === id ? { ...img, cloudUrl: data.url, uploading: false } : img
      ));
    } catch {
      setImages(prev => prev.map(img =>
        img.id === id ? { ...img, uploadError: true, uploading: false } : img
      ));
    }
  }

  function handleFiles(files) {
    const newImgs = Array.from(files).slice(0, 6 - images.length).map((file, i) => ({
      id:          Date.now() + Math.random(),
      url:         URL.createObjectURL(file),
      name:        file.name,
      primary:     images.length === 0 && i === 0,
      uploading:   true,
      cloudUrl:    null,
      uploadError: false,
    }));
    setImages(prev => [...prev, ...newImgs]);
    newImgs.forEach(img => {
      const file = Array.from(files).find(f => f.name === img.name);
      uploadFile(file, img.id);
    });
  }

  function setPrimary(id) {
    setImages(prev => prev.map(img => ({ ...img, primary: img.id === id })));
  }

  function removeImage(id) {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(i => i.primary)) {
        filtered[0].primary = true;
      }
      return filtered;
    });
  }

  return (
    <div>
      {/* Upload Area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all hover:border-opacity-70"
        style={{ borderColor:"#c97d5b", background:"#fdf8f3" }}>
        <Upload size={28} style={{ color:"#c97d5b" }} className="mx-auto mb-3"/>
        <p style={{ color:"#4a3728" }} className="font-semibold text-sm">
          Drag & drop images here
        </p>
        <p style={{ color:"#9c7a62" }} className="text-xs mt-1">
          or <span style={{ color:"#c97d5b" }} className="font-semibold">click to browse</span>
        </p>
        <p style={{ color:"#b89c8a" }} className="text-xs mt-2">
          PNG, JPG, WEBP up to 5MB · Max 6 images
        </p>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
          {images.map(img => (
            <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border-2"
              style={{ borderColor: img.uploadError ? "#dc2626" : img.primary ? "#c97d5b" : "#e8d5c4" }}>
              <img src={img.url} alt="" className="w-full h-full object-cover"/>

              {/* Upload spinner */}
              {img.uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                </div>
              )}

              {/* Upload error */}
              {img.uploadError && (
                <div className="absolute inset-0 bg-red-500/70 flex flex-col items-center justify-center gap-1">
                  <AlertCircle size={14} className="text-white"/>
                  <span className="text-white text-xs font-bold" style={{ fontSize:"9px" }}>Failed</span>
                </div>
              )}

              {/* Primary badge */}
              {img.primary && !img.uploading && !img.uploadError && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background:"#c97d5b", color:"white", fontSize:"9px" }}>
                  Main
                </div>
              )}

              {/* Overlay on hover */}
              {!img.uploading && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                  {!img.primary && !img.uploadError && (
                    <button type="button" onClick={() => setPrimary(img.id)}
                      className="text-white text-xs font-semibold px-2 py-1 rounded-full"
                      style={{ background:"rgba(201,125,91,0.9)", fontSize:"9px" }}>
                      Set Main
                    </button>
                  )}
                  <button type="button" onClick={() => removeImage(img.id)}
                    className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                    <X size={11} className="text-white"/>
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add more slot */}
          {images.length < 6 && (
            <button type="button" onClick={() => inputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center hover:opacity-70 transition-opacity"
              style={{ borderColor:"#e8d5c4" }}>
              <Plus size={18} style={{ color:"#9c7a62" }}/>
              <span style={{ color:"#9c7a62" }} className="text-xs mt-1">Add</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TAG INPUT ────────────────────────────────────────────────────────────────

function TagInput({ tags, setTags, placeholder }) {
  const [input, setInput] = useState("");

  function addTag(e) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      const tag = input.trim().replace(",","");
      if (tag && !tags.includes(tag)) setTags(prev => [...prev, tag]);
      setInput("");
    }
  }

  return (
    <div className="rounded-xl border p-3 flex flex-wrap gap-2 min-h-12"
      style={{ borderColor:"#e8d5c4", background:"white" }}>
      {tags.map(t => (
        <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{ background:"#f5ede5", color:"#c97d5b" }}>
          {t}
          <button onClick={() => setTags(prev => prev.filter(x => x !== t))}>
            <X size={10}/>
          </button>
        </span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={addTag}
        placeholder={tags.length === 0 ? placeholder : "Add more..."}
        className="flex-1 text-sm outline-none min-w-24"
        style={{ color:"#3a2416", background:"transparent" }}/>
    </div>
  );
}

// ─── PREVIEW PANEL ────────────────────────────────────────────────────────────

function PreviewCard({ form, images }) {
  const mainImg = images.find(i => i.primary)?.url || images[0]?.url;
  const disc = form.price && form.originalPrice
    ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
    : null;

  return (
    <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
        <div style={{ background:"#f5ede5", color:"#c97d5b" }} className="w-8 h-8 rounded-xl flex items-center justify-center">
          <Eye size={16}/>
        </div>
        <h3 style={{ fontFamily:"Georgia,serif", color:"#3a2416" }} className="font-bold">Live Preview</h3>
      </div>

      {/* Product card preview */}
      <div className="p-5">
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor:"#f0e4d8" }}>
          {/* Image */}
          <div className="relative bg-stone-100" style={{ aspectRatio:"4/5" }}>
            {mainImg ? (
              <img src={mainImg} alt="" className="w-full h-full object-cover"/>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <Image size={32} style={{ color:"#d0b8a8" }}/>
                <p style={{ color:"#b89c8a" }} className="text-xs mt-2">No image added</p>
              </div>
            )}
            {form.badge && form.badge !== "None" && (
              <span className="absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                style={{ background: form.badge==="Sale" ? "#f43f5e" : form.badge==="New" ? "#10b981" : form.badge==="Premium" ? "#f59e0b" : "#8b5cf6" }}>
                {form.badge === "Sale" && disc ? `-${disc}%` : form.badge}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            {form.category && (
              <p style={{ color:"#9c7a62" }} className="text-xs mb-1">{form.category}</p>
            )}
            <p style={{ color:"#3a2416", fontFamily:"Georgia,serif" }} className="font-semibold text-sm mb-2">
              {form.name || <span style={{ color:"#b89c8a" }}>Product name...</span>}
            </p>
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400"/>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span style={{ color:"#c97d5b", fontFamily:"Georgia,serif" }} className="font-bold">
                  {form.price ? `₹${Number(form.price).toLocaleString("en-IN")}` : "₹—"}
                </span>
                {form.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{Number(form.originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              <div style={{ background:"#f5ede5" }} className="w-8 h-8 rounded-full flex items-center justify-center">
                <Package size={14} style={{ color:"#c97d5b" }}/>
              </div>
            </div>
          </div>
        </div>

        {/* Stock indicator */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <span style={{ color:"#9c7a62" }}>Stock</span>
          <span style={{ color: Number(form.quantity) < 10 ? "#dc2626" : "#16a34a" }} className="font-bold">
            {form.quantity ? `${form.quantity} units` : "—"}
          </span>
        </div>

        {/* Active status */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <span style={{ color:"#9c7a62" }}>Status</span>
          <span className="font-bold px-2 py-0.5 rounded-full"
            style={{ background: form.active ? "#dcfce7" : "#f5f5f4", color: form.active ? "#16a34a" : "#9c7a62" }}>
            {form.active ? "Active" : "Draft"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN FORM
// ══════════════════════════════════════════════════════════════════════════════

export default function AddProductForm({ onBack, initialData, onSuccess }) {
  const isEdit = !!initialData?._id;
  const [form,       setForm]       = useState(() => initialData ? productToForm(initialData) : INITIAL);
  const [images,     setImages]     = useState(() =>
    initialData?.images?.map(url => ({
      id: Math.random().toString(36).slice(2),
      url, name: url.split("/").pop() || "image",
      primary: false, uploading: false, cloudUrl: url, uploadError: null,
    })) ?? []
  );
  const [errors,     setErrors]     = useState({});
  const [saved,      setSaved]      = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [saveError,  setSaveError]  = useState(null);
  const [categories, setCategories] = useState([]);
  const [catLoading, setCatLoading] = useState(true);

  useEffect(() => {
    api(API.categories.list)
      .then(data => {
        const list = Array.isArray(data) ? data : (data.data ?? []);
        setCategories(list.length > 0
          ? list
          : FALLBACK_CATEGORIES.map(name => ({ _id: name, name }))
        );
      })
      .catch(() => setCategories(FALLBACK_CATEGORIES.map(name => ({ _id: name, name }))))
      .finally(() => setCatLoading(false));
  }, []);

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
  }

  function toggleMulti(key, val) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())           e.name        = "Product name is required";
    if (!form.category)              e.category    = "Please select a category";
    if (!form.description.trim())    e.description = "Description is required";
    if (!form.price)                 e.price       = "Price is required";
    if (isNaN(Number(form.price)))   e.price       = "Enter a valid price";
    if (!form.quantity)              e.quantity    = "Stock quantity is required";
    const uploadedImages = images.filter(i => i.cloudUrl);
    if (uploadedImages.length === 0) e.images      = "Please add at least one image";
    const stillUploading = images.some(i => i.uploading);
    if (stillUploading)              e.images      = "Please wait for images to finish uploading";
    return e;
  }

  async function handleSave(asDraft = false) {
    setSaveError(null);
    const e = validate();
    if (Object.keys(e).length > 0 && !asDraft) {
      setErrors(e);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const payload = {
      name:               form.name.trim(),
      description:        form.description.trim(),
      sizes:              form.sizes,
      colors:             form.colors,
      delivery_time:      form.delivery_time,
      price:              Number(form.price),
      tags:               form.tags,
      quantity:           Number(form.quantity),
      category:           form.category,
      active:             asDraft ? false : form.active,
      care_instructions:  form.care_instructions.filter(s => s.trim()),
      what_included:      form.what_included.filter(s => s.trim()),
      images:             images.filter(i => i.cloudUrl).map(i => i.cloudUrl),
    };
    if (form.originalPrice) payload.originalPrice = Number(form.originalPrice);
    if (form.badge && form.badge !== "None") payload.badge = form.badge;
    payload.rating  = { average: Number(form.rating_average), total: Number(form.rating_total) };
    payload.reviews = Number(form.reviews);

    setSaving(true);
    try {
      const url    = isEdit ? `http://localhost:3001/api/products/${initialData._id}` : "http://localhost:3001/api/product";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server error ${res.status}`);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      if (isEdit) { onSuccess?.(); } else { handleReset(); }
    } catch (err) {
      setSaveError(err.message || "Failed to save product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(INITIAL);
    setImages([]);
    setErrors({});
    setSaveError(null);
  }

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>

      {/* Top Bar */}
      <div className="sticky top-0 z-30 border-b" style={{ background:"white", borderColor:"#e8d5c4" }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack || (() => window.history.back())}
              style={{ background:"#f5ede5", color:"#c97d5b" }}
              className="p-2 rounded-xl hover:opacity-80 transition-opacity">
              <ArrowLeft size={18}/>
            </button>
            <div>
              <h1 style={{ fontFamily:"Georgia,serif", color:"#3a2416" }} className="font-bold text-lg">{isEdit ? "Edit Product" : "Add New Product"}</h1>
              <p style={{ color:"#9c7a62" }} className="text-xs">{isEdit ? "Update the product details below" : "Fill in the details to list a new product"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold hover:opacity-70"
              style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              <RotateCcw size={14}/> Reset
            </button>
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background:"#c97d5b" }}>
              {saving
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> {isEdit ? "Updating..." : "Publishing..."}</>
                : <><Check size={14}/> {isEdit ? "Update Product" : "Publish Product"}</>
              }
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl"
          style={{ background:"#22c55e" }}>
          <Check size={16} className="text-white"/>
          <span className="text-white text-sm font-semibold">{isEdit ? "Product updated successfully!" : "Product published successfully!"}</span>
        </div>
      )}

      {/* Error Toast */}
      {saveError && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl"
          style={{ background:"#dc2626" }}>
          <AlertCircle size={16} className="text-white shrink-0"/>
          <span className="text-white text-sm font-semibold">{saveError}</span>
          <button type="button" onClick={() => setSaveError(null)} className="ml-2 text-white hover:opacity-70">
            <X size={14}/>
          </button>
        </div>
      )}

      {/* Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background:"#fee2e2", border:"1px solid #fecaca" }}>
            <AlertCircle size={16} style={{ color:"#dc2626" }} className="shrink-0"/>
            <p style={{ color:"#b91c1c" }} className="text-sm font-semibold">
              Please fix {Object.keys(errors).length} error(s) before publishing.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="space-y-6">

            {/* 1. Images */}
            <SectionCard title="Product Images" icon={<Image size={16}/>}>
              <ImageUploader images={images} setImages={setImages}/>
              {errors.images && (
                <p className="text-xs flex items-center gap-1" style={{ color:"#dc2626" }}>
                  <AlertCircle size={12}/> {errors.images}
                </p>
              )}
              <p style={{ color:"#9c7a62" }} className="text-xs flex items-center gap-1">
                <Info size={11}/> First image is the main display image. Click "Set Main" to change.
              </p>
            </SectionCard>

            {/* 2. Basic Info */}
            <SectionCard title="Basic Information" icon={<FileText size={16}/>}>
              <div>
                <Label required>Product Name</Label>
                <Input value={form.name} onChange={v => update("name", v)}
                  placeholder="e.g. Rose Bliss Bouquet" error={errors.name}/>
              </div>
              <div>
                <Label required>Category</Label>
                {catLoading ? (
                  <div className="px-4 py-3 rounded-xl border text-sm"
                    style={{ borderColor:"#e8d5c4", color:"#9c7a62" }}>
                    Loading categories...
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={e => update("category", e.target.value)}
                      className="w-full appearance-none px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={{
                        borderColor: errors.category ? "#dc2626" : "#e8d5c4",
                        background: "white",
                        color: form.category ? "#3a2416" : "#9c7a62",
                      }}
                      onFocus={e => e.target.style.borderColor = "#c97d5b"}
                      onBlur={e  => e.target.style.borderColor = errors.category ? "#dc2626" : "#e8d5c4"}>
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color:"#9c7a62" }}/>
                  </div>
                )}
                {errors.category && <p className="text-xs mt-1" style={{ color:"#dc2626" }}>{errors.category}</p>}
              </div>
              <div>
                <Label required hint={`${form.description.length}/500`}>Description</Label>
                <Textarea value={form.description} onChange={v => update("description", v)}
                  placeholder="Describe your product — what makes it special, what's included, ideal for what occasions..."
                  rows={5} maxLen={500}/>
                {errors.description && <p className="text-xs mt-1" style={{ color:"#dc2626" }}>{errors.description}</p>}
              </div>
              <div>
                <Label>Care Instructions</Label>
                <DynamicListInput
                  items={form.care_instructions}
                  setItems={v => update("care_instructions", v)}
                  placeholder="Instruction"
                />
              </div>
            </SectionCard>

            {/* 3. Pricing */}
            <SectionCard title="Pricing & Stock" icon={<IndianRupee size={16}/>}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Selling Price</Label>
                  <Input value={form.price} onChange={v => update("price", v)}
                    type="number" prefix="₹" placeholder="1299" error={errors.price}/>
                </div>
                <div>
                  <Label hint="Optional">Original Price (MRP)</Label>
                  <Input value={form.originalPrice} onChange={v => update("originalPrice", v)}
                    type="number" prefix="₹" placeholder="1599"/>
                </div>
              </div>

              {/* Discount Preview */}
              {(() => {
                const disc = form.price && form.originalPrice
                  ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
                  : null;
                return disc && disc > 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background:"#dcfce7" }}>
                    <Check size={14} style={{ color:"#16a34a" }}/>
                    <p style={{ color:"#15803d" }} className="text-sm font-semibold">
                      Customer saves ₹{(Number(form.originalPrice) - Number(form.price)).toLocaleString("en-IN")} ({disc}% off)
                    </p>
                  </div>
                ) : null;
              })()}

              <div>
                <Label required>Stock Quantity</Label>
                <Input value={form.quantity} onChange={v => update("quantity", v)}
                  type="number" placeholder="50" suffix="units" error={errors.quantity}/>
                {form.quantity && Number(form.quantity) < 10 && (
                  <p className="text-xs mt-1 flex items-center gap-1" style={{ color:"#ca8a04" }}>
                    <AlertCircle size={11}/> Low stock warning will show under 10 units
                  </p>
                )}
              </div>

              <div>
                <Label>Badge / Label</Label>
                <div className="flex flex-wrap gap-2">
                  {BADGES.map(b => (
                    <button key={b} onClick={() => update("badge", b)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                      style={form.badge === b
                        ? { background:"#c97d5b", borderColor:"#c97d5b", color:"white" }
                        : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* 4. Variants */}
            <SectionCard title="Sizes & Colors" icon={<Ruler size={16}/>} optional>
              <div>
                <Label>Available Sizes</Label>
                <ChipGroup options={SIZES} selected={form.sizes} onToggle={v => toggleMulti("sizes", v)}/>
              </div>
              <div>
                <Label>Available Colors</Label>
                <ColorPickerInput
                  colors={form.colors}
                  setColors={v => update("colors", v)}
                />
              </div>
            </SectionCard>

            {/* 5. Occasions & Tags */}
            <SectionCard title="Occasions & Tags" icon={<Tag size={16}/>} optional>
              <div>
                <Label>Suitable Occasions</Label>
                <ChipGroup
                  options={OCCASIONS}
                  selected={form.tags}
                  onToggle={v => toggleMulti("tags", v)}
                  color="#7c3aed"
                />
              </div>
              <div>
                <Label hint="Press Enter or comma to add">Custom Tags</Label>
                <TagInput tags={form.tags} setTags={t => update("tags", t)}
                  placeholder="Type a tag and press Enter... e.g. Romantic, Spring"/>
                <p style={{ color:"#9c7a62" }} className="text-xs mt-1">Tags help customers find your product in search</p>
              </div>
            </SectionCard>

            {/* 6. Delivery */}
            <SectionCard title="Delivery" icon={<Package size={16}/>} optional>
              <div>
                <Label>Estimated Delivery Time</Label>
                <Select value={form.delivery_time} onChange={v => update("delivery_time", v)}
                  options={["Same Day","Next Day","2-3 Days","3-5 Days"]}
                  placeholder="Select delivery time"/>
              </div>
            </SectionCard>

            {/* 7. What's Included */}
            <SectionCard title="What's Included" icon={<Package size={16}/>} optional>
              <div>
                <Label hint="Items included with this product">Items</Label>
                <DynamicListInput
                  items={form.what_included}
                  setItems={v => update("what_included", v)}
                  placeholder="Item"
                />
              </div>
            </SectionCard>

            {/* 8. Reviews & Rating */}
            <SectionCard title="Reviews & Rating" icon={<Star size={16}/>} optional>
              <div>
                <Label hint="0 – 5">Average Rating</Label>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => update("rating_average",
                          form.rating_average === star ? star - 1 : star
                        )}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={28}
                          style={{
                            fill:   star <= form.rating_average ? "#f59e0b" : "none",
                            color:  star <= form.rating_average ? "#f59e0b" : "#d1d5db",
                            transition: "all 0.15s",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <span style={{ color:"#9c7a62" }} className="text-sm font-semibold">
                    {form.rating_average}/5
                  </span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label hint="Total votes">Total Ratings</Label>
                  <Input
                    value={form.rating_total}
                    onChange={v => update("rating_total", v)}
                    type="number"
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label hint="Written reviews">Number of Reviews</Label>
                  <Input
                    value={form.reviews}
                    onChange={v => update("reviews", v)}
                    type="number"
                    placeholder="0"
                  />
                </div>
              </div>
            </SectionCard>

            {/* 9. Visibility */}
            <SectionCard title="Visibility & Settings" icon={<Eye size={16}/>}>
              <Toggle
                checked={form.active}
                onChange={v => update("active", v)}
                label="Active / Published"
                sub="Customers can see and purchase this product"/>
            </SectionCard>

          </div>

          {/* ── RIGHT: Preview + Summary ── */}
          <div className="space-y-5 lg:sticky lg:top-24">

            {/* Preview Card */}
            <PreviewCard form={form} images={images}/>

            {/* Checklist */}
            <div className="bg-white rounded-3xl border p-5" style={{ borderColor:"#e8d5c4" }}>
              <p style={{ fontFamily:"Georgia,serif", color:"#3a2416" }} className="font-bold mb-4">Publishing Checklist</p>
              <div className="space-y-2.5">
                {[
                  ["Product name",      !!form.name.trim()],
                  ["Category",          !!form.category],
                  ["Description",       !!form.description.trim()],
                  ["Selling price",     !!form.price],
                  ["Stock quantity",    !!form.quantity],
                  ["Colors added",      form.colors.length > 0],
                  ["Sizes added",       form.sizes.length > 0],
                  ["Care instructions", form.care_instructions.some(s => s.trim())],
                ].map(([label, done]) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: done ? "#dcfce7" : "#f5f5f4" }}>
                      {done
                        ? <Check size={11} style={{ color:"#16a34a" }}/>
                        : <div className="w-2 h-2 rounded-full" style={{ background:"#d4d4d4" }}/>
                      }
                    </div>
                    <span className="text-xs" style={{ color: done ? "#4a3728" : "#9c7a62" }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ color:"#9c7a62" }} className="text-xs">Completion</span>
                  <span style={{ color:"#c97d5b" }} className="text-xs font-bold">
                    {Math.round(([
                      !!form.name.trim(), !!form.category, !!form.description.trim(),
                      !!form.price, !!form.quantity, form.colors.length > 0,
                      form.sizes.length > 0, form.care_instructions.some(s => s.trim())
                    ].filter(Boolean).length / 8) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background:"#f5ede5" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      background:"#c97d5b",
                      width: `${Math.round(([
                        !!form.name.trim(), !!form.category, !!form.description.trim(),
                        !!form.price, !!form.quantity, form.colors.length > 0,
                        form.sizes.length > 0, form.care_instructions.some(s => s.trim())
                      ].filter(Boolean).length / 8) * 100)}%`
                    }}/>
                </div>
              </div>
            </div>

            {/* Action buttons (sticky bottom for mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 flex gap-3 border-t"
              style={{ background:"white", borderColor:"#e8d5c4" }}>
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex-1 py-3 rounded-full text-white font-semibold text-sm hover:opacity-90"
                style={{ background:"#c97d5b" }}>
                {saving ? (isEdit ? "Updating..." : "Publishing...") : (isEdit ? "Update" : "Publish")}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}