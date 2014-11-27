attribute vec3 pos;
attribute vec4 color;
attribute vec2 texcoord;

varying vec2 v_texCoord;
varying vec4 vColor;

float scale = 1.25;

void main() {
   vec4 newPos = vec4(((pos.x*-1.0)-0.5)*scale+(0.5*scale),((pos.y*scale)-0.5)*scale+(0.5*scale),pos.z,1.0);
   gl_Position =newPos;
   v_texCoord = texcoord;
   vColor = color;

}