import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        const stats = new Stats();
        document.body.appendChild(stats.domElement);

        // 创建场景
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x101010);

        // 创建相机
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10);
        camera.position.z = 3;

        // 渲染
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 创建几何
        const geometry = new THREE.BufferGeometry();
        const position = [];
        const color = [];

        const num = 1000 * 3;
        for (let i = 0; i < num; i++) {
            // 添加xyz
            position.push(Math.random() - 0.5);
            position.push(Math.random() - 0.5);
            position.push(Math.random() - 0.5);

            // 添加rgba
            color.push(Math.random() * 255);
            color.push(Math.random() * 255);
            color.push(Math.random() * 255);
            color.push(Math.random() * 255);
        }
        const positionAttribute = new THREE.Float32BufferAttribute(position, 3);
        const colorAttribute = new THREE.Uint8BufferAttribute(color, 4);
        colorAttribute.normalized = true;
        geometry.setAttribute('position', positionAttribute);
        geometry.setAttribute('color', colorAttribute);

        // 创建材质
        const material = new THREE.RawShaderMaterial( {

            uniforms: {
                time: { value: 1.0 }
            },
            vertexShader: document.getElementById( 'vertexShader' ).textContent,
            fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
            transparent: true,
            side: THREE.DoubleSide
        
        } );

        // 创建网格
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        divRef.current.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function() {
            renderer.render(scene, camera);
        })

        function animate() {
            requestAnimationFrame(animate)
            const time = performance.now();
            const object = scene.children[ 0 ];

            object.rotation.y = time * 0.0005;
            object.material.uniforms.time.value = time * 0.005;
            renderer.render(scene, camera);
            stats.update();
        }
        animate();

        function onWindowResize() {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        }
        window.onresize = onWindowResize;

        return () => {
            if (divRef.current) {
                divRef.current.removeChild(renderer.domElement);
            }
        };
    })

    return <div ref={divRef} />
}

export default App;