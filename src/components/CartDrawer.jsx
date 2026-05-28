import { X, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const fmt = n => "₹" + n.toLocaleString("en-IN");

export default function CartDrawer({ open, onClose }) {
  const { cart, removeFromCart, updateQty } = useCart();
  const navigate = useNavigate();
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  function goToCheckout() {
    onClose();
    navigate("/cart");
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300"
        style={{ transform: open ? "translateX(0)" : "translateX(100%)" }}>

        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "var(--color-border)" }}>
          <h2 style={{ fontFamily: "Georgia,serif", color: "var(--color-charcoal)" }} className="font-bold">
            Your Cart ({cart.length})
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:opacity-70">
            <X size={18} style={{ color: "var(--color-charcoal)" }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0
            ? <div className="text-center mt-16" style={{ color: "var(--color-olive)" }}>
                <span className="text-4xl block mb-3">🛒</span>
                Your cart is empty
              </div>
            : cart.map(item => (
              <div key={item.key} className="flex gap-3">
                {item.img
                  ? <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
                  : <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-2xl" style={{ background: "var(--color-beige)" }}>⌨</div>
                }
                <div className="flex-1 min-w-0">
                  <p style={{ color: "var(--color-charcoal)" }} className="text-sm font-semibold truncate">{item.name}</p>
                  {item.size && <p style={{ color: "var(--color-olive)" }} className="text-xs">{item.size}</p>}
                  <p style={{ color: "var(--color-olive)" }} className="text-sm font-bold">{fmt(item.price * item.qty)}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQty(item.key, item.qty - 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center border hover:opacity-70"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-charcoal)" }}>
                      <Minus size={10} />
                    </button>
                    <span className="text-xs font-semibold" style={{ color: "var(--color-charcoal)" }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)}
                      className="w-5 h-5 rounded-full flex items-center justify-center border hover:opacity-70"
                      style={{ borderColor: "var(--color-border)", color: "var(--color-charcoal)" }}>
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.key)}
                  className="text-stone-300 hover:text-rose-500 transition-colors shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))
          }
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex justify-between mb-4">
              <span style={{ color: "var(--color-charcoal)" }} className="font-semibold">Total</span>
              <span style={{ color: "var(--color-olive)" }} className="font-bold text-lg">{fmt(total)}</span>
            </div>
            <button onClick={goToCheckout}
              style={{ background: "var(--color-olive)" }}
              className="w-full text-white py-3 rounded-full font-semibold hover:opacity-90">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
