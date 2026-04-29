export const PRODUCTS = [
  { id:1,  name:"Rose Bliss Bouquet",        price:1299, original:1599, rating:4.8, reviews:124, badge:"Sale",    img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80", category:"Bouquets" },
  { id:2,  name:"Pastel Dream Arrangement",  price:1899, original:null, rating:4.9, reviews:87,  badge:"New",     img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&q=80", category:"Arrangements" },
  { id:3,  name:"Wildflower Wreath",         price:999,  original:1299, rating:4.7, reviews:56,  badge:"Sale",    img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=600&q=80", category:"Wreaths" },
  { id:4,  name:"Sunflower Garden Bundle",   price:1499, original:null, rating:4.6, reviews:203, badge:"Popular", img:"https://images.unsplash.com/photo-1543218024-57a70143c369?w=600&q=80", category:"Bouquets" },
  { id:5,  name:"Lavender & Eucalyptus",     price:849,  original:999,  rating:4.9, reviews:91,  badge:"New",     img:"https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=600&q=80", category:"Dried" },
  { id:6,  name:"Orchid Elegance Set",       price:2199, original:null, rating:5.0, reviews:44,  badge:"Premium", img:"https://images.unsplash.com/photo-1566873535350-96e04c74fb1a?w=600&q=80", category:"Arrangements" },
  { id:7,  name:"Dahlia Delight Box",        price:1699, original:1999, rating:4.8, reviews:78,  badge:"Sale",    img:"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80", category:"Bouquets" },
  { id:8,  name:"Mixed Tulip Bunch",         price:749,  original:null, rating:4.5, reviews:162, badge:"Popular", img:"https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600&q=80", category:"Bouquets" },
];

export const CATEGORIES = [
  { name:"Fresh Bouquets", img:"https://images.unsplash.com/photo-1490750967868-88df5691cc3f?w=500&q=80", count:24 },
  { name:"Wreaths",        img:"https://images.unsplash.com/photo-1606041011872-596597976b25?w=500&q=80", count:12 },
  { name:"Arrangements",  img:"https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=500&q=80", count:18 },
  { name:"Dried Flowers", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80", count:9  },
  { name:"Plants",        img:"https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&q=80", count:15 },
];

export const TESTIMONIALS = [
  { name:"Priya Sharma", rating:5, text:"Absolutely stunning arrangement! The flowers were fresh and lasted over two weeks. Will definitely order again.", avatar:"PS" },
  { name:"Rahul Verma",  rating:5, text:"Ordered a bouquet for my wife's birthday. She was thrilled! Beautiful packaging and on-time delivery.", avatar:"RV" },
  { name:"Ananya Singh", rating:5, text:"The dried flower wreath I got is breathtaking. It's been months and it still looks perfect. Such great quality!", avatar:"AS" },
];

export const BADGE_STYLES = { Sale:"bg-rose-500 text-white", New:"bg-emerald-500 text-white", Popular:"bg-violet-500 text-white", Premium:"bg-amber-500 text-white" };
export const TABS = ["All","Bouquets","Arrangements","Wreaths","Dried","Plants"];
export const fmt = n => "₹" + n.toLocaleString("en-IN");