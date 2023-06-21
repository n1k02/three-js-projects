import React, { useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

// based on "Chevrolet Corvette (C7)" (https://sketchfab.com/3d-models/chevrolet-corvette-c7-2b509d1bce104224b147c81757f6f43a)
// by Martin Trafas (https://sketchfab.com/Bexxie) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
export function Car() {
  const gltf = useLoader(
      GLTFLoader,
      process.env.PUBLIC_URL + "models/car/rx7.glb",
      (loader) => {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/"); // Путь к файлам декодера Draco

        // Добавляем слушателя событий 'progress' к загрузчику
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            process.env.PUBLIC_URL + "models/car/rx7.glb",
            () => {
              // Код, выполняемый при успешной загрузке
              console.log("Модель успешно загружена!");
               document.querySelector('.loading').style.display = 'none'
            },
            (xhr) => {
              // Код, выполняемый во время загрузки
              const percentLoaded = (xhr.loaded / xhr.total) * 100;
              console.log(`Загружено: ${percentLoaded}%`);
            },
            (error) => {
              // Код, выполняемый в случае ошибки загрузки
              console.error("Ошибка загрузки модели:", error);
                document.querySelector('.loading').innerHTML = 'Error loading 3d model'
                document.querySelector('.loading').style.color = 'red'
            }
        );
      }
  );

  useEffect(() => {
    // gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.set(0, -0.035, 0);
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 17;
      }
    });
  }, [gltf]);

  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime() * 2;

    let group = gltf.scene.children[0].children[0].children[0].children[0].children[1].children[5].children[0]
    group.children[0].rotation.x = t;
    group.children[1].rotation.x = t;
    group.children[2].rotation.x = t;
    group.children[3].rotation.x = t;
    // console.log(group)
  });

  return <primitive object={gltf.scene} />;
}

