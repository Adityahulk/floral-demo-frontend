import { useState, useEffect } from "react";
export default function AnnouncementBar() {
  const msgs = ["🌸 Free delivery on orders above ₹999","🌺 Fresh flowers, same-day delivery available","💐 Use code BLOOM15 for 15% off your first order"];
  const [idx,setIdx] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%msgs.length),3000);return()=>clearInterval(t);},[]);
  return <div style={{background:"#4a3728",color:"#f5e6d3"}} className="text-center py-2 text-sm font-medium">{msgs[idx]}</div>;
}