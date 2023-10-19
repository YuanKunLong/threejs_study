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
        const cube = new THREE.Mesh( geometry, material );
        // const cube2 = new THREE.Mesh( geometry, material );
        scene.add( cube );
        // scene.add( cube2 );
        camera.position.z = 5;
        // cube2.material.color.set(0xffff00);
        // cube2.geometry.translate(0,2,0);
        // cube2.geometry.rotateX(90)

        // !Vector3三维向量
        const v3 = new THREE.Vector3(0,0,0);
        v3.set(2,0,0)
        v3.y = 3;

        console.log(v3);

        // 向量归一化
        v3.normalize();

        cube.translateOnAxis(v3, 2)
        console.log('模型位置属性.position的值', cube.position);

        // !Euler欧拉
        // 创建一个欧拉对象，表示绕着xyz轴分别旋转45度、0度、90度
        const euler = new THREE.Euler(Math.PI / 4, 0, Math.PI / 2);
        cube.rotateX(euler.y);
        cube.rotateOnAxis(v3, euler.x)

        // !Color对象
        const color = new THREE.Color();
        color.setHex(0x00ff00);
        color.setStyle('#00ff00');
        color.set('#00ff00')
        color.set(0x00ff00)
        color.setRGB(0,1,0)
        console.log(color);
        
        // !Material模型材质父类


        console.log(cube );

        // !.clone()和.copy()
        const cube2 = cube.clone();
        cube2.position.clone();
        cube2.position.x += 3;
        scene.add( cube2 );
        


        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            requestAnimationFrame( animate );
            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            cube.rotateX(0.01);
            cube.rotateY(0.01);

            // cube2.rotation.copy(cube.rotation);
console.log(cube2);

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