import { useEffect } from "react";
import { CSS3DRenderer, CSS3DObject } from "three-css3drenderer";
import * as THREE from "three";

export default function TestCss3dRenderer() {
  useEffect(() => {
    let camera, scene, renderer, objEle3d;
    function init() {
      // set came and scene
      camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.z = 800;
      scene = new THREE.Scene();
      // set renderer
      renderer = new CSS3DRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      window.document
        .getElementById("container")
        .appendChild(renderer.domElement);

      let ele = document.createElement("div");
      objEle3d = new CSS3DObject(ele);
      ele.innerHTML = "<h1>Hello world</h1>";
      objEle3d.position.set(0, 0, 0);
      scene.add(objEle3d);
    }
    function render() {
      objEle3d.rotation.y += 0.01;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    init();
    render();
  }, []);

  return (
    <div>
      <div>
        <input type="text" />
      </div>
      <div id="container"></div>
    </div>
  );
}
