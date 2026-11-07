import * as THREE from './vendor/three.module.js';

// Change this default paint or the HTML version label, then run npx vercel again.
const DEFAULT_PAINT = '#9cbea4';
const canvas = document.querySelector('#view');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#182321');
const camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
scene.add(new THREE.HemisphereLight(0xe4f3ff, 0x354334, 3));
const light = new THREE.DirectionalLight(0xfff4df, 5);
light.position.set(3, 7, 5); light.castShadow = true;
light.shadow.mapSize.set(2048,2048);
Object.assign(light.shadow.camera, {left:-6,right:6,top:6,bottom:-6});
scene.add(light);
const rim = new THREE.DirectionalLight(0xb9d6ff, 3); rim.position.set(-4,3,-4); scene.add(rim);
const mat = (color, metalness=0, roughness=.5) => new THREE.MeshStandardMaterial({color, metalness, roughness});
const paint = mat(DEFAULT_PAINT,.45,.28), glass = mat('#193332',.5,.18), rubber = mat('#141918',0,.85), alloy = mat('#b8c6c4',.8,.25), trim=mat('#26332e',.3,.5);
const car = new THREE.Group(); scene.add(car);
function mesh(geo, material, x,y,z, parent=car){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,material,x,y,z,parent=car){return mesh(new THREE.BoxGeometry(w,h,d),material,x,y,z,parent);}
// Extruded side profiles provide the silhouette of an original low-poly coupe.
function profile(points,width,material){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:width,bevelEnabled:true,bevelThickness:.06,bevelSize:.06,bevelSegments:2,steps:1});geo.translate(0,0,-width/2);return mesh(geo,material,0,0,0);}
profile([[-2.25,.55],[-2.27,.9],[-1.9,1.05],[1.65,1.02],[2.2,.85],[2.27,.57],[1.9,.45],[-1.95,.45]],1.7,paint);
profile([[-1.22,1.05],[-.65,1.7],[.55,1.7],[1.35,1.04]],1.42,glass);
box(1.25,.07,1.49,paint,-.05,1.77,0);
for(const z of [-.76,.76]){box(.08,.65,.055,paint,-.08,1.4,z);box(.25,.045,.025,alloy,.45,1.01,z*1.17);box(.3,.13,.22,paint,.95,1.2,z*1.25);box(3.3,.11,.07,trim,0,.5,z*1.2);}
box(.12,.18,1.45,trim,2.25,.58,0);box(.1,.15,1.5,trim,-2.27,.58,0);
const lamps = new THREE.MeshStandardMaterial({color:0xe8ffff,emissive:0xc0faff,emissiveIntensity:3});
const rear = new THREE.MeshStandardMaterial({color:0xf15450,emissive:0xff1717,emissiveIntensity:1});
for(const z of [-.57,.57]){box(.075,.1,.42,lamps,2.23,.86,z);box(.06,.09,.5,rear,-2.29,.89,z);}
const wheels=[];
for(const x of [-1.45,1.45])for(const z of [-.92,.92]){const wheel=new THREE.Group();wheel.position.set(x,.47,z);car.add(wheel);wheels.push(wheel);const tire=mesh(new THREE.CylinderGeometry(.46,.46,.3,32),rubber,0,0,0,wheel);tire.rotation.x=Math.PI/2;const disc=mesh(new THREE.CylinderGeometry(.31,.31,.315,32),trim,0,0,0,wheel);disc.rotation.x=Math.PI/2;for(let i=0;i<5;i++){const spoke=box(.055,.55,.33,alloy,0,0,0,wheel);spoke.rotation.z=i*Math.PI/5;}const hub=mesh(new THREE.CylinderGeometry(.1,.1,.34,16),alloy,0,0,0,wheel);hub.rotation.x=Math.PI/2;}
const platform=mesh(new THREE.CylinderGeometry(3.35,3.35,.13,96),mat('#273b33',.2,.7),0,-.1,0,scene);
const ground=mesh(new THREE.PlaneGeometry(200,200),mat('#182321'),0,-.18,0,scene);ground.rotation.x=-Math.PI/2;
const ring=mesh(new THREE.TorusGeometry(3.12,.012,8,128),mat('#96b994'),0,-.025,0,scene);ring.rotation.x=Math.PI/2;
let spinning=!matchMedia('(prefers-reduced-motion: reduce)').matches, yaw=.5, pitch=.38, speed=0, dragging=false, px=0,py=0;
const rotate=document.querySelector('#rotate');
function rotationUI(){rotate.textContent=spinning?'Pause rotation':'Resume rotation';rotate.setAttribute('aria-pressed',String(spinning));}
rotationUI();
rotate.onclick=()=>{spinning=!spinning;rotationUI()};
document.querySelectorAll('[data-color]').forEach(button=>button.onclick=()=>{paint.color.set(button.dataset.color);document.querySelector('#paint-name').textContent=button.dataset.name;document.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)))});
document.querySelector('#speed').oninput=e=>{speed=Number(e.target.value);document.querySelector('#speed-value').textContent=`${speed} km/h`};
document.querySelector('#stop-wheels').onclick=()=>{const slider=document.querySelector('#speed');slider.value='0';slider.dispatchEvent(new Event('input'));};
let headlights=true;
document.querySelector('#lights').onclick=e=>{headlights=!headlights;lamps.emissiveIntensity=headlights?3:0;lamps.color.set(headlights?'#e8ffff':'#526561');e.currentTarget.textContent=`Headlights: ${headlights?'on':'off'}`;e.currentTarget.setAttribute('aria-pressed',String(headlights));document.querySelector('#light-state').textContent=`Headlights ${headlights?'on':'off'}`};
document.querySelector('#reset').onclick=()=>{yaw=.5;pitch=.38;};
canvas.onpointerdown=e=>{dragging=true;px=e.clientX;py=e.clientY;canvas.setPointerCapture(e.pointerId);spinning=false;rotationUI()};
canvas.onpointermove=e=>{if(!dragging)return;yaw-=(e.clientX-px)*.008;pitch=THREE.MathUtils.clamp(pitch+(e.clientY-py)*.005,.12,1.1);px=e.clientX;py=e.clientY;};
canvas.onpointerup=canvas.onpointercancel=()=>dragging=false;
canvas.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();spinning=false;rotationUI();yaw+=e.key==='ArrowLeft'?.12:e.key==='ArrowRight'?-.12:0;pitch=THREE.MathUtils.clamp(pitch+(e.key==='ArrowUp'?.08:e.key==='ArrowDown'?-.08:0),.12,1.1);};
new ResizeObserver(()=>{const {width,height}=canvas.parentElement.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}).observe(canvas.parentElement);
let previous=0;
renderer.setAnimationLoop(time=>{const dt=Math.min((time-previous)/1000,.05);previous=time;if(document.hidden)return;if(spinning)yaw+=dt*.22;const distance=camera.aspect<1?12:9;camera.position.set(Math.cos(yaw)*Math.cos(pitch)*distance,Math.sin(pitch)*distance+.7,Math.sin(yaw)*Math.cos(pitch)*distance);camera.lookAt(0,.8,0);wheels.forEach(w=>w.rotation.z-=dt*(speed/3.6)/.46);renderer.render(scene,camera);if(canvas.dataset.ready!=='true')canvas.dataset.ready='true';});
