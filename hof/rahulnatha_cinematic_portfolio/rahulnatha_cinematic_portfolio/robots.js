
// Starship canvas, debris collisions, robots, and cinematic light loop

function initStarshipCanvas(){
  const canvas = document.getElementById("space-canvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = window.innerWidth;
  let h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;

  window.addEventListener("resize",()=>{
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    initObjects();
  });

  const FAR_STAR_COUNT = 140;
  const MID_PARTICLE_COUNT = 60;
  const DEBRIS_COUNT = 20;

  let farStars = [];
  let midParticles = [];
  let debrisList = [];

  function rand(min,max){return Math.random()*(max-min)+min;}

  function initObjects(){
    farStars = [];
    midParticles = [];
    debrisList = [];

    for(let i=0;i<FAR_STAR_COUNT;i++){
      farStars.push({
        x:Math.random()*w,
        y:Math.random()*h,
        r:rand(0.4,1.4),
        speed:rand(0.02,0.06),
        twinklePhase:Math.random()*Math.PI*2
      });
    }
    for(let i=0;i<MID_PARTICLE_COUNT;i++){
      midParticles.push({
        x:Math.random()*w,
        y:Math.random()*h,
        r:rand(1,2),
        vx:rand(-0.15,-0.05),
        vy:rand(-0.03,0.03),
        alpha:rand(0.3,0.8)
      });
    }
    for(let i=0;i<DEBRIS_COUNT;i++){
      debrisList.push(makeDebris());
    }
  }

  function makeDebris(intensity=1){
    const side = Math.random();
    let x,y;
    if(side<0.5){
      x = rand(0,w);
      y = -20;
    }else{
      x = w+20;
      y = rand(0,h);
    }
    const angle = rand(Math.PI*0.6,Math.PI*1.1);
    const speed = rand(0.8,2.2)*intensity;
    return {
      x,y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      length:rand(18,40),
      alpha:rand(0.4,0.9),
      active:true
    };
  }

  let debrisIntensity = 0.3; // will be adjusted by cinematic loop

  initObjects();

  function maybeHitTile(d){
    const articles = Array.from(document.querySelectorAll("article"));
    if(!articles.length) return;
    if(Math.random() < 0.02 * debrisIntensity){
      const idx = Math.floor(Math.random()*articles.length);
      breakGlass(articles[idx]);
    }
  }

  function step(){
    ctx.clearRect(0,0,w,h);

    ctx.save();
    for(const s of farStars){
      s.x += -s.speed;
      if(s.x<0) s.x = w;
      const tw = 0.4 + 0.6*Math.sin(s.twinklePhase += 0.005);
      ctx.globalAlpha = 0.4 + 0.6*tw;
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = "rgba(248,250,252,0.85)";
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    for(const p of midParticles){
      p.x += p.vx;
      p.y += p.vy;
      if(p.x<-10){p.x=w+10;p.y=Math.random()*h;}
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = "rgba(148,163,184,0.9)";
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    for(const d of debrisList){
      d.x += d.vx;
      d.y += d.vy;
      ctx.globalAlpha = d.alpha;
      const nx = d.x - d.vx*d.length*0.9;
      const ny = d.y - d.vy*d.length*0.9;
      const grad = ctx.createLinearGradient(nx,ny,d.x,d.y);
      grad.addColorStop(0,"rgba(15,23,42,0)");
      grad.addColorStop(1,"rgba(148,163,184,0.9)");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.moveTo(nx,ny);
      ctx.lineTo(d.x,d.y);
      ctx.stroke();

      if(d.x<-40 || d.y>h+40 || d.y<-40){
        Object.assign(d, makeDebris(debrisIntensity));
        maybeHitTile(d);
      }else if(Math.random() < 0.0008*debrisIntensity){
        maybeHitTile(d);
      }
    }
    ctx.restore();

    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);

  // Expose intensity setter to cinematic loop
  window.__setDebrisIntensity = v=>{
    debrisIntensity = v;
  };
}

/* Glass break + robot repair */
function breakGlass(article){
  if(!article || article.classList.contains("broken")) return;
  article.classList.add("broken");

  const rect = article.getBoundingClientRect();
  const host = document.body;
  const arm = document.createElement("div");
  arm.className = "robot-arm animate";
  arm.style.left = rect.left + rect.width/2 + "px";
  arm.style.top = rect.top - 20 + window.scrollY + "px";
  arm.innerHTML = `
    <div class="segment" style="left:35px;top:0;transform:rotate(25deg);"></div>
    <div class="segment" style="left:18px;top:20px;transform:rotate(8deg);"></div>
    <div class="claw"></div>
  `;
  host.appendChild(arm);

  setTimeout(()=>{
    article.classList.remove("broken");
    arm.remove();
  }, 2600);
}

/* Cinematic light loop: A->B->C, low->med->high, 10s delay */
function setLightIntensity(v){
  document.documentElement.style.setProperty("--light-intensity", String(v));
}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

async function cinematicLoop(){
  // allow 10s for load
  await sleep(10000);

  let variants = [
    {label:"A-low",   maxIntensity:0.4, debris:0.3, duration:80000},
    {label:"B-med",   maxIntensity:0.75,debris:0.7, duration:90000},
    {label:"C-high",  maxIntensity:1.0, debris:1.0, duration:90000}
  ];
  let idx = 0;

  while(true){
    const v = variants[idx];
    const start = performance.now();
    const end = start + v.duration;

    while(performance.now() < end){
      const t = (performance.now() - start)/v.duration;
      const phase = t<0.5 ? t*2 : (1-t)*2; // rise then fall
      const intensity = phase*v.maxIntensity;
      setLightIntensity(intensity);
      if(window.__setDebrisIntensity){
        const base = v.debris;
        window.__setDebrisIntensity(base* (0.5 + 0.5*phase));
      }
      await sleep(30);
    }
    idx = (idx+1) % variants.length;
  }
}

/* init */
(function init(){
  initStarshipCanvas();
  cinematicLoop();
})();
