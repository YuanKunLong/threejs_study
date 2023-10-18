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

        // !通过顶点创建立方体
        // 创建一个空的几何体对象
        const geometry = new THREE.BufferGeometry();
        // 创建顶点
        const vertices = new Float32Array([
            0, 0, 0, //顶点1坐标
            2, 0, 0, //顶点2坐标
            2, 2, 0, //顶点3坐标
            0, 2, 0, //顶点6坐标
        ])
        // 给空的几何体添加顶点
        const attribue = new THREE.BufferAttribute(vertices, 3);
        geometry.setAttribute('position', attribue);

        // // 设置颜色
        const pointLight = new THREE.PointLight(0x00ff00, 10);
        pointLight.position.set(1,1,1)
        scene.add(pointLight);
        // const pointLightHelper = new THREE.PointLightHelper(pointLight, 3);
        // scene.add(pointLightHelper);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00, 
            wireframe: true, // 线条模式渲染mesh对应的三角形数据
        });
        // // 创建网格
        // const cube = new THREE.Points( geometry, material );
        // scene.add( cube );

        // const material = new THREE.LineBasicMaterial({
        //     color: 0x00ff00
        // })
        const cube = new THREE.Mesh(geometry, material);
        scene.add( cube );
        // // 顶点复用
        const indexes = new Uint16Array([
            0, 1, 2, 0, 2, 3
        ])
        geometry.index = new THREE.BufferAttribute(indexes, 1); // 1个为1组
        const normals = new Float32Array([
            0, 0, 1, //顶点1法线( 法向量 )
            0, 0, 1, //顶点2法线
            0, 0, 1, //顶点3法线
            0, 0, 1, //顶点4法线
            0, 0, 1, //顶点5法线
            0, 0, 1, //顶点6法线
        ])
        geometry.attributes.normal = new THREE.BufferAttribute(normals, 3); 

        // 矩形平面
        const geometry3 = new THREE.PlaneGeometry(10, 5, 2, 2);
        const cube3 = new THREE.Mesh(geometry3, material);
        scene.add(cube3);
        geometry3.translate(3,3,0);
        geometry3.center();
        geometry3.rotateX(Math.PI / 4);
        console.log(geometry3);
        console.log(geometry3.attributes.position);
        console.log(geometry3.index);

        const geometry4 = new THREE.SphereGeometry(2, 16, 16);
        const material4 = new THREE.MeshBasicMaterial({
            color: 0x00ff00, 
            wireframe: true,
        });
        const cube4 = new THREE.Mesh(geometry4, material4);
        scene.add(cube4);
        

        camera.position.z = 5;

        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            requestAnimationFrame( animate );
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            geometry3.rotateX(Math.PI / 4);

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