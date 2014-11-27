var spam = (function() {

	var renderer = new THREE.WebGLRenderer();
	adam_ferriss_init(renderer.context,500,375);
	var texture_adam = new THREE.Texture();
	texture_adam.__webglTexture = colorFbo.texture;
	//console.log(colorFbo.texture);
	texture_adam.__webglInit = true;
	

	var clock = new THREE.Clock();
	var olas; // animators
	var container, stats;
	var gif;
	var keyboard = new THREEx.KeyboardState();
	
	var vpeter = new Video("vpeter",802,700);
	var vsodeoka = new Video("vsodeoka",500,375);
	var vsabrina1 = new Video("vsabrina1",500,375);
	var vsabrina2 = new Video("vsabrina2",500,375);
	var vsabrina3 = new Video("vsabrina3",500,375);
	
	
	var vEva = new Video("vEva",500,375);

	var MovingCube;
	var collidableMeshList = [];

	var camera, scene, time;
	var prevPosition, prevRot;

	var mouseX = 0, mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;
	const LEFT_WALL = 1;
	const TOP_WALL = 2;
	const RIGHT_WALL = 4;
	const BOTTOM_WALL = 8;
	var prevCasillaY = 0;
	var prevCasillaX = 0;
	var tex = THREE.ImageUtils.loadTexture( "data/tex.png" );
	
	var rayMesh, rayGeo;
	var trumanshow, flagTruman;
	
	var adam = false;
	
	var brian = false;
	var soundB;
	var audio = document.createElement( 'audio' );
	var source = document.createElement( 'source' );
	audio.appendChild( source );
	source.src = 'data/brian_house_anthology.mp3';
	
	var sabrinaCSS = false;
	var adamCSS = false;
	var annaCSS = false;
	var peterCSS = false;
	var brianCSS = false;
	var sodeokaCSS = false;
	var evaCSS = false;

	var floorSize, floorPos;
	
	var meshA;
	var AZ = 0; 
	var MZ = 0;
	var counter=1;
	var timeModulo1=0;
	var prevTimeModulo1 = 0;
	var timeModulo2 = 0;
	var prevTimeModulo2 = 0;
	var loop = 0; 
	var NODO;
	var posRandom;
	var textureBody = new THREE.ImageUtils.loadTexture("data/text6.jpg");
	var textureGun = new THREE.ImageUtils.loadTexture("data/Tex_0009_1.jpg");
	
	var duration = 1000;
	var keyframes = 15 /*16*/, interpolation = duration / keyframes;
	var lastKeyframe = 0, currentKeyframe = 0;
	
	var step = 0;
	var mesh;
	var meshAnim;
	var frames = [];
	var currentMesh;
	
	var arrows;
	var keyarr = false;
	
	//var animations;
	var loader = new THREE.JSONLoader();
	var skinnedMesh, animation;
	
	var dir, a;
	var posInLine=0;
	var prevClock = 0;
	//var camera;
	var sizeA = THREE.Vector2(500,375);
	var sizeB = THREE.Vector2(600,360);
	
	var divAnna = document.getElementById('textAnna');
	var textAnna = divAnna.childNodes[1].innerHTML;
	var canvas1 = document.createElement('canvas');
	var w = 1500;
	var h = 1125;
	canvas1.width = w;
	canvas1.height = h;
	var context1= canvas1.getContext('2d');
	context1.fillRect(0,0,w,h);
	
	console.log (context1)
	
	function drawString(ctx, text, posX, posY, textColor, rotation, font, fontSize, maxWidth) {
		var lines = text.split("\n");
		if (!rotation) rotation = 0;
		if (!font) font = "'serif'";
		if (!fontSize) fontSize = 16;
		if (!textColor) textColor = '#000000';
		ctx.save();
		ctx.font = fontSize + "px " + font;
		ctx.fillStyle = textColor;
		ctx.translate(posX, posY);
		ctx.rotate(rotation * Math.PI / 180);
		for (i = 0; i < lines.length; i++) {
	 		ctx.fillText(lines[i],0, i*(fontSize+10));
		}
		ctx.restore();
	}

    drawString(context1,textAnna,0,50,"white",0,"monospace",24);

    
	var texture1 = new THREE.Texture(canvas1);
	
	var transText = new THREE.ImageUtils.loadTexture("data/transText.png");

	console.log(texture1);
	texture1.anisotropy = 6;
	texture1.needsUpdate = true;
	
	var textureFace;
	

	
	var lab = [[0,2,2,2,0],
	           [0,0,0,4,0],
	           [3,0,2,2,6],
	           [0,0,0,0,4],
	           [0,8,8,6,0],
	           [4,0,0,0,8]];
	
	var wLEFT = [ [500,500,500,500,500],
	           	  [500,500,500,500,500],
	           	  [500,500,500,500,500],
	           	  [500,500,500,500,500],
	           	  [500,500,500,500,500],
	           	  [500,500,500,500,500]
	];
	
	var wTOP = [ [500,500,500,500,500],
	             [500,500,500,500,500],
	             [500,500,500,500,500],
	             [500,500,500,500,500],
	             [500,500,500,500,500],
	             [500,500,500,500,500]
	];
	
	var wBOTTOM = [ [500,500,500,500,500],
		           	[500,500,500,500,500],
		            [500,500,500,500,500],
		            [500,500,500,500,500],
		            [500,500,500,500,500],
		            [500,500,500,500,640]
	];
	
	var wRIGHT = [ [500,500,500,500,500],
		           [500,500,500,500,500],
		           [500,500,500,500,500],
		           [500,500,500,488,512],
		           [500,500,500,500,500],
		           [500,500,500,500,500]
	];
	
	var hLEFT =  [[375,375,375,375,375],
	              [375,375,375,375,375],
	              [375,375,375,375,375],
	              [375,375,375,375,375],
	              [375,375,375,375,375],
	              [375,375,375,375,375],
	];
	
	var hTOP = [ [375,375,375,375,375],
	             [375,375,375,375,375],
	             [375,375,375,375,375],
	             [375,375,375,375,375],
	             [375,375,375,375,375],
	             [375,375,375,375,375],
	];
	
	var hBOTTOM = [ [375,375,375,375,375],
	                [375,375,375,375,375],
		            [375,375,375,375,375],
		            [375,375,375,375,375],
		            [375,375,375,375,375],
		            [375,375,375,375,360],
	];
	
	var hRIGHT = [ [375,375,375,375,375],
	               [375,375,375,375,375],
		           [375,375,375,375,375],
		           [375,375,375,375,586],
		           [375,375,375,375,375],
		           [375,375,375,375,375],
	];
	
	var texturesIndexLEFT   = [
	                           	[0,0,0,0,0],
				           		[0,0,0,0,0],
				           		[texture_adam,0,0,0,0],
				           		[0,0,0,0,0],
				           		[0,0,0,0,0],
				           		[0,0,0,0,0]
				           		
				           		
	                           ];
	
	var texturesIndexTOP   = [
		                       [0,vsabrina1.texture, vsabrina2.texture , vsabrina3.texture,0],
					           [0,0,0,0,0],
					           [0,0,0,0,0],
					           [0,0,0,0,0],
					           [0,0,0,0,0],
					           [0,0,0,0,0]
	                       ];
	
	var texturesIndexRIGHT   = [
									[0,0,0,0,0],
						           	[0,0,0,texture1,0],
						           	[0,0,0,0,0],
						           	[0,0,0,0,vpeter.texture],
						        	[0,0,0,0,0],
						           	[0,0,0,0,0]
			                       	
	                      		];
	
	var texturesIndexBOTTOM   = [										
	                             	
	                            	[0,0,0,0,0],
						         	[0,0,0,0,0],
						           	[0,0,0,0,0],
						           	[0,0,0,0,0],
						           	[0,vEva.texture,0,0,0],
						           	[0,0,0,0,vsodeoka.texture]
	                             
	                             ];
	
	
	var rx, ry, rz;
	
	var sphere;
	
	var mesh, helper, animationsH;
	var animations;
	var skins = [];
	
	var loader = new THREE.JSONLoader();

	

	function Video(id,wi,hi){
				this.id = id
				this.video = document.getElementById( id );
				this.video.play();
				
				this.image = document.createElement( 'canvas' );
				this.image.width = wi;
				this.image.height = hi;
				if(typeof w==='undefined') wi = window.innerWidth;
				if(typeof h==='undefined') hi = window.innerHeight;
				
				this.imageContext = this.image.getContext( '2d' );
				this.imageContext.fillStyle = '#000000';
				this.imageContext.fillRect( 0, 0, wi, hi );

				this.texture= new THREE.Texture( this.image );
				this.texture.minFilter = THREE.LinearFilter;
				this.texture.magFilter = THREE.LinearFilter;
				
				this.update = function(){
					if ( this.video.readyState === this.video.HAVE_ENOUGH_DATA) {

						this.imageContext.drawImage( this.video, 0, 0 );

						if ( this.texture ) this.texture.needsUpdate = true;

					}
				}
				//return this;
	}
	
	function Wall(position, size, texture, textureFace, color){
		var receiveShadow;
		if(typeof color==='undefined') color = 0xCCCCCC;
		if(typeof size==='undefined') {
			size.x = 500; 
			size.y = 375;
		}
		if(texture===0){
			this.faceMaterial = new THREE.MeshPhongMaterial({ ambient: color, color: color});
			receiveShadow = true;
		}else{
			this.textureMaterial = new THREE.MeshBasicMaterial( { map: texture, side:THREE.DoubleSide } );
			this.textureMaterial.transparent = true;
			this.material = new THREE.MeshPhongMaterial({ ambient: color, color: color});
			if ( textureFace === BOTTOM_WALL){
				this.materials = [this.material,this.material,this.material, this.material, this.material, this.textureMaterial];
				//console.log('bottom');
			} else if( textureFace === RIGHT_WALL){
				this.materials = [this.material,this.textureMaterial,this.material, this.material, this.material, this.material];
			} else if( textureFace === LEFT_WALL){
				this.materials = [this.textureMaterial,this.material,this.material, this.material, this.material, this.material];
			}else{
				this.materials = [this.material,this.material,this.material, this.material, this.textureMaterial, this.material];
			};
			this.faceMaterial = new THREE.MeshFaceMaterial( this.materials );
			receiveShadow = false;
		}
		
		this.geo = new THREE.CubeGeometry(size.x,size.y,size.z,1,1,1);
		this.geo.computeFaceNormals();
		this.geo.computeVertexNormals();
		this.mesh = new THREE.Mesh (this.geo,this.faceMaterial);
		
		this.mesh.position.set(position.x,position.y,position.z);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = receiveShadow;
		
	}
	

	
		function init() {
		
		var gifLoading = document.getElementById("gifLoading");
		gifLoading.style.visibility="hidden";
		var textLoading = document.getElementById("loadingText");
		textLoading.style.visibility="hidden";
		var arrows = document.getElementById("arrows");
		arrows.style.visibility="visible";
		var wrapper = document.getElementById("info-wrapper");
		wrapper.style.visibility="visible";
		var info2 = document.getElementById("info2");
		info2.style.visibility="visible";
		
		var textLoading = document.getElementById("loadingText");
		textLoading.style.visibility="hidden";
		
		container = document.getElementById("container");
		container.style.visibility="visible";
		//container = document.createElement( 'div' );
		//document.body.appendChild( container );
		
		ry = -180;
		rx = 0;
		rz = 0;
		posRandom = new THREE.Vector3(rx,ry,rz);

		

		scene = new THREE.Scene();
		var ambient = new THREE.AmbientLight( 0xffffff );
		scene.add( ambient );
		

		camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

		renderer.setClearColor( 0x888888 );
		renderer.setSize( window.innerWidth, window.innerHeight-5 );
		//renderer.shadowMapEnabled = true;
		//renderer.shadowMapSoft = true;
		container.appendChild( renderer.domElement );

		var dirLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
		dirLight.position.set( 0,3000, 0 );
		dirLight.target.position.set( 2000, 0, 2000 );
		//dirLight.castShadow = true;
		dirLight.shadowCameraVisible = false;
		dirLight.shadowCameraRight     =  2500;
		dirLight.shadowCameraLeft     = -2500;
		dirLight.shadowCameraTop      =  2500;
		dirLight.shadowCameraBottom   = -2500;
		//dirLight.shadowMapWidth = 1200;
		//dirLight.shadowMapHeight = 1200;
		


		scene.add( dirLight );
		
		//--Brian cave
		
		sphere = new THREE.Mesh( new THREE.SphereGeometry (150, 30, 30, 0, Math.PI*7/4,0,Math.PI/2 ),new THREE.MeshBasicMaterial({color: 0x000, side:THREE.DoubleSide, wireframe:false}));
		
		sphere.position.set(-50,-180,1750);
		sphere.scale.set(1,3,1);
		sphere.rotation.y= -1*(Math.PI/2.5);
		scene.add( sphere );
		var circle = new THREE.Mesh( new THREE.CircleGeometry( 150, 30 ),new THREE.MeshBasicMaterial({color: 0x222222}) );
		circle.rotation.set((Math.PI/2)*-1,0,0); 
		circle.position.set(-50,-179,1750);
		scene.add( circle );
		
		//--
	
		
		floorSize = new THREE.Vector2(3000,3500);
		var trumanH = 1000;
		trumanshow = new THREE.Mesh(new THREE.BoxGeometry(3000,trumanH,3500,5,5,5), 
				new THREE.MeshBasicMaterial({color: 0xff0000, wireframe:true }));
		
		
		var pivot = new THREE.Object3D();
		var pivotFloor = new THREE.Object3D();

		
		// FLOOR
		var floorMaterial = new THREE.MeshPhongMaterial( { 
		    //color: 0x996633, 
		    color: 0xffffff,
		    ambient: 0xffffff,
		    specular: 0xffffff,
		    shininess: 100,
		    side: THREE.DoubleSide
		} ) 
		var floorGeometry = new THREE.PlaneGeometry(floorSize.x, floorSize.y);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);

		floor.receiveShadow = true;

		floor.rotation.x = Math.PI/2;
		trumanshow.position.set(1500,trumanH/2-180,1750);
		pivotFloor.position.set(floorSize.x/2,-180,floorSize.y/2);
		pivotFloor.add(floor);
		pivot.add(pivotFloor);
		pivot.add(trumanshow);
		pivot.position.set(-500,0,-500);
		scene.add(pivot);
		//scene.add(trumanshow);
		
		//controls = new THREE.OrbitControls( cameraPersp, renderer.domElement );
		// model
		var objects = new Array(4);
		
		//////////////////////////////////////////////////////
		//labetinth
		
		for (var y = 0; y < lab.length; y++) {
			for (var x = 0; x < lab[y].length; x++){
				if (lab[y][x] & LEFT_WALL ){
					var wall = new Wall(new THREE.Vector3(x*500-250,0,y*500),new THREE.Vector3(10,hLEFT[y][x],wLEFT[y][x]),texturesIndexLEFT[y][x], LEFT_WALL);
					scene.add( wall.mesh );
				}
				if(lab[y][x] & TOP_WALL){
					var wall = new Wall(new THREE.Vector3(x*500,0,y*500-250),new THREE.Vector3(wTOP[y][x],hTOP[y][x],10),texturesIndexTOP[y][x], TOP_WALL);
					scene.add( wall.mesh );
				}
				if(lab[y][x] & RIGHT_WALL){
					var wall = new Wall(new THREE.Vector3((x*500+250)-((wRIGHT[y][x]-500)*0.5),(hRIGHT[y][x]-375)*0.5,y*500),new THREE.Vector3(10,hRIGHT[y][x],wRIGHT[y][x]),texturesIndexRIGHT[y][x], RIGHT_WALL);
					scene.add( wall.mesh );
				}
				if(lab[y][x] & BOTTOM_WALL){
					var wall = new Wall(new THREE.Vector3(x*500,0,y*500+250),new THREE.Vector3(wBOTTOM[y][x],hBOTTOM[y][x],10),texturesIndexBOTTOM[y][x], BOTTOM_WALL);
					scene.add( wall.mesh );
				}
			}
		}	

		
		var boxGeometry = new THREE.BoxGeometry(100,100,100,1,1,1);
		var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		MovingCube = new THREE.Mesh( boxGeometry, wireMaterial );
		MovingCube.position.set(0, 25.1, 0);
		MovingCube.rotation.y = (Math.PI/2)*-1;;
		//MovingCube.rotation.y = Math.PI/2;
		//MovingCube.position.set(0, 25.1,0);
		
		
		MovingCube.visible = false;
		
		MovingCube.add(camera);
		
		scene.add( MovingCube );
		prevPosition = MovingCube.position.clone();
		prevRot = MovingCube.rotation.clone();
		
		loader.load( "js/asset_6.js", function ( geometry, materials ) {

			geometry.computeVertexNormals();
			geometry.computeBoundingBox();

			ensureLoop( geometry.animations[0] );

			for ( var i = 0, il = materials.length; i < il; i ++ ) {

				var originalMaterial = materials[ i ];
				originalMaterial.skinning = true;
			}
			
			var s = 15;
			
			var material = new THREE.MeshFaceMaterial( materials );
			skinnedMesh = new THREE.SkinnedMesh( geometry, material, false );
			
			skinnedMesh.scale.set( s, s, s );

			skinnedMesh.position.x = 0;
			skinnedMesh.position.y = -180;
			skinnedMesh.position.z = 0;

			skinnedMesh.userData.delta = 25;
			
			NODO = new THREE.Object3D();
			NODO.add(skinnedMesh);
			NODO.position.set(500,0,500);
			
			
			scene.add(NODO);

			animation = new THREE.Animation( skinnedMesh, geometry.animations[0] );
			animation.play();
			animation.update( 0 );

		} );

		window.addEventListener( 'resize', onWindowResize, false );
		
		animate();

	}
		
	function ensureLoop( animation ) {

		for ( var i = 0; i < animation.hierarchy.length; i ++ ) {

			var bone = animation.hierarchy[ i ];

			var first = bone.keys[ 0 ];
			var last = bone.keys[ bone.keys.length - 1 ];

			last.pos = first.pos;
			last.rot = first.rot;
			last.scl = first.scl;

		}

	}
	
		
	

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}
	
	var moveNextFrame = false;
	var firstUpdate = 0;
	
	function update() {
		
		if(sabrinaCSS){
			document.getElementById("Popup6").style.color = "red";
		}else{
			document.getElementById("Popup6").style.color = "blue";
		}
		if(adamCSS){
			document.getElementById("Popup2").style.color = "red";
		}else{
			document.getElementById("Popup2").style.color = "blue";
		}
		if(peterCSS){
			document.getElementById("Popup5").style.color = "red";
		}else{
			document.getElementById("Popup5").style.color = "blue";
		}
		if(annaCSS){
			document.getElementById("Popup3").style.color = "red";
		}else{
			document.getElementById("Popup3").style.color = "blue";
		}
		if(brianCSS){
			document.getElementById("Popup4").style.color = "red";
		}else{
			document.getElementById("Popup4").style.color = "blue";
		}
		if(sodeokaCSS){
			document.getElementById("Popup1").style.color = "red";
		}else{
			document.getElementById("Popup1").style.color = "blue";
		}
		if(evaCSS){
			document.getElementById("Popup7").style.color = "red";
			document.getElementById("vEva").muted = false;
		}else{
			document.getElementById("Popup7").style.color = "blue";
			document.getElementById("vEva").muted = true;
		}
		
		if(flagTruman == true){
			trumanshow.visible = true;
		} else {
			trumanshow.visible = false;
		}
		
		if(brian){
			audio.play();
		}else{
			audio.pause();
		}
		MovingCube.position.y = 0;

		var delta = clock.getDelta(); 

		var rotateAngle = 10*Math.PI / 1680 *delta;   // pi/2 radians (90 degrees) per second
		
		if(keyarr){
			arrows = document.getElementById("arrows");
			$(arrows).fadeOut("slow");
			//console.log('keyarr');
		}			
		
		keypressed = false;
		if ( keyboard.pressed("left") ){     
			MovingCube.rotation.y += 100*Math.PI / 180 *delta;
			a = new THREE.Vector3(0,0,0);
			keypressed = true;
		}
		if ( keyboard.pressed("right") ){
			MovingCube.rotation.y -= 100*Math.PI / 180 *delta;
			a = new THREE.Vector3(0,0,0);
			keypressed = true;
		}
		/*if ( keyboard.pressed("W") ){
			MovingCube.rotation.x += 100*Math.PI / 180 *delta;
			a = new THREE.Vector3(0,0,0);
			keypressed = true;
		}
		if ( keyboard.pressed("S") ){
			MovingCube.rotation.x -= 100*Math.PI / 180 *delta;
			a = new THREE.Vector3(0,0,0);
			keypressed = true;
		}
		if ( keyboard.pressed("A") ){
			a = new THREE.Vector3(-1,0,0);
			keypressed = true;
		}
		if ( keyboard.pressed("D") ){
			a = new THREE.Vector3(1,0,0);
			keypressed = true;
		}*/	
		if ( keyboard.pressed("up") ){
			a = new THREE.Vector3(0,0,-1);
			keypressed = true;
		}
		if ( keyboard.pressed("down") ){
			a = new THREE.Vector3(0,0,1);
			keypressed = true;
		}
		
		
		
		
		if(keypressed){
			
			if(!keyarr){
				keyarr = true;
				//console.log('true');
			}

			a.applyQuaternion( MovingCube.quaternion ).normalize().multiplyScalar(10);
			MovingCube.position.add(a);
			var freqStep = 2.0;
			var ampStep = 2.0;
			MovingCube.position.add(new THREE.Vector3(0,Math.sin(clock.getElapsedTime() * 2*Math.PI * freqStep)*ampStep,0));
		
			
			var originPoint = prevPosition.clone();
			var localVertex = MovingCube.position.clone();
			var directionVector = localVertex.sub( originPoint );
			
			var casillaY = Math.floor ((MovingCube.position.z + 250 + a.z) / 500 );
			var casillaX = Math.floor ((MovingCube.position.x + 250 + a.x) / 500 );
			
			var collision = false;

			if ((casillaX < 5 && casillaX > 0) && (casillaY < 1)){
				sabrinaCSS = true;
			}else{
				sabrinaCSS = false;
			}
			if ((casillaX == 0) && (casillaY == 2)){
				adamCSS = true;
			}else{
				adamCSS = false;
			}
			if ((casillaX == 4) && (casillaY == 3)){
				peterCSS = true;
			}else{
				peterCSS = false;
			}
			if ((casillaX == 3) && (casillaY == 1)){
				annaCSS = true;
			}else{
				annaCSS = false;
			}
			if ((casillaX == 4) && (casillaY == 5)){
				sodeokaCSS = true;
			}else{
				sodeokaCSS = false;
			}
			if ((casillaX == 0) && ((casillaY > 2) && (casillaY < 5))){
				brianCSS = true;
			}else{
				brianCSS = false;
			}
			if ((casillaX == 1) && ((casillaY == 4))){
				evaCSS = true;
			}else{
				evaCSS = false;
			}
			
			if( !adam && (casillaX < 2)  && (casillaY == 2)){
				//console.log("adaaaaam!!!");

				adam = true;

			} 
			
			
			
			if ( casillaY < prevCasillaY) {
				if((lab[prevCasillaY][prevCasillaX] & TOP_WALL) || (lab[casillaY][casillaX] & BOTTOM_WALL)){
					collision = true;
				}	
			}
			
			else if ( casillaY > prevCasillaY) {
				if((lab[prevCasillaY][prevCasillaX] & BOTTOM_WALL) || (lab[casillaY][casillaX] & TOP_WALL)){
					collision = true;
				}	
			}
			
			else if ( casillaX < prevCasillaX) {
				if((lab[prevCasillaY][prevCasillaX] & LEFT_WALL) || (lab[casillaY][casillaX] & RIGHT_WALL)){
					collision = true;
				}	
			}
			
			else if ( casillaX > prevCasillaX) {
				if((lab[prevCasillaY][prevCasillaX] & RIGHT_WALL) || (lab[casillaY][casillaX] & LEFT_WALL)){
					collision = true;
				}	
			}
		
			
			if ( MovingCube.position.z > 1600 && MovingCube.position.z < 1850 && MovingCube.position.x > -500 && MovingCube.position.x < 70) {
				//console.log('inside!!!');
				if (!brian){
					brian = true;
					//console.log('toBrian');
				}
				if(prevPosition.z < MovingCube.position.z){
					if (MovingCube.position.z > 1800){
						MovingCube.position.z = prevPosition.z-10;
						//console.log(MovingCube.position.z + ' > 1800');
					}
				}
				if(prevPosition.x > MovingCube.position.x){
					if (MovingCube.position.x < -150){
						MovingCube.position.x = prevPosition.x;
						//console.log(MovingCube.position.x + ' < -150');
					}
				}
				if(prevPosition.x < MovingCube.position.x){
					if (MovingCube.position.x > 50){
						MovingCube.position.x = prevPosition.x;
						//console.log(MovingCube.position.x + ' > 50');
					}
				}
					
			}else{
				brian = false;
			}
			
			var floorHSize = floorSize * 0.5;
			var f1,f2,f3,f4;

			if(prevPosition.x < MovingCube.position.x){
				if (MovingCube.position.x > 2300){
					MovingCube.position.x = prevPosition.x;
					f1 = true;
					//console.log('z+');
				}else{
					f1 = false;
				}
			}
			if(prevPosition.x > MovingCube.position.x){
				if (MovingCube.position.x < -200){
					MovingCube.position.x = prevPosition.x;
					f2 = true;
					//console.log('z-');
				}else{
					f2 = false;
				}
			}
			if(prevPosition.z > MovingCube.position.z){
				if (MovingCube.position.z < -200){
					MovingCube.position.z = prevPosition.z;
					f3 = true;
					//console.log('x-');
				}else{
					f3 = false;
				}
			}
			if(prevPosition.z < MovingCube.position.z){
				if (MovingCube.position.z > 2700){
					MovingCube.position.z = prevPosition.z;
					f4 = true;
					//console.log('x+');
				}else{
					f4 = false;
				}
			}
			if (f1 || f2 || f3 || f4){
				flagTruman = true;
			}else{
				flagTruman = false;
			}
			
		
			if (collision){
				//console.log("collision")
				MovingCube.position.z = prevPosition.z;
				MovingCube.position.x = prevPosition.x;
				MovingCube.rotation.x = prevRot.x;
				MovingCube.rotation.y = prevRot.y;
				MovingCube.rotation.z = prevRot.z;
			}else{
				prevCasillaY = casillaY;
				prevCasillaX = casillaX;
			}
			prevPosition = MovingCube.position.clone();
			prevRot = MovingCube.rotation.clone();
		}
		


		vsodeoka.update();
		vpeter.update();
		vsabrina1.update();
		vsabrina2.update();
		vsabrina3.update();
		
		vEva.update();
		
		if(adam || firstUpdate<60){
			(adam_ferriss_loop(false))();
			firstUpdate++;
			//texture_adam.__webglTexture.update;
		}


		THREE.AnimationHandler.update( 0.4 * delta );
		rx = THREE.Math.randInt(0,2000);
		rz = THREE.Math.randFloat(0,2000);
		if(skinnedMesh){

				if (animation.currentTime > animation.data.length-0.1){
					//console.log('entra');
					rx = THREE.Math.randInt(0,2000);
					rz = THREE.Math.randFloat(0,2000)
					NODO.position.set(rx,0,rz);
				}
			//}
			NODO.lookAt(MovingCube.position);
		}
		

		
	}
	
	

	function render() {
		
		renderer.render( scene, camera );

	}

	function animate() {
		
		
	
		//rayGeo.verticesNeedUpdate = true;
		requestAnimationFrame( animate );				
		render();
		update();

	}
	
	
    "use strict";
    
    window.onload = init;



})();