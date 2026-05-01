export const BASE = "http://localhost:3001";
export const fmt  = n => "₹" + n.toLocaleString("en-IN");
export const fmtK = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;
