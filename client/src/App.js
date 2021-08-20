import React, { useRef } from "react";
import './App.css';

import * as THREE from 'three';
import TrackballControls from 'three-trackballcontrols';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

function App() {
  const spaceCanvasRef = useRef(null);
  const [craft, setCrafts] = React.useState([]);
  const [astronauts, setAstronauts] = React.useState({});

  React.useEffect(() => {
    fetch("/astronaut/get-astronauts")
      .then((res) => res.json())
      .then((data) => {

        // query and set the data
        const ships = [...new Set(data.people.map(x => x.craft))];
        setCrafts(ships);

        let astronautList = {};
        for (let i = 0; i < ships.length; i++) {
          astronautList[ships[i]] = "";
          for (let j = 0; j < data.number; j++) {
            if (data.people[j].craft === ships[i]) {
              astronautList[ships[i]] += data.people[j].name + "\n";
            }
          }
        }
        setAstronauts(astronautList);


        // set up the scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 1000);
        const renderer = new THREE.WebGLRenderer({});
        renderer.setSize(window.innerWidth, window.innerHeight);
        spaceCanvasRef.current.appendChild(renderer.domElement);
        const controls = new TrackballControls(camera, renderer.domElement);

        const light = new THREE.AmbientLight(0x404040, 5);
        scene.add(light);

        let ptLight = new THREE.PointLight(0xFBFAF5, 0.3);
        ptLight.position.set(0, 1000, 0);
        scene.add(ptLight);

        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const nightTexture = new THREE.TextureLoader().load('assets/earthmap1k.jpg');
        const material = new THREE.MeshPhongMaterial({ map: nightTexture });
        material.bumpMap = new THREE.TextureLoader().load('assets/earthbump1k.jpg');
        material.bumpScale = 0.2;
        material.specularMap = new THREE.TextureLoader().load('assets/earthspec1k.jpg');
        material.specular = new THREE.Color('grey');
        let earthMesh = new THREE.Mesh(geometry, material);
        scene.add(earthMesh);

        let canvasCloudMat = new THREE.MeshStandardMaterial({ color: "#FFF", transparent: true, side: THREE.DoubleSide, alphaTest: 0, opacity: 0.6 });
        canvasCloudMat.alphaMap = new THREE.TextureLoader().load('assets/africa_clouds_8k.jpeg');
        const cloudGeometry = new THREE.SphereGeometry(0.51, 32, 32);
        const cloudMesh = new THREE.Mesh(cloudGeometry, canvasCloudMat);
        earthMesh.add(cloudMesh);

        const starGeo = new THREE.SphereGeometry(2, 32, 32);
        let starMat = new THREE.MeshBasicMaterial();
        starMat.map = new THREE.TextureLoader().load('assets/galaxy_starfield.png');
        starMat.side = THREE.BackSide;
        const starMesh = new THREE.Mesh(starGeo, starMat);
        scene.add(starMesh);

        camera.position.z = 5;

        controls.update();

        // Labels
        const earthDiv = document.createElement('div');
        earthDiv.className = 'label';
        earthDiv.textContent = 'Earth';
        earthDiv.style.marginTop = '-1em';
        let earthLabel = new CSS2DObject(earthDiv);
        earthLabel.position.set(0, 0.53, 0);
        earthMesh.add(earthLabel);

        let labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.id = 'labelRenderer';
        labelRenderer.domElement.style.pointerEvents = 'none';
        labelRenderer.domElement.style.top = '0px';
        document.body.appendChild(labelRenderer.domElement);

        // ships
        let xDistance = []; // array containing the x translation
        let childShips = []; // array containing the child objects
        const gltfLoader = new GLTFLoader();
        const url = "assets/near_satellite/scene.gltf";


        for (let i = 0; i < ships.length; i++) {
          let child;
          gltfLoader.load(url, (gltf) => {
            child = gltf.scene;
            child.scale.multiplyScalar(1 / 45);
            scene.add(child);

            const xTranslation = Math.random() * (0.8 - 0.5) + 0.5;
            const yTranslation = Math.random() * (0.5 - 0.1) + 0.1;
            xDistance[i] = { "x": xTranslation, "y": yTranslation };

            child.position.x = xTranslation;
            child.position.y = yTranslation;
            childShips[i] = child;
            earthMesh.add(child);

            const shipDiv = document.createElement('div');
            shipDiv.id = `ship${i}`;
            shipDiv.className = 'label';
            shipDiv.textContent = `${ships[i]}`;
            shipDiv.style.marginTop = '-3em';
            const shipLabel = new CSS2DObject(shipDiv);
            shipLabel.position.set(0, 5, 0);
            child.add(shipLabel);

            // add the astronauts
            let astronautList = "";
            for (let j = 0; j < data.people.length; j++) {
              if (data.people[j].craft === ships[i]) {
                astronautList += data.people[j].name + "\n";
              }
            }

            shipDiv.textContent += "\n" + astronautList;

          })

        }

        // animation
        const animate = function () {
          requestAnimationFrame(animate);

          earthMesh.rotation.y += 0.001;
          cloudMesh.rotation.y += 0.002;

          for (let i = 0; i < childShips.length; i++) {
            childShips[i].position.set(0, 0, 0);
            let yRotation = 0.008;
            let zRotation = 0.008;
            if (i % 2 === 0) {
              yRotation *= -1;
              zRotation *= -1;
            }
            childShips[i].rotateY(yRotation);
            childShips[i].rotateX(0.001);
            childShips[i].rotateZ(zRotation);
            childShips[i].translateX(xDistance[i]["x"]);
            childShips[i].translateY(xDistance[i]["y"]);
          }

          controls.update();
          renderer.render(scene, camera);
          labelRenderer.render(scene, camera);
        };
        animate();

      });
  }, []);


  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       {!craft ? "Loading..." : craft}
    //     </p>
    //   </header>
    // </div>
    <div ref={spaceCanvasRef}></div>
  );
}

export default App;
