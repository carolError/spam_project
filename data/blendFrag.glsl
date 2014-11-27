precision mediump float;
uniform sampler2D u_image;
uniform sampler2D u_image2;
varying vec2 v_texCoord;

float t = 0.01;
void main(){
  vec4 input0 = texture2D(u_image, v_texCoord);
  vec4 input1 = texture2D(u_image2, v_texCoord);

  gl_FragColor = mix(input0, input1, 0.5);
}