import { useState } from "react";
import {
  Shield, FileText, Cookie, ChevronDown, ChevronUp,
  Mail, Phone, CheckCircle, AlertCircle,
  Lock, Eye, Database, Trash2, RefreshCw, Globe,
   ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TermsConditions from "./TermsConditions";
import CookiePolicy from "./CookiePolicy";
import { BUSINESS_INFO } from "../../constants/StaticVariables";
// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function PageHero({ icon, tag, title, subtitle, updated }) {
  return (
    <section className="relative overflow-hidden py-16" style={{ background:"var(--color-charcoal)" }}>
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background:"var(--color-olive)" }} />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10"  style={{ background:"var(--color-beige)" }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background:"rgba(215,25,32,0.12)" }}>
          <span style={{ color:"var(--color-sage)" }}>{icon}</span>
        </div>
        <span style={{ background:"rgba(215,25,32,0.12)", color:"var(--color-sage)" }}
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
          style={{ background:"rgba(215,25,32,0.12)" }}>
          <Mail size={18} style={{ color:"var(--color-sage)" }} />
          <div>
            <p style={{ color:"var(--color-beige)" }} className="text-sm font-semibold">Email Us</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">thefloralstudiosurat@gmail.com</p>
          </div>
        </a>
        <a href={BUSINESS_INFO.phoneHref}
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(215,25,32,0.12)" }}>
          <Phone size={18} style={{ color:"var(--color-sage)" }} />
          <div>
            <p style={{ color:"var(--color-beige)" }} className="text-sm font-semibold">Call Us</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">{BUSINESS_INFO.phoneDisplay}</p>
          </div>
        </a>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. PRIVACY POLICY
// ══════════════════════════════════════════════════════════════════════════════

function PrivacyPolicyComponent() {
  return (
    <div>
      <PageHero
        icon={<Shield size={32}/>}
        tag="Legal"
        title="Privacy Policy"
        subtitle="We care deeply about your privacy. This policy explains how Tech Computer collects, uses, and protects your personal information."
        updated="28 April 2025"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Highlight type="success"
          icon={<CheckCircle size={16}/>}
          text="Tech Computer does not sell your personal data to third parties. Your information is used solely to improve your shopping experience with us." />

        <Section title="Information We Collect" icon={<Database size={16}/>}>
          <p>We collect information you provide directly to us when you create an account, place an order, or contact our support team. This includes:</p>
          <BulletList items={[
            "Personal details: name, email address, phone number",
            "Delivery address and billing information",
            "Payment details (processed securely via our payment partners — we never store card numbers)",
            "Gift messages and special instructions you provide",
            "Communications with our customer support team",
          ]} />
          <p className="mt-3">We also automatically collect certain information when you use our website:</p>
          <BulletList items={[
            "Device information (browser type, operating system, IP address)",
            "Pages visited, time spent, and clickstream data",
            "Referring website or search terms that brought you to us",
            "Location data (city/region level only, based on IP)",
          ]} />
        </Section>

        <Section title="How We Use Your Information" icon={<Eye size={16}/>}>
          <p>We use the information we collect for the following purposes:</p>
          <BulletList items={[
            "Processing and fulfilling your orders, including delivery coordination",
            "Sending order confirmations, delivery updates, and receipts",
            "Providing customer support and resolving disputes",
            "Personalising your shopping experience and product recommendations",
            "Sending promotional emails and offers (only with your consent)",
            "Improving our website, products, and services through analytics",
            "Preventing fraud and ensuring the security of our platform",
            "Complying with applicable legal obligations",
          ]} />
          <Highlight type="info"
            icon={<AlertCircle size={16}/>}
            text="We will only send you marketing communications if you have opted in. You can unsubscribe at any time using the link in any of our emails." />
        </Section>

        <Section title="Information Sharing" icon={<Globe size={16}/>}>
          <p>We may share your information with trusted third parties in the following limited circumstances:</p>
          <BulletList items={[
            "Delivery partners (Shiprocket, Delhivery, local couriers) — to fulfil your orders",
            "Payment processors (Razorpay, Paytm) — to handle transactions securely",
            "Email service providers — to send transactional and marketing emails",
            "Analytics providers (Google Analytics) — to understand website usage",
            "Cloud hosting providers — to store and secure our data",
            "Law enforcement — only when required by law or to protect our rights",
          ]} />
          <p className="mt-3">All third-party partners are contractually obligated to handle your data with appropriate security measures and may not use it for their own marketing purposes.</p>
        </Section>

        <Section title="Data Security" icon={<Lock size={16}/>}>
          <p>We implement industry-standard security measures to protect your personal information:</p>
          <BulletList items={[
            "SSL/TLS encryption for all data transmitted between your browser and our servers",
            "Payment information is processed via PCI-DSS compliant payment gateways",
            "Access to personal data is restricted to authorised employees only",
            "Regular security audits and vulnerability assessments",
            "Two-factor authentication for all admin accounts",
          ]} />
          <Highlight type="warning"
            icon={<AlertCircle size={16}/>}
            text="While we take every reasonable precaution, no method of transmission over the internet is 100% secure. We encourage you to use a strong, unique password for your account." />
        </Section>

        <Section title="Your Rights" icon={<CheckCircle size={16}/>}>
          <p>You have the following rights regarding your personal data:</p>
          <BulletList items={[
            "Access: Request a copy of all personal data we hold about you",
            "Correction: Ask us to fix inaccurate or incomplete information",
            "Deletion: Request erasure of your personal data ('right to be forgotten')",
            "Portability: Receive your data in a structured, machine-readable format",
            "Objection: Object to processing of your data for marketing purposes",
            "Restriction: Ask us to limit how we use your data in certain circumstances",
          ]} />
          <p className="mt-3">To exercise any of these rights, please contact us at <strong style={{ color:"var(--color-olive)" }}>thefloralstudiosurat@gmail.com</strong>. We will respond within 30 days.</p>
        </Section>

        <Section title="Data Retention" icon={<Trash2 size={16}/>}>
          <p>We retain your personal data for as long as necessary to fulfil the purposes outlined in this policy:</p>
          <BulletList items={[
            "Account information: Retained while your account is active and for 2 years after closure",
            "Order data: Retained for 7 years for tax and legal compliance",
            "Marketing preferences: Until you withdraw consent or request deletion",
            "Support communications: Retained for 2 years after resolution",
            "Website analytics: Aggregated data retained indefinitely; personal identifiers deleted after 26 months",
          ]} />
        </Section>

        <Section title="Cookies" icon={<Cookie size={16}/>}>
          <p>We use cookies and similar tracking technologies on our website. Please refer to our <strong style={{ color:"var(--color-olive)" }}>Cookie Policy</strong> for full details on the types of cookies we use, why we use them, and how you can manage your preferences.</p>
        </Section>

        <Section title="Children's Privacy" icon={<Shield size={16}/>}>
          <p>Tech Computer is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us immediately and we will delete it promptly.</p>
        </Section>

        <Section title="Changes to This Policy" icon={<RefreshCw size={16}/>}>
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of significant changes by:</p>
          <BulletList items={[
            "Posting the updated policy on our website with a new 'Last Updated' date",
            "Sending an email notification to registered users for material changes",
            "Displaying a prominent banner on our website for 30 days after major updates",
          ]} />
          <p className="mt-3">Continued use of our website after changes constitutes your acceptance of the updated policy.</p>
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
  { id:"/terms-conditions",   label:"Terms of Service",  icon:<FileText size={16}/>, page:<TermsConditions/>  },
  { id:"/cookie-policy", label:"Cookie Policy",     icon:<Cookie size={16}/>,   page:<CookiePolicy />    },
];

export default function PrivacyPolicy() {
  const active = "/privacy-policy";
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>
      <PrivacyPolicyComponent />
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
