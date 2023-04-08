import React, { useMemo } from 'react'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'


// eslint-disable-next-line react/prop-types
function Model({ url, scale, position, color }) {
  var material = new THREE.MeshPhongMaterial( {
    color: color,
    polygonOffset: true,
    polygonOffsetFactor: 1, 
    polygonOffsetUnits: 1
  } )

  const obj = useLoader(OBJLoader, url)
  obj.scale.set(scale.x, scale.y, scale.z);
  
  obj.position.set(position.x, position.y, position.z);
  obj.children[0].material = material
            obj.traverse(function (child) {
                  if ((child).isMesh) {
                      (child).material = material
                  }
              })
  return (<primitive object={obj}></primitive>)
}

function Model2({url, scale, position, color}) {
  
    const material = new THREE.MeshPhongMaterial( {
      color: color,
      polygonOffset: true,
      polygonOffsetFactor: 1, 
      polygonOffsetUnits: 1
    } )
    return (
        <mesh
          geometry={new THREE.SphereGeometry(5, 32, 32)}
          material={material}
          position={[position.x, position.y, position.z]}
        />
    );
  };
  

export {Model, Model2}