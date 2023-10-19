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
        const camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 0.1, 1000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        divRef.current.appendChild( renderer.domElement );

        // 创建立方体
        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // 设置颜色
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // 创建网格
        const mesh = new THREE.Mesh( geometry, material );
        const mesh2 = new THREE.Mesh( geometry, material );
        mesh2.translateX(5);
        // ! group层级模型（树结构）Object3D === Group 两者没有区别只是Group更具语义化
        const group = new THREE.Group();
        group.add(mesh);
        group.add(mesh2);
        scene.add( group );
        console.log(group.children);
        // !scene 场景对象的子集包括：group、环境光AmbientLight、平行光DirectionalLight、辅助线AxesHelper
        console.log(scene.children);
        group.translateX(2);
        group.translateZ(2);
        const ve3 = new THREE.Vector3();
        mesh.getWorldPosition(ve3)
        console.log(ve3);
        console.log(mesh.position);
        const meshAxesHelper = new THREE.AxesHelper(10);
        mesh.add(meshAxesHelper);
        
        //长方体的几何中心默认与本地坐标原点重合
        const geometry3 = new THREE.BoxGeometry(5, 5, 5);
        const material3 = new THREE.MeshBasicMaterial({
            color: 0x00ffff
        });
        const mesh3 = new THREE.Mesh(geometry3, material3);
        geometry3.translate(5/2,0,0)
        mesh3.rotateY(Math.PI / 3)
        scene.add(mesh3);
        let animation = requestAnimationFrame(render);
        function render() {
            mesh3.rotation.y += 0.01;//旋转动画
            renderer.render( scene, camera );
            animation = requestAnimationFrame(render);
            console.log(22);
        }
        cancelAnimationFrame(animation);
        scene.remove(mesh3);
        meshAxesHelper.visible = false;
        



        // 批量创建多个长方体表示高层楼
        const group1 = new THREE.Group(); //所有高层楼的父对象
        group1.name = "高层";
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(2, 6, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffff
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = i * 3; // 网格模型mesh沿着x轴方向阵列
            group1.add(mesh); //添加到组对象group1
            mesh.name = i + 1 + '号楼';
            // console.log('mesh.name',mesh.name);
        }
        group1.position.y = 3;


        const group2 = new THREE.Group();
        group2.name = "洋房";
        // 批量创建多个长方体表示洋房
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(2, 3, 1);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00ffff
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = i * 3;
            group2.add(mesh); //添加到组对象group2
            mesh.name = i + 6 + '号楼';
        }
        group2.position.z = 5;
        group2.position.y = 1;

        const model = new THREE.Group();
        model.name='小区房子';
        model.add(group1, group2);
        model.position.set(-5,0,-2);
        model.traverse(function(obj) {
            // console.log(obj.name);
            if(obj.isMesh) {
                obj.material.color.set(0xffff00)
            }
        })
        const nameNode = model.getObjectByName("4号楼");
        nameNode.material.color.set(0xff0000)
        // scene.add(model);

        

        camera.position.z = 30;

        // 开启动画
        function animate() {
            // 每帧执行 60次/每秒
            // requestAnimationFrame( animate );
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
            // console.log('camera.position', camera.position);
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