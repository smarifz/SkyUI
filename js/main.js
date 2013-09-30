// MAIN
// standard global variables
var container, scene, camera, cube, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
// var clock = new THREE.Clock();
var time = 0;
var ORIGIN = new THREE.Vector3();
var reset;

// SCENE
scene = new THREE.Scene();

// custom global variables
var cube;
var time = 20;
var isDone = false;
var plane;

init();
animate();

// FUNCTIONS
function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	texture_placeholder = document.createElement('canvas');
	texture_placeholder.width = 128;
	texture_placeholder.height = 128;

	projector = new THREE.Projector();

	// CAMERA
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 1500;
	camera = new THREE.PerspectiveCamera(75, SCREEN_WIDTH / SCREEN_HEIGHT, 1,
			2000000);
	camera.position.z = 2000;
	// camera.setLens(15);

	scene.add(camera);
	camera.position.set(0, 150, 300);
	camera.lookAt(scene.position);

	// RENDERER
	if (Detector.webgl) {
		renderer = new THREE.WebGLRenderer({
			antialias : true
		});
		console.log('WebGL Activated');
	} else {
		renderer = new THREE.CanvasRenderer();
		console.log('Canvas Renderer Activated');
	}

	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
	container = document.createElement('div');
	document.body.appendChild(container);
	container.appendChild(renderer.domElement);

	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({
		charCode : 'm'.charCodeAt(0)
	});

	// LISTENERS
	document.addEventListener('mouseup', onDocumentMouseUp, false);
	document.addEventListener('mousedown', onDocumentMouseDown, false);

	// CONTROLS
	controls = new THREE.TrackballControls(camera);

	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '10px';
	stats.domElement.style.zIndex = 100;
	// container.appendChild(stats.domElement);

	// LIGHT
	// var light = new THREE.PointLight(0xffffff);
	// light.position.set(0, 250, 0);
	// scene.add(light);

	// SKYBOX
	var materials = [ loadTexture('images/px.jpg'), // right
	loadTexture('images/nx.jpg'), // left
	loadTexture('images/py.jpg'), // top
	loadTexture('images/ny.jpg'), // bottom
	loadTexture('images/pz.jpg'), // back
	loadTexture('images/nz.jpg') // front

	];

	var skybox = new THREE.Mesh(new THREE.CubeGeometry(1024, 1204, 1024, 7, 7,
			7), new THREE.MeshFaceMaterial(materials));
	// skybox.scale.x = -1;
	scene.add(skybox);

	for ( var i = 0, l = skybox.geometry.vertices.length; i < l; i++) {

		var vertex = skybox.geometry.vertices[i];

		vertex.normalize();
		vertex.multiplyScalar(550);

	}

	var ambient = new THREE.AmbientLight(0xffffff);
	scene.add(ambient);

	var pointLight = new THREE.PointLight(0xffffff, 2);
	scene.add(pointLight);

	// //////////
	// CUBE ///////////////////////////////////////////////////////
	// //////////

	// Cube with different images on each face
	var materialArray = [];
	materialArray.push(new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/games_with_text.png')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/movies_with_text.png')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/music_icon.png')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/my_flight_icon.png')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/movies_with_text.png')
	}));
	materialArray.push(new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/top_connect.png')
	}));
	var DiceBlueMaterial = new THREE.MeshFaceMaterial(materialArray);

	var DiceBlueGeom = new THREE.CubeGeometry(150, 150, 150, 1, 1, 1);
	cube = new THREE.Mesh(DiceBlueGeom, DiceBlueMaterial);
	cube.position.set(0, 0, 0);
	cube.overdraw = true;
	scene.add(cube);

	for ( var i = 0, l = cube.geometry.vertices.length; i < l; i++) {

		var vertex2 = cube.geometry.vertices[i];

		vertex2.normalize();
		vertex2.multiplyScalar(150);

	}

	// RESET CAMERA BUTTON ///////////////////////////////////////////

	reset = document.getElementById('reset');
	reset.style.position = 'absolute';
	reset.style.top = '45%';
	reset.style.width = '40px';
	reset.style.height = '40px';
	reset.style.border = "1px solid black";
	//reset.style.boxShadow = "5px 5px 1.2em black";
	document.body.appendChild(reset);

	// PRELOADER/////////////////////////////////////////////////////////////////
	var preloader = new THREE.Object3D();
	preloader.position.set(0, 100, 0);
	scene.add(preloader);

	var preloaderBg = new THREE.Mesh(new THREE.PlaneGeometry(500, 30, 1, 1),
			new THREE.MeshBasicMaterial({
				color : 0x0f0f2e,
				transparent : true
			}));
	preloader.add(preloaderBg);

	var preloaderLine = new THREE.Mesh(new THREE.PlaneGeometry(494, 24, 1, 1),
			new THREE.MeshBasicMaterial({
				color : 0x00e5e5,
				transparent : true
			}));
	preloaderLine.position.set(0, 0, 1);
	preloaderLine.scale.x = 0;
	preloader.add(preloaderLine);
	//
	// IMAGE PRELOADER
	var manifest = [ {
		src : "music_icon.png",
		id : "image0"
	}, {
		src : "games_icon.png",
		id : "image1"
	} ];

	var queue = new createjs.LoadQueue(false, 'images/');
	queue.addEventListener("progress", handleImageLoadProgress);
	queue.addEventListener("complete", handleImageLoadComplete);
	queue.addEventListener("fileload", handleImageLoad);
	queue.loadManifest(manifest);

	function handleImageLoadProgress(event) {
		// console.log("progress: "+event.progress);
		TweenMax.to(preloaderLine.scale, 0.5, {
			x : event.progress
		});
	}

	function handleImageLoadComplete(event) {
		// all images loaded
		TweenMax.to(preloaderBg.material, 0.5, {
			opacity : 0,
			delay : 0.5
		});
		TweenMax.to(preloaderLine.material, 0.5, {
			opacity : 0,
			delay : 0.5,
			onComplete : removePreloader
		});
		// setTimeout(mainF, 1000);
	}

	function removePreloader() {
		scene.remove(preloader);
	}

	function handleImageLoad(event) {
		// image loaded
	}
	
	//SMALL PLANE /////////////////////////////////////////////
	var geometry1 = new THREE.CubeGeometry(20, 20, 20);
	var material1 = new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture('images/building_windows.jpg')
	});
	plane = new THREE.Mesh(geometry1, material1);
	plane.position.set(300, 200, 200);
	scene.add(plane);
	
	

}

function animate() {

	render();
	requestAnimationFrame(animate);
	rotateCube(time);
	time = time - 1;
	update();

}

function update() {
	
	
	var time = Date.now() * 0.05;
	
	console.log('time '+time);

	plane.position.x = Math.sin(time * .05) * 510;
	//plane.position.y = Math.cos(time * .05) * 450;
	plane.position.z = Math.cos(time * .05) * 510;
	
	if (keyboard.pressed("z")) {
		// do something
	}

	reset.addEventListener("mousedown", function() {

		new TWEEN.Tween(camera.position).to({
			x : 0,
			y : 150,
			z : 300
		}, 1000).easing(TWEEN.Easing.Exponential.Out).start();

		camera.up.set(0, 1, 0);

	}, false);

	controls.update();
	stats.update();
	TWEEN.update();
}

function render() {

	controls.noZoom = false;
	controls.noPan = true;
	renderer.render(scene, camera);
}

function loadTexture(path) {

	var texture = new THREE.Texture(texture_placeholder);
	var material = new THREE.MeshBasicMaterial({
		map : texture,
		overdraw : true,
		side : THREE.BackSide
	});

	var image = new Image();
	image.onload = function() {

		texture.needsUpdate = true;
		material.map.image = this;

		render();

	};
	image.src = path;

	return material;

}

function onDocumentMouseMove(event) {

	document.removeEventListener('mouseup', onDocumentMouseUp, false);
	document.removeEventListener('mouseout', onDocumentMouseOut, false);
	document.removeEventListener('mousedown', onDocumentMouseDown, false);

}

function onDocumentMouseDown(event) {
}

function onDocumentMouseUp(event) {

	console.log("inside mouse up");

	event.preventDefault();

	var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1, 0.5);
	projector.unprojectVector(vector, camera);

	var raycaster = new THREE.Raycaster(camera.position, vector.sub(
			camera.position).normalize());

	var intersects = raycaster.intersectObject(cube);

	if (intersects.length > 0) {

		console.log("Intersected..Matching face to page..");

		if (intersects[0].face.normal.x == 0
				&& intersects[0].face.normal.y == 0
				&& intersects[0].face.normal.z == -1) {
			window.open('sample.html', '_blank');
		}
		if (intersects[0].face.normal.x == 0
				&& intersects[0].face.normal.y == 0
				&& intersects[0].face.normal.z == 1) {
			window.open('sample.html', '_blank');
		}
		if (intersects[0].face.normal.x == 1
				&& intersects[0].face.normal.y == 0
				&& intersects[0].face.normal.z == 0) {
			window.open('sample.html', '_blank');
		}
		if (intersects[0].face.normal.x == 0
				&& intersects[0].face.normal.y == -1
				&& intersects[0].face.normal.z == 0) {
			window.open('sample.html', '_blank');
		}
		if (intersects[0].face.normal.x == -1
				&& intersects[0].face.normal.y == 0
				&& intersects[0].face.normal.z == 0) {
			window.open('sample.html', '_blank');
		}
		if (intersects[0].face.normal.x == 0
				&& intersects[0].face.normal.y == 1
				&& intersects[0].face.normal.z == 0) {
			window.open('sample.html', '_blank');
		}

	}

}

function rotateCube(time) {
	var SPEED = .2;

	if (time >= 0) {

		cube.rotation.y -= SPEED;
		if (time == 0) {
			isDone = true;
		}
	}

	if (isDone) {
		if (cube.rotation.y < 0) {
			cube.rotation.y += SPEED;
		} else {
			isDone = false;
		}
	}

}
