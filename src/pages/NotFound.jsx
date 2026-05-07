import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}
      className="flex flex-col items-center justify-center px-4 text-center">

      <p style={{ fontFamily:"Georgia, serif", color:"var(--color-border)", fontSize:"clamp(6rem,20vw,12rem)", lineHeight:1 }}
        className="font-bold select-none">
        404
      </p>

      <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-3xl font-bold mt-2 mb-3">
        Page Not Found
      </h1>
      <p style={{ color:"var(--color-olive)" }} className="text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or you don't have permission to access it.
      </p>

      <Link to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        style={{ background:"var(--color-olive)" }}>
        🌸 Back to Home
      </Link>
    </div>
  );
}
