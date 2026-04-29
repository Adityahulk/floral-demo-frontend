
import {  Phone, Mail, MapPin  } from "lucide-react";
import {Facebook,Instagram,Twitter,Youtube} from  "react-feather";
import { useNavigate } from "react-router-dom";
export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer style={{background:"#3a2416",color:"#f5e6d3"}}>
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div style={{background:"#c97d5b"}} className="w-8 h-8 rounded-full flex items-center justify-center">🌸</div>
              <span style={{fontFamily:"Georgia,serif"}} className="font-bold text-lg">Floral Studio</span>
            </div>
            <p style={{color:"#b89c8a"}} className="text-sm leading-relaxed mb-5">Bringing nature's beauty to your doorstep, one bloom at a time.</p>
            <div className="flex gap-3">
              {[Instagram,Facebook,Twitter,Youtube].map((Icon,i)=>(
                <a key={i} href="#" style={{background:"#4a3728"}} className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"><Icon size={14}/></a>
              ))}
            </div>
          </div>
          {[{title:"Quick Links",links:["Home","Shop","Collections","About Us","Blog"]},{title:"Support",links:["FAQ","Shipping Info","Returns","Track Order","Contact Us"]}].map(({title,links})=>(
            <div key={title}>
              <h3 style={{fontFamily:"Georgia,serif"}} className="font-bold mb-4">{title}</h3>
              <ul className="space-y-2">{links.map(l=><li key={l}><a href="#" style={{color:"#b89c8a"}} className="text-sm hover:opacity-70 transition-opacity">{l}</a></li>)}</ul>
            </div>
          ))}
          <div>
            <h3 style={{fontFamily:"Georgia,serif"}} className="font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm" style={{color:"#b89c8a"}}>
              <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" style={{color:"#c97d5b"}}/>123 Garden Lane, Lucknow, UP 226001</li>
              <li className="flex items-center gap-2"><Phone size={14} style={{color:"#c97d5b"}}/>+91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail size={14} style={{color:"#c97d5b"}}/>hello@floralstudio.in</li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs" style={{borderColor:"#4a3728",color:"#7a5c4a"}}>
          <p>© 2025 Floral Studio. All rights reserved.</p>
          <div className="flex gap-4">
            <a key="Privacy Policy" onClick={() => {navigate("/privacy-policy");
              window.scrollTo({ top:0, behavior:"smooth" });
            }} className="hover:opacity-70 transition-opacity cursor-pointer">Privacy Policy</a>
            <a key="Terms of Service" onClick={() => {navigate("/terms-conditions");
              window.scrollTo({ top:0, behavior:"smooth" });
            }} className="hover:opacity-70 transition-opacity cursor-pointer">Terms of Service</a>
            <a key="Cookie Policy" onClick={() => {navigate("/cookie-policy");
              window.scrollTo({ top:0, behavior:"smooth" });
            }} className="hover:opacity-70 transition-opacity cursor-pointer">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}