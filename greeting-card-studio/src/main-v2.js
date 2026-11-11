import { createClient } from '@supabase/supabase-js';
import './style-v2.css';

const SUPABASE_URL=import.meta.env.VITE_SUPABASE_URL||'';
const SUPABASE_KEY=import.meta.env.VITE_SUPABASE_ANON_KEY||'';
const db=SUPABASE_URL&&SUPABASE_KEY?createClient(SUPABASE_URL,SUPABASE_KEY):null;
const themes=[
 ['royal','Royal Gold','Luxury','#ead9b8','#634824','#d4ad65','✦','Chân thành gửi đến bạn'],
 ['sapphire','Midnight Sapphire','Luxury','#192e53','#f1e4cb','#b9a0e3','✧','Những điều đẹp nhất'],
 ['obsidian','Black & Gold','Luxury','#191919','#f9edda','#d2ac66','◆','With Love'],
 ['pearl','Ivory Pearl','Luxury','#f2eee6','#60524c','#c5a985','❋','Lời chúc từ trái tim'],
 ['emerald','Emerald Garden','Luxury','#16483c','#f8f1df','#d0bd89','❧','Nở rộ theo cách riêng'],
 ['champagne','Champagne Celebration','Luxury','#f6e7cf','#7c593e','#d5a775','✧','Cheers To You'],
 ['rose','Rose Velvet','Tình yêu','#702c44','#fce8eb','#e6b1c4','♥','Thương gửi người đặc biệt'],
 ['lavender','Lavender Dream','Tình yêu','#ded1ef','#624a77','#ab88bf','✿','Gửi chút dịu dàng'],
 ['blossom','Cherry Blossom','Tình yêu','#f9e0e6','#96556a','#dfa2b6','❀','Mùa hoa nở'],
 ['valentine','Valentine Romance','Tình yêu','#b63f58','#fff0e9','#f2bb97','♥','You Are My Valentine'],
 ['anniversary','Forever Together','Tình yêu','#e8d4c2','#825f5c','#bc8b79','∞','Kỷ niệm của chúng mình'],
 ['sweet','Sweet Love','Tình yêu','#fae4ef','#a74d77','#d5a3bd','♡','Một chút thương yêu'],
 ['birthday','Birthday Blossom','Sinh nhật','#fce3d9','#994f59','#dfaa89','✿','Chúc mừng sinh nhật'],
 ['cake','Golden Birthday','Sinh nhật','#fff0ca','#8b6739','#d9b76d','★','Tuổi mới rực rỡ'],
 ['balloon','Pastel Wishes','Sinh nhật','#e1e8f5','#5d719e','#a3b5dc','✧','Happy Birthday'],
 ['sparkle','Starry Birthday','Sinh nhật','#2e365d','#f5e8ca','#d6b877','✦','Ước mơ thành hiện thực'],
 ['lunar','Lunar Imperial','Ngày lễ','#9e2b2a','#fff1d2','#f0bc71','福','Phúc Lộc An Khang'],
 ['winter','Winter Silver','Ngày lễ','#e7eff5','#527087','#b0cadb','❄','Winter Wishes'],
 ['christmas','Christmas Evergreen','Ngày lễ','#214b40','#fae9d4','#c4ad6b','✦','Merry Christmas'],
 ['moon','Moonlight Festival','Ngày lễ','#20375f','#fff1d2','#d5bc78','☾','Trăng tròn đoàn viên'],
 ['grad','Golden Graduation','Thành tựu','#f5e8d0','#755b36','#d8b46d','★','Chúc mừng tốt nghiệp'],
 ['success','Success Laurel','Thành tựu','#dbeadf','#4b7654','#93b68d','❧','Chúc mừng thành công'],
 ['thanks','Thank You Bloom','Cảm ơn','#f0e1ed','#755d7b','#c5a4c3','✿','Lời cảm ơn chân thành'],
 ['appreciation','Pearl Appreciation','Cảm ơn','#f4efe7','#797168','#c1ae9a','♡','Thank You So Much']
].map(([id,name,category,bg,ink,foil,icon,headline])=>({id,name,category,bg,ink,foil,icon,headline}));
const $=(sel,from=document)=>from.querySelector(sel);
const safe=v=>String(v??'').normalize('NFC').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId=id=>themes.find(t=>t.id===id)||themes[0];
const normalColor=x=>/^#[0-9a-fA-F]{6}$/.test(x||'')?x:'#ffffff';
const draftKey='thiep-may-luxury-v2-draft';
const guestIndexKey='thiep-may-guest-cards-v1';
const initial=t=>({version:2,themeId:t.id,title:t.name,recipient:'Người đặc biệt',sender:'Một người luôn nghĩ đến bạn',headline:t.headline,message:'Mong bạn luôn hạnh phúc, bình an và gặp thật nhiều điều đẹp đẽ. Từng khoảnh khắc hôm nay đều đáng trân trọng.',background:t.bg,ink:t.ink,foil:t.foil,font:'serif',fontSize:34,textAlign:'center',photoUrl:'',musicUrl:'',photoSize:64,photoShape:'rounded',effect:'petals',headingY:20,envelopeStyle:'classic',envelopeName:'',envelopeNote:''});
const state={page:'home',category:'Tất cả',design:initial(themes[0]),cardId:null,user:null,cards:[],notice:'',editToken:null,shareToken:null,busy:false,shareUrl:'',open:false,preview:false,localImage:null,localAudio:null};
try{const d=JSON.parse(localStorage.getItem(draftKey)||'null');if(d&&d.version===2)state.design={...initial(byId(d.themeId)),...d};}catch{}
const app=$('#app');
const pathToken=new URLSearchParams(location.search).get('card');
const isViewer=!!pathToken;
function setNotice(msg){state.notice=String(msg);const n=$('#toast');if(n){n.textContent=state.notice;n.hidden=!state.notice;}else if(state.page!=='viewer')console.info(msg)}
function shell(content){app.innerHTML=content;const t=$('#toast');if(t&&state.notice){t.textContent=state.notice;t.hidden=false}}
function header(){return `<header class="site-header"><div class="header-inner"><button class="wordmark" data-action="home"><span class="logo-mark">✧</span><span>THIỆP MÂY<small>STUDIO</small></span></button><nav class="main-nav"><button data-action="home">Khám phá</button><button data-action="editor">Thiết kế</button><button data-action="mycards">Thiệp của tôi</button></nav></div></header>`}
function themeCard(t){return `<button class="theme-tile" data-theme="${safe(t.id)}" aria-label="Sử dụng mẫu ${safe(t.name)}"><div class="tile-art" style="--bg:${t.bg};--ink:${t.ink};--foil:${t.foil}"><span class="tile-sparks">✧</span><span class="mini-envelope"><i class="mini-flap"></i><b class="mini-seal">${safe(t.icon)}</b></span></div><div class="tile-name">${safe(t.name)} <span>↗</span></div><div class="tile-category">${safe(t.category)}</div></button>`}
function home(){state.page='home';const tags=['Tất cả','Luxury','Tình yêu','Sinh nhật','Ngày lễ','Thành tựu','Cảm ơn'];shell(`${header()}<main><section class="hero"><div class="hero-text"><div class="eyebrow">LUXURY GREETING CARD STUDIO · 2026</div><h1>Một lời chúc.<br><em>Muôn cách yêu thương.</em></h1><p>Tự tay thiết kế tấm thiệp mang dấu ấn riêng. Chọn phong bì, viết lời chúc, thêm hình ảnh và nhạc rồi gửi một đường link cho người thương.</p><div class="hero-actions"><button class="btn primary" data-action="editor">Bắt đầu thiết kế <span>↗</span></button><a href="#gallery" class="btn ghost">Khám phá bộ sưu tập ↓</a></div><div class="hero-meta">24 mẫu chọn lọc <span>✦</span> Chỉnh sửa linh hoạt <span>✦</span> Mở trên điện thoại</div></div><div class="hero-preview"><div class="hero-deco">✦</div><div class="hero-envelope"><div class="hero-flap"></div><div class="hero-seal">M</div></div><div class="hero-caption">AN ENVELOPE OF LOVE</div></div></section><section class="gallery" id="gallery"><div class="section-heading"><div><div class="eyebrow">THE COLLECTION</div><h2>Chọn câu chuyện của bạn</h2></div><p>24 thiết kế · 7 phong cách</p></div><div class="tabs">${tags.map(x=>`<button class="tab ${state.category===x?'active':''}" data-category="${safe(x)}">${safe(x)}</button>`).join('')}</div><div class="tile-grid">${themes.filter(x=>state.category==='Tất cả'||x.category===state.category).map(themeCard).join('')}</div></section><section class="closing"><span>✧</span><h2>Không chỉ là một tấm thiệp.</h2><p>Là cách bạn gửi đi những điều khó nói thành lời.</p><button class="btn primary" data-action="editor">Thiết kế ngay ↗</button></section></main>${footer()}${toast()}`)}
function toast(){return `<div class="toast" id="toast" role="status" hidden></div>`}
function footer(){return `<footer class="footer">✧ THIỆP MÂY STUDIO <span>Thiết kế với sự trân trọng · © 2026</span></footer>`}
function saveDraft(){try{localStorage.setItem(draftKey,JSON.stringify({...state.design,photoUrl:state.design.photoUrl.startsWith('data:')?'':state.design.photoUrl,musicUrl:state.design.musicUrl.startsWith('data:')?'':state.design.musicUrl}));}catch{}}
function setTheme(t){state.design={...initial(t),recipient:state.design.recipient,sender:state.design.sender,envelopeName:state.design.envelopeName||'',envelopeNote:state.design.envelopeNote||''};state.cardId=null;state.editToken=null;state.shareToken=null;state.shareUrl='';state.localImage=null;state.localAudio=null;saveDraft();state.page='editor';editor()}
function textStyle(d){return `font-family:${d.font==='sans'?'"Be Vietnam Pro",Arial,sans-serif':'"Noto Serif",Georgia,serif'};font-size:clamp(19px,${Number(d.fontSize)}px,48px);text-align:${d.textAlign};color:${normalColor(d.ink)}`}
function letterContent(d,editing=false){return `<article class="letter" style="--paper:${normalColor(d.background)};--ink:${normalColor(d.ink)};--foil:${normalColor(d.foil)}"><div class="letter-border"><div class="letter-star">✧ ✦ ✧</div><div class="letter-recipient">TO · ${safe(d.recipient)}</div>${d.photoUrl?`<div class="letter-photo ${d.photoShape==='circle'?'circle':''}" style="width:${Number(d.photoSize)}%"><img src="${safe(d.photoUrl)}" alt="Ảnh kỷ niệm do người gửi chọn" loading="eager"></div>`:''}<h2 class="letter-headline ${editing?'draggable':''}" style="${textStyle(d)};margin-top:${Number(d.headingY)*1.4}px" ${editing?'data-drag-headline="1" title="Kéo để đổi vị trí"':''}>${safe(d.headline)}</h2><p class="letter-message">${safe(d.message).replace(/\n/g,'<br>')}</p><div class="letter-signature">Thương mến,<br><strong>${safe(d.sender)}</strong></div><div class="letter-signet">✧</div></div></article>`}
function envelopeMarkup(d){const t=byId(d.themeId);return `<div class="envelope-wrap"><div class="envelope-scene envelope-${safe(d.envelopeStyle||'classic')}" style="--paper:${normalColor(d.background)};--ink:${normalColor(d.ink)};--foil:${normalColor(d.foil)}"><div class="envelope-back"></div><div class="envelope-top"></div><div class="envelope-front"></div><div class="wax-seal">${safe(t.icon)}</div><div class="envelope-address">${safe(d.envelopeName||d.recipient)}</div>${d.envelopeNote?`<div class="envelope-note">${safe(d.envelopeNote)}</div>`:''}</div></div>`}
function hexBlend(a,b,t){
 const x=parseInt(normalColor(a).slice(1),16),y=parseInt(normalColor(b).slice(1),16);
 return '#'+[16,8,0].map(shift=>Math.round(((x>>shift)&255)*(1-t)+((y>>shift)&255)*t).toString(16).padStart(2,'0')).join('');
}
function coordinatedStyle(d){
 const bg=normalColor(d.background), ink=normalColor(d.ink),foil=normalColor(d.foil);
 return '--paper:'+bg+';--ink:'+ink+';--foil:'+foil+';--env-paper:'+hexBlend(bg,'#ffffff',.07)+';--env-shine:'+hexBlend(bg,foil,.22)+';--wash:'+hexBlend(bg,'#ffffff',.80)+';--wash-deep:'+hexBlend(bg,'#f1ede8',.63)+';--reader-ink:#453c39';
}
function reader(d,{preview=false}={}){state.page=preview?'preview':'viewer';state.open=false;const content=()=>`<main class="reader-page" style="${coordinatedStyle(d)}"><div class="reader-wash"></div>${preview?`<button class="reader-back" data-action="back-editor">← Quay lại chỉnh sửa</button>`:''}<div class="reader-content"><div class="reader-overline">✧ A LETTER FOR YOU ✧</div>${!state.open?`<div class="reader-closed"><button class="envelope-button" data-action="open-envelope" aria-label="Chạm để mở phong bì">${envelopeMarkup(d)}</button></div>`:`<div class="reader-open"><h1>${safe(d.title)}</h1>${letterContent(d)}${d.musicUrl?`<div class="music-dock"><audio id="card-bgm" loop preload="auto" src="${safe(d.musicUrl)}"></audio><button class="music-toggle" data-action="toggle-music" type="button" aria-label="Tắt nhạc" aria-pressed="true" title="Bật/tắt nhạc">♫</button></div>`:''}<button class="btn ghost" data-action="close-envelope">Đóng phong bì ↶</button></div>`}</div><div class="reader-footer">THIỆP MÂY STUDIO · A LITTLE MOMENT OF LOVE</div></main>`;shell(content());}
function editor(){state.page='editor';const d=state.design;const input=(label,name,value,type='text',additional='')=>`<label class="form-field"><span>${label}</span><input type="${type}" data-field="${name}" value="${safe(value)}" ${additional}></label>`;const textarea=(label,name,value)=>`<label class="form-field"><span>${label}</span><textarea data-field="${name}" rows="4">${safe(value)}</textarea></label>`;shell(`${header()}<main class="studio"><div class="editor-top"><div><span class="eyebrow">DESIGN WORKSPACE</span><h1>Thiết kế thiệp của bạn</h1></div><div class="editor-cta"><button class="btn ghost" data-action="preview">Xem phong bì ♡</button><button class="btn dark" data-action="save">Lưu thiệp</button><button class="btn primary" data-action="share">Tạo link chia sẻ ↗</button></div></div><div class="studio-layout"><aside class="studio-sidebar"><section class="panel"><div class="panel-head"><span>01</span><h3>Phong cách</h3></div><div class="current-theme" data-action="show-themes">${safe(byId(d.themeId).name)} <span>Đổi mẫu ↗</span></div>${input('Tên thiệp','title',d.title)}${input('Tên trên phong bì','envelopeName',d.envelopeName||'','text','maxlength="80" placeholder="Mặc định lấy tên người nhận"')}${input('Lời nhắn nhỏ trên phong bì','envelopeNote',d.envelopeNote||'','text','maxlength="80" placeholder="Tùy chọn"')}<label class="form-field"><span>Kiểu phong bì</span><select data-field="envelopeStyle"><option value="classic" ${d.envelopeStyle==='classic'?'selected':''}>Phong bì cổ điển</option><option value="modern" ${d.envelopeStyle==='modern'?'selected':''}>Phong bì hiện đại</option><option value="royal" ${d.envelopeStyle==='royal'?'selected':''}>Phong bì hoàng gia</option><option value="floral" ${d.envelopeStyle==='floral'?'selected':''}>Phong bì hoa văn</option><option value="minimal" ${d.envelopeStyle==='minimal'?'selected':''}>Phong bì tối giản</option></select></label><div class="color-row">${input('Màu thiệp & phong bì','background',d.background,'color')}${input('Màu chữ','ink',d.ink,'color')}${input('Ánh kim','foil',d.foil,'color')}</div><p class="help">Thiệp và phong bì đồng bộ màu. Ánh sáng được phối nhẹ theo tông nền.</p></section><section class="panel"><div class="panel-head"><span>02</span><h3>Nội dung</h3></div>${input('Người nhận','recipient',d.recipient)}${input('Người gửi','sender',d.sender)}${input('Tiêu đề trên thiệp','headline',d.headline)}${textarea('Lời chúc','message',d.message)}<div class="color-row"><label class="form-field"><span>Font chữ</span><select data-field="font"><option value="serif" ${d.font==='serif'?'selected':''}>Noto Serif Luxury</option><option value="sans" ${d.font==='sans'?'selected':''}>Be Vietnam Pro</option></select></label><label class="form-field"><span>Cỡ chữ</span><input data-field="fontSize" type="number" min="19" max="48" value="${Number(d.fontSize)}"></label></div><label class="form-field"><span>Căn chữ</span><select data-field="textAlign"><option value="center" ${d.textAlign==='center'?'selected':''}>Giữa</option><option value="left" ${d.textAlign==='left'?'selected':''}>Trái</option><option value="right" ${d.textAlign==='right'?'selected':''}>Phải</option></select></label><label class="form-field"><span>Vị trí tiêu đề (có thể kéo trực tiếp)</span><input data-field="headingY" type="range" min="13" max="65" value="${Number(d.headingY)}"></label></section><section class="panel"><div class="panel-head"><span>03</span><h3>Hình ảnh & nhạc</h3></div><label class="upload-field"><strong>＋ Thêm ảnh cá nhân</strong><small>JPEG / PNG / WebP / GIF · tối đa 8MB</small><input id="image-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif"></label>${d.photoUrl?`<button class="remove-media" data-action="remove-photo">Xóa ảnh ✕</button><label class="form-field"><span>Kích thước ảnh</span><input type="range" data-field="photoSize" min="35" max="90" value="${Number(d.photoSize)}"></label><label class="form-field"><span>Khung ảnh</span><select data-field="photoShape"><option value="rounded" ${d.photoShape==='rounded'?'selected':''}>Bo góc</option><option value="circle" ${d.photoShape==='circle'?'selected':''}>Tròn</option></select></label>`:''}<label class="upload-field"><strong>♫ Thêm nhạc nền</strong><small>MP3 / WAV / OGG / M4A · tối đa 12MB</small><input id="music-upload" type="file" accept="audio/mpeg,audio/wav,audio/ogg,audio/mp4,.m4a"></label>${d.musicUrl?`<div class="media-status">✓ Đã chọn nhạc</div><button class="remove-media" data-action="remove-music">Xóa nhạc ✕</button>`:''}<p class="help">Nhạc tự phát khi chạm vào phong bì. Không hiện thanh phát nhạc, chỉ có nút bật/tắt nhỏ.</p></section><section class="panel"><div class="panel-head"><span>04</span><h3>Hiệu ứng & tiện ích</h3></div><label class="form-field"><span>Hiệu ứng mở thiệp</span><select data-field="effect"><option value="petals" ${d.effect==='petals'?'selected':''}>Hoa nhẹ</option><option value="sparkles" ${d.effect==='sparkles'?'selected':''}>Lấp lánh</option><option value="hearts" ${d.effect==='hearts'?'selected':''}>Trái tim bay</option><option value="gold" ${d.effect==='gold'?'selected':''}>Bụi vàng</option><option value="stars" ${d.effect==='stars'?'selected':''}>Bầu trời sao</option><option value="confetti" ${d.effect==='confetti'?'selected':''}>Kim tuyến</option><option value="glow" ${d.effect==='glow'?'selected':''}>Ánh sáng mềm</option><option value="mixed" ${d.effect==='mixed'?'selected':''}>Tổng hợp Luxury</option><option value="none" ${d.effect==='none'?'selected':''}>Không hiệu ứng</option></select></label><button class="sidebar-button" data-action="reset-theme">Khôi phục mẫu gốc</button></section></aside><section class="studio-stage"><div class="stage-head"><strong>Thiệp đang thiết kế</strong><span>LIVE PREVIEW · 390 × 570</span></div><div class="stage-board"><div id="live-letter">${letterContent(d,true)}</div><div class="stage-hint">↕ Kéo tiêu đề để đổi vị trí · Các thay đổi được cập nhật trực tiếp</div></div><div class="stage-foot"><div class="stage-foot-note">✦ Không cần đăng nhập. Mã chỉnh sửa được giữ trên thiết bị này; người nhận chỉ xem được thiệp.</div><button class="btn ghost" data-action="preview">Xem hiệu ứng mở phong bì →</button></div>${state.shareUrl?`<div class="share-box"><strong>Link chỉ xem</strong><input id="share-link" readonly value="${safe(state.shareUrl)}"><button class="btn dark" data-action="copy">Sao chép</button></div>`:''}</section></div></main>${footer()}${toast()}`);bindDragging();}
function previewUpdate(){const l=$('#live-letter');if(l)l.innerHTML=letterContent(state.design,true);bindDragging();saveDraft();}
function bindDragging(){const h=$('[data-drag-headline]');const letter=$('.stage-board .letter');if(!h||!letter)return;let pointer=null;h.addEventListener('pointerdown',e=>{pointer=e.pointerId;h.setPointerCapture(pointer);h.classList.add('moving')});h.addEventListener('pointermove',e=>{if(pointer!==e.pointerId)return;const rect=letter.getBoundingClientRect();state.design.headingY=Math.round(Math.max(13,Math.min(65,(e.clientY-rect.top)/rect.height*100)));h.style.marginTop=(state.design.headingY*1.4)+'px';const r=$('[data-field="headingY"]');if(r)r.value=state.design.headingY;});h.addEventListener('pointerup',()=>{pointer=null;h.classList.remove('moving');saveDraft()})}

function guestEntries(){try{const a=JSON.parse(localStorage.getItem(guestIndexKey)||'[]');return Array.isArray(a)?a.filter(x=>x&&x.cardId&&x.editToken).slice(0,100):[]}catch{return []}}
function guestRemember(entry){const items=guestEntries().filter(x=>x.cardId!==entry.cardId);items.unshift(entry);try{localStorage.setItem(guestIndexKey,JSON.stringify(items.slice(0,100)))}catch{}}
function guestForget(id){try{localStorage.setItem(guestIndexKey,JSON.stringify(guestEntries().filter(x=>x.cardId!==id)))}catch{}}
async function loadCards(){state.cards=[];if(!db)return;const entries=guestEntries().slice(0,50);const responses=await Promise.all(entries.map(async x=>{try{const {data,error}=await db.rpc('guest_card_get_owner',{p_card_id:x.cardId,p_edit_token:x.editToken});if(error||!data?.length)return null;return {...data[0],id:data[0].card_id,editToken:x.editToken}}catch{return null}}));state.cards=responses.filter(Boolean)}
async function mycards(){state.page='mycards';shell(`${header()}<main class="mycards-page"><span class="eyebrow">YOUR COLLECTION</span><h1>Thiệp của tôi</h1><p>Thiệp được lưu trực tuyến. Thiết bị này giữ quyền chỉnh sửa; đừng xóa dữ liệu trình duyệt.</p><button class="btn primary" data-action="editor">+ Tạo thiệp mới</button><div class="mycards-grid"><div class="empty-state">Đang tải thiệp đã lưu…</div></div></main>${footer()}${toast()}`);await loadCards();if(state.page!=='mycards')return;const grid=$('.mycards-grid');if(!grid)return;grid.innerHTML=state.cards.map(c=>`<div class="saved-card"><div class="saved-art" style="background:${normalColor(c.design?.background)};color:${normalColor(c.design?.ink)}">${safe(byId(c.design?.themeId).icon)}<small>${safe(c.title)}</small></div><div class="saved-info"><strong>${safe(c.title)}</strong><span>${new Date(c.updated_at).toLocaleDateString('vi-VN')}</span><div class="saved-actions"><button data-edit="${safe(c.id)}">Chỉnh sửa</button><button data-share="${safe(c.id)}">Chia sẻ</button><button class="danger" data-delete="${safe(c.id)}">Xóa</button></div></div></div>`).join('')||'<div class="empty-state">Chưa có thiệp nào được lưu trên thiết bị này. Hãy tạo tấm thiệp đầu tiên.</div>'}
async function save(){
 if(!db){setNotice('Chưa kết nối hệ thống lưu thiệp.');return null}
 if(state.busy)return null;state.busy=true;setNotice('Đang lưu thiệp…');
 const d={...state.design};const token=state.editToken||crypto.randomUUID();
 try{
  if(state.cardId&&state.editToken){
   const {data,error}=await db.rpc('guest_card_update',{p_card_id:state.cardId,p_edit_token:token,p_title:d.title,p_design:d});
   if(error||data!==true)throw new Error(error?.message||'Không có quyền cập nhật thiệp này.');
  }else{
   const {data,error}=await db.rpc('guest_card_create',{p_edit_token:token,p_title:d.title,p_design:d});
   if(error||!data?.length)throw new Error(error?.message||'Không tạo được thiệp');
   state.cardId=data[0].card_id;state.shareToken=data[0].share_token;state.editToken=token;
  }
  guestRemember({cardId:state.cardId,editToken:token,shareToken:state.shareToken,title:d.title,updated_at:new Date().toISOString()});
  saveDraft();setNotice('Đã lưu thiệp trực tuyến.');return state.cardId;
 }catch(e){setNotice('Không lưu được: '+String(e?.message||e));return null}finally{state.busy=false}
}
async function share(id=null){
 if(!db)return setNotice('Chưa kết nối Supabase.');
 let shareToken;
 if(id&&id!==state.cardId){
  const c=state.cards.find(x=>x.id===id);
  if(!c)return setNotice('Không tìm thấy thiệp đã lưu.');
  shareToken=c.share_token;
 }else{
  const saved=await save();if(!saved)return;
  shareToken=state.shareToken;
 }
 if(!shareToken)return setNotice('Không lấy được mã chia sẻ.');
 const link=new URL(location.href);link.searchParams.set('card',shareToken);link.hash='';state.shareUrl=link.toString();
 if(state.page==='editor')editor();else await mycards();
 setNotice('Đã tạo liên kết chỉ xem.');
 if(navigator.clipboard?.writeText){try{await navigator.clipboard.writeText(state.shareUrl);setNotice('Đã sao chép liên kết chỉ xem.')}catch{setNotice('Sao chép liên kết trong ô chia sẻ.')}}
}
async function deleteCard(id){
 if(!confirm('Bạn muốn xóa vĩnh viễn thiệp này?'))return;
 const c=state.cards.find(x=>x.id===id);if(!c||!db)return;
 const {data,error}=await db.rpc('guest_card_delete',{p_card_id:id,p_edit_token:c.editToken});
 if(error||data!==true){setNotice('Không xóa được thiệp.');return}
 guestForget(id);if(state.cardId===id){state.cardId=null;state.editToken=null;state.shareToken=null}
 await mycards();setNotice('Đã xóa thiệp.');
}
async function uploadMedia(file,kind){
 if(!file)return;const image=kind==='photo';
 const allowed=image?['image/jpeg','image/png','image/webp','image/gif']:['audio/mpeg','audio/wav','audio/ogg','audio/mp4','audio/x-m4a'];
 const limit=image?8*1024*1024:12*1024*1024;
 if(!allowed.includes(file.type)||file.size>limit){setNotice(`Tệp không hợp lệ. ${image?'Ảnh tối đa 8MB':'Nhạc tối đa 12MB'}.`);return}
 if(!db)return setNotice('Chưa kết nối Supabase.');
 const cardId=await save();if(!cardId)return;
 const form=new FormData();form.set('cardId',cardId);form.set('editToken',state.editToken);form.set('kind',kind);form.set('file',file);
 setNotice('Đang tải tệp lên. Không đóng trang…');
 try{
  const resp=await fetch(SUPABASE_URL+'/functions/v1/guest-card-media',{method:'POST',headers:{apikey:SUPABASE_KEY},body:form});
  const payload=await resp.json();if(!resp.ok||!payload?.url)throw new Error(payload?.error||'Tải lên thất bại');
  if(image)state.design.photoUrl=payload.url;else state.design.musicUrl=payload.url;
  editor();saveDraft();await save();setNotice('Đã tải ảnh hoặc nhạc và lưu thiệp thành công.');
 }catch(e){setNotice('Tải tệp thất bại: '+String(e?.message||e))}
}
async function showShared(){state.page='viewer';const token=pathToken;
 if(!db||!token||!/^[0-9a-f-]{36}$/i.test(token)){shell('<main class="share-error"><h1>Không thể mở thiệp</h1><p>Liên kết không hợp lệ hoặc hệ thống chưa sẵn sàng.</p></main>');return}
 shell('<main class="share-loading"><h1>✧ Một lời chúc dành cho bạn</h1><p>Đang mở phong bì…</p></main>');
 let data=null,error=null;
 ({data,error}=await db.rpc('guest_card_get_public',{p_share_token:token}));
 if(!error&&!data?.length)({data,error}=await db.rpc('get_shared_card',{share_token:token}));
 if(error||!data?.length){shell('<main class="share-error"><h1>Không tìm thấy thiệp</h1><p>Liên kết không hợp lệ hoặc thiệp đã bị xóa.</p></main>');return}
 state.design={...initial(byId(data[0].design?.themeId)),...data[0].design,title:data[0].title};reader(state.design);
}
function handleAction(action){switch(action){case'home':home();break;case'editor':state.cardId=null;state.editToken=null;state.shareToken=null;state.shareUrl='';editor();break;case'mycards':void mycards();break;case'preview':reader(state.design,{preview:true});break;case'back-editor':stopCardMusic();editor();break;case'open-envelope':state.open=true;readerOpen();playOpeningChime();startCardMusic();break;case'close-envelope':stopCardMusic();state.open=false;readerOpen();break;case'toggle-music':toggleCardMusic();break;case'save':void save();break;case'share':void share();break;case'copy':void copyShare();break;case'show-themes':home();location.hash='gallery';break;case'reset-theme':if(confirm('Đặt lại nội dung và màu của mẫu này?'))setTheme(byId(state.design.themeId));break;case'remove-photo':state.design.photoUrl='';editor();saveDraft();break;case'remove-music':state.design.musicUrl='';editor();saveDraft();break;}}
// Both sounds are triggered synchronously by the recipient's click/tap.
function playOpeningChime(){
 try{
  const AudioContextType=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextType)return;
  const ctx=new AudioContextType();
  const start=ctx.currentTime;
  [659.25,783.99,1046.50].forEach((frequency,index)=>{
   const osc=ctx.createOscillator();
   const gain=ctx.createGain();
   const t=start+index*0.115;
   osc.type='sine';osc.frequency.setValueAtTime(frequency,t);
   gain.gain.setValueAtTime(0.0001,t);
   gain.gain.exponentialRampToValueAtTime(0.075,t+0.025);
   gain.gain.exponentialRampToValueAtTime(0.0001,t+0.48);
   osc.connect(gain);gain.connect(ctx.destination);
   osc.start(t);osc.stop(t+0.5);
  });
  if(ctx.state==='suspended')void ctx.resume().catch(()=>{});
  window.setTimeout(()=>{void ctx.close().catch(()=>{})},1400);
 }catch(e){console.debug('Không phát được hiệu ứng mở thư',e)}
}
function updateMusicButton(playing){
 const button=$('.music-toggle');if(!button)return;
 button.textContent=playing?'♫':'♪';button.setAttribute('aria-pressed',String(playing));
 button.setAttribute('aria-label',playing?'Tắt nhạc':'Bật nhạc');button.classList.toggle('is-playing',playing);
}
function startCardMusic(){
 const a=$('#card-bgm');if(!a)return;a.volume=.66;a.loop=true;
 try{const p=a.play();if(p&&p.catch)void p.then(()=>updateMusicButton(true)).catch(()=>updateMusicButton(false));
 else updateMusicButton(!a.paused);}catch{updateMusicButton(false);}
}
function stopCardMusic(){const a=$('#card-bgm');if(a){a.pause();try{a.currentTime=0}catch{}}updateMusicButton(false);}
function toggleCardMusic(){const a=$('#card-bgm');if(!a)return;if(!a.paused){a.pause();updateMusicButton(false)}else startCardMusic()}
function readerOpen(){const preview=state.page==='preview';const opened=state.open;reader(state.design,{preview});state.open=opened;const d=state.design;const container=$('.reader-content');if(!container)return;container.innerHTML=`<div class="reader-overline">✧ A LETTER FOR YOU ✧</div>${opened?`<div class="reader-open"><h1>${safe(d.title)}</h1>${letterContent(d)}${d.musicUrl?`<div class="music-dock"><audio id="card-bgm" loop preload="auto" src="${safe(d.musicUrl)}"></audio><button class="music-toggle" data-action="toggle-music" type="button" aria-label="Tắt nhạc" aria-pressed="true" title="Bật/tắt nhạc">♫</button></div>`:''}<button class="btn ghost" data-action="close-envelope">Đóng phong bì ↶</button></div>`:`<div class="reader-closed"><button class="envelope-button" data-action="open-envelope" aria-label="Chạm để mở phong bì">${envelopeMarkup(d)}</button></div>`}`;if(opened&&d.effect!=='none')makeParticles(d.effect)}
function motionReduced(){return !!window.matchMedia?.('(prefers-reduced-motion:reduce)').matches}
function symbolsFor(effect){return ({petals:['❀','✿','❁'],sparkles:['✦','✧','⋆'],hearts:['♥','♡','❥'],gold:['✦','•','✧'],stars:['★','☆','✧'],confetti:['◆','●','■'],glow:['✧','◌','✦'],mixed:['❀','✦','♥','◆','✧','♡','★']})[effect]||['✦','✧']}
function burstAt(x,y,effect,count=18){
 if(motionReduced()||effect==='none')return;
 const layer=$('.reader-page');if(!layer)return;
 const choices=symbolsFor(effect),n=Math.min(count,40);
 for(let i=0;i<n;i++){
  const p=document.createElement('span');p.className='luxury-burst';p.textContent=choices[Math.floor(Math.random()*choices.length)];
  const a=i/n*Math.PI*2+(Math.random()-.5)*.4,dist=40+Math.random()*110;
  p.style.left=x+'px';p.style.top=y+'px';p.style.setProperty('--dx',Math.cos(a)*dist+'px');
  p.style.setProperty('--dy',Math.sin(a)*dist+'px');p.style.setProperty('--spin',(Math.random()*480-240)+'deg');
  p.style.setProperty('--time',(650+Math.random()*550)+'ms');
  p.style.color=i%3===0?'var(--foil)':i%3===1?'var(--ink)':'#d59aa9';
  layer.appendChild(p);setTimeout(()=>p.remove(),1250);
 }
}
function makeParticles(effect){
 if(motionReduced()||effect==='none')return;
 const root=$('.reader-open');if(!root)return;const choices=symbolsFor(effect);
 for(let i=0;i<32;i++){
  const p=document.createElement('span');p.className='luxury-float';p.textContent=choices[i%choices.length];
  p.style.left=(3+Math.random()*94)+'%';p.style.top=(-5-Math.random()*55)+'px';
  p.style.setProperty('--drift',(Math.random()*170-85)+'px');p.style.setProperty('--spin',(Math.random()*480-240)+'deg');
  p.style.animationDelay=(Math.random()*.8)+'s';p.style.animationDuration=(4+Math.random()*3)+'s';
  p.style.color=i%3===0?'var(--foil)':i%3===1?'var(--ink)':'#d59aa9';
  root.appendChild(p);setTimeout(()=>p.remove(),7600);
 }
 setTimeout(()=>{const rect=root.getBoundingClientRect();if(rect.width&&state.open)burstAt(rect.left+rect.width/2,Math.min(rect.top+170,innerHeight*.45),effect,35)},140);
}
async function copyShare(){const text=state.shareUrl;if(!text)return;try{await navigator.clipboard.writeText(text);setNotice('Đã sao chép liên kết.')}catch{const el=$('#share-link');if(el){el.select();document.execCommand('copy');setNotice('Đã sao chép liên kết.')}}}
app.addEventListener('click',e=>{const t=e.target.closest('[data-action], [data-theme], [data-category], [data-edit], [data-share], [data-delete]');if(!t)return;const {action,theme,category,edit,share:shareId,delete:del}=t.dataset;if(action){handleAction(action);return}if(theme){setTheme(byId(theme));return}if(category){state.category=category;home();return}if(edit){const c=state.cards.find(x=>x.id===edit);if(c){state.design={...initial(byId(c.design?.themeId)),...c.design};state.cardId=edit;state.editToken=c.editToken;state.shareToken=c.share_token;state.shareUrl='';editor()}return}if(shareId){void share(shareId);return}if(del){void deleteCard(del)}});
app.addEventListener('pointerdown',e=>{
 if(!state.open||!['viewer','preview'].includes(state.page))return;
 if(!e.target.closest('.reader-page')||e.target.closest('button,a,input,textarea,select,audio'))return;
 burstAt(e.clientX,e.clientY,state.design.effect,18);
});
app.addEventListener('input',e=>{const el=e.target;if(!el.dataset?.field)return;const k=el.dataset.field;const numbers=['fontSize','headingY','photoSize'];let v=numbers.includes(k)?Number(el.value):el.value;if(numbers.includes(k)&&!Number.isFinite(v))return;state.design[k]=v;if(k==='fontSize')state.design.fontSize=Math.max(19,Math.min(48,v));previewUpdate()});
app.addEventListener('change',e=>{const el=e.target;if(el.id==='image-upload'||el.id==='music-upload'){const f=el.files?.[0];if(f)void uploadMedia(f,el.id==='image-upload'?'photo':'music')}else if(el.dataset?.field)previewUpdate()});

window.addEventListener('error',e=>{console.error(e.error||e.message);setNotice('Ứng dụng gặp lỗi hiển thị: '+(e.message||'Không rõ nguyên nhân'))});
window.addEventListener('unhandledrejection',e=>{console.error(e.reason);setNotice('Có lỗi kết nối hoặc xử lý dữ liệu. Hãy thử lại.')});
if(isViewer)void showShared();else home();
