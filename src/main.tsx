import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Search, Globe2, LayoutGrid, Bookmark, History, Settings, Play, Plus, X, Trash2, Sun, Moon, ArrowRight, BookOpen, Newspaper, Sparkles, Users, Wrench, Compass, ExternalLink } from 'lucide-react';
import { GRID_ROW2, GRID_ROW3, HUB_APPS, HUB_META } from './catalog';
import { resolveAddress } from './navigation';
import './styles.css';
import { THEMES, LIGHT_THEMES } from './themes';

type Entry = {id:string;kind:'bookmark'|'history';title:string;url:string;createdAt:string};
const icons = [BookOpen, Newspaper, Sparkles, Users, Wrench];
const categories = Object.keys(HUB_META);
async function library(method='GET', body?:unknown) {
  const response = await fetch('/api/library', {method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Your library is unavailable.');
  return data;
}
function App() {
  const [page,setPage] = useState('home');
  const [hub,setHub] = useState('islamic');
  const [query,setQuery] = useState('');
  const [engine,setEngine] = useState('google');
  const [theme,setTheme] = useState(12);
  const dark = !LIGHT_THEMES.includes(theme);
  function setDark(value:boolean){setTheme(value?5:12);}
  const [listPage,setListPage] = useState(0);
  const [size,setSize] = useState({width:window.innerWidth,height:window.innerHeight});
  useEffect(()=>{const resize=()=>setSize({width:window.innerWidth,height:window.innerHeight});window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
  const capacity = Math.max(2,Math.floor((size.height-300)/62));
  const hubCapacity = size.width<600?6:10;
  const [now,setNow] = useState(new Date());
  const [entries,setEntries] = useState<Entry[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [modal,setModal] = useState(false);
  const [saving,setSaving] = useState(false);
  const [media,setMedia] = useState('');
  const [mediaName,setMediaName] = useState('');
  const mediaRef = useRef('');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [filter,setFilter] = useState('');
  async function refresh() {setLoading(true);try {setEntries(await library());setError('');} catch(e) {setError((e as Error).message);} finally {setLoading(false);}}
  useEffect(()=>{void refresh();const timer=setInterval(()=>setNow(new Date()),1000);return ()=>{clearInterval(timer);URL.revokeObjectURL(mediaRef.current);};},[]);
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';},[dark]);
  useEffect(()=>{const root=document.documentElement;root.style.setProperty('--palette',THEMES[theme][1]);root.style.setProperty('--bg',THEMES[theme][2]);root.style.setProperty('--accent',THEMES[theme][3]);},[theme]);
  useEffect(()=>{if(modal)dialogRef.current?.showModal();else dialogRef.current?.close();},[modal]);
  function open(input:string,title?:string) {
    try {
      const url=resolveAddress(input,engine);
      const tab=window.open(url,'_blank','noopener,noreferrer');
      void tab;
      setError('');
      void library('POST',{kind:'history',title:title || new URL(url).hostname,url}).then((entry:Entry)=>setEntries(prev=>[entry,...prev].slice(0,500))).catch(e=>setError(`Link opened. ${e.message}`));
    } catch(e) {setError((e as Error).message);}
  }
  async function remove(kind:string,id?:string) {try{await library('DELETE',{kind,id});setEntries(prev=>prev.filter(e=>e.kind!==kind || (id && e.id!==id)));setError('');}catch(e){setError((e as Error).message);}}
  const bookmarks=entries.filter(e=>e.kind==='bookmark');
  function navigate(next:string){setPage(next);setFilter('');setListPage(0);}
  function linkCard(app:{id:string;name:string;ur?:string;url?:string}, index:number) {return <button className="site-card" key={app.id} onClick={()=>open(app.url!,app.name)}><span className={`site-icon tone-${index%5}`}><Globe2 size={20}/><img src={`https://www.google.com/s2/favicons?domain=${new URL(app.url!).hostname}&sz=64`} alt="" onError={e=>{e.currentTarget.style.display='none';}}/></span><span className="site-name">{app.name}<small lang="ur" dir="rtl">{app.ur || new URL(app.url!).hostname}</small></span><ArrowUpRight size={16}/></button>;}
  return <div className="app-shell">
    <aside className="sidebar"><a className="brand" href="#" onClick={e=>{e.preventDefault();navigate('home');}}><span className="brand-mark">ES<span/></span><span>Ever Smart<small>BROWSER</small></span></a>
      <span className="nav-label">YOUR WORKSPACE</span><nav>{[{id:'home',label:'Discover',icon:Compass},{id:'hubs',label:'All hubs',icon:LayoutGrid},{id:'bookmarks',label:'Bookmarks',icon:Bookmark},{id:'history',label:'History',icon:History},{id:'media',label:'Media player',icon:Play}].map(item=><button key={item.id} className={page===item.id?'active':''} onClick={()=>navigate(item.id)}><item.icon size={19}/>{item.label}{item.id==='bookmarks'&&bookmarks.length>0&&<span className="count">{bookmarks.length}</span>}</button>)}</nav>
      <div className="sidebar-note"><Globe2 size={25}/><strong>A world of possibilities.</strong><p>Your favorite places.<br/>One thoughtful space.</p><span>Made for the web <ArrowUpRight size={13}/></span></div>
      <button className={`settings-button ${page==='settings'?'active':''}`} onClick={()=>navigate('settings')}><Settings size={18}/>Themes & settings</button><div className="sidebar-footer"><span className="status-dot"/>ES Browser <span>2.0 / WEB</span></div>
    </aside>
    <div className="workspace"><header className="topbar"><div className="breadcrumb">Workspace <span>/</span><strong>{page==='home'?'Discover':page.charAt(0).toUpperCase()+page.slice(1)}</strong></div><div className="top-actions"><span className="web-badge"><span className="status-dot"/>Web edition</span><button className="icon-button" aria-label={dark?'Use light theme':'Use dark theme'} onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button><span className="avatar">ES</span></div></header>
    <main>
      {error&&<div className="error" role="alert">{error}<button onClick={()=>setError('')} aria-label="Dismiss error"><X size={16}/></button></div>}
      {page==='home'&&<>
        <section className="welcome"><div><span className="eyebrow">EVER SMART · YOUR DIGITAL WORLD</span><h1>E-SMART <em>Home</em></h1></div><div className="clock"><strong>{now.toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit',hour12:false})}</strong><span>{now.toLocaleDateString('en',{weekday:'long',month:'short',day:'numeric'})}</span></div></section>
        <form className="search-box" onSubmit={e=>{e.preventDefault();open(query);}}><Search size={23}/><input aria-label="Search or enter a web address" placeholder="Search the web or enter an address" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Search engine" value={engine} onChange={e=>setEngine(e.target.value)}><option value="google">Google</option><option value="duckduckgo">DuckDuckGo</option></select><button className="search-submit">Go</button></form>
        <section className="everyday"><div className="section-heading"><h2>POPULAR SITES</h2><button className="text-button" onClick={()=>setModal(true)}><Plus size={14}/>Bookmark</button></div><div className="quick-grid">{[...GRID_ROW2,...GRID_ROW3].map(linkCard)}</div></section>
        <section className="hub-section"><div className="section-heading"><h2>APPS, SITES & CHANNELS</h2><span className="eyebrow">CHOOSE YOUR HUB</span></div><div className="hub-grid">{categories.map((id,i)=>{const Icon=icons[i];return <button key={id} className={`hub-card hub-${id}`} onClick={()=>{setHub(id);navigate('hubs');}}><span className="hub-mosaic">{HUB_APPS[id].slice(0,9).map((app,n)=><span key={app.id} style={{background:app.bg}}><img src={`https://www.google.com/s2/favicons?domain=${new URL(app.url).hostname}&sz=32`} alt="" onError={e=>{e.currentTarget.style.display='none';}}/><Icon size={14}/></span>)}</span><strong>{HUB_META[id].name}</strong><small>{HUB_APPS[id].length} apps & platforms</small></button>;})}</div></section>
        <section className="home-library"><div className="section-heading"><h2>BOOKMARKS</h2><button className="text-button" onClick={()=>navigate('bookmarks')}>View all <ArrowRight size={13}/></button></div><div className="bookmark-strip">{bookmarks.length?bookmarks.slice(0,3).map(entry=><button key={entry.id} onClick={()=>open(entry.url,entry.title)}><Bookmark size={13}/>{entry.title}</button>):<button onClick={()=>setModal(true)}><Plus size={14}/>Add your first bookmark</button>}<button onClick={()=>navigate('history')}><History size={14}/>Recent history</button></div></section>
      </>}
      {page==='hubs'&&<><div className="page-heading"><span className="eyebrow">CURATED FOR YOUR EVERYDAY</span><h1>Explore the hubs.</h1><p>Familiar favorites and something new to discover.</p></div><div className="category-tabs">{categories.map((id,i)=>{const Icon=icons[i];return <button className={hub===id?'selected':''} onClick={()=>{setHub(id);setFilter('');setListPage(0);}} key={id}><Icon size={17}/>{HUB_META[id].name}</button>;})}</div><div className="section-heading"><div><h2>{HUB_META[hub].name}</h2><p>{HUB_META[hub].desc}</p></div><input className="filter" aria-label="Filter hub links" placeholder="Find a link…" value={filter} onChange={e=>{setFilter(e.target.value);setListPage(0);}}/></div><div className="quick-grid">{HUB_APPS[hub].filter(a=>`${a.name} ${a.ur}`.toLowerCase().includes(filter.toLowerCase())).slice(listPage*hubCapacity,(listPage+1)*hubCapacity).map(linkCard)}</div><div className="pagination"><button disabled={listPage===0} onClick={()=>setListPage(p=>p-1)}>Previous</button><span>Page {listPage+1}</span><button disabled={(listPage+1)*hubCapacity>=HUB_APPS[hub].filter(a=>`${a.name} ${a.ur}`.toLowerCase().includes(filter.toLowerCase())).length} onClick={()=>setListPage(p=>p+1)}>Next</button></div>{!HUB_APPS[hub].some(a=>`${a.name} ${a.ur}`.toLowerCase().includes(filter.toLowerCase()))&&<div className="empty">No matching links. Try a different search.</div>}</>}
      {(page==='bookmarks'||page==='history')&&<><div className="section-heading page-heading"><div><span className="eyebrow">YOUR PERSONAL LIBRARY</span><h1>{page==='bookmarks'?'Keep the good finds.':'Where curiosity took you.'}</h1><p>{page==='bookmarks'?'Your saved places, ready when you are.':'Links opened from this workspace. Other browser activity stays in your browser.'}</p></div>{page==='bookmarks'?<button className="primary" onClick={()=>setModal(true)}><Plus size={17}/>Add bookmark</button>:<button className="text-button" onClick={()=>void remove('history')}>Clear history</button>}</div><input className="filter" aria-label="Filter library" placeholder="Search your library…" value={filter} onChange={e=>{setFilter(e.target.value);setListPage(0);}}/>{loading?<div className="skeleton" aria-label="Loading library"/>:<div className="library-list">{entries.filter(e=>e.kind===(page==='bookmarks'?'bookmark':'history')&&`${e.title} ${e.url}`.toLowerCase().includes(filter.toLowerCase())).slice(listPage*capacity,(listPage+1)*capacity).map(entry=><div className="library-row" key={entry.id}><Globe2 size={22}/><button onClick={()=>open(entry.url,entry.title)}><strong>{entry.title}</strong><small>{entry.url}</small></button><time>{new Date(entry.createdAt).toLocaleDateString()}</time><button className="icon-button" aria-label={`Delete ${entry.title}`} onClick={()=>void remove(entry.kind,entry.id)}><Trash2 size={17}/></button></div>)}{!entries.some(e=>e.kind===(page==='bookmarks'?'bookmark':'history')&&`${e.title} ${e.url}`.toLowerCase().includes(filter.toLowerCase()))&&<div className="empty"><Bookmark size={32}/><h2>{filter?'No matches found':'A fresh start.'}</h2><p>{page==='bookmarks'?'Add your first bookmark to make this space yours.':'Open a link from Discover to start your workspace history.'}</p><button className="text-button" onClick={()=>page==='bookmarks'?setModal(true):navigate('home')}>{page==='bookmarks'?'Add a bookmark':'Discover the web'}<ArrowRight size={16}/></button></div>}</div>}<div className="pagination"><button disabled={listPage===0} onClick={()=>setListPage(p=>p-1)}>Previous</button><button onClick={()=>{setListPage(0);void refresh();}}>Refresh library</button><button disabled={(listPage+1)*capacity>=entries.filter(e=>e.kind===(page==='bookmarks'?'bookmark':'history')&&`${e.title} ${e.url}`.toLowerCase().includes(filter.toLowerCase())).length} onClick={()=>setListPage(p=>p+1)}>Next</button></div></>}
      {page==='media'&&<><div className="page-heading"><span className="eyebrow">TAKE A MOMENT</span><h1>Your personal screening room.</h1><p>Play an audio or video file from your device. Files stay on your device.</p></div><div className="media-panel">{media?<><video controls src={media} key={media}/><p>{mediaName}</p></>:<div className="empty"><Play size={40}/><h2>Press pause on the everyday.</h2><p>Choose a browser-compatible video or audio file.</p></div>}<label className="primary file-picker"><Plus size={18}/>Choose media<input type="file" accept="video/*,audio/*" onChange={e=>{const file=e.target.files?.[0];if(file){URL.revokeObjectURL(mediaRef.current);mediaRef.current=URL.createObjectURL(file);setMedia(mediaRef.current);setMediaName(file.name);}}}/></label></div></>}
      {page==='settings'&&<><div className="page-heading"><span className="eyebrow">PERSONALIZE YOUR DIGITAL WORLD</span><h1>Themes & colors</h1><p>Choose a digital color scheme for this session.</p></div><div className="theme-grid">{THEMES.map((t,i)=><button key={t[0]} className={theme===i?'theme-option selected':'theme-option'} style={{background:`linear-gradient(110deg,${t[1]},${t[2]})`,color:LIGHT_THEMES.includes(i)?'#18354b':'#f5f7ff'}} onClick={()=>setTheme(i)} aria-pressed={theme===i}><span className="theme-swatch" style={{background:t[3]}}/><strong>{t[0]}</strong><small>{theme===i?'Selected':LIGHT_THEMES.includes(i)?'Light':'Dark'}</small></button>)}</div></>}
      <footer><span>ES BROWSER <span className="footer-divider">/</span> Your world. One workspace.</span><span lang="ur" dir="rtl">ہر ضرورت کا ایک حل</span></footer>
    </main></div>
    <dialog ref={dialogRef} onCancel={()=>setModal(false)} onClick={e=>{if(e.target===e.currentTarget)setModal(false);}}><form onSubmit={async e=>{e.preventDefault();const form=e.currentTarget;const data=new FormData(form);setSaving(true);try{const url=resolveAddress(String(data.get('url')));const entry=await library('POST',{kind:'bookmark',title:String(data.get('title')).trim(),url});setEntries(prev=>[entry,...prev]);setError('');setModal(false);form.reset();}catch(err){setError((err as Error).message);}finally{setSaving(false);}}}><div className="section-heading"><h2>Save a good find.</h2><button type="button" className="icon-button" aria-label="Close" onClick={()=>setModal(false)}><X size={20}/></button></div><label>Name<input name="title" required maxLength={240} placeholder="My favorite website"/></label><label>Web address<input name="url" required maxLength={4096} placeholder="https://example.com"/></label>{error&&<p className="modal-error" role="alert">{error}</p>}<button className="primary" disabled={saving}>{saving?'Saving…':'Save bookmark'}<Bookmark size={16}/></button></form></dialog>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
