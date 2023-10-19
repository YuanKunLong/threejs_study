import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//@ts-ignore
import img1 from './assets/a.jpg';

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

        // // 创建立方体
        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // // 设置颜色
        // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // // 创建网格
        // const mesh = new THREE.Mesh( geometry, material );
        // scene.add( mesh );

        const geometry = new THREE.PlaneGeometry(10,10);
        const geometry1 = new THREE.BoxGeometry(5,5,5);
        const geometry2 = new THREE.SphereGeometry(10, 30,30);
        const geometry3 = new THREE.CircleGeometry(6, 10);
        const texLoader = new THREE.TextureLoader();
        // load方法加载图像，返回一个纹理对象Texture
        const texture = texLoader.load(img1);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        })
        const mesh = new THREE.Mesh( geometry, material );
        const mesh1 = new THREE.Mesh( geometry1, material );
        const mesh2 = new THREE.Mesh( geometry2, material );
        const mesh3 = new THREE.Mesh( geometry3, material );
        mesh.position.x = 15;
        mesh1.position.y = 15;
        mesh2.position.x = -15;
        mesh3.position.z = -20;
        scene.add( mesh,mesh1,mesh2,mesh3 );
        console.log('uv', geometry.attributes.uv);
        console.log(999,mesh.material);

        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(6,6);
        // mesh.rotateX(-Math.PI / 2);
        // !自定义UV坐标
        const uvs = new Float32Array([
            // 0,0, // 左下角
            // 1,0, // 右下角
            // 1,1, // 右上角
            // 0,1 // 左上角
            0.5, 0, 
            0, 0, 
            0, 0.5, 
            0.5, 0.5, 
        ])
        geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2) // 2个为一组
        // 添加一个辅助网格地面
        const gridHelper = new THREE.GridHelper(300, 25, 0x004444, 0x004444);
        scene.add(gridHelper)

        // texture.offset.x += 0.5;
        // texture.offset.y += 0.5;
        // // 重复映射 THREE.RepeatWrapping
        // texture.wrapS = THREE.RepeatWrapping;//对应offste.x偏移
        // texture.wrapT = THREE.RepeatWrapping;//对应offste.y偏移
        // texture.repeat.x = 5;
        // 渲染循环
        function render() {
            texture.offset.x += 0.01;//设置纹理动画：偏移量根据纹理和动画需要，设置合适的值
            renderer.render(scene, camera);
            requestAnimationFrame(render);
        }
        texture.flipY = false;
        // render();



        camera.position.z = 30;

        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            requestAnimationFrame( animate );
            // mesh2.rotation.x += 0.01;
            mesh2.rotation.y += 0.01;

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


        return () => {
            if (divRef.current) {
                divRef.current.removeChild(renderer.domElement);
            }
        };
    })

    return <div ref={divRef} />
}

export default App;