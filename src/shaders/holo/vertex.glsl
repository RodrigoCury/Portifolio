uniform float uTime;
uniform vec3 uColor;
uniform float uGlitchSpeed;
uniform float uGlitchIntensity;

varying vec2 vUv;
varying vec3 vColor;
varying float vTime;
varying vec4 vModelPosition;
varying vec3 vWorldNormal;
varying vec3 vViewDir;

void main(){
    vec4 attributes = vec4(position, 1.0);
    attributes.x += uGlitchIntensity * step(0.5, sin(uTime * 2.0 + attributes.y * 1.0)) * step(0.99, sin(uTime * uGlitchSpeed * 0.5));

    vec4 modelPosition = modelMatrix * attributes;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;


    gl_Position = projectedPosition;

    vUv = uv;
    vTime = uTime;
    vColor = uColor;
    vModelPosition = modelPosition;
    vWorldNormal = normalize(normalMatrix * attributes.xyz);
    vViewDir = normalize(-(viewPosition * attributes).xyz);

}

