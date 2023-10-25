import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function App() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!divRef.current) return;

        const stats = new Stats();
        //@ts-ignore
        document.body.appendChild(stats.domElement);

        // 创建场景
        const scene = new THREE.Scene();
        // scene.background = new THREE.Color(0x101010);

        // 创建相机
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.z = 15;
        camera.position.x = 10;
        camera.position.y = 5;

        // 渲染
        const renderer = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: true
        });
        // renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);





        // 创建地面
        const planeGeometry = new THREE.PlaneGeometry(30, 30);
        const planeMaterial = new THREE.MeshLambertMaterial({
            color: '#eedecc',
            side: THREE.DoubleSide
        })
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        planeMesh.rotateX(Math.PI / 2)
        scene.add(planeMesh);
        // 创建环境光
        const light = new THREE.AmbientLight('#b9d5ff', 0.12);
        scene.add(light);
        // 创建平行光
        const directionalLight = new THREE.DirectionalLight('b9d5fff', 0.12);
        directionalLight.position.set(5,5,5)
        scene.add(directionalLight)


        // !创建房屋组
        const house = new THREE.Group();
        scene.add(house);

        // 创建一个墙体
        const walls = new THREE.Mesh(
            new THREE.BoxGeometry(4, 2.5, 4),
            new THREE.MeshStandardMaterial({
                color: '#ac8e82'
            })
        )
        walls.position.y = 2.5 / 2;
        house.add(walls);

        // 屋顶
        const roof = new THREE.Mesh(
            new THREE.ConeGeometry(3.5, 2, 4),
            new THREE.MeshStandardMaterial({
                color: '#b35f45'
            })
        )
        roof.rotateY(Math.PI / 4)
        roof.position.y = 2.5 + 2 / 2;
        house.add(roof);

        //门
        const door = new THREE.Mesh(
            new THREE.PlaneGeometry(1.5,1.5,1.5),
            new THREE.MeshStandardMaterial({
                color: 'aa7b7b'
            })
        )
        // + 0.01为了解决模型闪烁问题
        door.position.set(0, 1.5 / 2, 4 / 2 + 0.01);
        house.add(door);

        // 创建灌木丛
        const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
        const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });
        // 第1个球
        const mesh1 = new THREE.Mesh(bushGeometry, bushMaterial);
        mesh1.position.set(0.8,0.2,2.2);
        mesh1.scale.set(0.5, 0.5, 0.5)
        // 第2个球
        const mesh2 = new THREE.Mesh(bushGeometry, bushMaterial);
        mesh2.position.set(1.4,0.1,2.1);
        mesh2.scale.set(0.25,0.25,0.25)
        // 第3个球
        const mesh3 = new THREE.Mesh(bushGeometry, bushMaterial);
        mesh3.position.set(-0.8,0.1,2.1);
        mesh3.scale.set(0.4,0.4,0.4)
        // 第4个球
        const mesh4 = new THREE.Mesh(bushGeometry, bushMaterial);
        mesh4.position.set(-1,0.05,2.6);
        mesh4.scale.set(0.15,0.15,0.15)
        house.add(mesh1, mesh2, mesh3, mesh4);

        // 添加门灯
        const doorLight = new THREE.PointLight('#ff7d46',1,7);
        doorLight.position.set(0,2.2,2.7)
        house.add(doorLight);
        

        // !坟墓组
        const graves = new THREE.Group();
        scene.add(graves);

        // 创建墓碑
        const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
        const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });
        // 墓碑个数
        const graveNum = 50;
        for (let i = 0; i < graveNum; i++) {
            const angle = Math.random() * Math.PI * 2; // 角度
            const radius = 3 + Math.random() * 6; // 半径位于房屋和地面边缘之间
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const grave = new THREE.Mesh(graveGeometry, graveMaterial);
            grave.position.set(x, 0.3, z);
            grave.rotation.y = (Math.random() - 0.5) * 0.5;
            grave.rotation.z = (Math.random() - 0.5) * 0.5;
            grave.castShadow = true;

            graves.add(grave);
        }

        // 添加烟雾
        const fog = new THREE.Fog('#262837',1,50);
        scene.fog = fog;
        renderer.setClearColor('#262837')

        // TODO 加载纹理

        // 添加悬浮幽灵效果
        const ghost1 = new THREE.PointLight('#ff00ff',2,3);
        const ghost2 = new THREE.PointLight('#00ffff',2,3);
        const ghost3 = new THREE.PointLight('#ffff00',2,3);
        scene.add(ghost1, ghost2, ghost3);

        // 激活阴影
        renderer.shadowMap.enabled = true;
        scene.traverse(function(obj) {
            console.log(obj);
            if(obj instanceof THREE.Mesh) {
                obj.castShadow = true;
            }
        })


        // 优化 一般优化是通过设置相机助手，把用于渲染阴影的灯光的摄像机给添加到助手里面，
        //  再调整相机的远近等属性，缩小灯光相机的可视范围。
        doorLight.shadow.mapSize.width = 256
        doorLight.shadow.mapSize.height = 256
        doorLight.shadow.camera.far = 7

        ghost1.shadow.mapSize.width = 256
        ghost1.shadow.mapSize.height = 256
        ghost1.shadow.camera.far = 7

        ghost2.shadow.mapSize.width = 256
        ghost2.shadow.mapSize.height = 256
        ghost2.shadow.camera.far = 7

        ghost3.shadow.mapSize.width = 256
        ghost3.shadow.mapSize.height = 256
        ghost3.shadow.camera.far = 7

        // PCF柔软阴影贴图
        renderer.shadowMap.type = THREE.PCFSoftShadowMap


        divRef.current.appendChild(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function() {
            renderer.render(scene, camera);
        })

        // 辅助线
        const axesHelper = new THREE.AxesHelper(100);
        scene.add(axesHelper);




        // 设置动画
        const clock = new THREE.Clock();
        const tick = () => {
            const elapsedTime = clock.getElapsedTime();
            controls.update();

            const ghost1Algle = elapsedTime * 0.5;
            // x和z设置点光源移动
            ghost1.position.x = Math.cos(ghost1Algle) * 4;
            ghost1.position.z = Math.sin(ghost1Algle) * 4;
            // 设置光源上下移动
            ghost1.position.y = Math.sin(ghost1Algle) * 3;

            const ghost2Algle = -elapsedTime * 0.32;
            ghost2.position.x = Math.cos(ghost2Algle) * 5;
            ghost2.position.z = Math.sin(ghost2Algle) * 4;
            ghost2.position.y = Math.sin(ghost2Algle) * 3 + Math.sin(elapsedTime * 2.5);

            const ghost3Algle = -elapsedTime * 0.27;
            ghost3.position.x = Math.cos(ghost3Algle) * (7 * Math.sin(elapsedTime * 0.32));
            ghost3.position.z = Math.sin(ghost3Algle) * (7 * Math.sin(elapsedTime * 0.5));
            ghost3.position.y = Math.sin(ghost3Algle) * 3 + Math.sin(elapsedTime * 2.5);
            
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();


        function animate() {
            requestAnimationFrame(animate)
            
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