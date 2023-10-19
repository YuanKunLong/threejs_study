import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        // 创建场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        divRef.current.appendChild( renderer.domElement );

        // 创建立方体
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // 设置颜色
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // 创建网格
        const mesh = new THREE.Mesh( geometry, material );
        scene.add( mesh );

        camera.position.z = 5;

        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            requestAnimationFrame( animate );
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;

            renderer.render( scene, camera );
        }
        animate();

        // 辅助线
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function() {
            // 重新渲染
            renderer.render(scene, camera);
            // 本质是改变相机的参数
            console.log('camera.position', camera.position);
        })

        const stats = new Stats();
        stats.setMode(1);
        document.body.appendChild(stats.domElement);


        return () => {
            if (divRef.current) {
                divRef.current.removeChild(renderer.domElement);
            }
        };
    })

    return <div ref={divRef} />
}

export default App;