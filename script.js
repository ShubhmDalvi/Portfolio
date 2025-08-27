// particles.js config
particlesJS('particles-js', {
  particles: {
    number: { value: 70, density: { enable: true, value_area: 900 } },
    color: { value: ['#ffffff', '#22d3ee', '#a78bfa'] },
    shape: { type: 'circle', stroke: { width: 0, color: '#000' } },
    opacity: { value: 0.55, random: true, anim: { enable: true, speed: 1, opacity_min: 0.2, sync: false } },
    size: { value: 3, random: true, anim: { enable: true, speed: 2.5, size_min: 0.1, sync: false } },
    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.35, width: 1 },
    move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
  },
  interactivity: {
    detect_on: 'canvas',
    events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
    modes: { grab: { distance: 140, line_linked: { opacity: 0.7 } }, push: { particles_nb: 4 } }
  },
  retina_detect: true
});

/* -------------------- Loader: random fake snippet -------------------- */
const loader = document.getElementById('loader');
const loaderCode = document.getElementById('loaderCode');
const loaderTitle = document.getElementById('loaderTitle');

const snippets = [
`// warming up modules…
const launchPortfolio = async () => {
  await new Promise(r => setTimeout(r, 256));
  const ship = (x) => console.log("🚀", x);
  ship("UI mounted"); return true;
};
launchPortfolio();`,

`/* compiling vibes… */
function boot(seq = 0){
  const steps = ["Shaders","Particles","UI"];
  while(seq < steps.length){ console.log("✓", steps[seq++]); }
  return "OK";
}
boot();`,

`# initializing graph…
class Node { constructor(v){ this.v = v; } }
const g = [new Node("skills"), new Node("projects")];
console.log("connected:", g.length, "nodes");`,

`// de-flaking tests…
const tests = ["lint","types","e2e"];
tests.forEach(t => console.log("•", t, "pass"));`,

`// pinging creativity server…
(async ()=>{
  const ok = await fetch("about:blank").catch(()=>({ok:true}));
  console.log("creative=", !!ok);
})();`
];

const titles = ["bootstrapping_","hydrating_","compiling_","warming-up_","linking_"];

function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }
if (loaderCode) loaderCode.textContent = pick(snippets);
if (loaderTitle) loaderTitle.innerHTML = pick(titles) + '<span class="blink">_</span>';

const hideLoader = () => loader && loader.classList.add('hidden');
window.addEventListener('load', () => { setTimeout(hideLoader, 1800); });
setTimeout(hideLoader, 3200); // safety

/* -------------------- Toggles -------------------- */
const projectsToggle = document.getElementById('projectsToggle');
const projectsContent = document.getElementById('projectsContent');
const aboutToggle = document.getElementById('aboutToggle');
const aboutContent = document.getElementById('aboutContent');

projectsToggle?.addEventListener('click', () => {
  const open = projectsContent.classList.toggle('open');
  projectsContent.hidden = !open;
  projectsToggle.setAttribute('aria-expanded', String(open));
  projectsToggle.innerHTML = open
    ? 'Hide Projects <i class="fa-solid fa-chevron-up" id="chevron"></i>'
    : 'View Projects <i class="fa-solid fa-chevron-down" id="chevron"></i>';
});

aboutToggle?.addEventListener('click', () => {
  const open = aboutContent.classList.toggle('open');
  aboutContent.hidden = !open;
  aboutToggle.setAttribute('aria-expanded', String(open));
});

/* -------------------- Whole-card subtle 3D tilt -------------------- */
/* We drive transform via CSS variables to avoid clashing with other transforms. */
(function enableWholeCardTilt(){
  const card = document.querySelector('.content');
  if (!card) return;

  // Disable on touch devices or reduced motion
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReduced) return;

  const maxTilt = 8;         // degrees
  const scaleOnHover = 1.01; // subtle scale
  let rect = null;
  let raf = null;

  const setVars = (rx, ry, sc) => {
    card.style.setProperty('--rx', rx + 'deg');
    card.style.setProperty('--ry', ry + 'deg');
    card.style.setProperty('--scale', sc);
  };

  const onEnter = () => { rect = card.getBoundingClientRect(); setVars(0, 0, scaleOnHover); };
  const onLeave = () => { setVars(0, 0, 1); };

  const onMove = (ev) => {
    if (!rect) rect = card.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;
    const rx = Math.max(-maxTilt, Math.min(maxTilt, (-py * 2) * maxTilt));
    const ry = Math.max(-maxTilt, Math.min(maxTilt, ( px * 2) * maxTilt));
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(()=> setVars(rx, ry, scaleOnHover));
  };

  card.addEventListener('mouseenter', onEnter);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', onLeave);
  window.addEventListener('scroll', ()=> rect = null, { passive:true });
  window.addEventListener('resize', ()=> rect = null);
  window.addEventListener('blur', onLeave);
})();

/* -------------------- Removed:
   - document-wide parallax translate
   - per-project-card tilt
   (as requested)
*/

/* -------------------- Typing effect for roles -------------------- */
const roles = ["Problem Solver", "Bug Hunter", "Pixel Perfectionist", "Clean Coder"];
const typedEl = document.getElementById('typed');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop(){
  const current = roles[roleIdx];
  if(!deleting){
    charIdx++;
    if (typedEl) typedEl.textContent = current.slice(0, charIdx);
    if(charIdx === current.length){
      deleting = true;
      setTimeout(typeLoop, 1200);
      return;
    }
  }else{
    charIdx--;
    if (typedEl) typedEl.textContent = current.slice(0, charIdx);
    if(charIdx === 0){
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  const speed = deleting ? 45 : 80;
  setTimeout(typeLoop, speed + Math.random()*60);
}
typeLoop();
