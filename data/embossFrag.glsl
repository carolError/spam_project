precision highp float;
varying vec2 v_texCoord;
uniform float time;
uniform sampler2D u_image;
uniform float step_w;
uniform float step_h;

      vec2 offset[9];

      void main() {

        vec2 tc = v_texCoord;
        vec4 input0 = texture2D(u_image,tc);
    
        vec2 x1 = vec2(step_w, 0.0);
        vec2 y1 = vec2(0.0, step_h);
    /*
        input0 += texture2D(u_image, tc+x1); // right
        input0 += texture2D(u_image, tc-x1); // left
        input0 += texture2D(u_image, tc+y1); // top
        input0 += texture2D(u_image, tc-y1); // bottom

        input0 *=vec4(0.2);
*/
        float kernel[9];
        float kernel2[9];
        float kernel3[9];
        vec4 sum = input0;
        vec4 sum2 = input0;
        vec4 sum3 = input0;

          offset[0] = vec2(-step_w, -step_h);
          offset[1] = vec2(0.0, -step_h);
          offset[2] = vec2(step_w, -step_h);
          offset[3] = vec2(-step_w, 0.0);
          offset[4] = vec2(0.0, 0.0);
          offset[5] = vec2(step_w, 0.0);
          offset[6] = vec2(-step_w, step_h);
          offset[7] = vec2(0.0, step_h);
          offset[8] = vec2(step_w, step_h);

          kernel[0] = -0.0; kernel[1] = -0.5; kernel[2] = 0.0;
          kernel[3] = 0.0; kernel[4] = 0.25; kernel[5] = -0.0;
          kernel[6] = -0.0; kernel[7] = 0.25; kernel[8] = 0.0;

          kernel2[0] = 0.0; kernel2[1] = -0.05; kernel2[2] = 0.0;
          kernel2[3] = 0.0; kernel2[4] = 0.025; kernel2[5] = 0.00;
          kernel2[6] = 0.0; kernel2[7] = 0.025; kernel2[8] = 0.0;

          kernel3[0] = -0.25; kernel3[1] = -0.25; kernel3[2] = -0.25;
          kernel3[3] = -0.25; kernel3[4] = 2.0; kernel3[5] = -0.25;
          kernel3[6] = -0.25; kernel3[7] = -0.25; kernel3[8] = -0.25;
          
          //int i;

          for (int i = 0; i < 9; i++) {
              //vec4 color = texture2D(tex, vUv + offset[i]);
              //sum += color * kernel[i];
              sum += texture2D(u_image,v_texCoord+offset[i])*(kernel[i]);
              sum2 += texture2D(u_image,v_texCoord+offset[i])*(kernel2[i]);
              sum3 += texture2D(u_image, v_texCoord+offset[i])*(kernel3[i]);
          }
          //sum3/=4.0;

          //sum+=sum2;
          //sum*=0.5;
          //sum+=0.5;

          vec4 c = mix(sum3, sum3, 0.5);//vec4(normalize(vec3(sum.r,sum.g,1.0/60.0)),1.0);
          float avg = (sum2.r+sum2.g+sum2.b)/3.0;
          //vec3 avg = sum2.rgb;
          float color = avg>0.9 ? -0.6 : 0.0;
          float color2 = avg<0.1 ? 0.6 : 0.0;
/*
          if(avg.r>0.9){
            color = -0.6;
          }
          else if(avg.r <0.1){
            color2 = 0.6;
          }
       
          vec3 newColor;
          vec3 newColor2;

          if(avg.r>0.9){
            newColor.r = -0.6;
          }
          if(avg.g>0.9){
            newColor.g = -0.6;
          }
          if(avg.b>0.9){
            newColor.b = -0.6;
          }

          if(avg.r<0.1){
            newColor2.r = 0.6;
          }
          if(avg.g<0.1){
            newColor2.g = 0.6;
          }
          if(avg.b<0.1){
            newColor2.b = 0.6;
          }
*/

          //sum3/= 144.0;
          //c*=0.5;
          //c+=0.5;

        //gl_FragColor = texture2D(u_image, v_texCoord) +1.0*c+ vec4(0.00991,0.00992,0.00993,0.0) ;
        gl_FragColor = abs(sum2 + vec4(vec3(color),0.0) + vec4(vec3(0.0),0.0) + vec4(vec3(0.0025),0.0)) ;//c + vec4(vec3(0.001),1.0);//- vec4(vec3(0.011),1.0);
        //gl_FragColor.b = 1.0;
        //gl_FragColor =c;

      }