import { useState, useRef } from "react";
import {
  ArrowLeft, Upload, X, Plus, Check, AlertCircle,
  Image, Tag, IndianRupee, Package, FileText,
  ChevronDown, Trash2, Eye, Save, RotateCcw,
  Star, Layers, Palette, Ruler, Info
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CATEGORIES = ["Bouquets", "Arrangements", "Wreaths", "Dried Flowers", "Plants", "Gift Hampers"];
const OCCASIONS  = ["Birthday", "Anniversary", "Wedding", "Romance", "Congratulations", "Sympathy", "Corporate", "Seasonal", "Gift", "Luxury"];
const COLORS     = ["Red", "Pink", "White", "Yellow", "Purple", "Orange", "Mixed", "Peach", "Blue", "Green"];
const SIZES      = ["Small", "Medium", "Large", "Extra Large"];
const BADGES     = ["None", "New", "Popular", "Sale", "Premium", "Bestseller"];

const INITIAL = {
  title:         "",
  category:      "",
  description:   "",
  price:         "",
  originalPrice: "",
  stock:         "",
  badge:         "None",
  sizes:         [],
  colors:        [],
  occasions:     [],
  careInstructions: "",
  weight:        "",
  deliveryTime:  "Same Day",
  isActive:      true,
  isFeatured:    false,
  tags:          [],
};

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

function DynamicListInput({ items, setItems, placeholder }) {
  function handleChange(index, value) {
    setItems(prev => prev.map((item, i) => i === index ? value : item));
  }

  function addItem() {
    setItems(prev => [...prev, ""]);
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={e => handleChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{ borderColor: "#e8d5c4", background: "white", color: "#3a2416" }}
            onFocus={e => e.target.style.borderColor = "#c97d5b"}
            onBlur={e => e.target.style.borderColor = "#e8d5c4"}
          />
          <button
            onClick={() => removeItem(index)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "#fee2e2" }}>
            <X size={13} style={{ color: "#dc2626" }} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed text-xs font-semibold hover:opacity-70 transition-opacity"
        style={{ borderColor: "#c97d5b", color: "#c97d5b" }}>
        <Plus size={13} /> Add Item
      </button>
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

  function handleFiles(files) {
    const newImgs = Array.from(files).slice(0, 6 - images.length).map(file => ({
      id:      Date.now() + Math.random(),
      url:     URL.createObjectURL(file),
      name:    file.name,
      primary: images.length === 0,
    }));
    setImages(prev => [...prev, ...newImgs]);
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
              style={{ borderColor: img.primary ? "#c97d5b" : "#e8d5c4" }}>
              <img src={img.url} alt="" className="w-full h-full object-cover"/>

              {/* Primary badge */}
              {img.primary && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background:"#c97d5b", color:"white", fontSize:"9px" }}>
                  Main
                </div>
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
                {!img.primary && (
                  <button onClick={() => setPrimary(img.id)}
                    className="text-white text-xs font-semibold px-2 py-1 rounded-full"
                    style={{ background:"rgba(201,125,91,0.9)", fontSize:"9px" }}>
                    Set Main
                  </button>
                )}
                <button onClick={() => removeImage(img.id)}
                  className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                  <X size={11} className="text-white"/>
                </button>
              </div>
            </div>
          ))}

          {/* Add more slot */}
          {images.length < 6 && (
            <button onClick={() => inputRef.current?.click()}
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
              {form.title || <span style={{ color:"#b89c8a" }}>Product title...</span>}
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
          <span style={{ color: Number(form.stock) < 10 ? "#dc2626" : "#16a34a" }} className="font-bold">
            {form.stock ? `${form.stock} units` : "—"}
          </span>
        </div>

        {/* Active status */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <span style={{ color:"#9c7a62" }}>Status</span>
          <span className="font-bold px-2 py-0.5 rounded-full"
            style={{ background: form.isActive ? "#dcfce7" : "#f5f5f4", color: form.isActive ? "#16a34a" : "#9c7a62" }}>
            {form.isActive ? "Active" : "Draft"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN FORM
// ══════════════════════════════════════════════════════════════════════════════

export default function AddProductForm({ onBack }) {
  const [form,   setForm]   = useState(INITIAL);
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saved,  setSaved]  = useState(false);
  const [saving, setSaving] = useState(false);

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
    if (!form.title.trim())    e.title    = "Product title is required";
    if (!form.category)        e.category = "Please select a category";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price)           e.price    = "Price is required";
    if (isNaN(form.price))     e.price    = "Enter a valid price";
    if (!form.stock)           e.stock    = "Stock quantity is required";
    if (images.length === 0)   e.images   = "Please add at least one image";
    return e;
  }

  function handleSave(asDraft = false) {
    const e = validate();
    if (Object.keys(e).length > 0 && !asDraft) {
      setErrors(e);
      window.scrollTo({ top:0, behavior:"smooth" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1500);
  }

  function handleReset() {
    setForm(INITIAL);
    setImages([]);
    setErrors({});
  }

  const disc = form.price && form.originalPrice
    ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
    : null;

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
              <h1 style={{ fontFamily:"Georgia,serif", color:"#3a2416" }} className="font-bold text-lg">Add New Product</h1>
              <p style={{ color:"#9c7a62" }} className="text-xs">Fill in the details to list a new product</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold hover:opacity-70"
              style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              <RotateCcw size={14}/> Reset
            </button>
            <button onClick={() => handleSave(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-semibold hover:opacity-70"
              style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              <Save size={14}/> Save Draft
            </button>
            <button onClick={() => handleSave(false)} disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background:"#c97d5b" }}>
              {saving
                ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Publishing...</>
                : <><Check size={14}/> Publish Product</>
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
          <span className="text-white text-sm font-semibold">Product published successfully!</span>
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
                <Label required>Product Title</Label>
                <Input value={form.title} onChange={v => update("title", v)}
                  placeholder="e.g. Rose Bliss Bouquet" error={errors.title}/>
              </div>
              <div>
                <Label required>Category</Label>
                <Select value={form.category} onChange={v => update("category", v)}
                  options={CATEGORIES} placeholder="Select a category"/>
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
                <Textarea value={form.careInstructions} onChange={v => update("careInstructions", v)}
                  placeholder="e.g. Change water every 2 days. Keep away from direct sunlight. Trim stems at an angle."
                  rows={3}/>
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
              {disc && disc > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background:"#dcfce7" }}>
                  <Check size={14} style={{ color:"#16a34a" }}/>
                  <p style={{ color:"#15803d" }} className="text-sm font-semibold">
                    Customer saves ₹{(Number(form.originalPrice) - Number(form.price)).toLocaleString("en-IN")} ({disc}% off)
                  </p>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label required>Stock Quantity</Label>
                  <Input value={form.stock} onChange={v => update("stock", v)}
                    type="number" placeholder="50" suffix="units" error={errors.stock}/>
                  {form.stock && Number(form.stock) < 10 && (
                    <p className="text-xs mt-1 flex items-center gap-1" style={{ color:"#ca8a04" }}>
                      <AlertCircle size={11}/> Low stock warning will show under 10 units
                    </p>
                  )}
                </div>
                <div>
                  <Label>Product Weight</Label>
                  <Input value={form.weight} onChange={v => update("weight", v)}
                    placeholder="500" suffix="grams"/>
                </div>
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
                <ChipGroup options={COLORS} selected={form.colors} onToggle={v => toggleMulti("colors", v)} color="#e11d48"/>
              </div>
            </SectionCard>

            {/* 5. Occasions & Tags */}
            <SectionCard title="Occasions & Tags" icon={<Tag size={16}/>} optional>
              <div>
                <Label>Suitable Occasions</Label>
                <ChipGroup options={OCCASIONS} selected={form.occasions} onToggle={v => toggleMulti("occasions", v)} color="#7c3aed"/>
              </div>
              <div>
                <Label hint="Press Enter or comma to add">Search Tags</Label>
                <TagInput tags={form.tags} setTags={t => update("tags", t)}
                  placeholder="Type a tag and press Enter... e.g. Romantic, Spring"/>
                <p style={{ color:"#9c7a62" }} className="text-xs mt-1">Tags help customers find your product in search</p>
              </div>
            </SectionCard>

            {/* 6. Delivery */}
            <SectionCard title="Delivery" icon={<Package size={16}/>} optional>
              <div>
                <Label>Estimated Delivery Time</Label>
                <Select value={form.deliveryTime} onChange={v => update("deliveryTime", v)}
                  options={["Same Day","Next Day","2-3 Days","3-5 Days"]}
                  placeholder="Select delivery time"/>
              </div>
            </SectionCard>

            {/* 7. Visibility */}
            <SectionCard title="Visibility & Settings" icon={<Eye size={16}/>}>
              <Toggle
                checked={form.isActive}
                onChange={v => update("isActive", v)}
                label="Active / Published"
                sub="Customers can see and purchase this product"/>
              <Toggle
                checked={form.isFeatured}
                onChange={v => update("isFeatured", v)}
                label="Featured Product"
                sub="Show in homepage and featured collections"/>
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
                  ["Product title",   !!form.title.trim()],
                  ["Category",        !!form.category],
                  ["Description",     !!form.description.trim()],
                  ["Selling price",   !!form.price],
                  ["Stock quantity",  !!form.stock],
                  ["Product images",  images.length > 0],
                  ["Occasions",       form.occasions.length > 0],
                  ["Sizes added",     form.sizes.length > 0],
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
                      !!form.title.trim(), !!form.category, !!form.description.trim(),
                      !!form.price, !!form.stock, images.length>0,
                      form.occasions.length>0, form.sizes.length>0
                    ].filter(Boolean).length / 8) * 100)}%
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background:"#f5ede5" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{
                      background:"#c97d5b",
                      width: `${Math.round(([
                        !!form.title.trim(), !!form.category, !!form.description.trim(),
                        !!form.price, !!form.stock, images.length>0,
                        form.occasions.length>0, form.sizes.length>0
                      ].filter(Boolean).length / 8) * 100)}%`
                    }}/>
                </div>
              </div>
            </div>

            {/* Action buttons (sticky bottom for mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 flex gap-3 border-t"
              style={{ background:"white", borderColor:"#e8d5c4" }}>
              <button onClick={() => handleSave(true)}
                className="flex-1 py-3 rounded-full border font-semibold text-sm"
                style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                Save Draft
              </button>
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex-1 py-3 rounded-full text-white font-semibold text-sm hover:opacity-90"
                style={{ background:"#c97d5b" }}>
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}