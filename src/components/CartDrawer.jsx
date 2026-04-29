import { X } from "lucide-react";
export default function CartDrawer({ cart, open, onClose, onRemove }) {
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const fmt = n => "₹" + n.toLocaleString("en-IN");
  return (
    <>
      {open&&<div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}/>}
      <div className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300"
        style={{transform:open?"translateX(0)":"translateX(100%)"}}>
        <div className="flex items-center justify-between p-5 border-b" style={{borderColor:"#f0e4d8"}}>
          <h2 style={{fontFamily:"Georgia,serif",color:"#3a2416"}} className="font-bold">Your Cart ({cart.length})</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:opacity-70"><X size={18} style={{color:"#5c4033"}}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length===0
            ? <div className="text-center mt-16" style={{color:"#9c7a62"}}><span className="text-4xl block mb-3">🛒</span>Your cart is empty</div>
            : cart.map(item=>(
              <div key={item.id} className="flex gap-3">
                <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl"/>
                <div className="flex-1 min-w-0">
                  <p style={{color:"#3a2416"}} className="text-sm font-semibold truncate">{item.name}</p>
                  <p style={{color:"#9c7a62"}} className="text-xs">Qty: {item.qty}</p>
                  <p style={{color:"#c97d5b"}} className="text-sm font-bold">{fmt(item.price*item.qty)}</p>
                </div>
                <button onClick={()=>onRemove(item.id)} className="text-stone-300 hover:text-rose-500 transition-colors"><X size={14}/></button>
              </div>
            ))
          }
        </div>
        {cart.length>0&&(
          <div className="p-5 border-t" style={{borderColor:"#f0e4d8"}}>
            <div className="flex justify-between mb-4">
              <span style={{color:"#3a2416"}} className="font-semibold">Total</span>
              <span style={{color:"#c97d5b"}} className="font-bold text-lg">{fmt(total)}</span>
            </div>
            <button style={{background:"#c97d5b"}} className="w-full text-white py-3 rounded-full font-semibold hover:opacity-90">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </>
  );
}