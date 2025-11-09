

/* ===========================
File: world.js
Purpose: builds world, portals, dynamic scene loading/rendering, HUD/XP
=========================== */
(() => {
  const canvas = document.getElementById('world');
  const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setSize(innerWidth, innerHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08121f, 12, 42);
  const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .1, 200);
  camera.position.set(0, 1.6, 4);

  // lights
  const hemi = new THREE.HemisphereLight(0x7ec8ff, 0x08121f, 0.6); scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, .8); dir.position.set(8,10,6); scene.add(dir);

  // skybox glow
  const skyGeo = new THREE.SphereGeometry(120, 32, 16);
  const skyMat = new THREE.MeshBasicMaterial({color:0x0a1730, side:THREE.BackSide});
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  // ground grid platform
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200,200, 100,100), new THREE.MeshStandardMaterial({color:0x0b1f35, wireframe:true, metalness:.4, roughness:.9}));
  ground.rotation.x = -Math.PI/2; ground.position.y = 0; scene.add(ground);

  // floating beacons
  const beacons = new THREE.Group(); scene.add(beacons);

  // portals / zones
  const zones = window.RN_CONTENT.zones;
  const zoneMeshes = [];
  zones.forEach(z => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2, .07, 16, 100),
      new THREE.MeshStandardMaterial({color:z.color, emissive:z.color, emissiveIntensity:.35, metalness:.3, roughness:.2})
    );
    ring.position.set(...z.pos); ring.position.y = 2;
    ring.rotation.x = Math.PI/2;
    scene.add(ring); zoneMeshes.push({id:z.id, mesh:ring, entered:false});

    // beacon
    const orb = new THREE.Mesh(new THREE.SphereGeometry(.25, 24, 24), new THREE.MeshStandardMaterial({color:z.color, emissive:z.color, emissiveIntensity:.7}));
    orb.position.copy(ring.position); orb.position.y += .9; beacons.add(orb);
  });

  // labels (simple sprites)
  const labels = new THREE.Group(); scene.add(labels);
  const labelCanvas = (text)=>{ const c=document.createElement('canvas'); c.width=256; c.height=64; const x=c.getContext('2d'); x.fillStyle='rgba(0,0,0,0)'; x.fillRect(0,0,c.width,c.height); x.font='bold 28px Inter,Arial'; x.fillStyle='#cfe9ff'; x.textAlign='center'; x.textBaseline='middle'; x.fillText(text, c.width/2, c.height/2); return c; };
  zones.forEach(z=>{ const tex = new THREE.CanvasTexture(labelCanvas(z.label)); tex.anisotropy = 8; const mat = new THREE.SpriteMaterial({map:tex, transparent:true}); const s = new THREE.Sprite(mat); s.position.set(...z.pos); s.position.y = 3.3; s.scale.set(3.6, .9, 1); labels.add(s); });

  // player
  const player = new window.RN_Player(camera, renderer.domElement); player.addTo(scene);

  // HUD and socials
  const xpFill = document.getElementById('xpFill');
  const xpText = document.getElementById('xpText');
  const gh = document.getElementById('gh');
  const ln = document.getElementById('ln');
  const mail = document.getElementById('mail');
  gh.href = `https://github.com/${window.RN_CONTENT.contact.github}`;
  ln.href = `https://linkedin.com/in/${window.RN_CONTENT.contact.linkedin}`;
  mail.href = `mailto:${window.RN_CONTENT.contact.email}`;

  let XP = 0; const MAX_XP = 100;
  function gainXP(v){ XP = Math.min(MAX_XP, XP+v); xpFill.style.width = `${XP}%`; xpText.textContent = `${XP} / ${MAX_XP} XP`; showToast(`+${v} XP`); }

  // toast
  const toastEl = document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl);
  function showToast(msg){ toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(showToast._t); showToast._t = setTimeout(()=>toastEl.classList.remove('show'), 1800); }

  // input
  addEventListener('keydown', e=>{ if(e.repeat) return; player.onKey(e, true); });
  addEventListener('keyup',   e=> player.onKey(e, false));
  addEventListener('resize', ()=>{ camera.aspect = innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight, false); });

  // start screen
  const inst = document.getElementById('instructions');
  document.getElementById('startBtn').addEventListener('click', ()=>{ player.lock(); });
  player.controls.addEventListener('lock', ()=>{ inst.style.display='none'; });
  player.controls.addEventListener('unlock', ()=>{ inst.style.display='grid'; });

  // dynamic scenes data (placeholder)
  const activeScenes = new Map(); // id -> group
  function buildScene(id){
    const g = new THREE.Group(); g.name = `scene_${id}`;
    // placeholder content per zone
    switch(id){
      case 'intro': {
        g.add(pillar(0,1.2,0, 0x00d4ff)); g.add(holoPanel('Welcome', 'Explore to unlock content.')); break;
      }
      case 'projects': {
        window.RN_CONTENT.projects.forEach((p,i)=>{ const z=i*2.8; const panel=holoPanel(p.title, p.subtitle+` — ${p.tags.join(', ')}`); panel.position.set(-2+ (i%2)*4, 1.6, z); g.add(panel); });
        break;
      }
      case 'skills': {
        window.RN_CONTENT.skills.forEach((s,i)=>{ const m = meter(s.name, s.level/100, 0x7aa2ff); m.position.set((i-1.5)*3,1.4,0); g.add(m); });
        break;
      }
      case 'about': {
        g.add(holoPanel('About', window.RN_CONTENT.about)); break;
      }
      case 'contact': {
        const p = holoPanel('Contact', `${window.RN_CONTENT.contact.email}\nGitHub: @${window.RN_CONTENT.contact.github}\nLinkedIn: @${window.RN_CONTENT.contact.linkedin}`); g.add(p); break;
      }
    }
    scene.add(g); activeScenes.set(id,g);
  }
  function destroyScene(id){ const g = activeScenes.get(id); if(!g) return; scene.remove(g); g.traverse(n=>{ if(n.material && n.material.dispose) n.material.dispose(); if(n.geometry && n.geometry.dispose) n.geometry.dispose(); if(n.texture && n.texture.dispose) n.texture.dispose(); }); activeScenes.delete(id); }

  // helpers
  function pillar(x,y,z,color){ const m = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, 2.2, 24), new THREE.MeshStandardMaterial({color, emissive:color, emissiveIntensity:.2, metalness:.4, roughness:.25})); m.position.set(x,y,z); return m; }
  function holoPanel(title, body){ const g = new THREE.Group(); const p = new THREE.Mesh(new THREE.PlaneGeometry(2.8,1.4), new THREE.MeshBasicMaterial({color:0x0c1628, transparent:true, opacity:.7})); const b = new THREE.Mesh(new THREE.PlaneGeometry(2.82,1.44), new THREE.MeshBasicMaterial({color:0x00e5ff, transparent:true, opacity:.12})); b.position.z = -0.01; g.add(b); g.add(p); const tex = textTexture(`${title}\n`, '#cfe9ff', 22, 'bold'); const tex2 = textTexture(body, '#89a9c6', 16, 'normal'); const sp1 = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true})); sp1.scale.set(2.5,.5,1); sp1.position.set(0,.35,.01); g.add(sp1); const sp2 = new THREE.Sprite(new THREE.SpriteMaterial({map:tex2, transparent:true})); sp2.scale.set(2.5, .7,1); sp2.position.set(0,-.15,.01); g.add(sp2); return g; }
  function meter(name, frac, color){ const g = new THREE.Group(); const w=2.4; const bg = new THREE.Mesh(new THREE.PlaneGeometry(w,.2), new THREE.MeshBasicMaterial({color:0x0c1628, transparent:true, opacity:.6})); const fg = new THREE.Mesh(new THREE.PlaneGeometry(w*frac,.18), new THREE.MeshBasicMaterial({color})); fg.position.x = -(w/2) + (w*frac)/2; g.add(bg); g.add(fg); const label = new THREE.Sprite(new THREE.SpriteMaterial({map:textTexture(name, '#cfe9ff', 16, 'bold'), transparent:true})); label.scale.set(1.6,.35,1); label.position.set(0,.28,.01); g.add(label); return g; }
  function textTexture(text, color, size=22, weight='normal'){ const c=document.createElement('canvas'); c.width=512; c.height=256; const x=c.getContext('2d'); x.fillStyle='rgba(0,0,0,0)'; x.fillRect(0,0,c.width,c.height); x.fillStyle=color; x.font=`${weight} ${size}px Inter, Arial`; x.textAlign='center'; x.textBaseline='top'; const lines = String(text).split(/\n/); lines.forEach((ln,i)=> x.fillText(ln, c.width/2, 20 + i*(size+6))); const t = new THREE.CanvasTexture(c); t.anisotropy = renderer.capabilities.getMaxAnisotropy?.() || 8; return t; }

  // zone enter detection
  function checkZones(){
    const pos = player.controls.getObject().position;
    zoneMeshes.forEach((z,i)=>{
      const d = z.mesh.position.distanceTo(pos);
      const record = zones[i];
      if (d < 3.2 && !z.entered){
        z.entered = true; gainXP(record.onEnterXP || 5); buildScene(z.id); showToast(`${record.label} unlocked`);
      } else if (d >= 6.5 && z.entered){
        z.entered = false; destroyScene(z.id); // unload when far to keep memory low
      }
    });
  }

  // animation loop
  const clock = new THREE.Clock();
  function tick(){
    const dt = clock.getDelta();
    player.update(dt);

    // animate beacons
    const t = clock.elapsedTime; beacons.children.forEach((b,i)=>{ b.position.y = 2.6 + Math.sin(t + i)*.25; });

    checkZones();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();

  // welcome xp
  setTimeout(()=>{ gainXP(5); showToast('Welcome, Explorer'); }, 900);
})();
