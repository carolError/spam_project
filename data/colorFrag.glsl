precision highp float;
uniform sampler2D u_image;
varying vec2 v_texCoord;
uniform float time;
//uniform float step_w;
//uniform float step_h;

float speed = 5.0;
uniform float texelWidth; 

vec3 rainbow(float h) {
  h = mod(mod(h, 1.0) + 1.0, 1.0);
  float h6 = h * 6.0;
  float r = clamp(h6 - 4.0, 0.0, 1.0) +
    clamp(2.0 - h6, 0.0, 1.0);
  float g = h6 < 2.0
    ? clamp(h6, 0.0, 1.0)
    : clamp(4.0 - h6, 0.0, 1.0);
  float b = h6 < 4.0
    ? clamp(h6 - 2.0, 0.0, 1.0)
    : clamp(6.0 - h6, 0.0, 1.0);
  return vec3(r, g, b);
}

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    
   // vec4 p = c.g < c.b ? vec4(c.bg, K.wz) : vec4(c.gb, K.xy);
    //vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(( (q.z + (q.w - q.y) / (6.0 * d + e))) ), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    
    
    vec2 tc = v_texCoord;
    vec4 input0 = texture2D(u_image,tc);
    vec4 orig = texture2D(u_image, tc);
    float co = cos(time*speed);
    float si = sin(time*speed);
    
    mat4 hueRotation =
    mat4(0.299,  0.587,  0.114, 0.0,
         0.299,  0.587,  0.114, 0.0,
         0.299,  0.587,  0.114, 0.0,
         0.000,  0.000,  0.000, 1.0) +
    
    mat4(0.701, -0.587, -0.114, 0.0,
         -0.299,  0.413, -0.114, 0.0,
         -0.300, -0.588,  0.886, 0.0,
         0.000,  0.000,  0.000, 0.0) * co +
    
    mat4(0.168,  0.330, -0.497, 0.0,
         -0.328,  0.035,  0.292, 0.0,
         1.250, -1.050, -0.203, 0.0,
         0.000,  0.000,  0.000, 0.0) * si;
    
    float step = 0.25;
    float tl = abs(texture2D(u_image, v_texCoord + texelWidth * vec2(-step, -step)).x);   // top left
    float  l = abs(texture2D(u_image, v_texCoord + texelWidth * vec2(-step,  0.0)).x);   // left
    float bl = abs(texture2D(u_image, v_texCoord + texelWidth * vec2(-step,  step)).x);   // bottom left
    float  t = abs(texture2D(u_image, v_texCoord + texelWidth * vec2( 0.0, -step)).x);   // top
    float  b = abs(texture2D(u_image, v_texCoord + texelWidth * vec2( 0.0,  step)).x);   // bottom
    float tr = abs(texture2D(u_image, v_texCoord + texelWidth * vec2( step, -step)).x);   // top right
    float  r = abs(texture2D(u_image, v_texCoord + texelWidth * vec2( step,  0.0)).x);   // right
    float br = abs(texture2D(u_image, v_texCoord + texelWidth * vec2( step,  step)).x);   // bottom right

    float mult = 1.0;

    float dX = tr*mult + 2.0*r*mult + br*mult -tl*mult - 2.0*l*mult - bl*mult;
    float dY = bl*mult + 2.0*b*mult + br*mult -tl*mult - 2.0*t*mult - tr*mult;
    
    vec4 color = vec4(normalize(vec3(dX,dY,1.0/300.0)),1.0);
    
    color*=0.5;
    color+=0.5;
    
    //gl_FragColor = color * hueRotation;    
    
    //hue.rgb += (sin(hue.rgb*0.5*time));    
    
    
    //hue*=hueRotation;
    //hue += (sin(time*5.0)+1.0)*0.5;
    //hue.g += sin(time*10.25);
    //hue.b += sin(time*5.5);
    //hue*=0.5;
    //hue+=0.5;
    vec4 b2rgb = vec4(vec3(hsv2rgb(input0.rgb)),1.0);
    
    vec4 hue = vec4(vec3(rgb2hsv(b2rgb.rgb)),1.0);
    //hue = mix(hue, color, 0.5);
    //b2rgb = mix(hue, b2rgb, 0.5);
    //b2rgb += sin(time);
    //vec4 final = vec4(vec3(sin(input0.rgb*40.141592*time)),0.25);
    //final = normalize(final*hue);
    //final += vec4(vec3(0.95),1.0);
    //input0 = normalize(input0);

    gl_FragColor = input0;//mod(hue*hueRotation,time);
    
    
}