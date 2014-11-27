

var geometry, material, mesh, renderer, scene, camera;
init();
render();

function init(){
	geometry = new THREE.CubeGeometry(200,200,200);
	material = new THREE.MeshBasicMaterial({color: 0xff00ff});
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0,0,0);
	camera = new THREE.PerspectiveCamera(45, window.innerWidth/ window.innerHeight, 1, 1000);
	camera.lookAt = (mesh);
	scene = new THREE.Scene();
	scene.add(mesh);
	scene.add(camera);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	
}

function update(){
	
}

function render(){
	renderer.render(scene, camera);
}