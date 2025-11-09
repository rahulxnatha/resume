
// Google Sheets + xlsx fallback + detail registry

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQweOKrkGkkqFH_Qy1rstZU-ZvqmoYGcHv7eRkl-8kPeqHAs3jhFjU5X4MUE_MbLwYRjkxLp8yuyd0m/pub?output=csv";
const SHEET_XLSX_URL = SHEET_CSV_URL.replace("output=csv","output=xlsx");
const LOCAL_FALLBACK = "r...a.com.xlsx";

function escapeHTML(str){
  return String(str ?? "").replace(/[&<>"']/g, s=>{
    switch(s){
      case "&":return "&amp;";
      case "<":return "&lt;";
      case ">":return "&gt;";
      case '"':return "&quot;";
      case "'":return "&#39;";
      default:return s;
    }
  });
}

function softWrapTokens(str){
  let s = String(str ?? "");
  s = s.replace(/https:\/\/www\.linkedin\.com\/in(?!\[\[WBR\]\])/g,"https://www.linkedin.com/in[[WBR]]");
  s = s.replace(/https:\/\/linkedin\.com\/in(?!\[\[WBR\]\])/g,"https://linkedin.com/in[[WBR]]");
  s = s.replace(/https:\/\/www\.(?!\[\[WBR\]\])/g,"https://www.[[WBR]]");
  s = s.replace(/https:\/\/(?!\[\[WBR\]\])/g,"https://[[WBR]]");
  s = s.replace(/@gmail\.com(?!\[\[WBR\]\])/g,"[[WBR]]@gmail.com");
  return s;
}

function htmlWithSoftWraps(str){
  const withTokens = softWrapTokens(str);
  return escapeHTML(withTokens).replace(/\[\[WBR\]\]/g,"<wbr>");
}

function toBulletListHTML(desc){
  const norm = String(desc ?? "").replace(/\r\n/g,"\n").trim();
  if(!norm) return "";
  const segments = norm.split(/\n\s*\n/g);
  const items = [];
  for(let seg of segments){
    let t = seg.trim();
    if(!t) continue;
    t = t.replace(/^[\u2022•\-\*]+\s*/,"");
    items.push(`<li>${htmlWithSoftWraps(t)}</li>`);
  }
  if(!items.length) return "";
  return `<ul class="bullet-list">${items.join("")}</ul>`;
}

async function loadWorkbook() {
  try {
    const resp = await fetch(SHEET_XLSX_URL,{cache:"no-store"});
    if (!resp.ok) throw new Error("Remote XLSX not OK");
    const buf = await resp.arrayBuffer();
    return XLSX.read(buf,{type:"array"});
  } catch(e){
    console.warn("Remote sheet load failed, using local fallback:", e);
  }
  const resp2 = await fetch(LOCAL_FALLBACK);
  if(!resp2.ok) throw new Error("Local fallback xlsx not found");
  const buf2 = await resp2.arrayBuffer();
  return XLSX.read(buf2,{type:"array"});
}

function sheetRows(wb,name){
  const ws = wb.Sheets[name];
  if(!ws) return [];
  return XLSX.utils.sheet_to_json(ws,{defval:"",raw:false});
}

/* DETAIL REGISTRY */
const detailRegistry = {
  work:[], skill:[], certification:[], projects:[], contact:[]
};
const detailMap = new Map();
let currentSection = null;
let currentDetailId = null;

function registerDetail(section,title,briefHtml,fallbackHtml){
  if(!detailRegistry[section]) detailRegistry[section] = [];
  const id = section + "-" + detailRegistry[section].length;
  const item = {id,section,title:title||"Untitled",briefHtml, fallbackHtml};
  detailRegistry[section].push(item);
  detailMap.set(id,item);
  return id;
}

/* POPULATORS */

function populateHero(rows){
  if(!rows.length) return;
  const row = rows[0];
  const name = row.Name || "Rahul Natha";
  const title = row.Title || "";
  const tags = row.Tags || "";
  document.querySelector(".hero-name").textContent = name;
  if(title) document.querySelector(".hero-sub").textContent = title;
  if(tags) document.querySelector(".hero-chip-bottom span").textContent = tags;
}

function populateWork(rows){
  const container = document.getElementById("timeline-items");
  if(!container) return;
  container.innerHTML = "";
  rows.forEach(row=>{
    if(!row.Title) return;
    const join = row.Join || "";
    const exit = row.Exit || "";
    const org = row.Org || "";
    const type = row.Type || "";
    const desc = row.Description || "";
    const brief = row.Brief || "";
    const timeRange = (join && exit) ? `${join} – ${exit}` : (join || exit);

    const metaPieces = [];
    if(timeRange) metaPieces.push(`<div>${htmlWithSoftWraps(timeRange)}</div>`);
    if(org) metaPieces.push(`<div>${htmlWithSoftWraps(org)}</div>`);
    if(type) metaPieces.push(`<div>${htmlWithSoftWraps(type)}</div>`);

    const bulletHtmlRaw = toBulletListHTML(desc);
    const bodyHtml = bulletHtmlRaw || `<p>${htmlWithSoftWraps(desc)}</p>`;

    const itemEl = document.createElement("div");
    itemEl.className = "timeline-item";
    itemEl.innerHTML = `
      <div class="timeline-meta">
        ${metaPieces.join("")}
      </div>
      <div class="timeline-main">
        <div class="timeline-role"><b>${escapeHTML(row.Title)}</b></div>
        <div class="timeline-body">${bodyHtml}</div>
      </div>
    `;

    const detailId = registerDetail("work",row.Title,brief,bodyHtml);
    itemEl.dataset.detailId = detailId;
    container.appendChild(itemEl);
  });
}

function createSkillTile(row){
  const article = document.createElement("article");
  const title = row.Skill || row.Category || "Skill";
  const cat = row.Category || "";
  const desc = row.Description || "";
  const brief = row.Brief || "";
  const bodyHtml = htmlWithSoftWraps(desc);
  const detailId = registerDetail("skill",title,brief,bodyHtml);
  article.dataset.detailId = detailId;
  article.innerHTML = `
    <div class="article-bolt bl"></div>
    <div class="article-bolt br"></div>
    <h3>${escapeHTML(title)}</h3>
    <div class="meta-line">${htmlWithSoftWraps(cat)}</div>
    <div class="body">${bodyHtml}</div>
    <div class="tags">
      ${row.Skill ? `<span class="tag-pill">${htmlWithSoftWraps(row.Skill)}</span>` : ""}
    </div>
  `;
  return article;
}

function populateSkills(rows){
  const grid = document.getElementById("skills-grid");
  if(!grid) return;
  grid.innerHTML = "";
  rows.forEach(row=>{
    if(!row.Skill && !row.Category) return;
    grid.appendChild(createSkillTile(row));
  });
}

function createCertTile(row){
  const article = document.createElement("article");
  const title = row.Title || "Certification";
  const issuer = row.Issuer || "";
  const issue = row["Issue date"] || "";
  const valid = row.Validity || "";
  const verify = row.Verification || "";
  const desc = row.Description || "";
  const brief = row.Brief || "";
  const metaParts = [];
  if(issuer) metaParts.push(issuer);
  if(issue) metaParts.push(issue);
  if(valid) metaParts.push(valid);
  const meta = metaParts.join(" · ");
  const bodyHtml = htmlWithSoftWraps(desc);
  const detailId = registerDetail("certification",title,brief,bodyHtml);
  article.dataset.detailId = detailId;
  article.innerHTML = `
    <div class="article-bolt bl"></div>
    <div class="article-bolt br"></div>
    <h3>${escapeHTML(title)}</h3>
    <div class="meta-line">${htmlWithSoftWraps(meta)}</div>
    <div class="body">${bodyHtml}</div>
    <div class="tags">
      ${verify ? `<span class="tag-pill">Verification</span>` : ""}
    </div>
  `;
  return article;
}

function populateCerts(rows){
  const grid = document.getElementById("cert-grid");
  if(!grid) return;
  grid.innerHTML = "";
  rows.forEach(row=>{
    if(!row.Title) return;
    grid.appendChild(createCertTile(row));
  });
}

function createProjectTile(row){
  const article = document.createElement("article");
  const title = row.Title || "Project";
  const tools = row.Tools || "";
  const tech = row.Tech || "";
  const tags = row.Tags || "";
  const desc = row.Description || "";
  const brief = row.Brief || "";
  const meta = [tools,tech].filter(Boolean).join(" · ");
  const tagPieces = tags ? tags.split(/[·,]/).map(s=>s.trim()).filter(Boolean) : [];
  const bodyHtml = htmlWithSoftWraps(desc);
  const detailId = registerDetail("projects",title,brief,bodyHtml);
  article.dataset.detailId = detailId;
  article.innerHTML = `
    <div class="article-bolt bl"></div>
    <div class="article-bolt br"></div>
    <h3>${escapeHTML(title)}</h3>
    <div class="meta-line">${htmlWithSoftWraps(meta)}</div>
    <div class="body">${bodyHtml}</div>
    <div class="tags">
      ${tagPieces.map(t=>`<span class="tag-pill">${htmlWithSoftWraps(t)}</span>`).join("")}
    </div>
  `;
  return article;
}

function populateProjects(rows){
  const grid = document.getElementById("projects-grid");
  if(!grid) return;
  grid.innerHTML = "";
  rows.forEach(row=>{
    if(!row.Title) return;
    grid.appendChild(createProjectTile(row));
  });
}

function createContactTile(row){
  const article = document.createElement("article");
  const mode = row.Mode || "Contact";
  const addr = row.Address || "";
  const brief = row.Brief || "";
  let addrProcessed = addr;
  let href = "";
  if(addr.startsWith("http")){
    href = addr;
  }else if(addr.includes("@")){
    href = "mailto:" + addr;
  }
  addrProcessed = htmlWithSoftWraps(addrProcessed);
  let bodyHtml = addrProcessed;
  if(href){
    bodyHtml = `<a href="${escapeHTML(href)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;">${addrProcessed}</a>`;
  }
  const detailId = registerDetail("contact",mode,brief,bodyHtml);
  article.dataset.detailId = detailId;
  article.innerHTML = `
    <div class="article-bolt bl"></div>
    <div class="article-bolt br"></div>
    <h3>${escapeHTML(mode)}</h3>
    <div class="meta-line"></div>
    <div class="body">${bodyHtml}</div>
    <div class="tags"></div>
  `;
  return article;
}

function populateContact(rows){
  const grid = document.getElementById("contact-grid");
  if(!grid) return;
  grid.innerHTML = "";
  rows.forEach(row=>{
    if(!row.Mode && !row.Address) return;
    grid.appendChild(createContactTile(row));
  });
}

/* DETAILS PANE */
function initDetailsPane(){
  const pane = document.getElementById("details-pane");
  const titleEl = document.getElementById("details-title");
  const contentEl = document.getElementById("details-content");
  const btnMin = document.getElementById("details-min");
  const btnMax = document.getElementById("details-max");
  const btnClose = document.getElementById("details-close");
  const searchInput = document.getElementById("details-search");
  const dropdown = document.getElementById("details-dropdown");

  function renderDetailContent(item){
    titleEl.textContent = item.title.toUpperCase();
    let html = "";
    if(item.briefHtml && item.briefHtml.trim()){
      html = item.briefHtml;
    }else if(item.fallbackHtml && item.fallbackHtml.trim()){
      html = item.fallbackHtml;
    }else{
      html = `<p style="font-size:.85rem;opacity:.75;">No additional details yet.</p>`;
    }
    contentEl.innerHTML = html;
  }

  function allItems(){
    const all = [];
    Object.values(detailRegistry).forEach(list=>list.forEach(it=>all.push(it)));
    return all;
  }

  function renderDropdown(filterText){
    const list = allItems();
    const q = (filterText||"").toLowerCase();
    let matches = list;
    if(q){
      matches = list.filter(it=>it.title.toLowerCase().includes(q));
    }
    if(!matches.length){
      dropdown.innerHTML = `<div class="details-option-empty">The searched content is currently unavailable.</div>`;
    }else{
      dropdown.innerHTML = matches.map(it=>(
        `<div class="details-option" data-detail-id="${it.id}">${escapeHTML(it.title)}</div>`
      )).join("");
    }
    dropdown.classList.add("open");
  }

  function openDetails(id){
    const item = detailMap.get(id);
    if(!item) return;
    currentDetailId = id;
    currentSection = item.section;
    pane.classList.add("open");
    pane.classList.remove("minimized"); // keep maximized if already set
    searchInput.value = item.title;
    renderDetailContent(item);
  }

  document.addEventListener("click",e=>{
    const target = e.target.closest("[data-detail-id]");
    if(target){
      openDetails(target.dataset.detailId);
    }
  });

  dropdown.addEventListener("click",e=>{
    const opt = e.target.closest(".details-option");
    if(!opt) return;
    openDetails(opt.dataset.detailId);
    dropdown.classList.remove("open");
  });

  searchInput.addEventListener("focus",()=>{
    renderDropdown(searchInput.value.trim());
  });
  searchInput.addEventListener("input",()=>{
    renderDropdown(searchInput.value.trim());
  });
  searchInput.addEventListener("blur",()=>{
    setTimeout(()=>dropdown.classList.remove("open"),150);
  });
  searchInput.addEventListener("keydown",e=>{
    if(e.key==="Enter"){
      e.preventDefault();
      const list = allItems();
      const q = searchInput.value.trim().toLowerCase();
      const match = list.find(it=>it.title.toLowerCase().includes(q));
      if(match){
        openDetails(match.id);
      }else{
        dropdown.classList.remove("open");
        contentEl.innerHTML = `<p style="font-size:.85rem;opacity:.75;">The searched content is currently unavailable.</p>`;
      }
    }
  });

  btnClose.addEventListener("click",()=>{
    pane.classList.remove("open","minimized","maximized");
  });
  btnMin.addEventListener("click",()=>{
    if(!pane.classList.contains("open")) pane.classList.add("open");
    pane.classList.toggle("minimized");
    pane.classList.remove("maximized");
  });
  btnMax.addEventListener("click",()=>{
    if(!pane.classList.contains("open")) pane.classList.add("open");
    pane.classList.toggle("maximized");
  });
}

/* REVEAL */
function initReveal(){
  const reveals = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    }
  },{threshold:0.16});
  reveals.forEach(el=>io.observe(el));
}

(async function initData(){
  initReveal();
  try{
    const wb = await loadWorkbook();
    const heroRows = sheetRows(wb,"hero");
    const workRows = sheetRows(wb,"work");
    const skillRows = sheetRows(wb,"skill");
    const certRows = sheetRows(wb,"certification");
    const projectRows = sheetRows(wb,"projects");
    const contactRows = sheetRows(wb,"contact");

    populateHero(heroRows);
    populateWork(workRows);
    populateSkills(skillRows);
    populateCerts(certRows);
    populateProjects(projectRows);
    populateContact(contactRows);
  }catch(e){
    console.error("Failed to load sheet data:",e);
  }
  initDetailsPane();
})();
