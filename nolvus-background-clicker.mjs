import {appendFileSync,existsSync,unlinkSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const logFile=fileURLToPath(new URL('./nolvus-clicker.log',import.meta.url));
const stopFile=fileURLToPath(new URL('./stop-clicker.flag',import.meta.url));
const once=process.argv.includes('--once');
function log(s){const line=`${new Date().toLocaleString()} ${s}`;console.log(line);appendFileSync(logFile,line+'\n');}
const expression=`(()=>{
 if(location.hostname!=='www.nexusmods.com'&&location.hostname!=='nexusmods.com')return 'Wrong site';
 const roots=[document],seen=new Set(),candidates=[];let count=0;
 while(roots.length){const root=roots.shift();if(seen.has(root))continue;seen.add(root);
 for(const e of root.querySelectorAll('*')){
 if(e.shadowRoot)roots.push(e.shadowRoot);
 if(e.tagName==='IFRAME'){try{if(e.contentDocument)roots.push(e.contentDocument)}catch{}}
 if(!e.matches('button,a,input[type="button"],[role="button"]'))continue;
 const text=(e.innerText||e.textContent||e.value||'').replace(/\\s+/g,' ').trim();
 if(!/^(?:slow|standard)\\s*download$/i.test(text))continue;count++;
 const r=e.getBoundingClientRect(),s=getComputedStyle(e);
 if(!r.width||!r.height||s.visibility==='hidden'||s.display==='none'||e.disabled||e.getAttribute('aria-disabled')==='true')continue;
 candidates.push({e,text});
 }}
 candidates.sort((a,b)=>Number(/^standard/i.test(b.text))-Number(/^standard/i.test(a.text)));
 const candidate=candidates[0];
 if(!candidate)return 'Waiting for Slow download or Standard download ('+count+' matching buttons)';
 const {e,text}=candidate,key=text.toLowerCase().replace(/\\s+/g,' ');
 const clicks=window.__nolvusDownloadClicks||(window.__nolvusDownloadClicks={});
 if(Date.now()-(clicks[key]||0)<20000)return 'Waiting after '+text+' click';
 clicks[key]=Date.now();e.click();return 'Clicked '+text+' (including shadow DOM)';
})()`;
async function evaluate(target){return new Promise((resolve,reject)=>{
 const u=new URL(target.webSocketDebuggerUrl);if(!['localhost','127.0.0.1','[::1]'].includes(u.hostname))return reject(Error('Nonlocal debug socket refused'));
 const ws=new WebSocket(u);let done=false;const timer=setTimeout(()=>finish(Error('Page response timed out')),8000);
 function finish(err,value){if(done)return;done=true;clearTimeout(timer);ws.close();err?reject(err):resolve(value);}
 ws.onopen=()=>ws.send(JSON.stringify({id:1,method:'Runtime.evaluate',params:{expression,returnByValue:true,userGesture:true}}));
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id===1){if(m.error||m.result?.exceptionDetails)finish(Error(JSON.stringify(m.error||m.result.exceptionDetails)));else finish(null,m.result.result.value);}};
 ws.onerror=()=>finish(Error('Debug socket failed'));ws.onclose=()=>{if(!done)finish(Error('Page closed'));};
 });}
if(existsSync(stopFile))unlinkSync(stopFile);
log('Started. Searches Nolvus debug port 8088; does not move the mouse.');
let previous='';
do{
 if(existsSync(stopFile)){unlinkSync(stopFile);log('Stopped by user.');break;}
 try{
 const ts=await(await fetch('http://127.0.0.1:8088/json/list',{signal:AbortSignal.timeout(4000)})).json();
 const targets=ts.filter(t=>{try{return t.type==='page'&&['www.nexusmods.com','nexusmods.com'].includes(new URL(t.url).hostname)}catch{return false}});
 if(!targets.length){if(previous!=='none')log('Waiting for a Nexus download page');previous='none';}
 for(const t of targets){const result=await evaluate(t);const status=t.id+result;if(status!==previous||result.startsWith('Clicked'))log(t.title+': '+result);previous=status;}
 }catch(e){const message='Connection: '+e.message;if(message!==previous)log(message);previous=message;}
 if(once)break;
 await new Promise(r=>setTimeout(r,2000));
}while(true);
