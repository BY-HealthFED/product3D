import { h, Component } from 'preact';

import { connect } from 'preact-redux';
import { bindActionCreators } from 'redux';
import { setRuntimeVariable } from '~/actions/user';

import { jsSDK } from '~/servicer/index.js';
import wechat, {isWeChat} from 'share-wechat';
import { appId } from '~/config.js';

import prdlist from './prdlist.json';

import Loading from '~/components/Loading';
import Modal from '~/components/Modal';
import loader from '~/core/utils/jsDynamicLoading';

import '~/core/utils/requestAnimationFrame';

import scss from './scss';

class Home extends Component {

	constructor(props) {
		super(props);
		this.state = {
			provinces: [],
			runtimeVariable: 'this is a runtimeVariable',
			prdlist,
			jsonPath: null,
			imgPath: null,
			selectedPrd: {},
			error: {},
			openModal: false
		};
		this.scene = null;
		this.requestAnimationFrame = null;
		this.timer = null;
		this.type = null;
	}

	componentWillMount() {
		this.setWeChat();
	}

	componentDidMount() {
		this.setState(
			{
				selectedPrd: {...prdlist[0]}
			}, () => {
				const {json, img} = this.state.selectedPrd;
				this.init(json, img);
			});
		this.type = prdlist[0].json === './assets/data/prd.json' ? 1 : 2;
	}

	setWeChat = () => {
		Loading.show();
		jsSDK({
			url: window.location.href.split('#')[0],
			appId
		}).then(res => {
			Loading.hide();
			const { appId, timestamp, nonceStr,	signature } = res.body;
			const jsApiList = ['scanQRCode'];
			wechat({appId, timestamp, nonceStr,	signature, jsApiList},{
				data : {
					title: '3DProducts',
					desc: '三维产品展示',
					link: window.location.href,
					imgUrl: 'http://wx-test.by-health.com/web/product3D/assets/icons/shareicon.jpg'
				}
			}).then(() => {
				window.console.log(appId, timestamp, nonceStr,	signature);
			}).catch(() => {
				Loading.hide();
				window.console.log('error');
			});
		}).catch(() => {
			Loading.hide();
		});
	}

	scanQRCode = () => {
		// Loading.show();
		if (!isWeChat()) {
			return;
		}
		const __this = this;
		window.wx.ready(() => {
			__this.closeModal();
			window.wx.scanQRCode({
				desc: 'scanQRCode desc',
				needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
				scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
				success (res) {
					// Loading.hide();
					if (res.resultStr.indexOf('http://m.by-health.com/c/') !== -1) {
						window.location.href = res.resultStr;
					} else {
						__this.showModal({
							title: '温馨提示',
							Msg: '请扫描正确二维码！'
						});
					}
				},
				error(res){
					// Loading.hide();
					  if (res.errMsg.indexOf('function_not_exist') > 0){
						   alert('版本过低请升级');
					}
				}
			});
		});
	}



	THREEJSONLoader = (url) => {
		return new Promise((resolve) => {
			const loader = new window.THREE.JSONLoader();
			loader.load(url, (geometry, materials) => {
				resolve(geometry, materials);
			});
		});
	}

	THREETextureLoader = (url, res) => {
		return new Promise((resolve) => {
			const textureLoader = new window.THREE.TextureLoader();
			textureLoader.load(url, (texture) => {
				resolve({geometry: res, texture});
			});
		});
	}

	init = (jsonPath, imgPath) => {
		Loading.show();
		const isTHREE = window.THREE;
		// 准备库
		Promise.resolve()
			.then(() => {
				if (!isTHREE) {
					return loader('./assets/lib/three.min.js');
				}
			})
			.then(() =>{
				if (!isTHREE) {
					return loader('./assets/lib/OrbitControls.js');
				}
			})
			.then(() => this.THREEJSONLoader(jsonPath))
			.then(res => this.THREETextureLoader(imgPath, res))
			.then((res) => {
				Loading.hide();
				this.setScene(res.geometry, res.texture);
			});
	}

	setScene = (geometry, texture) => {
		let camera, controls, scene, renderer;
		this.scene = scene = new window.THREE.Scene();
		scene.background = new window.THREE.Color( 0xcccccc );
		scene.fog = new window.THREE.FogExp2( 0xcccccc, 0.002 );
		renderer = new window.THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		const container = this.container;

		renderer.setSize( container.offsetWidth, container.offsetHeight );

		container.appendChild( renderer.domElement );

		camera = new window.THREE.PerspectiveCamera( 55, container.offsetWidth / container.offsetHeight, 1, 1000 );
		camera.position.z = 21;
		camera.position.x = 10;
		controls = new window.THREE.OrbitControls( camera, renderer.domElement );
		// controls.addEventListener( 'change', render ); // remove when using animation loop
		// enable animation loop when using damping or autorotation
		controls.enableDamping = true;
		controls.autoRotateSpeed = 0.5;
		//controls.dampingFactor = 0.25;
		window.clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			controls.autoRotate = true;
		}, 4000);
		controls.enableZoom = true;
		controls.minDistance = 10;
		controls.maxDistance = 35;

		const material = new window.THREE.MeshPhysicalMaterial( {
			map: texture,
			metalness: 0,
			roughness: 0.45,
			clearCoat:  0.1,
			clearCoatRoughness: 0.5,
			reflectivity: 0.1
		} );

		const mesh = new window.THREE.Mesh( geometry, material);

		mesh.position.x = 3;
		mesh.position.y = 0;
		mesh.position.z = 0;
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = false;
		scene.add( mesh );

		const barCodePlane = this.setBarCodeGeometry(scene);
		const typ1 = {
			width: 1.6,
			x: -0.1,
			y: 8.87,
			z: 0.055
		};
		const type2 = {
			width: 1.8,
			x: 0.1,
			y: 9.3,
			z: 0.055
		};
		const SecurityCircle = this.setSecurityGeometry(scene,
			this.type === 1 ? typ1 : type2
		);

		let O = 0;
		const onWindowResize = () => {
			camera.aspect = container.offsetWidth / container.offsetHeight;
			camera.updateProjectionMatrix();
			renderer.setSize( container.offsetWidth, container.offsetHeight );
		};
		barCodePlane.material.opacity = 0;
		const animate = () => {
			this.requestAnimationFrame = requestAnimationFrame( animate );
			controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
			window.TWEEN.update();
			SecurityCircle.material.opacity = O/1000;
			O++;
			if (O >= 100) {
				O = 0;
			}
			renderer.render( scene, camera );
		};

		// 创建点击事件
		const onDocumentMouseDown = (event) => {
			let vector = new window.THREE.Vector3(( event.clientX / container.offsetWidth ) * 2 - 1, -( event.clientY / container.offsetHeight ) * 2 + 1, 0.5);
			vector = vector.unproject(camera);

			let raycaster = new window.THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

			let intersects = raycaster.intersectObjects([barCodePlane, SecurityCircle]);

			if (intersects.length > 0) {
				let objName = intersects[0].object.name;
				if (objName === 'barCode') {
					this.showModal({
						title: this.state.selectedPrd.name,
						Msg: '点击条形码'
					});
				}
				if (objName === 'Security') {
					const Msg = (
						<div>
						刮开瓶盖图层，扫描16位防伪码，<br />即可查询真伪。
							<button onClick={this.scanQRCode} class="radius-small pd-5 ww bg-green white mgt1-5">去扫码</button>
						</div>
					);
					this.showModal({
						title: this.state.selectedPrd.name,
						Msg
					});
				}
			}
		};

		const onGoSec = () => {
			// camera.position.set(-0.041, 1.9, -1.21);
			// controls.target.set(30, 167, 81);
			// controls.update();
			// controls.reset();

			const from = {
				x : camera.position.x,
				y : camera.position.y,
				z : camera.position.z
			};
			const to = {
				x :-4.40053959871765,
				y : 21.906356009207347,
				z : 6.461177728400781
			};

			const tween = new window.TWEEN.Tween(from)
				.to(to,600)
				.easing(window.TWEEN.Easing.Linear.None)
				.onUpdate(function () {
					camera.position.set(this.x, this.y, this.z);
				});
			tween.start();
			controls.autoRotate = false;
			window.clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				controls.autoRotate = true;
			}, 3000);
		};

		// onWindowResize
		onWindowResize();

		this.setLights(scene);

		animate();
		window.document.removeEventListener('resize', onWindowResize);
		window.document.removeEventListener('mousedown', onDocumentMouseDown);
		window.document.addEventListener( 'resize', onWindowResize, false );
		window.document.addEventListener('mousedown', onDocumentMouseDown, false);
		this.buttonScr.removeEventListener('mousedown', onGoSec);
		this.buttonScr.addEventListener('mousedown', onGoSec, false);
	}


	setLights = (scene) => {
		// lights
		const lighta = new window.THREE.DirectionalLight( 0x888888, 0.9 );
		lighta.position.set( 1, 1, 1 );
		scene.add( lighta );
		const lightb = new window.THREE.DirectionalLight( 0x777788, 0.5 );
		lightb.position.set( -1, -1, -1 );
		scene.add( lightb );
		const lightc = new window.THREE.AmbientLight( 0x888888 );
		scene.add( lightc );
	}

	setBarCodeGeometry = (scene) => {
		// 条形码的触发对象
		const barCodeGeometry = new window.THREE.PlaneGeometry( 1, 2.6, 1 );
		const barCodeMaterial = new window.THREE.MeshBasicMaterial( {color: 0xff0000, side: window.THREE.DoubleSide, transparent: true, opacity:0.1 } );
		const barCodePlane = new window.THREE.Mesh( barCodeGeometry, barCodeMaterial );
		barCodePlane.name = 'barCode';
		barCodePlane.position.x = -2.25;
		barCodePlane.position.y = 0.1;
		barCodePlane.position.z = 1.5;
		barCodePlane.rotation.y = 2.1;
		scene.add( barCodePlane );
		return barCodePlane;
	}

	setSecurityGeometry = (scene, data) => {
		// 防伪码的触发对象
		const SecurityGeometry = new window.THREE.CircleGeometry( data.width, 32 );
		const SecurityMaterial = new window.THREE.MeshBasicMaterial( { color: 0xff0000, side: window.THREE.DoubleSide, transparent: true, opacity:0.1 } );
		const SecurityCircle = new window.THREE.Mesh( SecurityGeometry, SecurityMaterial );
		SecurityCircle.name = 'Security';
		SecurityCircle.position.x = data.x;
		SecurityCircle.position.y = data.y;
		SecurityCircle.position.z = data.z;
		SecurityCircle.rotation.x = -1.55;
		scene.add( SecurityCircle );
		return SecurityCircle;
	}

	destroyScene = () => {
		return new Promise((resolve) => {
			// Stop the animation
			window.cancelAnimationFrame(this.requestAnimationFrame);
			// Clear the scene children
			while (this.scene.children.length > 0){
				this.scene.remove(this.scene.children[0]);
			}
			this.scene = null;
			this.container.removeChild(this.container.childNodes[0]);
			resolve();
		});
	}

	onChangePrd = (e) => {
		const data = e.target.value.split('##');
		this.type = data[1] === './assets/data/prd.json' ? 1 : 2;
		this.setState({
			selectedPrd: {
				name: data[0],
				json: data[1],
				img: data[2]
			}
		}, () => {
			this.destroyScene()
				.then(() => {
					const {json, img} = this.state.selectedPrd;
					this.init(json, img);
				});
		});
	}

	closeModal = () => {
		this.setState({
			error: {},
			openModal: !this.state.openModal
		});
	}

	showModal = (error) => {
		this.setState({
			error: {...error},
			openModal: true
		});
	}

	render() {
		const {prdlist, openModal} = this.state;
		const {title, Msg} = this.state.error;
		return (
			<div className={scss.root}>
				<div className={scss.container} ref={el => {this.container = el;}} />
				<div className={scss.security} ref={el => {this.buttonScr = el;}} >防伪码</div>
				<div className={`formBox ${scss.form}`}>
					<select onChange={this.onChangePrd}>
						{
							prdlist.map((item) => (
								<option value={`${item.name}##${item.json}##${item.img}`}>{item.name}</option>
							))
						}
					</select>
				</div>
				<Modal isOpen={openModal} onRequestClose={this.closeModal} >
					<div className={scss.modal}>
						<h3>{title}</h3>
						<div>
							{Msg}
						</div>
					</div>
				</Modal>
			</div>
		);
	}
}

function mapStateToProps(state) {
	return state;
}


function mapDispatchToProps(dispatch){
	return bindActionCreators({ setStore: setRuntimeVariable}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
