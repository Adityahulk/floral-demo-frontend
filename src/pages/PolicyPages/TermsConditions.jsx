import { useState } from "react";
import {
  Shield, FileText, Cookie, ChevronDown, ChevronUp,
  Mail, Phone, CheckCircle, AlertCircle,
  Lock, RefreshCw, Globe,
  ShoppingCart, CreditCard, Truck, Star, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import CookiePolicy from "./CookiePolicy";
// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function PageHero({ icon, tag, title, subtitle, updated }) {
  return (
    <section className="relative overflow-hidden py-16" style={{ background:"var(--color-charcoal)" }}>
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background:"var(--color-olive)" }} />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10"  style={{ background:"var(--color-beige)" }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background:"rgba(95,111,82,0.2)" }}>
          <span style={{ color:"var(--color-sage)" }}>{icon}</span>
        </div>
        <span style={{ background:"rgba(95,111,82,0.2)", color:"var(--color-sage)" }}
          className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-4">
          {tag}
        </span>
        <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
        <p style={{ color:"var(--color-sage)" }} className="text-base leading-relaxed max-w-xl mx-auto mb-4">{subtitle}</p>
        <p style={{ color:"var(--color-olive)" }} className="text-xs">Last updated: {updated}</p>
      </div>
    </section>
  );
}

function Section({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 rounded-2xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: open ? "var(--color-beige)" : "white" }}>
        <div className="flex items-center gap-3">
          <div style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">{title}</h2>
        </div>
        {open
          ? <ChevronUp size={18} style={{ color:"var(--color-olive)" }} />
          : <ChevronDown size={18} style={{ color:"var(--color-olive)" }} />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 bg-white">
          <div style={{ color:"var(--color-charcoal)" }} className="text-sm leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function Highlight({ icon, text, type = "info" }) {
  const styles = {
    info:    { bg:"#dbeafe", color:"#1d4ed8", border:"#bfdbfe" },
    success: { bg:"#dcfce7", color:"#15803d", border:"#bbf7d0" },
    warning: { bg:"#fef9c3", color:"#a16207", border:"#fde68a" },
    danger:  { bg:"#fee2e2", color:"#b91c1c", border:"#fecaca" },
  };
  const s = styles[type];
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl my-3"
      style={{ background: s.bg, border:`1px solid ${s.border}` }}>
      <span style={{ color: s.color }} className="shrink-0 mt-0.5">{icon}</span>
      <p style={{ color: s.color }} className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span style={{ color:"var(--color-olive)" }} className="mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactCard() {
  return (
    <div className="mt-10 p-6 rounded-3xl" style={{ background:"var(--color-charcoal)" }}>
      <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="font-bold text-xl mb-2 text-center">
        Have Questions?
      </h3>
      <p style={{ color:"var(--color-sage)" }} className="text-sm text-center mb-6">
        Our team is happy to help clarify anything in this policy.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <a href="mailto:thefloralstudiosurat@gmail.com"
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(95,111,82,0.2)" }}>
          <Mail size={18} style={{ color:"var(--color-sage)" }} />
          <div>
            <p style={{ color:"var(--color-beige)" }} className="text-sm font-semibold">Email Us</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">thefloralstudiosurat@gmail.com</p>
          </div>
        </a>
        <a href="tel:+919825553565"
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(95,111,82,0.2)" }}>
          <Phone size={18} style={{ color:"var(--color-sage)" }} />
          <div>
            <p style={{ color:"var(--color-beige)" }} className="text-sm font-semibold">Call Us</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">+91 98255 53565</p>
          </div>
        </a>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TERMS OF SERVICE
// ══════════════════════════════════════════════════════════════════════════════

function TermsOfService() {
  return (
    <div>
      <PageHero
        icon={<FileText size={32}/>}
        tag="Legal"
        title="Terms of Service"
        subtitle="Please read these terms carefully before using our website or placing an order. By using The Floral Studio, you agree to these terms."
        updated="28 April 2025"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Highlight type="info"
          icon={<AlertCircle size={16}/>}
          text="These Terms of Service constitute a legally binding agreement between you and The Floral Studio (operated by The Floral Studio Plants & Decor, Surat, Gujarat, India)." />

        <Section title="Acceptance of Terms" icon={<CheckCircle size={16}/>}>
          <p>By accessing or using the The Floral Studio website, mobile application, or any related services, you confirm that:</p>
          <BulletList items={[
            "You are at least 18 years of age or have parental/guardian consent",
            "You have read, understood, and agreed to these Terms of Service",
            "You have read and agreed to our Privacy Policy and Cookie Policy",
            "You are legally capable of entering into a binding contract",
            "You will comply with all applicable local, state, national, and international laws",
          ]} />
        </Section>

        <Section title="Products & Orders" icon={<ShoppingCart size={16}/>}>
          <p><strong>Product Descriptions:</strong> We make every effort to display product colours, sizes, and descriptions accurately. However, the actual appearance of plants, planters and decor items may vary slightly due to natural variation in plants, seasonal availability, handcrafted finishes, and screen colour variations.</p>
          <p className="mt-3"><strong>Order Acceptance:</strong> Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order at our discretion. Your order is confirmed only upon receipt of our confirmation email.</p>
          <p className="mt-3"><strong>Pricing:</strong> All prices are displayed in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices at any time without prior notice. The price applicable to your order is the price at the time of order confirmation.</p>
          <p className="mt-3"><strong>Availability:</strong> All orders are subject to product availability. In case a product is unavailable after order placement, we will contact you to offer a suitable alternative or a full refund.</p>
          <Highlight type="warning"
            icon={<AlertCircle size={16}/>}
            text="Plants are living products and subject to seasonal availability. Exact size, leaf shape, and flowering cycle may vary from the product images. Our team may substitute a plant of equal or greater value while keeping the overall look and category of your order intact." />
        </Section>

        <Section title="Delivery Policy" icon={<Truck size={16}/>}>
          <p>We offer same-day delivery for orders placed before 2:00 PM (local time) within our serviceable areas. Standard delivery timelines are:</p>
          <BulletList items={[
            "Same Day: Orders before 2PM — delivered by 9PM",
            "Next Day: Orders after 2PM — delivered the following day",
            "Scheduled Delivery: Choose your preferred date and time slot at checkout",
            "Express Delivery: Within 4 hours (subject to availability and additional charge)",
          ]} />
          <p className="mt-3"><strong>Delivery Responsibility:</strong> We are responsible for your order until it is handed over to the recipient or left at the specified address per your instructions. We are not liable for delays caused by incorrect address details, recipient unavailability, or force majeure events.</p>
          <p className="mt-3"><strong>Delivery Attempts:</strong> If delivery is unsuccessful, we will make one re-attempt. A second failed delivery may result in the order being cancelled, as live plants left in transit can suffer stress or damage and may not survive a third attempt.</p>
        </Section>

        <Section title="Cancellations & Refunds" icon={<RefreshCw size={16}/>}>
          <p><strong>Cancellation Policy:</strong></p>
          <BulletList items={[
            "More than 24 hours before delivery: Full refund",
            "4–24 hours before delivery: 50% refund",
            "Less than 4 hours before delivery: No refund (preparation already begun)",
            "After dispatch: Cancellation not possible",
          ]} />
          <p className="mt-3"><strong>Refund Eligibility:</strong> Refunds are issued in cases where:</p>
          <BulletList items={[
            "The delivered product is significantly different from what was ordered",
            "The plant arrives damaged, severely wilted, or unhealthy on delivery",
            "A planter or decor item arrives broken or visibly defective",
            "The order was not delivered within the agreed timeframe",
            "A duplicate charge was made on your account",
          ]} />
          <p className="mt-3"><strong>Refund Timeline:</strong> Approved refunds are processed within 5–7 business days to your original payment method.</p>
          <Highlight type="success"
            icon={<CheckCircle size={16}/>}
            text="To request a refund, please contact us within 24 hours of delivery with photos of the product. Our customer care team will review your request and respond within 1 business day." />
        </Section>

        <Section title="Payments" icon={<CreditCard size={16}/>}>
          <p>We accept the following payment methods:</p>
          <BulletList items={[
            "Credit and Debit Cards (Visa, Mastercard, RuPay, American Express)",
            "UPI (Google Pay, PhonePe, Paytm, BHIM)",
            "Net Banking",
            "Wallets (Paytm, Freecharge, Mobikwik)",
            "EMI options (available on select cards for orders above ₹2,000)",
          ]} />
          <p className="mt-3">All online payments are processed securely via Razorpay, which is PCI-DSS Level 1 compliant. The Floral Studio does not store any card or UPI credentials.</p>
          <Highlight type="warning"
            icon={<AlertCircle size={16}/>}
            text="Cash on Delivery is currently not available. All orders must be paid online at checkout." />
        </Section>

        <Section title="User Accounts" icon={<Shield size={16}/>}>
          <p>When you create an account on our platform, you are responsible for:</p>
          <BulletList items={[
            "Maintaining the confidentiality of your password and account credentials",
            "All activities that occur under your account",
            "Immediately notifying us of any unauthorised use of your account",
            "Ensuring your account information is accurate and up to date",
          ]} />
          <p className="mt-3">We reserve the right to suspend or terminate accounts that violate these terms, engage in fraudulent activity, or are used in any manner that may harm other users or our business.</p>
        </Section>

        <Section title="Reviews & User Content" icon={<Star size={16}/>}>
          <p>By submitting a review, photo, or any other content on our platform, you:</p>
          <BulletList items={[
            "Grant The Floral Studio a non-exclusive, royalty-free licence to use, display, and share your content",
            "Confirm the content is your own original work and does not infringe third-party rights",
            "Agree not to submit false, misleading, defamatory, or offensive content",
            "Understand we may remove content that violates our guidelines without notice",
          ]} />
        </Section>

        <Section title="Intellectual Property" icon={<Lock size={16}/>}>
          <p>All content on the The Floral Studio website — including text, images, logos, product photographs, design elements, and software — is owned by or licensed to The Floral Studio and is protected by Indian and international copyright, trademark, and intellectual property laws.</p>
          <p className="mt-3">You may not reproduce, distribute, modify, or create derivative works from any of our content without express written permission.</p>
        </Section>

        <Section title="Limitation of Liability" icon={<AlertCircle size={16}/>}>
          <p>To the maximum extent permitted by applicable law, The Floral Studio shall not be liable for:</p>
          <BulletList items={[
            "Indirect, incidental, or consequential damages arising from use of our services",
            "Loss of profits, revenue, or business opportunities",
            "Damage or decline of plants caused by improper care, lighting, watering or environment after delivery",
            "Delays or failures in delivery caused by circumstances beyond our reasonable control",
            "Any errors or omissions in product descriptions or pricing",
          ]} />
          <p className="mt-3">Our total liability to you in connection with any order shall not exceed the value of that order.</p>
        </Section>

        <Section title="Governing Law" icon={<Globe size={16}/>}>
          <p>These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Surat, Gujarat, India.</p>
          <p className="mt-3">We encourage you to contact us first to resolve any disputes amicably before initiating formal legal proceedings.</p>
        </Section>

        <ContactCard />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN — Tab switcher
// ══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id:"/privacy-policy", label:"Privacy Policy",    icon:<Shield size={16}/>,   page:<PrivacyPolicy />   },
  { id:"/terms-conditions",   label:"Terms of Service",  icon:<FileText size={16}/>, page:<TermsConditions />  },
  { id:"/cookie-policy", label:"Cookie Policy",     icon:<Cookie size={16}/>,   page:<CookiePolicy />    },
];

export default function TermsConditions() {
  const active = "/terms-conditions";
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>
      <TermsOfService />

      {/* Footer Links */}
      <div className="border-t py-8" style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p style={{ color:"var(--color-olive)" }} className="text-sm mb-4">Also read our other policies:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {TABS.filter(t => t.id !== active).map(t => (
              <button key={t.id} onClick={() => { 
                navigate(`/${t.id}`);
                window.scrollTo({ top:0, behavior:"smooth" });
             }}
                className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
                style={{ color:"var(--color-olive)" }}>
                {t.icon} {t.label} <ChevronRight size={13}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}