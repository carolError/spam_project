attribute vec3 pos;
attribute vec4 color;
attribute vec2 texcoord;

varying vec2 v_texCoord;
varying vec4 vColor;

uniform float u_mouseX;
uniform float u_mouseY;

vec2 scale = vec2(u_mouseY,u_mouseY);

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}


void main() {

   gl_Position = vec4(pos.x*scale.x,pos.y*scale.y,pos.z,1.0) * rotationMatrix(vec3(0.0,0.0,1.0), u_mouseX);
   v_texCoord = texcoord;
   vColor = color;

}