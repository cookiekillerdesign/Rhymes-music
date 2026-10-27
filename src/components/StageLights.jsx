import { useEffect, useRef } from "react";
import { usePlayer } from "./Player";
import { prefersReducedMotion } from "../lib/scroll";

/*
 * Концертный свет: шесть «голов» под потолком, лучи в дыму, реакция на курсор
 * и на бас играющего трека. Цвета плавно перетекают при смене палитры.
 */
const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FRAG = `precision mediump float;
uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 c1;uniform vec3 c2;uniform vec3 c3;uniform float pu;uniform float k;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+1.7;a*=.5;}return v;}
float beam(vec2 uv,vec2 o,float ang,float w){vec2 d=uv-o;float a=atan(d.x,-d.y);float l=length(d);
 return smoothstep(w,w*.1,abs(a-ang))*exp(-l*.65)*smoothstep(0.,.06,l);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*r)/r.y;float ar=r.x/r.y;
 float hz=fbm(uv*2.2+vec2(t*.04,-t*.03));float hz2=fbm(uv*5.+vec2(-t*.07,t*.05));
 float haze=.28+hz*.95+hz2*.35;vec3 col=vec3(0.);
 for(int i=0;i<6;i++){
  float fi=float(i);float x=(fi/5.-.5)*ar*1.1;vec2 o=vec2(x,.62);
  float sp=.28+fract(fi*.37)*.4;
  float ang=sin(t*sp+fi*1.9)*.5+m.x*.3+(x<0.?.2:-.2)+m.y*.05+sin(t*4.+fi)*pu*.06;
  float w=.04+.025*sin(fi*2.1)+pu*.015;
  float q=mod(fi,3.);vec3 bc=q<.5?c1:(q<1.5?c2:c3);
  col+=bc*beam(uv,o,ang,w)*haze*(.95+pu*1.8);
  col+=bc*.005/max(length(uv-o),.012)*(1.+pu*2.5);
 }
 col+=vec3(.05,.04,.07)*hz*(.6-uv.y);
 col+=(c1+c2)*.06*smoothstep(-.1,-.55,uv.y)*hz*(1.+pu*1.5);
 col*=1.-.45*dot(uv*.85,uv*.85);
 col=1.-exp(-col*1.5*k);
 col+=(h(gl_FragCoord.xy+fract(t))-.5)*.03;
 gl_FragColor=vec4(col,1.);
}`;

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

export default function StageLights({ palette, intensity = 1, className = "" }) {
  const ref = useRef(null);
  const { level } = usePlayer();
  const target = useRef(palette.map(hex));

  useEffect(() => { target.current = palette.map(hex); }, [palette]);

  useEffect(() => {
    const cv = ref.current;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) { cv.classList.add("is-fallback"); return undefined; }

    const compile = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv.classList.add("is-fallback"); return undefined; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = Object.fromEntries(["r", "t", "m", "c1", "c2", "c3", "pu", "k"].map((u) => [u, gl.getUniformLocation(prog, u)]));

    const reduce = prefersReducedMotion();
    const cur = target.current.map((c) => c.slice());
    let mouse = [0, 0], tm = [0, 0], visible = true, raf;

    const resize = () => {
      const scale = Math.min(devicePixelRatio || 1, 1.5) * (innerWidth < 700 ? 0.5 : 0.62);
      cv.width = Math.max(1, (cv.clientWidth * scale) | 0);
      cv.height = Math.max(1, (cv.clientHeight * scale) | 0);
      gl.viewport(0, 0, cv.width, cv.height);
    };
    const ro = new ResizeObserver(resize); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    const onMove = (e) => { tm = [e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight * 2 - 1)]; };
    addEventListener("pointermove", onMove, { passive: true });

    // Контекст могут отобрать (много вкладок с WebGL, сброс драйвера): показываем CSS-фон
    const onLost = (e) => { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; cv.classList.add("is-fallback"); };
    cv.addEventListener("webglcontextlost", onLost);

    const t0 = performance.now();
    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || gl.isContextLost()) return;
      const t = reduce ? 6 : (now - t0) / 1000;
      mouse = [mouse[0] + (tm[0] - mouse[0]) * 0.04, mouse[1] + (tm[1] - mouse[1]) * 0.04];
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) cur[i][j] += (target.current[i][j] - cur[i][j]) * 0.035;
      gl.uniform2f(U.r, cv.width, cv.height);
      gl.uniform1f(U.t, t);
      gl.uniform2f(U.m, mouse[0], mouse[1]);
      gl.uniform3fv(U.c1, cur[0]); gl.uniform3fv(U.c2, cur[1]); gl.uniform3fv(U.c3, cur[2]);
      gl.uniform1f(U.pu, level.current);
      gl.uniform1f(U.k, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      removeEventListener("pointermove", onMove);
      cv.removeEventListener("webglcontextlost", onLost);
      if (!gl.isContextLost()) {
        gl.deleteBuffer(buf); gl.deleteProgram(prog);
        // Браузер держит ограниченное число контекстов: освобождаем сразу, не дожидаясь сборщика мусора
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, [intensity, level]);

  return <canvas ref={ref} className={`stage ${className}`} aria-hidden="true" />;
}
