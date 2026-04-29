import { Star } from "react-feather";
import { TESTIMONIALS } from "../constants/StaticVariables";

export default function Testimonials() {
    function Stars({ n, size=14 }) {
  return <span className="flex gap-0.5">{[1,2,3,4,5].map(i=><Star key={i} size={size} className={i<=Math.round(n)?"fill-amber-400 text-amber-400":"fill-stone-200 text-stone-200"}/>)}</span>;
}
  return (
    <section style={{background:"#4a3728"}} className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p style={{color:"#f5c8a8"}} className="text-xs uppercase tracking-widest font-semibold mb-2">Testimonials</p>
          <h2 style={{fontFamily:"Georgia,serif"}} className="text-3xl sm:text-4xl font-bold text-white">What Our Customers Say</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({name,rating,text,avatar})=>(
            <div key={name} style={{background:"#5c4033"}} className="rounded-2xl p-6">
              <Stars n={rating} size={16}/>
              <p style={{color:"#f5e6d3"}} className="text-sm leading-relaxed mt-4 mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div style={{background:"#c97d5b"}} className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold">{avatar}</div>
                <p className="text-white font-semibold text-sm">{name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}