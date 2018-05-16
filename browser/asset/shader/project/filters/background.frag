
uniform float time;
uniform vec2 resolution;

void main ()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = (gl_FragCoord.xy-.5*resolution.xy) / resolution.y;
	float dust = 0.;
	const float count = 40.;
	float a = TAU*amod(p, count)/count;
	// p.x -= .3;
	float d = length(p);
	d *= d;
	// p *= rot(d*2.);
	float cell = .05;
	float x = p.x-time*.05;
	float should = step(.5,rng(vec2(a,floor(x/cell))));
	vec2 pp = p;
	p.x = repeat(x, cell);
	dust += smoothstep(.01, .0, length(p));
	dust += smoothstep(.95, 1., cos((length(pp)-time*cell)*TAU/cell));
	dust += smoothstep(.002, .0001, abs(p.y));
	dust *= smoothstep(.002, .001, (length(p)-.2*(.5+.5*sin(a-time+d*20.))*d));
	uv.y = 1. - uv.y;
	vec3 color = mix(vec3(.9,.5,.5), vec3(1,1,.7), uv.y);
	color += dust;
	color = clamp(color, 0., 1.);
	gl_FragColor = vec4(color,1);
}