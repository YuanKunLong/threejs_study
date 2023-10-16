import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        // 1. 创建场景
        const scene = new THREE.Scene();
        // 2. 创建几何
        const geome = new THREE.BoxGeometry(1, 1, 1);
        // 3. 创建几何的材质样式
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00, // 材质的颜色
            transparent: true, // 开启透明
            opacity: 0.5, // 透明度
        })
        // 4. 创建不受光影响的网材质格
        const cube = new THREE.Mesh(geome, material);
        // 将网格添加在场景中
        scene.add(cube);
        // 5. 创建渲染盒子
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        divRef.current.appendChild(renderer.domElement);
        // 6. 创建照相机
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // AxerHelper 辅助观察的坐标系
        const axesHelper = new THREE.AxesHelper(10);
        scene.add(axesHelper);

        // !test
        cube.position.set(3, 0, 0);
        camera.position.set(1, 1, 5);
        camera.lookAt(0, 1, 0)

        // !光
        // 创建受光影响的网格材质
        const geome1 = new THREE.BoxGeometry(1, 1, 1);
        const lambertMeterial = new THREE.MeshLambertMaterial();
        const cube1 = new THREE.Mesh(geome1, lambertMeterial);
        // cube1.position.y = 2;
        // 创建光源 第一个参数：光的颜色 第二的参数：光照的强度
        const pointLight = new THREE.PointLight(0x00ff00, 100);
        // 设置光照的方向 把光源点放在X轴上 从X轴正5的位置照射
        pointLight.position.set(-5, 1, 1);
        // 设置光源辅助观察
        const pointLightHelper = new THREE.PointLightHelper(pointLight, 3);
        scene.add(cube1);
        // scene.add(pointLight);
        // scene.add(pointLightHelper);

        // 环境光
        // const ambient = new THREE.AmbientLight(0xffffff, 1);
        // scene.add(ambient);
        // 平行光
        // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        // directionalLight.position.set(1, 0, 0);
        // scene.add(directionalLight);
        // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1, 0xff0000);
        // scene.add(directionalLightHelper);
        // 聚光灯
        const spotLight = new THREE.SpotLight(0x00ff00, 100);
        scene.add(spotLight);
        const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0xffffff);
        scene.add(spotLightHelper);

        // !轨道控制
        // 设置相机控件轨道控制器OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        // 监听鼠标、键盘事件 如果OrbitControls改变了相机参数 重新调用渲染器渲染场景
        controls.addEventListener('change', function() {
            // 重新渲染
            renderer.render(scene, camera);
            // 本质是改变相机的参数
            console.log('camera.position', camera.position);
        })


        // 简易动画
        function animate() {
            // requestAnimationFrame(animate);

            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        animate();



        return () => {
            if (divRef.current) {
                divRef.current.removeChild(renderer.domElement);
            }
        };
    })

    return <div ref={divRef} />
}

export default App;