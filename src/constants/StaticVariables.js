export const PRODUCTS = [
  { id:1,  name:"Business Laptop Setup",     price:42999, original:45999, rating:4.8, reviews:124, badge:"Sale",    img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80", category:"Laptops" },
  { id:2,  name:"Desktop Service Package",   price:1899,  original:null,  rating:4.9, reviews:87,  badge:"New",     img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80", category:"Services" },
  { id:3,  name:"Keyboard & Mouse Combo",    price:999,   original:1299,  rating:4.7, reviews:56,  badge:"Sale",    img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80", category:"Accessories" },
  { id:4,  name:"Office Networking Kit",     price:1499,  original:null,  rating:4.6, reviews:203, badge:"Popular", img:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80", category:"Networking" },
  { id:5,  name:"Laptop Cooling Stand",      price:849,   original:999,   rating:4.9, reviews:91,  badge:"New",     img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", category:"Accessories" },
  { id:6,  name:"Premium Monitor Setup",     price:21999, original:null,  rating:5.0, reviews:44,  badge:"Premium", img:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80", category:"Displays" },
  { id:7,  name:"Data Backup Support",       price:1699,  original:1999,  rating:4.8, reviews:78,  badge:"Sale",    img:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80", category:"Services" },
  { id:8,  name:"USB-C Essentials Pack",     price:749,   original:null,  rating:4.5, reviews:162, badge:"Popular", img:"https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&q=80", category:"Accessories" },
];

export const CATEGORIES = [
  { name:"Laptops",     img:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80", count:24 },
  { name:"Accessories", img:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80", count:12 },
  { name:"Services",    img:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80", count:18 },
  { name:"Networking",  img:"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&q=80", count:9  },
  { name:"Displays",    img:"https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&q=80", count:15 },
];

export const TESTIMONIALS = [
  { name:"Priya Sharma", rating:5, text:"Helpful guidance, quick setup, and dependable computer service. Will definitely order again.", avatar:"PS" },
  { name:"Rahul Verma",  rating:5, text:"Ordered accessories for my home office. Great packaging and on-time delivery.", avatar:"RV" },
  { name:"Ananya Singh", rating:5, text:"The repair support was clear, fast, and fairly priced. Such great service!", avatar:"AS" },
];

export const BUSINESS_INFO = {
  phone: "9327655513",
  phoneDisplay: "+91 93276 55513",
  phoneHref: "tel:+919327655513",
  whatsappHref: "https://wa.me/919327655513",
  address: "Shop NoG, 40, Microtechnique IT, Star world complex, Green City Rd, Pal Gam, Surat, Gujarat 394510",
  addressShort: "Star world complex, Pal Gam, Surat",
  mapsHref: "https://maps.app.goo.gl/4oUpLrayBKzFnySM7?g_st=ac",
};

export const BADGE_STYLES = { Sale:"bg-rose-500 text-white", New:"bg-emerald-500 text-white", Popular:"bg-violet-500 text-white", Premium:"bg-amber-500 text-white" };
export const TABS = ["All","Laptops","Accessories","Services","Networking"];
export const fmt = n => "₹" + n.toLocaleString("en-IN");
