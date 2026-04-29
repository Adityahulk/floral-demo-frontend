import { CATEGORIES } from "../constants/StaticVariables";

export default function Categories() {
  return (
    <section style={{background:"#fdf8f3"}} className="py-16" id="collections">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p style={{color:"#c97d5b"}} className="text-xs uppercase tracking-widest font-semibold mb-2">Browse By Type</p>
          <h2 style={{fontFamily:"Georgia,serif",color:"#3a2416"}} className="text-3xl sm:text-4xl font-bold">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map(({name,img,count})=>(
            <a key={name} href="#" className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{aspectRatio:"3/4"}}>
              <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div className="absolute inset-0" style={{background:"linear-gradient(to top, rgba(58,36,22,0.8), transparent)"}}/>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p style={{fontFamily:"Georgia,serif"}} className="text-white font-semibold text-sm">{name}</p>
                <p style={{color:"#f5c8a8"}} className="text-xs mt-0.5">{count} items</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}