if(!self.define){let o,l={};const n=(n,i)=>(n=new URL(n+".js",i).href,l[n]||new Promise((l=>{if("document"in self){const o=document.createElement("script");o.src=n,o.onload=l,document.head.appendChild(o)}else o=n,importScripts(n),l()})).then((()=>{let o=l[n];if(!o)throw new Error(`Module ${n} didn’t register its module`);return o})));self.define=(i,s)=>{const t=o||("document"in self?document.currentScript.src:"")||location.href;if(l[t])return;let r={};const e=o=>n(o,t),f={module:{uri:t},exports:r,require:e};l[t]=Promise.all(i.map((o=>f[o]||e(o)))).then((o=>(s(...o),r)))}}define(["./workbox-6567b62a"],(function(o){"use strict";o.setCacheNameDetails({prefix:"gnsimulator"}),self.addEventListener("message",(o=>{o.data&&"SKIP_WAITING"===o.data.type&&self.skipWaiting()})),o.precacheAndRoute([{url:"/GN-Tools/css/app.17b9245d.css",revision:null},{url:"/GN-Tools/css/chunk-vendors.748b90a2.css",revision:null},{url:"/GN-Tools/fonts/materialdesignicons-webfont.015e7571.ttf",revision:null},{url:"/GN-Tools/fonts/materialdesignicons-webfont.43f2dfd1.woff2",revision:null},{url:"/GN-Tools/fonts/materialdesignicons-webfont.52fd8e4e.woff",revision:null},{url:"/GN-Tools/fonts/materialdesignicons-webfont.85d55efc.eot",revision:null},{url:"/GN-Tools/fonts/roboto-latin-100.539f0a96.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-100.5ba994da.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-100italic.41ba6421.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-100italic.d61e7e8b.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-300.4d8f8086.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-300.6c1bc461.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-300italic.3a529751.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-300italic.45164643.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-400.1e2d4d3a.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-400.7e4a045b.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-400italic.68431199.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-400italic.bb3c6955.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-500.1dfbc3db.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-500.e21fe97f.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-500italic.7543a42b.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-500italic.aaff6867.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-700.02633003.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-700.12893bfc.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-700italic.bc7179e0.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-700italic.e53062e2.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-900.282ba77f.woff2",revision:null},{url:"/GN-Tools/fonts/roboto-latin-900.4962e810.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-900italic.2394134a.woff",revision:null},{url:"/GN-Tools/fonts/roboto-latin-900italic.9c1f8084.woff2",revision:null},{url:"/GN-Tools/index.html",revision:"17728a85257efb4168bcef803ddee6eb"},{url:"/GN-Tools/js/app.524ebe27.js",revision:null},{url:"/GN-Tools/js/chunk-vendors.38c386e1.js",revision:null},{url:"/GN-Tools/manifest.json",revision:"a72ed49cf18e6c3eaa8e3b1f32be680e"},{url:"/GN-Tools/robots.txt",revision:"b6216d61c03e6ce0c9aea6ca7808f7ca"}],{})}));
//# sourceMappingURL=service-worker.js.map