'use strict';


var app = angular.module('test3JS', []);

app.controller('testCtrl', function ($scope){
        $scope.renderer = null;
        $scope.canvas = null;
        $scope.camera = null;
        $scope.scene = null;
        $scope.ambientLight = null;
        $scope.objeto = null;
        $scope.manager = null;
        $scope.loader = null;
        $scope.clock = null;
        $scope.arToolkitSource = null;
        $scope.arToolkitContext = null;
        $scope.marcador = null;
        $scope.marcadorCon = null;
        $scope.deltaTime = null;
        $scope.totalTime = null;

        $scope.iniciar = function() {
            //crear objetos THREE
            $scope.scene = new THREE.Scene();
            $scope.camera = new THREE.Camera();
            $scope.ambientLight = new THREE.AmbientLight(0xcccccc, 1.0);
            $scope.renderer = new THREE.WebGLRenderer({
                antialias : true,
                alpha : true
            });
            $scope.clock = new THREE.Clock();


            //editar renderer
            $scope.renderer.setClearColor(new THREE.Color('lightgrey'), 0)
            $scope.renderer.setSize(640,480);
            $scope.renderer.domElement.style.position = 'absolute'
            $scope.renderer.domElement.style.top = '65px'
            $scope.renderer.domElement.style.left = '0px'
            document.getElementById("prueba").appendChild($scope.renderer.domElement); 


            /////
            //crear objetos THREEX
            $scope.arToolkitSource = new THREEx.ArToolkitSource({
                sourceType : 'webcam',
            });

            $scope.arToolkitSource.init(function onReady(){
                $scope.onResize()
            });
            
            window.addEventListener('resize', function(){
                $scope.onResize()
            });
    
            $scope.arToolkitContext = new THREEx.ArToolkitContext({
                cameraParametersUrl : 'data/camera_para.dat',
                detectionMode : 'mono'
            });
    
            $scope.arToolkitContext.init( function onCompleted(){
                $scope.camera.projectionMatrix.copy( $scope.arToolkitContext.getProjectionMatrix() );
            });

            //agregar
            $scope.scene.add($scope.camera);
            $scope.scene.add($scope.ambientLight);

            
        }

        $scope.onResize = function() {
            $scope.arToolkitSource.onResize()	
            $scope.arToolkitSource.copySizeTo($scope.renderer.domElement)	
            if ( $scope.arToolkitContext.arController !== null )
            {
                $scope.arToolkitSource.copySizeTo($scope.arToolkitContext.arController.canvas)	
            }
        }

        $scope.OnProgress = function (xhr) { console.log( (xhr.loaded / xhr.total * 100) + '% loaded' ); }

        $scope.OnError = function (xhr) { console.log( 'An error happened' ); }

        $scope.venus = function() {
            $scope.iniciar();
            $scope.marcador = new THREE.Group();
            $scope.scene.add($scope.marcador);
            $scope.marcadorCon = new THREEx.ArMarkerControls($scope.arToolkitContext, $scope.marcador, {
                type: 'pattern', patternUrl: "data/hiro.patt",
            });
            new THREE.MTLLoader()
            .setPath( 'models/' )
            .load( 'tierra.mtl', function ( materials ) {
                materials.preload();
                new THREE.OBJLoader()
                    .setMaterials( materials )
                    .setPath( 'models/' )
                    .load( 'tierra.obj', function ( group ) {
                        $scope.objeto = group.children[0];
                        $scope.objeto.material.side = THREE.DoubleSide;
                        $scope.objeto.position.y = 0.25;
                        $scope.objeto.scale.set(0.3,0.3,0.3);
                        $scope.marcador.add($scope.objeto);
                    }, $scope.onProgress, $scope.onError );
            });
            $scope.animate();
        }

        $scope.animate = function () {
            requestAnimationFrame( $scope.animate );
            $scope.deltaTime = $scope.clock.getDelta();
            $scope.totalTime += $scope.deltaTime;
            $scope.update();
            $scope.render();
        }

        $scope.render = function() {
            $scope.renderer.render($scope.scene, $scope.camera)
        }

        $scope.update = function () {
            if ( $scope.marcador.visible )
            {
                $scope.objeto.rotation.y += 0.01 ;
            }
            // update artoolkit on every frame
            if ( $scope.arToolkitSource.ready !== false )
                $scope.arToolkitContext.update( $scope.arToolkitSource.domElement );
        }

        $scope.hola = function () {
            alert('holamundo');
        }
    });