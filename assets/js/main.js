import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas=document.querySelector('#space');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.8));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x02040a,.00215);
const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,1300);camera.position.set(innerWidth<800?0:12,68,176);
const controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.055;controls.minDistance=45;controls.maxDistance=390;controls.maxPolarAngle=Math.PI*.82;controls.target.set(0,0,0);
scene.add(new THREE.AmbientLight(0x90a4c7,.4));scene.add(new THREE.PointLight(0xffffff,680,430,1.35));

const starsGeo=new THREE.BufferGeometry(),starCount=innerWidth<700?1500:3400,positions=new Float32Array(starCount*3),colors=new Float32Array(starCount*3);
for(let i=0;i<starCount;i++){const r=145+Math.random()*510,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);positions[i*3]=r*Math.sin(p)*Math.cos(t);positions[i*3+1]=r*Math.cos(p);positions[i*3+2]=r*Math.sin(p)*Math.sin(t);const n=Math.random();colors.set(n>.82?[.45,.85,1]:n<.12?[1,.72,.55]:[.75,.79,.9],i*3)}
starsGeo.setAttribute('position',new THREE.BufferAttribute(positions,3));starsGeo.setAttribute('color',new THREE.BufferAttribute(colors,3));scene.add(new THREE.Points(starsGeo,new THREE.PointsMaterial({size:.75,transparent:true,opacity:.76,vertexColors:true})));

function glowTexture(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,8,128,128,128);g.addColorStop(0,'#fff');g.addColorStop(.18,'rgba(115,245,255,.95)');g.addColorStop(.5,'rgba(77,97,255,.18)');g.addColorStop(1,'transparent');x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c)}
const core=new THREE.Group();scene.add(core);
[[44,0x63eaff,.44],[62,0x8c4fff,.14]].forEach(([size,color,opacity])=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTexture(),color,transparent:true,opacity,blending:THREE.AdditiveBlending,depthWrite:false}));s.scale.set(size,size,1);core.add(s)});
const logoTex=new THREE.TextureLoader().load('assets/images/logo.png');logoTex.colorSpace=THREE.SRGBColorSpace;
const logo3D=new THREE.Group();core.add(logo3D);
const coin=new THREE.Mesh(new THREE.CylinderGeometry(12.5,12.5,3.2,96),[new THREE.MeshStandardMaterial({color:0x17233e,metalness:.92,roughness:.2}),new THREE.MeshStandardMaterial({color:0x07101f,metalness:.75,roughness:.28}),new THREE.MeshStandardMaterial({color:0x07101f,metalness:.75,roughness:.28})]);coin.rotation.x=Math.PI/2;logo3D.add(coin);
const rim=new THREE.Mesh(new THREE.TorusGeometry(12.55,.62,20,110),new THREE.MeshStandardMaterial({color:0xbaff24,emissive:0x4f8100,emissiveIntensity:2,metalness:.82,roughness:.18}));rim.position.z=1.72;logo3D.add(rim);
const face=new THREE.Mesh(new THREE.CircleGeometry(11.65,96),new THREE.MeshBasicMaterial({map:logoTex,transparent:true,alphaTest:.025,toneMapped:false}));face.position.z=1.78;logo3D.add(face);
const energyRing=new THREE.Mesh(new THREE.TorusGeometry(15.4,.12,10,120),new THREE.MeshBasicMaterial({color:0x72efff,transparent:true,opacity:.64,blending:THREE.AdditiveBlending}));energyRing.rotation.x=1.08;core.add(energyRing);

const data=[
{name:'Sportsbook',radius:20,size:1.5,speed:.009,color:0x9b9289,feature:'Odds kompetitif',service:'24 jam',desc:'Nikmati pilihan pertandingan, market lengkap, dan pengalaman taruhan olahraga dalam satu arena.'},
{name:'Mix Parlay',radius:28,size:2.35,speed:.0067,color:0xd8a65d,feature:'Cashback Lose 1',service:'Hingga 300rb',desc:'Rangkai pilihan pertandingan favoritmu dan dapatkan promo Cashback Lose 1 khusus Mix Parlay.'},
{name:'Slot',radius:37,size:2.55,speed:.0054,color:0x268ee8,feature:'Provider populer',service:'Ribuan game',desc:'Jelajahi ribuan permainan slot dari provider pilihan dengan tema dan fitur beragam.'},
{name:'Live Casino',radius:47,size:1.85,speed:.0043,color:0xc75531,feature:'Dealer langsung',service:'Full HD',desc:'Rasakan atmosfer meja casino secara langsung dengan dealer profesional dan tayangan berkualitas.'},
{name:'Poker',radius:64,size:6.3,speed:.0024,color:0xc8a67f,feature:'Meja aktif',service:'Setiap hari',desc:'Masuk ke meja poker dan uji strategi dalam permainan yang aktif sepanjang hari.'},
{name:'Arcade',radius:83,size:5.45,speed:.00175,color:0xd6bd7b,feature:'Gameplay cepat',service:'Instan',desc:'Koleksi permainan arcade ringan, cepat, dan seru untuk menemani setiap sesi.'},
{name:'E-Sports',radius:101,size:3.55,speed:.0013,color:0x75d6df,feature:'Liga global',service:'Live odds',desc:'Ikuti kompetisi e-sports favorit dengan pilihan pertandingan dan market terkini.'},
{name:'Promosi',radius:117,size:3.4,speed:.001,color:0x345bcc,feature:'Bonus pilihan',service:'Update rutin',desc:'Temukan penawaran, cashback, dan program loyalitas terbaru dari Bolapelangi2.'}
];
const planets=[],orbitMaterial=new THREE.LineBasicMaterial({color:0x7180a0,transparent:true,opacity:.18});
function planetMaterial(color){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle='#'+color.toString(16).padStart(6,'0');x.fillRect(0,0,512,256);for(let i=0;i<85;i++){x.globalAlpha=.03+Math.random()*.08;x.fillStyle=i%2?'#fff':'#050710';x.beginPath();x.ellipse(Math.random()*512,Math.random()*256,20+Math.random()*100,1+Math.random()*10,Math.random()*.1,0,Math.PI*2);x.fill()}const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=THREE.RepeatWrapping;return new THREE.MeshStandardMaterial({map:t,roughness:.84})}
data.forEach((p,i)=>{const pts=new THREE.EllipseCurve(0,0,p.radius,p.radius,0,Math.PI*2).getPoints(160).map(v=>new THREE.Vector3(v.x,0,v.y));scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts),orbitMaterial));const pivot=new THREE.Group();scene.add(pivot);pivot.rotation.y=i*.82;const mesh=new THREE.Mesh(new THREE.SphereGeometry(p.size,32,32),planetMaterial(p.color));mesh.position.x=p.radius;mesh.userData={index:i};pivot.add(mesh);if(i===5){const ring=new THREE.Mesh(new THREE.RingGeometry(p.size*1.35,p.size*2.05,72),new THREE.MeshBasicMaterial({color:0xd8c797,side:THREE.DoubleSide,transparent:true,opacity:.72}));ring.rotation.x=Math.PI/2.25;mesh.add(ring)}planets.push({mesh,pivot,data:p})});

const nav=document.querySelector('#planet-nav');data.forEach((p,i)=>{const b=document.createElement('button');b.textContent=String(i+1).padStart(2,'0');b.title=p.name;b.setAttribute('aria-label','Buka '+p.name);b.onclick=()=>focusPlanet(i);nav.appendChild(b)});
const panel=document.querySelector('#planet-panel'),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let running=true,targetPosition=null;
function showInfo(i){const p=data[i];document.querySelector('#planet-index').textContent='DESTINASI '+String(i+1).padStart(2,'0');document.querySelector('#planet-name').textContent=p.name.toUpperCase();document.querySelector('#planet-description').textContent=p.desc;document.querySelector('#planet-distance').textContent=p.feature;document.querySelector('#planet-year').textContent=p.service;panel.classList.add('open');[...nav.children].forEach((b,n)=>b.classList.toggle('active',n===i))}
function focusPlanet(i){showInfo(i);const pos=new THREE.Vector3();planets[i].mesh.getWorldPosition(pos);controls.target.copy(pos);const dir=camera.position.clone().sub(pos).normalize();targetPosition=pos.clone().add(dir.multiplyScalar(Math.max(15,data[i].size*6)))}
let down={x:0,y:0};canvas.addEventListener('pointerdown',e=>down={x:e.clientX,y:e.clientY});canvas.addEventListener('pointerup',e=>{if(Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight)*2+1;raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(planets.map(x=>x.mesh))[0];if(hit)focusPlanet(hit.object.userData.index)});
document.querySelector('#close-panel').onclick=()=>{panel.classList.remove('open');[...nav.children].forEach(b=>b.classList.remove('active'))};
document.querySelector('#reset-view').onclick=()=>{panel.classList.remove('open');controls.target.set(0,0,0);targetPosition=new THREE.Vector3(innerWidth<800?0:12,68,176)};
document.querySelector('#toggle-motion').onclick=e=>{running=!running;e.currentTarget.textContent=running?'❚❚ JEDA ORBIT':'▶ LANJUTKAN ORBIT'};
document.querySelector('#explore-now').onclick=()=>focusPlanet(0);
const clock=new THREE.Clock();function animate(){requestAnimationFrame(animate);const d=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;if(running)planets.forEach(x=>{x.pivot.rotation.y+=x.data.speed*d*60;x.mesh.rotation.y+=.006*d*60});logo3D.quaternion.copy(camera.quaternion);logo3D.rotateY(Math.sin(t*.72)*.13);logo3D.rotateX(Math.cos(t*.58)*.045);logo3D.position.y=Math.sin(t*1.05)*.38;energyRing.rotation.z+=.0035*d*60;energyRing.rotation.y+=.0014*d*60;starsGeo.rotateY(.000025);if(targetPosition){camera.position.lerp(targetPosition,.055);if(camera.position.distanceTo(targetPosition)<.12)targetPosition=null}controls.update();renderer.render(scene,camera)}animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<700?1.35:1.8))});setTimeout(()=>document.querySelector('#loading').classList.add('hide'),650);
