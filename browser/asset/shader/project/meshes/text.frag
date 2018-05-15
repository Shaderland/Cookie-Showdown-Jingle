
uniform sampler2D textTexture;
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void burn (inout vec4 color, vec2 uv) {
	vec3 seed = vec3(uv.xyy)*10.;
	float noisy = noiseIQ(seed)*fbm(seed*3.);
	float ratio = .5+.5*sin(time+noisy*3.);
	color.rgb *= (1.-smoothstep(.3,.7,ratio));
	color.rgb = mix(color.rgb, vec3(0.733, 0.160, 0.105), smoothstep(.5,.9,ratio));
	color.rgb = mix(color.rgb, vec3(01, 0.898, 0.478), smoothstep(.8,.9,ratio));
	color.a *= 1.-smoothstep(.9,.95,ratio);
}

float getLight (vec2 uv) {
	return texture2D(textTexture, uv).r;
}

#define lod .5
#define frameCount 5.
#define frame mod(floor(time/lod), frameCount)

void main()	{
	vec2 uv = vUv;
	vec4 color = texture2D(textTexture, uv);

	vec2 unit = 1. / resolution.xy;
	vec3 normal = (vec3(
		getLight(uv+vec2(unit.x, 0)) - getLight(uv+vec2(-unit.x, 0)),
		getLight(uv+vec2(0, unit.y)) - getLight(uv+vec2(0, -unit.y)),
		1));

	normal /= .1;

	// color.rg = normal * .5 + .5;
	float a = time * 2.;
	vec3 light = normalize(vec3(cos(a), sin(a), sin(a+PI)*.1));
	float shade = (dot(normal.xy, light.xy) * .5 + .5);// * (1.-smoothstep(.2,.21, length(uv - vec2(.5) - light.xy * .1)));

	// lines
	shade += smoothstep(.0, .1, sin(uv.x * 200. + time * 10. - uv.y * 100.)) * step(abs(frame-3.),.001);

	vec2 p = uv;
	float radius = .02;
	float shell = .001;
	float cell = .08;
	p -= .5;
	// p *= rot(time);

	// heart
	vec2 pp = p;
	pp.y -= sqrt(abs(pp.x*.5))*.5;
	pp.y /= .8;
	pp.y += .1;
	float hr = .1 + .2 * (.5 + .5 * sin(time*8.));
	shade += (1.-smoothstep(hr*.9,hr,length(pp))) * step(abs(frame-4.),.001);

	// rays
	shade += smoothstep(.0, .01, sin(atan(p.y, p.x)*20. + time * 8.)) * step(abs(frame-1.),.001);
	p += .5;
	vec2 ii = floor((p+cell/2.) / cell);
	// p.y += sin(ii.x*.1 + time) * .1;
	radius += sin(ii.x *10. + rand(ii.yy)*10. + time * 2.)*.01;
	p = repeat(p, cell);

	// pp = p;
	// pp.y -= sqrt(abs(pp.x*.5))*.2;
	// pp.y /= .8;
	// hr = .015;
	// shade += (1.-smoothstep(hr*.9,hr,length(pp))) * step(abs(frame-4.),.001);

	a = rng(ii) * TAU + time * 10.;
	p += vec2(cos(a), sin(a)) * (cell / 2. - radius);

	// circle
	shade += (1.-smoothstep(radius, radius+shell, length(p))) * step(abs(frame-2.), .001);


	shade = clamp(shade, 0., 1.);

	color.rgb = vec3(1,0,0);
	color.rgb += shade;
	// burn(color, uv);

	gl_FragColor = color;
}
