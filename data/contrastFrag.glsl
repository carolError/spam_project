precision highp float;
uniform sampler2D u_image;
varying vec2 v_texCoord;

float contrast = 2.0;

void main() {
    vec4 color = texture2D(u_image, v_texCoord);
    const vec3 LumCoeff = vec3(0.2125, 0.7154, 0.0721);
    
    vec3 AvgLumin = vec3(0.5, 0.5, 0.5);
    
    vec3 intensity = vec3(dot(color.rgb, LumCoeff));
    
    // could substitute a uniform for this 1. and have variable saturation
    vec3 satColor = mix(intensity, color.rgb, 1.);
    vec3 conColor = mix(AvgLumin, satColor, contrast);
    
    float avg = (conColor.r+conColor.g+conColor.b)/3.0;
    vec4 bw = avg >= 0.1 ? vec4(0.6) : vec4(0.01);
    gl_FragColor = bw;

    //gl_FragColor = color;//vec4(conColor, 1.0);
}