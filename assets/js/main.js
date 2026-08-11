import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('#space');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02030a, 0.00215);
const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 1300);
camera.position.set(0, 72, 170);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = .055;
controls.minDistance = 45;
controls.maxDistance = 390;
controls.maxPolarAngle = Math.PI * .82;
controls.target.set(0, 0, 0);

scene.add(new THREE.AmbientLight(0x90a4c7, .38));
const sunLight = new THREE.PointLight(0xffffff, 650, 420, 1.35);
scene.add(sunLight);

const starsGeo = new THREE.BufferGeometry();
const starCount = innerWidth < 700 ? 1800 : 3600;
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 140 + Math.random() * 510, theta = Math.random() * Math.PI * 2, phi = Math.acos(2 * Math.random() - 1);
  starPositions[i*3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i*3+1] = r * Math.cos(phi);
  starPositions[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  const tint = Math.random(); starColors.set(tint > .82 ? [0.45,.85,1] : tint < .12 ? [1,.72,.55] : [.75,.79,.9], i*3);
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
starsGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ size:.75, transparent:true, opacity:.76, vertexColors:true, sizeAttenuation:true })));

function atmosphereTexture(){
  const c=document.createElement('canvas'); c.width=c.height=256; const x=c.getContext('2d');
  const g=x.createRadialGradient(128,128,8,128,128,128); g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.18,'rgba(105,238,255,.9)');g.addColorStop(.52,'rgba(70,95,255,.18)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c);
}

const core = new THREE.Group(); scene.add(core);
const sun = new THREE.Mesh(new THREE.SphereGeometry(13,64,64), new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x7edcff,emissiveIntensity:2.5,roughness:.4}));core.add(sun);
for(const s of [32,43]) {
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({map:atmosphereTexture(),color:s===32?0x77eaff:0xa976ff,transparent:true,opacity:s===32?.75:.22,blending:THREE.AdditiveBlending,depthWrite:false}));
  glow.scale.set(s,s,s);
  core.add(glow);
}

const logoTex = new THREE.TextureLoader().load('assets/images/logo.png');
logoTex.colorSpace = THREE.SRGBColorSpace;
const logo = new THREE.Sprite(new THREE.SpriteMaterial({map:logoTex,transparent:true,depthTest:false})); logo.scale.set(21,21,1); logo.position.z=13.2; core.add(logo);

const data = [
  {name:'Merkurius',radius:20,size:1.45,speed:.009,color:0x9b9289,distance:'57,9 juta km',year:'88 hari',desc:'Planet terkecil dan paling dekat dengan Matahari, dengan perubahan suhu yang ekstrem.'},
  {name:'Venus',radius:28,size:2.35,speed:.0067,color:0xd8a65d,distance:'108,2 juta km',year:'225 hari',desc:'Dunia berbatu berselimut awan tebal, sering terlihat paling terang dari Bumi.'},
  {name:'Bumi',radius:37,size:2.55,speed:.0054,color:0x268ee8,distance:'149,6 juta km',year:'365 hari',desc:'Planet biru, rumah bagi kehidupan dengan lautan luas dan atmosfer pelindung.'},
  {name:'Mars',radius:47,size:1.85,speed:.0043,color:0xc75531,distance:'227,9 juta km',year:'687 hari',desc:'Planet merah dengan gunung berapi raksasa dan jejak aliran air purba.'},
  {name:'Jupiter',radius:64,size:6.3,speed:.0024,color:0xc8a67f,distance:'778,5 juta km',year:'11,9 tahun',desc:'Raksasa gas terbesar, terkenal dengan badai besar dan puluhan bulan.'},
  {name:'Saturnus',radius:83,size:5.45,speed:.00175,color:0xd6bd7b,distance:'1,43 miliar km',year:'29,5 tahun',desc:'Raksasa gas dengan sistem cincin es dan batu paling ikonik.'},
  {name:'Uranus',radius:101,size:3.55,speed:.0013,color:0x75d6df,distance:'2,87 miliar km',year:'84 tahun',desc:'Planet es biru pucat yang berotasi hampir menyamping.'},
  {name:'Neptunus',radius:117,size:3.4,speed:.001,color:0x345bcc,distance:'4,50 miliar km',year:'164,8 tahun',desc:'Planet terjauh dengan angin tercepat di seluruh tata surya.'}
];
const planetMeshes=[];
const orbitMaterial=new THREE.LineBasicMaterial({color:0x7180a0,transparent:true,opacity:.19});

function planetMaterial(color,seed){
  const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle='#'+color.toString(16).padStart(6,'0');x.fillRect(0,0,512,256);
  for(let i=0;i<90;i++){x.globalAlpha=.03+Math.random()*.08;x.fillStyle=i%2?'#fff':'#050710';x.beginPath();x.ellipse(Math.random()*512,Math.random()*256,20+Math.random()*100,1+Math.random()*10,Math.random()*.1,0,Math.PI*2);x.fill()}
  x.globalAlpha=1;const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;return new THREE.MeshStandardMaterial({map:t,roughness:.84,metalness:.03});
}

data.forEach((p,i)=>{
  const curve=new THREE.EllipseCurve(0,0,p.radius,p.radius,0,Math.PI*2);const pts=curve.getPoints(160).map(v=>new THREE.Vector3(v.x,0,v.y));scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),orbitMaterial));
  const pivot=new THREE.Group();scene.add(pivot);pivot.rotation.y=i*.82;
  const mesh=new THREE.Mesh(new THREE.SphereGeometry(p.size,32,32),planetMaterial(p.color,i));mesh.position.x=p.radius;mesh.userData={index:i};pivot.add(mesh);
  if(p.name==='Saturnus'){const ring=new THREE.Mesh(new THREE.RingGeometry(p.size*1.35,p.size*2.05,72),new THREE.MeshBasicMaterial({color:0xd8c797,side:THREE.DoubleSide,transparent:true,opacity:.72}));ring.rotation.x=Math.PI/2.25;mesh.add(ring)}
  planetMeshes.push({mesh,pivot,data:p});
});

const nav=document.querySelector('#planet-nav');
data.forEach((p,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0');b.title=p.name;b.setAttribute('aria-label','Fokus ke '+p.name);b.onclick=()=>focusPlanet(i);nav.appendChild(b)});
const panel=document.querySelector('#planet-panel'), raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
let running=true,selected=-1,targetPosition=null;
function showInfo(i){const p=data[i];document.querySelector('#planet-index').textContent=`PLANET ${String(i+1).padStart(2,'0')}`;document.querySelector('#planet-name').textContent=p.name.toUpperCase();document.querySelector('#planet-description').textContent=p.desc;document.querySelector('#planet-distance').textContent=p.distance;document.querySelector('#planet-year').textContent=p.year;panel.classList.add('open');[...nav.children].forEach((b,n)=>b.classList.toggle('active',n===i));selected=i}
function focusPlanet(i){showInfo(i);const pos=new THREE.Vector3();planetMeshes[i].mesh.getWorldPosition(pos);controls.target.copy(pos);const dir=camera.position.clone().sub(pos).normalize();targetPosition=pos.clone().add(dir.multiplyScalar(Math.max(15,data[i].size*6)))}
canvas.addEventListener('pointerup',e=>{if(Math.abs(e.movementX)>3||Math.abs(e.movementY)>3)return;pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(planetMeshes.map(x=>x.mesh))[0];if(hit)focusPlanet(hit.object.userData.index)});
document.querySelector('#close-panel').onclick=()=>{panel.classList.remove('open');[...nav.children].forEach(b=>b.classList.remove('active'));selected=-1};
document.querySelector('#reset-view').onclick=()=>{panel.classList.remove('open');controls.target.set(0,0,0);targetPosition=new THREE.Vector3(0,72,170);selected=-1};
document.querySelector('#toggle-motion').onclick=e=>{running=!running;e.currentTarget.textContent=running?'❚❚ JEDA ORBIT':'▶ LANJUTKAN ORBIT'};

const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const d=Math.min(clock.getDelta(),.04);if(running)planetMeshes.forEach((x,i)=>{x.pivot.rotation.y+=x.data.speed*d*60;x.mesh.rotation.y+=.006*d*60});core.rotation.z+=.0007;starsGeo.rotateY(.000025);if(targetPosition){camera.position.lerp(targetPosition,.055);if(camera.position.distanceTo(targetPosition)<.12)targetPosition=null}controls.update();renderer.render(scene,camera)}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.8))});
setTimeout(()=>document.querySelector('#loading').classList.add('hide'),650);
