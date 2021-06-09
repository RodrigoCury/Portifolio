precision mediump float;
uniform float uAlpha;
uniform float uBarDistance;
uniform float uBarSpeed;
uniform float uFlickerSpeed;
uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uGlowDistance;
uniform float uGlowSpeed;

varying vec3 vColor;
varying vec2 vUv;
varying float vTime;
varying vec4 vModelPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

float rand(float n){
    return fract(sin(n) * 43758.5453123);
    }

float noise(float p){
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

void main(){
    vec4 color = vec4(vColor, 1.0);
    // Bars
    float val = vTime * uBarSpeed + vModelPosition.y * uBarDistance;
    float bars = step(val - floor(val), 0.5) * 0.65;

    // Flicker
    float flicker = clamp(noise(vTime * uFlickerSpeed), 0.65, 1.0);

    // Rim
    float rim = 1.0 - clamp(dot(vViewDir, vWorldNormal), 0.0, 1.0);
    vec4 rimColor = vec4(uRimColor * pow(rim, uRimPower), 1.0);

    // Glow
    float glow = 0.0;
    float tempGlow = vModelPosition.y * uGlowDistance - vTime * uGlowSpeed;
    glow = tempGlow - floor(tempGlow);

    vec2 newUv = vUv + vTime * 0.00002;

    float strength = mod(newUv.y * 60.0, 1.0);

    vec4 newColor = vec4(1.0);
    newColor = color + rimColor + (glow * 0.35 * color);
    newColor.a = uAlpha * (bars + rim + glow) * flicker;

    gl_FragColor = newColor;
}