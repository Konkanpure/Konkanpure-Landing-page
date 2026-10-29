const fruitScenes=[
 ['mango','Mango products','THE GOLDEN CHAPTER','A little sunshine, from pulp and dried chunks to familiar mango favourites.','Golden mango, so many possibilities. Let’s find your favourite!'],
 ['kokum','Kokum products','A LITTLE COASTAL TANG','Explore kokum agal, dried kokum and another side of Konkan’s tangy favourite.','A little tang goes a long way. Discover kokum for your kitchen.'],
 ['jackfruit','Jackfruit products','THE GOLDEN HEART','Discover jackfruit sticks, flour and dehydrated slices in our planned collection.','Look inside! There’s a whole world of jackfruit to explore.'],
 ['cashew','Cashew products','A FUTURE CHAPTER','Our cashew collection is a future concept. Watch this space for more.','A small nut with big character. This chapter is coming soon.'],
 ['coconut','Coconut products','A LITTLE COAST IN EVERY CRACK','Coconut oils, pantry ideas and snacks are future concepts, coming soon.','A familiar coastal favourite. Our coconut collection is coming soon.'],
 ['karvanda','Karvanda products','SMALL BERRIES. BIG MEMORIES.','Tangy berry-inspired products are future concepts, coming soon.','Little berries, memorable tang. Watch for our future karvanda chapter.']
];
(() => {
 const first=document.querySelector('#fruit-video');if(!first)return;
 const frame=first.closest('.video-frame'),toggle=document.querySelector('#video-toggle'),status=document.querySelector('#video-status');
 const second=first.cloneNode(false);second.removeAttribute('id');second.setAttribute('aria-hidden','true');second.classList.add('standby');frame.insertBefore(second,first.nextSibling);
 const players=[first,second];let active=first,scene=0,visible=false,userPaused=false,manual=false,autoPaused=motionPaused,changing=false,request=0;
 const suffix=matchMedia('(max-width:700px)').matches||navigator.connection?.saveData?'mobile':'hd';
 const url=i=>`assets/videos/${fruitScenes[i][0]}-${suffix}.mp4`;
 const canPlay=()=>visible&&!document.hidden&&!userPaused&&(!autoPaused||manual);
 function prepare(v,i){if(v.dataset.scene===String(i))return;v.pause();v.dataset.scene=i;v.poster=`assets/videos/${fruitScenes[i][0]}-hd.webp`;v.src=url(i);v.preload='auto';v.load();}
 function controls(){toggle.textContent=active.error?'Retry ↻':active.paused?'Play ▶':'Pause Ⅱ';toggle.setAttribute('aria-label',active.error?'Retry fruit video':active.paused?'Play fruit video':'Pause fruit video');}
 function copy(){const [fruit,name,kicker,text,speech]=fruitScenes[scene];active.setAttribute('aria-label',name+' video');document.querySelector('#fruit-name').textContent=name;document.querySelector('#fruit-kicker').textContent=kicker;document.querySelector('#fruit-copy').textContent=text;const link=document.querySelector('#fruit-products');link.href=`collection.html?fruit=${fruit}`;link.textContent=`View ${fruit} products ↗`;const guide=document.querySelector('.video-guide>img');guide.src=`assets/guide-${fruit}.webp`;guide.alt=`Konkan Kaka introducing ${fruit}`;document.querySelector('.video-guide .bubble p').textContent=speech;document.querySelector('#video-progress').textContent=`0${scene+1} / 06`;document.querySelectorAll('[data-fruit]').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===scene)));document.querySelector('#video-timeline').value=0;}
 async function play(){if(!canPlay())return;if(!active.src)prepare(active,scene);try{await active.play();status.textContent='';}catch{status.textContent='Tap Play to watch';}controls();}
 function warm(){if(!visible||autoPaused||navigator.connection?.saveData)return;const spare=players.find(v=>v!==active);prepare(spare,(scene+1)%6);}
 async function show(n){const next=(n+6)%6;if(changing&&next===scene)return;const token=++request;changing=true;const old=active,incoming=players.find(v=>v!==old);prepare(incoming,next);
 // Hold the outgoing frame until the next clip is decoded; never clear the visible source.
 const ready=incoming.readyState>=2?Promise.resolve():new Promise((resolve,reject)=>{incoming.addEventListener('loadeddata',resolve,{once:true});incoming.addEventListener('error',reject,{once:true});});
 try{await ready;if(token!==request)return;incoming.currentTime=0;if(canPlay())await incoming.play();if(token!==request){incoming.pause();return;}active=incoming;scene=next;old.classList.add('standby');incoming.classList.remove('standby');incoming.setAttribute('aria-hidden','false');old.setAttribute('aria-hidden','true');copy();status.textContent='';setTimeout(()=>{if(old!==active){old.pause();if(!changing)warm();}},220);
 }catch{if(token===request)status.textContent='Unable to load the next video. Tap Next to retry.';}finally{if(token===request){changing=false;controls();}}
 }
 players.forEach(v=>{v.addEventListener('play',()=>{if(v===active){controls();warm();}});v.addEventListener('pause',()=>{if(v===active)controls();});v.addEventListener('timeupdate',()=>{if(v!==active||changing)return;const end=Math.max(0,v.duration-.2);document.querySelector('#video-timeline').value=end?v.currentTime/end*100:0;if(v.currentTime>=end&&end>0&&!autoPaused&&!userPaused&&visible)show(scene+1);});v.addEventListener('ended',()=>{if(v===active&&!changing&&!autoPaused&&!userPaused)show(scene+1);});v.addEventListener('error',()=>{if(v===active){status.textContent='Unable to load this video. Tap Retry.';controls();}});});
 toggle.addEventListener('click',()=>{if(!active.paused){userPaused=true;manual=false;players.forEach(v=>v.pause());}else{userPaused=false;manual=true;if(active.error){active.removeAttribute('data-scene');prepare(active,scene);}play();}controls();});
 document.querySelector('#video-prev').addEventListener('click',()=>show(scene-1));document.querySelector('#video-next').addEventListener('click',()=>show(scene+1));document.querySelectorAll('[data-fruit]').forEach(b=>b.addEventListener('click',()=>show(+b.dataset.fruit)));
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){play();warm();}else players.forEach(v=>v.pause());},{threshold:.2}).observe(frame);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)players.forEach(v=>v.pause());else play();});document.addEventListener('motionchange',e=>{autoPaused=e.detail.paused;manual=false;if(autoPaused)players.forEach(v=>v.pause());else play();});copy();controls();
})();
