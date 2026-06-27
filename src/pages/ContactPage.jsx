import { useState } from "react";
import { api } from "../api/client";
import { API } from "../api/endpoints";
import {
  Phone, Mail, MapPin, Clock, Send, Check,
  MessageCircle, ChevronDown, ChevronUp
} from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { Instagram, Facebook, Twitter, Youtube,} from "react-feather";
import { BUSINESS_INFO } from "../constants/StaticVariables";
// ─── DATA ─────────────────────────────────────────────────────────────────────

const FAQS = [
  { q:"What are your delivery hours?",          a:"We deliver 7 days a week from 8AM to 9PM. Same-day delivery is available for orders placed before 2PM." },
  { q:"Do you deliver outside Surat?",          a:"Yes! We currently deliver to 12 cities including Delhi, Mumbai, Bengaluru, Hyderabad, Pune, and more." },
  { q:"Can I get help choosing a computer?",    a:"Absolutely! Call or WhatsApp us with your requirements and budget. Our team will recommend a practical setup for your work or home." },
  { q:"How are products packed for delivery?",  a:"Products are packed carefully with protective materials so they arrive safely." },
  { q:"What is your cancellation policy?",      a:"Orders can be cancelled up to 4 hours before the scheduled delivery time for a full refund." },
  { q:"Do you do bulk/event orders?",           a:"Yes, we take bulk orders for offices, housewarmings, weddings and events. Please contact us at least 7 days in advance for large orders." },
];

const TOPICS = ["General Inquiry", "Order Issue", "Repair Help", "Computer Setup", "Bulk / Office", "Feedback"];

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm]     = useState({ name:"", email:"", phone:"", topic:"General Inquiry", message:"" });
  const [sent, setSent]     = useState(false);
  const [loading, setLoad]  = useState(false);
  const [faqOpen, setFaq]   = useState(null);

  function onChange(k, v) { setForm(f => ({ ...f, [k]: v })); }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    setLoad(true);
    try {
      const data = await api(API.contact.submit, { method: "POST", body: form });
      if (data.success) setSent(true);
    } finally {
      setLoad(false);
    }
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all";
  const inputStyle = { borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" };

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>

      <Breadcrumb paths={[
        { id: 1, name: "Home",    path: "/" },
        { id: 2, name: "Contact", path: "/contact" },
      ]} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20" style={{ background:"var(--color-charcoal)" }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background:"var(--color-olive)" }} />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10"  style={{ background:"var(--color-beige)" }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <span style={{ background:"rgba(215,25,32,0.12)", color:"var(--color-sage)" }}
            className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5">
            Get In Touch
          </span>
          <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="text-5xl font-bold mb-5">
            We'd Love To<br /><span style={{ color:"var(--color-sage)" }} className="italic">Hear From You</span>
          </h1>
          <p style={{ color:"var(--color-sage)" }} className="text-lg leading-relaxed max-w-xl mx-auto">
            Have a product question, repair request, setup need, or just want to say hello?
            Our team is here for you — always.
          </p>
        </div>
      </section>

      {/* ── CONTACT CARDS ── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 -mt-12">
            {[
              { icon:<Phone size={22}/>,          title:"Call Us",        value:BUSINESS_INFO.phoneDisplay, sub:"Mon-Sun, 8AM-9PM",           href:BUSINESS_INFO.phoneHref,      color:"var(--color-olive)" },
              { icon:<MessageCircle size={22}/>,   title:"WhatsApp",      value:BUSINESS_INFO.phoneDisplay, sub:"Quick replies in minutes",    href:BUSINESS_INFO.whatsappHref,   color:"#22c55e" },
              { icon:<Mail size={22}/>,            title:"Email Us",      value:BUSINESS_INFO.email,   sub:"Reply within 24 hours",       href:BUSINESS_INFO.emailHref, color:"#3b82f6" },
              { icon:<MapPin size={22}/>,          title:"Visit Store",   value:BUSINESS_INFO.address, sub:"Open daily 9AM-7PM",          href:BUSINESS_INFO.mapsHref, color:"#f59e0b" },
            ].map(({ icon, title, value, sub, href, color }) => (
              <a key={title} href={href}
                className="bg-white rounded-3xl p-6 border text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 block"
                style={{ borderColor:"var(--color-border)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background:`${color}18`, color }}>
                  {icon}
                </div>
                <p style={{ color:"var(--color-charcoal)" }} className="font-bold mb-1">{title}</p>
                <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-medium mb-1">{value}</p>
                <p style={{ color:"var(--color-olive)" }} className="text-xs">{sub}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM + INFO ── */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 border" style={{ borderColor:"var(--color-border)" }}>
            {sent ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ background:"#dcfce7" }}>
                  <Check size={40} style={{ color:"#16a34a" }} />
                </div>
                <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-3xl font-bold mb-3">
                  Message Sent!
                </h2>
                <p style={{ color:"var(--color-olive)" }} className="mb-6">
                  Thank you, <strong>{form.name}</strong>! We'll get back to you at<br />
                  <strong style={{ color:"var(--color-olive)" }}>{form.email}</strong> within 24 hours.
                </p>
                <button onClick={() => { setSent(false); setForm({ name:"", email:"", phone:"", topic:"General Inquiry", message:"" }); }}
                  style={{ background:"var(--color-olive)" }} className="text-white px-7 py-3 rounded-full font-semibold hover:opacity-90">
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-2xl font-bold mb-1">Send Us a Message</h2>
                  <p style={{ color:"var(--color-olive)" }} className="text-sm">Product queries, repair help, or setup advice — we'll respond within 24 hours.</p>
                </div>

                <div className="space-y-5">
                  {/* Name + Email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ color:"var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">Full Name *</label>
                      <input value={form.name} onChange={e => onChange("name", e.target.value)}
                        placeholder="Priya Sharma" className={inputCls} style={inputStyle}
                        onFocus={e => e.target.style.borderColor="var(--color-olive)"}
                        onBlur={e  => e.target.style.borderColor="var(--color-border)"} />
                    </div>
                    <div>
                      <label style={{ color:"var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">Email Address *</label>
                      <input type="email" value={form.email} onChange={e => onChange("email", e.target.value)}
                        placeholder="priya@example.com" className={inputCls} style={inputStyle}
                        onFocus={e => e.target.style.borderColor="var(--color-olive)"}
                        onBlur={e  => e.target.style.borderColor="var(--color-border)"} />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ color:"var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">
                      Phone Number <span style={{ color:"var(--color-olive)" }} className="font-normal">(optional)</span>
                    </label>
                    <input type="tel" value={form.phone} onChange={e => onChange("phone", e.target.value)}
                      placeholder={BUSINESS_INFO.phoneDisplay} className={inputCls} style={inputStyle}
                      onFocus={e => e.target.style.borderColor="var(--color-olive)"}
                      onBlur={e  => e.target.style.borderColor="var(--color-border)"} />
                  </div>

                  {/* Topic */}
                  <div>
                    <label style={{ color:"var(--color-charcoal)" }} className="block text-sm font-semibold mb-2">What's This About?</label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map(t => (
                        <button key={t} onClick={() => onChange("topic", t)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
                          style={form.topic === t
                            ? { background:"var(--color-olive)", borderColor:"var(--color-olive)", color:"white" }
                            : { borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ color:"var(--color-charcoal)" }} className="block text-sm font-semibold mb-1.5">Your Message *</label>
                    <textarea value={form.message} onChange={e => onChange("message", e.target.value)}
                      rows={5} placeholder="Tell us about the product, repair, setup, or support you need..."
                      className={inputCls + " resize-none"} style={inputStyle}
                      onFocus={e => e.target.style.borderColor="var(--color-olive)"}
                      onBlur={e  => e.target.style.borderColor="var(--color-border)"} />
                    <p style={{ color:"var(--color-sage)" }} className="text-xs mt-1 text-right">{form.message.length}/500</p>
                  </div>

                  <button onClick={handleSubmit} disabled={loading}
                    className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
                    style={{ background:"var(--color-olive)" }}>
                    {loading
                      ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                      : <><Send size={18} /> Send Message</>
                    }
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Info Panel */}
          <div className="space-y-5">

            {/* Hours */}
            <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"var(--color-border)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div style={{ background:"var(--color-beige)" }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                  <Clock size={18} style={{ color:"var(--color-olive)" }} />
                </div>
                <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">Business Hours</h3>
              </div>
              <div className="space-y-3">
                {[
                  { day:"Monday – Friday", time:"8:00 AM – 9:00 PM", open:true  },
                  { day:"Saturday",        time:"8:00 AM – 9:00 PM", open:true  },
                  { day:"Sunday",          time:"10:00 AM – 6:00 PM",open:true  },
                  { day:"Public Holidays", time:"10:00 AM – 4:00 PM",open:false },
                ].map(({ day, time, open }) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b last:border-0"
                    style={{ borderColor:"var(--color-border)" }}>
                    <span style={{ color:"var(--color-charcoal)" }} className="text-sm font-medium">{day}</span>
                    <div className="flex items-center gap-2">
                      <span style={{ color: open ? "var(--color-charcoal)" : "var(--color-olive)" }} className="text-sm">{time}</span>
                      <div className="w-2 h-2 rounded-full" style={{ background: open ? "#22c55e" : "var(--color-border)" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"var(--color-border)" }}>
              <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="space-y-3">
                {[
                  { icon:<Instagram size={18}/>, label:"Tech Computer", handle:"Instagram", color:"#e1306c", href:BUSINESS_INFO.instagramHref },
                  { icon:<Facebook  size={18}/>, label:"Tech Computer",          handle:"Facebook",  color:"#1877f2", href:BUSINESS_INFO.facebookHref },
                  { icon:<Twitter   size={18}/>, label:"@techcomputer",          handle:"Twitter",   color:"#1da1f2", href:"#" },
                  { icon:<Youtube   size={18}/>, label:"Tech Computer",          handle:"YouTube",   color:"#ff0000", href:"#" },
                ].map(({ icon, label, handle, color, href }) => (
                  <a key={handle} href={href}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:opacity-80 transition-opacity"
                    style={{ background:"var(--color-beige)" }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ background:color }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold">{label}</p>
                      <p style={{ color:"var(--color-olive)" }} className="text-xs">{handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a href={BUSINESS_INFO.whatsappHref}
              className="flex items-center gap-4 p-5 rounded-3xl text-white hover:opacity-90 transition-opacity"
              style={{ background:"#25d366" }}>
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <MessageCircle size={24} />
              </div>
              <div>
                <p className="font-bold">Chat on WhatsApp</p>
                <p className="text-sm opacity-80">We reply within minutes!</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ── MAP PLACEHOLDER ── */}
      <section className="py-4" id="map">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl overflow-hidden border relative" style={{ borderColor:"var(--color-border)", height:"320px" }}>
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
              alt="Map" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-3xl p-6 shadow-2xl text-center max-w-xs">
                <div style={{ background:"var(--color-beige)" }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <MapPin size={28} style={{ color:"var(--color-olive)" }} />
                </div>
                <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg mb-1">Tech Computer</h3>
                <p style={{ color:"var(--color-olive)" }} className="text-sm mb-4">{BUSINESS_INFO.address}</p>
                <a href={BUSINESS_INFO.mapsHref} target="_blank" rel="noreferrer"
                  style={{ background:"var(--color-olive)" }} className="text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 inline-block">
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-10">
            <p style={{ color:"var(--color-olive)" }} className="text-xs uppercase tracking-widest font-semibold mb-3">FAQ</p>
            <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="rounded-2xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
                <button onClick={() => setFaq(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                  style={{ background: faqOpen === i ? "var(--color-beige)" : "white" }}>
                  <span style={{ color:"var(--color-charcoal)" }} className="font-semibold pr-4">{q}</span>
                  {faqOpen === i
                    ? <ChevronUp size={18} className="shrink-0" style={{ color:"var(--color-olive)" }} />
                    : <ChevronDown size={18} className="shrink-0" style={{ color:"var(--color-olive)" }} />
                  }
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-5" style={{ background:"var(--color-beige)" }}>
                    <p style={{ color:"var(--color-charcoal)" }} className="text-sm leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
