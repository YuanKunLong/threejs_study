import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';

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
        const material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
        // 创建网格
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;

        // 设置辅助线
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);
        // 轨道控制器
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function() {
            renderer.render(scene, camera);
        })
        const ambient = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambient);

        // !设置GUI
        const gui = new GUI();
        // 属性设置
        gui.add(cube.position, 'x', 0, 100).step(1).onChange(function(val) {
            console.log(val);
            
        });
        // .name 修改显示的名称 .step 设置步长
        gui.add(ambient, 'intensity', 0, 2.0).name("环境光强度").step(0.1);
        const obj = {
            color: 0x00ffff,
            scale: 0,
            bool: true,
            specular: ''
        }
        // .addColor颜色值改变 .onChange变化后触发的回调函数
        gui.addColor(obj, 'color').onChange(function(val) {
            cube.material.color.set(val);
        })
        gui.add(obj, 'scale', [-2, 0, 2]).name('坐标').onChange(function(val) {
            cube.position.y = val;
        })
        gui.add(obj, 'scale', {
            left: -1,
            center: 0,
            right: 1
        }).name('位置选择').onChange(function(val) {
            cube.position.x = val;
        })
        gui.add(obj, 'bool').name('是否旋转').onChange(function(val) {
            console.log(obj.bool);
            if(val) animate();
        })
        // 材质
        const matFolder = gui.addFolder('材质');
        // matFolder.close();
        matFolder.addColor(obj, 'color').onChange(function(val) {
            cube.material.color.set(val);
        })
        matFolder.addColor(obj, 'specular').onChange(function(val) {
            cube.material.specular.set(val);
        })
        const matFolderChild = matFolder.addFolder('再子集');
        matFolderChild.close();

        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            if(obj.bool) requestAnimationFrame( animate );
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render( scene, camera );
        }
        animate();

        window.onresize = function() {
            // 重新修改画布大小
            renderer.setSize(window.innerWidth, window.innerHeight);
            // 重新设置观察范围的宽高比
            camera.aspect = window.innerWidth / window.innerHeight;
            // camera的属性发生变化时 需调用updateProjectionMatrix方法更新相机的投影矩阵
            camera.updateProjectionMatrix();
        }

        return () => {
            if (divRef.current) {
                divRef.current.removeChild(renderer.domElement);
            }
        };
    })

    return <div ref={divRef} />
}

export default App;