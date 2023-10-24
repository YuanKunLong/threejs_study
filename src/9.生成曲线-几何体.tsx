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

        // ! 绘制圆弧
        // 创建材质
        const geometry = new THREE.BufferGeometry();
        // 生成原型顶点
        const R = 100; // 圆半径
        const N = 50; // 分段数量
        // 圆弧
        const sp = 2 * Math.PI / N; // 两个相邻点间隔弧度
        // 半圆弧
        // const sp = 1 * Math.PI / N;
        
        // 批量生成圆形顶点
        const arr = [];
        for (let i = 0; i < N; i++) {
            const angle = sp * i; // 当前点弧度
            // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
            const x = R * Math.cos(angle);
            const y = R * Math.sin(angle);
            arr.push(x, y, 0);
        }
        // 类型数组创建顶点数据
        const vertices = new Float32Array(arr);
        // 创建属性缓存区对象
        // 3个为一组，表示一个顶点的xyz轴
        const attribue = new THREE.BufferAttribute(vertices, 3);
        // 给顶点设置坐标轴
        geometry.attributes.position = attribue;

        // 创建线材质
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0xff0000 // 线条颜色
        })
        const lineMeth = new THREE.LineLoop(geometry, lineMaterial);
        scene.add( lineMeth );

        camera.position.z = 50;



        const pointsArr = [
            // 三维向量Vector3表示的坐标值
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(0,100,0),
            new THREE.Vector3(0,100,100),
            new THREE.Vector3(0,0,100),
        ];
        console.log(new THREE.Vector3(0,0,0),pointsArr,geometry.setFromPoints(pointsArr));
        



        

        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            // requestAnimationFrame( animate );
            // mesh.rotation.x += 0.01;
            // mesh.rotation.y += 0.01;

            renderer.render( scene, camera );
        }
        animate();

        // 辅助线
        const axesHelper = new THREE.AxesHelper(1000);
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