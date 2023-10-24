import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import moxing from '@src/assets/test.glb';

function App() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        // 创建场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            preserveDrawingBuffer: true,
            // 设置对数冲突缓存区，优化深度冲突问题（模型闪烁）
            logarithmicDepthBuffer: true
        });
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

        // !建模
        const loader = new GLTFLoader();
        loader.load(moxing, function(gltf) {
            console.log(gltf);
            scene.add(gltf.scene);
            gltf.scene.traverse(function(obj) {
                if(obj.isMesh) {
                    obj.material = new THREE.MeshBasicMaterial({
                        color: 0xffffff
                    })
                }
            })
            const nameNode = gltf.scene.getObjectByName('锥体');
            nameNode.material.color.set(0x0000ff)
        },function(xhr) {
            const percent = xhr.loaded / xhr.total;
            console.log('加载进度' + percent,xhr);
            
        })
        camera.position.set(7,7,7);
        const light = new THREE.PointLight(0x00ff00,10,100);
        light.position.set(5,5,5)
        scene.add(light);
        // 解决色差问题
        renderer.outputColorSpace = THREE.SRGBColorSpace;// 设置为SRGB颜色空间
        

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
        //@ts-ignore
        stats.setMode(1);
        //@ts-ignore
        document.body.appendChild(stats.domElement);

        renderer.setClearColor(0xb9d3ff, 0.5)

        return () => {
            if (divRef.current) {
                divRef.current.removeChild(renderer.domElement);
            }
        };
    })

    return <div ref={divRef} />
}

export default App;