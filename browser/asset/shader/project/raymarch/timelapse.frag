uniform float time;
uniform vec2 resolution;

#define sdist(p,r) (length(p)-r)

void rot (inout vec2 p, float a) { float c = cos(a), s= sin(a); p *= mat2(c,-s,s,c); }

float getCross (vec3 p, float thin, float blend) {
  return smin(sdist(p.xz, thin), smin(sdist(p.xy, thin), sdist(p.yz, thin), blend), blend);
}

float map (vec3 pos, float salt, float pepper, float curry, float cumin) {
  vec3 p = pos;
  float scene = 10.;
  // const float steps = 4.;
  // for (float i = steps - 1.; i > 0.; --i) {
  //   float r = i / steps;
  //   r *= r;
  // //   p.xz = abs(p.xz) - .5;
  // //   rot(p.xz, time * r);
  // //   rot(p.xy, time * r * .5);
  //   // p.y = repeat(p.y, 4.);
  //   // vec3 pp = p;
  //   // pp = repeat(pp, 3.);
  //   // pp = abs(pp);
  //   float radius = .5 * r;
  //   float thin = .05 * r;
  //   float shell = .01 * r;
  //   float blend = .2 * r;
  //   rot(p.xz, p.y * .2);
  //   amod(p.xz, 5.);
  //   p.x -= 2.5 * r;
  //   float shape = smin(sdist(p, radius), getCross(p, thin, .2), blend);
  //   float hole = smin(getCross(p, thin - shell, blend), sdist(p, radius - shell), blend);
  //   scene = smin(scene, max(shape, -hole), .02);
  // }
  scene = min(scene, mix(sdist(pos, 1. + salt * .1), 10., step(.8, pepper)));

  rot(p.zy, pepper * TAU);
  rot(p.xz, salt * TAU);
  rot(p.xy, curry * .2);
  rot(p.xz, curry * .2 * p.y);
  p = mix(p, repeat(p, 2. + 4. * pepper), step(.5, salt));
  amod(p.xz, ceil(10. * curry));
  p.x -= pepper * 5.;
  scene = min(scene, mix(sdist(p.xz, .2 + curry * .1), 10., step(.9, salt)));
  p.y = repeat(p.y, pepper * 10.);
  scene = min(scene, mix(sdBox(p, vec3(.1 + curry * .5)), 10., step(.9, curry)));
  scene = min(scene, mix(sdist(p.yz, .2 + cumin * .5), 10., step(.8, cumin)));
  return scene;
}

vec3 getNormal (vec3 p, float salt, float pepper, float curry, float cumin) {
  vec2 e = vec2(.0001,0);
  return (vec3(map(p+e.xyy, salt, pepper, curry, cumin)-map(p-e.xyy, salt, pepper, curry, cumin), map(p+e.yxy, salt, pepper, curry, cumin)-map(p-e.yxy, salt, pepper, curry, cumin), map(p+e.yyx, salt, pepper, curry, cumin)-map(p-e.yyx, salt, pepper, curry, cumin)));
}

void main () {
  vec2 uv = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
  vec3 eye = vec3(0,1,-6);
  // rot(eye.xz, time*.1165);
  // rot(eye.xy, time*.68635);
  // rot(eye.zy, time*.31589);
  vec3 target = vec3(0,0,0);
  vec3 forward = normalize(target - eye);
  vec3 right = normalize(cross(forward, vec3(0,1,0)));
  vec3 up = normalize(cross(right, forward));
  vec3 ray = normalize(forward + right * uv.x + up * uv.y);
  vec3 pos = eye;
  float shade = 0.;
  float lod = .5;
  vec2 seed = vec2(floor(time*lod)/lod);
  float salt = abs(rand(seed * 10.));
  float pepper = abs(rand(seed+vec2(412.4534,1.4401)));
  float curry = abs(rand(seed+vec2(98.796,6.5468)));
  float cumin = abs(rand(seed+vec2(.5468,984.54)));
  const float steps = 100.;
  for (float i = steps; i >= 0.; --i) {
    float dist = map(pos, salt, pepper, curry, cumin);
    if (dist < .0001) {
      shade = i / steps;
      break;
    }
    // dist = max(dist, .005);
    // shade += .0001 / dist;
    pos += ray * dist;
  }
  float t = time + length(pos) * .5;
  vec3 normal = getNormal(pos, salt, pepper, curry, cumin) / .0001;
  vec3 color = vec3(1);
  // color = vec3(.5) + .5 * sin(vec3(.4,.5,.6)*t);
  // color = mix(normal * .5 + .5, color, step(.5, curry));
  color *= shade;
  gl_FragColor = vec4(color, 1);
}
