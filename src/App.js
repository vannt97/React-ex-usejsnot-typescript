import "./styles.css";
import * as THREE from "three";
import TWEEN from "../node_modules/tween.js/src/Tween.js";
import TrackballControls from "three-trackballcontrols";
import { CSS3DRenderer, CSS3DObject } from "three-css3drenderer";
import { useEffect } from "react";
import { table, tableOfObjects, tableOfDogObjects } from "./data.js";

export default function App() {
  useEffect(() => {
    let camera, scene, renderer;
    let controls;

    const objects = [];
    const targets = { table: [], sphere: [], helix: [], grid: [] };

    init();
    animate();

    function init() {
      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 3000;

      scene = new THREE.Scene();

      // table

      for (let i = 0; i < tableOfObjects.length; i += 1) {
        let item = tableOfObjects[i];

        // console.log(item)
        const element = document.createElement("div");
        element.className = "element";
        element.style.backgroundColor =
          "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")";

        const number = document.createElement("div");
        number.className = "number";
        number.textContent = item.stat;
        element.appendChild(number);

        const symbol = document.createElement("div");
        symbol.className = "symbol";
        symbol.textContent = item.title;
        element.appendChild(symbol);

        const details = document.createElement("div");
        details.className = "details";
        details.innerHTML = item.description + "<br>" + item.stat;
        element.appendChild(details);

        const objectCSS = new CSS3DObject(element);
        objectCSS.position.x = Math.random() * 4000 - 2000;
        objectCSS.position.y = Math.random() * 4000 - 2000;
        objectCSS.position.z = Math.random() * 4000 - 2000;
        scene.add(objectCSS);

        objects.push(objectCSS);

        const object = new THREE.Object3D();
        object.position.x = item.gridCoord[0] * 140 - 1330;
        object.position.y = -(item.gridCoord[1] * 180) + 990;

        targets.table.push(object);
      }

      // sphere

      const vector = new THREE.Vector3();

      for (let i = 0, l = objects.length; i < l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;

        const object = new THREE.Object3D();

        object.position.setFromSphericalCoords(800, phi, theta);

        vector.copy(object.position).multiplyScalar(2);

        object.lookAt(vector);

        targets.sphere.push(object);
      }

      // helix

      for (let i = 0, l = objects.length; i < l; i++) {
        const theta = i * 0.175 + Math.PI;
        const y = -(i * 8) + 450;

        const object = new THREE.Object3D();

        object.position.setFromCylindricalCoords(900, theta, y);

        vector.x = object.position.x * 2;
        vector.y = object.position.y;
        vector.z = object.position.z * 2;

        object.lookAt(vector);

        targets.helix.push(object);
      }

      // grid

      for (let i = 0; i < objects.length; i++) {
        const object = new THREE.Object3D();

        object.position.x = (i % 5) * 400 - 800;
        object.position.y = -(Math.floor(i / 5) % 5) * 400 + 800;
        object.position.z = Math.floor(i / 25) * 1000 - 2000;

        targets.grid.push(object);
      }

      //

      renderer = new CSS3DRenderer();
      console.log(renderer)
      renderer.setSize(window.innerWidth, window.innerHeight);
      window.document
        .getElementById("container")
        .appendChild(renderer.domElement);

      //

      controls = new TrackballControls(camera, renderer.domElement);
      controls.minDistance = 500;
      controls.maxDistance = 6000;
      controls.addEventListener("change", render);

      const buttonTable = document.getElementById("table");
      buttonTable.addEventListener("click", function () {
        console.log('click .....')
        transform(targets.table, 2000);
      });

      const buttonSphere = document.getElementById("sphere");
      buttonSphere.addEventListener("click", function () {
        transform(targets.sphere, 2000);
      });

      const buttonHelix = document.getElementById("helix");
      buttonHelix.addEventListener("click", function () {
        transform(targets.helix, 2000);
      });

      const buttonGrid = document.getElementById("grid");
      buttonGrid.addEventListener("click", function () {
        transform(targets.grid, 2000);
      });

      transform(targets.table, 2000);

      //
      console.log(targets)
      window.addEventListener("resize", onWindowResize);
    }

    function transform(targets, duration) {
      TWEEN.removeAll();
      console.log('transform ....')
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        const target = targets[i];

        new TWEEN.Tween(object.position)
          .to(
            {
              x: target.position.x,
              y: target.position.y,
              z: target.position.z
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();

        new TWEEN.Tween(object.rotation)
          .to(
            {
              x: target.rotation.x,
              y: target.rotation.y,
              z: target.rotation.z
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }

      new TWEEN.Tween(this)
        .to({}, duration * 2)
        .onUpdate(render)
        .start();
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);

      render();
    }

    function animate() {
      requestAnimationFrame(animate);

      TWEEN.update();

      controls.update();
    }

    function render() {
      renderer.render(scene, camera);
    }
  });

  return (
    <div className="App">
      <div id="info">
        <a href="https://threejs.org" target="_blank" rel="noopener">
          three.js
        </a>{" "}
        css3d - periodic table.
      </div>
      <div id="container"></div>
      <div id="menu">
        <button id="table">TABLE</button>
        <button id="sphere">SPHERE</button>
        <button id="helix">HELIX</button>
        <button id="grid">GRID</button>
      </div>
    </div>
  );
}
