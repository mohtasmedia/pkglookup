#!/usr/bin/env node
!function(e){"function"==typeof define&&define.amd?define(e):e()}((function(){"use strict";const e=require("https"),[n,...s]=process.argv.slice(2),o=!s.indexOf("-v"),t=!s.indexOf("-vv"),i=async([n,s])=>new Promise((o,t)=>{e.get({hostname:n,path:s,headers:{"User-Agent":""}},e=>{const n=[];e.on("data",e=>n.push(e)),e.on("end",()=>o(JSON.parse(Buffer.concat(n)))),e.on("error",e=>t(e))})}).catch(e=>e),a=e=>e>=1024?(e/1024).toFixed(1)+"KB":e+"B",p=(e,n)=>console.log(`[31m${e}[0m: ${n}`);(async()=>{const e=await i(["api.npms.io","/v2/package/"+encodeURIComponent(n)]);if("NOT_FOUND"===e.code)return console.log(e.message);const{collected:{metadata:s,github:c}}=e,r=await i(["bundlephobia.com","/api/size?package="+n]),d=s.links.repository.split("/"),{total_count:u}=await i(["api.github.com",`/search/issues?q=repo:${d[3]}/${d[4]}+is:pr+state:open&per_page=1`]);(o||t)&&(p("Name",s.name),p("Description",s.description),p("Version",s.version)),p("Last updated",(e=>`${e.getDay()}/${e.getMonth()+1}/${e.getFullYear()}`)(new Date(s.date))),p("Size / Gzipped",`${a(r.size)} / ${a(r.gzip)}`),(o||t)&&(p("Liscnce",s.license),p("Homepage",s.links.homepage),p("Repo",s.links.repository)),t&&(p("Open issues",c.issues.openCount),u&&p("Open PRs",u))})()}));
