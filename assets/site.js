// guava.ventures: runs the two styles (Guava sky from assets/guava-sky.js, unchanged from the brand kit, and Normal) and builds the Appearance sheet.
import { GUAVA_CSS, applyGuavaSky, playDay, guavaSky, reach, LOOKS, FONTS, CITIES, sunTimes, fmtHour, deviceTz } from "./guava-sky.js";

const KEY = "guava-theme", VARS_KEY = "guava-sky-vars";
const DEFAULTS = { style: "guava", mode: "system", look: "guava", font: "clean", city: null, cycle: true, freeze: 12, sunSpot: "glow" };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
let saved = Object.assign({}, DEFAULTS);
try { saved = Object.assign(saved, JSON.parse(store.get(KEY) || "{}")); } catch (e) {}
let preview = null;
const settings = () => preview == null ? saved : Object.assign({}, saved, { at: preview });

const root = document.documentElement;
// Normal style: one quiet solid ground (warm ivory or charcoal). The sky never writes variables in it.
const NORMAL = {
  light: { "--ground": "#FAF9F5", "--panel": "#FFFFFF", "--ink": "#141413", "--ink-soft": "#5E5D59", "--ink-faint": "#87867F", "--rule": "#E8E6DC", "--rule-strong": "#D1CFC5", "--hero-bg": "#F0EEE6", "--hero-on": "#141413" },
  dark: { "--ground": "#1F1E1D", "--panel": "#262624", "--ink": "#FAF9F5", "--ink-soft": "#C2C0B6", "--ink-faint": "#9C9A92", "--rule": "#3A3936", "--rule-strong": "#4A4844", "--hero-bg": "#30302E", "--hero-on": "#FAF9F5" }
};
const systemDark = matchMedia("(prefers-color-scheme: dark)");
const normalScheme = () => saved.mode === "dark" || (saved.mode !== "light" && systemDark.matches) ? "dark" : "light";
function normalState() {
  const scheme = normalScheme(), n = NORMAL[scheme];
  const base = guavaSky({ look: "guava", font: saved.font, cycle: false, freeze: scheme === "light" ? 13 : 0 });
  const v = Object.assign({}, base.vars, n, { "--panel-glass": n["--panel"], "--sun-o": "0" });
  ["--art1", "--art2", "--art3", "--art4", "--g1", "--g2", "--g3"].forEach(k => { v[k] = n["--ground"]; });
  const fit = (k, ratio) => { if (/^#[0-9a-f]{6}$/i.test(v[k] || "")) v[k] = reach(reach(v[k], n["--ground"], ratio), n["--panel"], ratio); };
  ["--accent", "--good", "--signal", "--bad"].forEach(k => fit(k, 4.5));
  for (let i = 1; i <= 9; i++) fit("--c" + i, 3);
  for (let i = 1; i <= 8; i++) fit("--cx" + i, 3);
  return { style: "normal", scheme, font: base.font, vars: v };
}
function applyNormal() {
  const s = normalState();
  Object.keys(s.vars).forEach(k => root.style.setProperty(k, s.vars[k]));
  root.dataset.theme = s.scheme; root.dataset.sun = "off"; root.style.colorScheme = s.scheme;
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.setAttribute("content", s.vars["--ground"]));
  let link = document.getElementById("guava-font");
  const href = "https://fonts.googleapis.com/css2?" + FONTS[s.font].google + "&display=swap";
  if (!link) { link = document.createElement("link"); link.id = "guava-font"; link.rel = "stylesheet"; document.head.appendChild(link); }
  if (link.getAttribute("href") !== href) link.setAttribute("href", href);
  return s;
}
// Applies the saved style; the sky only runs in Guava style.
function refresh() {
  const normal = saved.style === "normal";
  root.dataset.style = normal ? "normal" : "guava";
  const s = normal ? applyNormal() : applyGuavaSky(root, settings());
  store.set(VARS_KEY, JSON.stringify({ v: s.vars, t: s.scheme, s: root.dataset.style }));
  return s;
}
if (!document.getElementById("guava-sky-css")) {
  const st = document.createElement("style"); st.id = "guava-sky-css"; st.textContent = GUAVA_CSS; document.head.appendChild(st);
}
let backdrop = document.getElementById("backdrop");
if (!backdrop) { backdrop = document.createElement("div"); backdrop.id = "backdrop"; backdrop.setAttribute("aria-hidden", "true"); document.body.prepend(backdrop); }
if (!backdrop.querySelector(".sun")) { const i = document.createElement("i"); i.className = "sun"; backdrop.appendChild(i); }
refresh();
setInterval(() => { if (saved.style !== "normal") refresh(); }, 5 * 60000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
systemDark.addEventListener("change", () => { if (saved.style === "normal" && saved.mode === "system") refresh(); });

// Numbers and labels use DM Mono; the brand face (Plus Jakarta Sans) and the chosen one are loaded by the engine.
if (!document.getElementById("site-mono")) {
  const l = document.createElement("link"); l.id = "site-mono"; l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400&family=Newsreader:ital,opsz,wght@1,6..72,400&display=swap";
  document.head.appendChild(l);
}

// Frost the header once the page scrolls.
const onScroll = () => document.body.classList.toggle("scrolled", scrollY > 4);
addEventListener("scroll", onScroll, { passive: true }); onScroll();

// Reveal sections as they arrive.
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach(el => io.observe(el));
} else reveals.forEach(el => el.classList.add("in"));

// ---------- Appearance ----------
const btn = document.getElementById("appearance-btn");
if (btn) buildAppearance(btn);

function phoneHTML() {
  return `<div class="phone" aria-hidden="true"><div class="phone-screen">
    <div class="status"><span data-clock>9:41</span><span>●●●</span></div>
    <div style="font-size:24px;font-weight:800;letter-spacing:-.02em;padding:0 4px;font-family:var(--f-display)">Today</div>
    <div class="hero-card"><p class="mono" style="font-size:11px;text-transform:uppercase;letter-spacing:.06em;opacity:.85">Safe to spend</p><p style="font-size:28px;font-weight:800;font-family:var(--f-display)">$1,240</p>
      <div class="freq" style="margin-top:8px;height:6px;background:rgba(255,255,255,.35)"><i style="width:62%;background:currentColor;border-radius:999px"></i></div></div>
    <div class="glassrow"><span class="tile" style="background:var(--c1-fill);color:var(--c1-on)">R</span>Rent<span class="mono" style="margin-left:auto;color:var(--ink-soft)">Fri</span></div>
    <div class="glassrow"><span class="tile" style="background:var(--c4-fill);color:var(--c4-on)">S</span>Text Sam<span class="mono" style="margin-left:auto;color:var(--ink-soft)">3 wk</span></div>
    <div class="glassrow"><span class="tile" style="background:var(--c3-fill);color:var(--c3-on)">G</span>Gym renews<span class="mono" style="margin-left:auto;color:var(--ink-soft)">4 d</span></div>
    <div class="tabbar"><span class="on">Today</span><span>Diary</span><span>Money</span><span>People</span><span>Life</span></div>
  </div></div>`;
}

function swatch(lookId, at) {
  const v = guavaSky(Object.assign({}, saved, { look: lookId, at })).vars;
  return `radial-gradient(90% 70% at ${v["--sun-x"]} 0%, ${v["--art1"]} 0%, transparent 70%), radial-gradient(80% 70% at 95% 40%, ${v["--art2"]} 0%, transparent 72%), radial-gradient(90% 70% at 5% 100%, ${v["--art3"]} 0%, transparent 72%), radial-gradient(80% 60% at 95% 100%, ${v["--art4"]} 0%, transparent 70%), ${v["--ground"]}`;
}

function buildAppearance(button) {
  const scrim = document.createElement("div"); scrim.className = "sheet-scrim";
  const sheet = document.createElement("aside");
  sheet.className = "sheet glass-sheet"; sheet.setAttribute("role", "dialog"); sheet.setAttribute("aria-modal", "true"); sheet.setAttribute("aria-labelledby", "ap-title"); sheet.hidden = true;
  sheet.innerHTML = `
    <div class="sheet-head"><h2 id="ap-title" class="h3">Appearance</h2>
      <button class="icon-btn" type="button" data-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
    <div class="sheet-body">
      <div class="preview">${phoneHTML()}</div>
      <div class="style-cell" role="radiogroup" aria-label="Style">
        <button type="button" role="radio" data-style="guava"><span class="mini mini-sky"></span>Guava</button>
        <button type="button" role="radio" data-style="normal"><span class="mini mini-normal"></span>Normal</button>
      </div>
      <section data-only="guava"><h3>Look</h3><div class="looks" data-looks></div></section>
      <section data-only="normal"><div class="seg" role="radiogroup" aria-label="Light or dark">
        <button type="button" role="radio" data-mode="light">Light</button><button type="button" role="radio" data-mode="dark">Dark</button><button type="button" role="radio" data-mode="system">System</button></div></section>
      <section><h3>Text</h3><div class="fonts" data-fonts></div></section>
      <div class="card set-row" data-only="guava"><span class="k" id="cyc-l">Change through the day</span><button class="switch" type="button" role="switch" data-cycle aria-labelledby="cyc-l"></button></div>
      <div class="card timeline" data-only="guava">
        <div class="top"><span data-tl-label>Preview a time</span><b data-tl-val></b></div>
        <input type="range" min="0" max="23.75" step="0.25" data-hour aria-label="Time of day">
        <div class="marks"><span>12am</span><span>6am</span><span>Noon</span><span>6pm</span><span>12am</span></div>
        <div class="foot"><button class="btn btn-glass btn-sm" type="button" data-play>Play the day</button></div>
      </div>
      <div class="card" style="padding:0" data-only="guava">
        <div class="set-row"><div><div class="k">City</div><div class="v" data-city-v></div></div><button class="btn btn-glass btn-sm" type="button" data-city-btn aria-expanded="false">Change</button></div>
        <div class="city-list" data-city-list>
          <div class="chips"><button type="button" data-loc>Use my location</button><button type="button" data-tz>Use my time zone</button></div>
          <input type="search" placeholder="Search cities" data-city-q aria-label="Search cities">
          <div class="chips" data-city-chips></div>
          <div class="city-msg" data-city-msg></div>
        </div>
      </div>
    </div>`;
  const play = document.createElement("div");
  play.className = "play"; play.setAttribute("role", "dialog"); play.setAttribute("aria-label", "Play the day");
  play.innerHTML = `<button class="icon-btn play-close" type="button" data-play-close aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <div class="play-inner">${phoneHTML()}<div class="daybar"><div class="track"><div class="fill"></div><div class="knob"></div></div>
    <div class="marks"><span>12am</span><span>6am</span><span>Noon</span><span>6pm</span><span>12am</span></div><div class="now" data-play-now></div></div></div>`;
  document.body.append(scrim, sheet, play);

  const $ = s => sheet.querySelector(s);
  const looksEl = $("[data-looks]"), fontsEl = $("[data-fonts]"), hour = $("[data-hour]");
  LOOKS.forEach(l => {
    const b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.dataset.look = l.id;
    b.innerHTML = `<span class="sw"></span><span class="nm">${l.label}</span><span class="tg">${l.tag}</span>`;
    b.onclick = () => save({ look: l.id }); looksEl.appendChild(b);
  });
  Object.entries(FONTS).forEach(([id, f]) => {
    const b = document.createElement("button"); b.type = "button"; b.className = "opt"; b.dataset.font = id;
    b.innerHTML = `<span class="aa" style="font-family:'${f.family}',${f.fallback}">Aa</span><span class="nm" style="font-family:'${f.family}',${f.fallback}">${f.label}</span><span class="tg">${f.family}</span>`;
    b.onclick = () => save({ font: id }); fontsEl.appendChild(b);
  });

  let lastMoment = null, back = 0, cancelPlay = null;
  function show() {
    const normal = saved.style === "normal";
    sheet.querySelectorAll("[data-style]").forEach(b => b.setAttribute("aria-checked", String(b.dataset.style === (normal ? "normal" : "guava"))));
    sheet.querySelectorAll("[data-mode]").forEach(b => b.setAttribute("aria-checked", String(b.dataset.mode === saved.mode)));
    sheet.querySelectorAll("[data-only]").forEach(el => { el.hidden = el.dataset.only !== (normal ? "normal" : "guava"); });
    sheet.querySelector(".mini-sky").style.background = swatch(saved.look, guavaSky(saved).localHour);
    fontsEl.querySelectorAll(".opt").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.font === saved.font)));
    if (normal) { refresh(); document.querySelectorAll("[data-clock]").forEach(c => { c.textContent = fmtHour(new Date().getHours() + new Date().getMinutes() / 60); }); return null; }
    const s = refresh();
    looksEl.querySelectorAll(".opt").forEach(b => { b.setAttribute("aria-pressed", String(b.dataset.look === saved.look)); b.querySelector(".sw").style.background = swatch(b.dataset.look, s.localHour); });
    $("[data-cycle]").setAttribute("aria-checked", String(saved.cycle));
    $("[data-tl-label]").textContent = saved.cycle ? "Preview a time" : "Stick to";
    $("[data-tl-val]").textContent = fmtHour(s.localHour) + " · " + s.palette;
    if (document.activeElement !== hour) hour.value = String(Math.round(s.localHour * 4) / 4);
    document.querySelectorAll("[data-clock]").forEach(c => { c.textContent = fmtHour(s.localHour); });
    const st = sunTimes(s.place);
    const where = s.place.name + (saved.city ? "" : " (your time zone)");
    $("[data-city-v]").textContent = where + ". " + (st.polar === "day" ? "The sun stays up all day today" : st.polar === "night" ? "The sun stays down all day today" : "Sunrise " + fmtHour(st.rise) + ", sunset " + fmtHour(st.set));
    return s;
  }
  function save(patch) { saved = Object.assign({}, saved, patch); store.set(KEY, JSON.stringify(saved)); show(); }

  sheet.querySelectorAll("[data-style]").forEach(b => { b.onclick = () => { preview = null; save({ style: b.dataset.style }); }; });
  sheet.querySelectorAll("[data-mode]").forEach(b => { b.onclick = () => save({ mode: b.dataset.mode }); });
  $("[data-cycle]").onclick = () => { preview = null; save({ cycle: !saved.cycle }); };
  hour.oninput = () => {
    clearTimeout(back); preview = +hour.value; const s = show();
    if (lastMoment && s.palette !== lastMoment && navigator.vibrate) navigator.vibrate(8);
    lastMoment = s.palette;
  };
  hour.onchange = () => {
    if (!saved.cycle) { preview = null; save({ freeze: +hour.value }); }
    else back = setTimeout(() => { preview = null; show(); }, 1500);
  };

  // City.
  const list = $("[data-city-list]"), chips = $("[data-city-chips]"), msg = $("[data-city-msg]");
  const renderCities = q => {
    q = (q || "").trim().toLowerCase();
    const found = CITIES.filter(c => !q || c.name.toLowerCase().includes(q)).slice(0, q ? 24 : 12);
    chips.innerHTML = ""; msg.textContent = found.length ? "" : "No match. Try the nearest big city.";
    found.forEach(c => { const b = document.createElement("button"); b.type = "button"; b.textContent = c.name; b.onclick = () => { save({ city: c }); toggleCity(false); }; chips.appendChild(b); });
  };
  const toggleCity = open => { list.classList.toggle("open", open); $("[data-city-btn]").setAttribute("aria-expanded", String(open)); if (open) renderCities($("[data-city-q]").value); };
  $("[data-city-btn]").onclick = () => toggleCity(!list.classList.contains("open"));
  $("[data-city-q]").oninput = e => renderCities(e.target.value);
  $("[data-tz]").onclick = () => { save({ city: null }); toggleCity(false); };
  $("[data-loc]").onclick = () => {
    if (!navigator.geolocation) { msg.textContent = "Location is off for this app. Pick a city instead."; return; }
    navigator.geolocation.getCurrentPosition(p => {
      const r = x => Math.round(x * 10) / 10;
      save({ city: { name: "My location", lat: r(p.coords.latitude), lon: r(p.coords.longitude), tz: deviceTz() } }); toggleCity(false);
    }, () => { msg.textContent = "Location is off for this app. Pick a city instead."; }, { maximumAge: 36e5, timeout: 10000 });
  };

  // Play the day.
  const fill = play.querySelector(".fill"), knob = play.querySelector(".knob"), now = play.querySelector("[data-play-now]"), pbtn = $("[data-play]");
  const stopPlay = () => { if (cancelPlay) cancelPlay(); };
  pbtn.onclick = () => {
    if (cancelPlay) { stopPlay(); return; }
    play.classList.add("open"); pbtn.textContent = "Stop";
    cancelPlay = playDay(root, settings(), {
      onHour: (h, s) => { const pct = (h / 24 * 100) + "%"; fill.style.width = pct; knob.style.left = pct; now.textContent = fmtHour(h) + " · " + s.palette;
        play.querySelectorAll("[data-clock]").forEach(c => { c.textContent = fmtHour(h); }); },
      onDone: () => { cancelPlay = null; play.classList.remove("open"); pbtn.textContent = "Play the day"; show(); }
    });
  };
  play.addEventListener("click", e => { if (e.target === play || e.target.closest("[data-play-close]")) stopPlay(); });

  // Open and close.
  let fontsLoaded = false;
  const open = () => {
    if (!fontsLoaded) {
      fontsLoaded = true; const l = document.createElement("link"); l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?" + Object.values(FONTS).map(f => f.google).join("&") + "&display=swap"; document.head.appendChild(l);
    }
    sheet.hidden = false; requestAnimationFrame(() => { sheet.classList.add("open"); scrim.classList.add("open"); });
    button.setAttribute("aria-expanded", "true"); show(); $("[data-close]").focus();
  };
  const close = () => {
    sheet.classList.remove("open"); scrim.classList.remove("open"); button.setAttribute("aria-expanded", "false");
    setTimeout(() => { if (!sheet.classList.contains("open")) sheet.hidden = true; }, 300); button.focus();
  };
  button.onclick = () => (sheet.classList.contains("open") ? close() : open());
  scrim.onclick = close; $("[data-close]").onclick = close;
  addEventListener("keydown", e => { if (e.key !== "Escape") return; if (cancelPlay) stopPlay(); else if (sheet.classList.contains("open")) close(); });
  setInterval(() => { if (sheet.classList.contains("open") && preview == null && !cancelPlay) show(); }, 60000);
  systemDark.addEventListener("change", () => { if (sheet.classList.contains("open")) show(); });
}
