var colorFbo;

(function() {
var start = new Date().getTime();
var gl, cBB;
var baseProgram, embossProgram, contrastProgram, blurProgram, blendProgram;
var feedback, embossFbo, contrastFbo, blurFbo, blendFbo;
var camTex;
var time;
var mouseX, mouseY;
var mapMouseX = 1.01;
var mapMouseY = 1.01;
var delayCounter = 0;
var inc = 1;
var firstFrame = false;
var video=document.createElement('video');
var width, height;
var baseImg = new Image();
var glMouseXLoc, glMouseYLoc, timeU2;
var videoLoaded = true;
baseImg.src = "yantra.png";


document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mousedown', onDocumentMouseDown, false);


var adam_ferriss_init = function (context,w,h){
	w = window.innerWidth;
	h = window.innerHeight;
width = w;
height = h;
gl = context;
time = new Date().getTime();
//gl.viewport(0,0,w, h);
cBB = new pxBB();
feedback = new pxFbo();
embossFbo = new pxFbo();
contrastFbo = new pxFbo();
colorFbo = new pxFbo();
blurFbo = new pxFbo();
blendFbo = new pxFbo();

feedback.allocate(w,h);
embossFbo.allocate(w,h);
contrastFbo.allocate(w,h);
colorFbo.allocate(w,h);
blurFbo.allocate(w,h);
blendFbo.allocate(w,h);

var baseVs = createShaderFromScriptElement(gl, "baseVs");
var translateVs = createShaderFromScriptElement(gl, "translateVs");
var stretchVs = createShaderFromScriptElement(gl, "stretchVs");

var baseFs = createShaderFromScriptElement(gl, "baseFs");
var embossFrag = createShaderFromScriptElement(gl, "embossFrag");
var contrastFrag = createShaderFromScriptElement(gl, "contrastFrag");
var blurFrag = createShaderFromScriptElement(gl, "blurFrag");
var blendFrag = createShaderFromScriptElement(gl, "blendFrag");

baseProgram = createProgram(gl, [baseVs, baseFs]);
embossProgram = createProgram(gl, [translateVs, embossFrag]);
contrastProgram = createProgram(gl, [baseVs, contrastFrag]);
colorProgram = createProgram(gl, [stretchVs, baseFs]);
blurProgram = createProgram(gl, [baseVs, blurFrag]);
blendProgram = createProgram(gl, [baseVs, blendFrag]);

gl.useProgram(embossProgram);
var step_w = gl.getUniformLocation(embossProgram,"step_w");
gl.uniform1f(step_w, 15.5/w);
var step_h = gl.getUniformLocation(embossProgram,"step_h");
gl.uniform1f(step_h, 15.5/h);
var timeU = gl.getUniformLocation(embossProgram, "time");
gl.uniform1f(timeU, time);
glMouseXLoc =  gl.getUniformLocation(embossProgram,"u_mouseX");
glMouseYLoc =  gl.getUniformLocation(embossProgram,"u_mouseY");

gl.useProgram(colorProgram);
var texelWidth = gl.getUniformLocation(colorProgram, "texelWidth");
gl.uniform1f(texelWidth, 1.0/w);
var timeU2 = gl.getUniformLocation(colorProgram, "time");

gl.useProgram(blurProgram);
var step_w = gl.getUniformLocation(blurProgram,"step_w");
gl.uniform1f(step_w, 0.58/w);
var step_h = gl.getUniformLocation(blurProgram,"step_h");
gl.uniform1f(step_h, 0.58/h);

getCamAsTexture();

}





var adam_ferriss_loop = function (do_loop){
	var introloaded = false;
	return (function loop(){
		if(videoLoaded){

		  if(!firstFrame && delayCounter >=50){
			getCamAsTexture();
		    getNewImg();
		    firstFrame = true;
		  
		  }

		 gl.viewport(0,0,width,height);

		 contrastFbo.start();
		 cBB.draw(contrastProgram, camTex);
		
		 embossFbo.start();
		 gl.useProgram(embossProgram);
		 gl.uniform1f(glMouseXLoc, mapMouseX);
		 gl.uniform1f(glMouseYLoc, mapMouseY);
		 cBB.draw(embossProgram, feedback.texture);
		
		 blurFbo.start();
		 embossFbo.draw(blurProgram);
		
		 blendFbo.start();
		 blurFbo.draw2(blendProgram, embossFbo.texture);
		
		 feedback.start();
		 blendFbo.draw(baseProgram);
		
		 colorFbo.start();
		 gl.useProgram(colorProgram);
		 
		 inc+=0.001;
		 gl.uniform1f(timeU2, inc);
		 embossFbo.draw(colorProgram);
		
		 gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		 if(do_loop) colorFbo.draw(baseProgram);
		 
		 
		gl.bindTexture(gl.TEXTURE_2D, camTex);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, camTex.image);

		steupTextureFilteringAndMips(500, 375); 
		}
    
	
	
		if(do_loop) window.requestAnimationFrame(loop);
	});
}

function isPowerOf2(value) {
	  return (value & (value - 1)) == 0;
}

function steupTextureFilteringAndMips(width, height) {
	  if (isPowerOf2(width) && isPowerOf2(height)) {
	    gl.generateMipmap(gl.TEXTURE_2D);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	  } else {
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	  }
}


function getCamAsTexture(){
  camTex = createAndSetupTexture(gl);
  camTex.image = baseImg;
  gl.bindTexture(gl.TEXTURE_2D, camTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, camTex.image);

  feedback.start();
  cBB.draw(baseProgram,camTex);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function getNewImg(){
   feedback.start();
   cBB.draw(contrastProgram,camTex);
   gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

this.adam_ferriss_init = adam_ferriss_init;
this.adam_ferriss_loop = adam_ferriss_loop;
this.getNewImg = getNewImg;
this.adam_ferriss_mouse_down = onDocumentMouseDown;


function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2]), gl.STATIC_DRAW);
}

function createAndSetupTexture(gl){
  var texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  return texture;
}

function createFbo(gl, texture){
  var fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2d(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture,0);
  return fbo;
}

function pxFbo(){
  this.start = function(pgm){ 
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
  };
  
  this.allocate = function(w, h){
    this.fbo = gl.createFramebuffer();
    this.texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
  };

  this.draw = function(pgm){
    this.bb.draw(pgm, this.texture);
  }

  this.draw2 = function(pgm, texture2){
    this.bb.draw2(pgm, this.texture, texture2);
  }

  this.fbo;
  this.texture;
  this.bb = new pxBB(gl);
}


function initBuffer(buf,dataset){
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataset), gl.STATIC_DRAW);
}



function pxBB(){
  this.vert = gl.createBuffer();
  initBuffer(this.vert, [
    -1.0,1.0,
    0.0,-1.0,
    -1.0,0.0,
    1.0,1.0,
    0.0,1.0,
    -1.0,0.0
    ]);

  this.tex = gl.createBuffer();
  initBuffer(this.tex,[
    0,1,
    0,0,
    1,1,
    1,0
    ]);

  this.color = gl.createBuffer();
  initBuffer(this.color, [
    1,1,1,1,
    1,1,1,1,
    1,1,1,1,
    1,1,1,1
    ]);

  pxBB.prototype.predraw = function(pgm){
    //set up vertex attributes
    gl.useProgram(pgm);
    pgm.vertexPosAttrib = gl.getAttribLocation(pgm, 'pos');
    gl.enableVertexAttribArray(pgm.vertexPosAttrib);

    pgm.vertexColorAttrib = gl.getAttribLocation(pgm, 'color');
    gl.enableVertexAttribArray(pgm.vertexColorAttrib);

    pgm.vertexTexAttrib = gl.getAttribLocation(pgm, 'texcoord');
    gl.enableVertexAttribArray(pgm.vertexTexAttrib);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.color);
    gl.vertexAttribPointer(pgm.vertexColorAttrib, 4, gl.FLOAT, false, 0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vert);
    gl.vertexAttribPointer(pgm.vertexPosAttrib, 3, gl.FLOAT, false, 0,0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tex);
    gl.vertexAttribPointer(pgm.vertexTexAttrib, 2, gl.FLOAT, false, 0,0);

  }

  pxBB.prototype.draw = function(pgm, texture){
    this.predraw(pgm);
    gl.uniform1i(gl.getUniformLocation(pgm,"u_image"), 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  pxBB.prototype.draw2 = function(pgm, texture1, texture2){
    this.predraw(pgm);
    gl.uniform1i(gl.getUniformLocation(pgm,"u_image"), 0);
    gl.uniform1i(gl.getUniformLocation(pgm,"u_image2"), 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  }

}

function map(value,max,minrange,maxrange) {
    return ((max-value)/(max))*(maxrange-minrange)+minrange;
}

function onDocumentMouseMove(event) {
    mouseX = (event.clientX );
    mouseY = (event.clientY );

    mapMouseX = map(mouseX, window.innerWidth, 0.5,0.0);
    mapMouseY = map(mouseY, window.innerHeight, 1.005,0.99);
    //getNewImg();
}

function onDocumentMouseDown(event) {

}
}());