// DO NOT MODIFY THIS FILE

import {
    AmbientLight,
    DirectionalLight, EventDispatcher, NoToneMapping,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import {OrbitControls} from "three-stdlib";
import CubeManager from "./CubeManager";

interface ViewportManagerEventMap {
    isInitialized: { type: 'isInitialized' };
}

class ViewportManager extends EventDispatcher<ViewportManagerEventMap> {
    protected _frameHandle: number | null;
    protected _renderer: WebGLRenderer | null;
    protected _resizeObserver: ResizeObserver | null;
    protected _container: HTMLElement | null;

    constructor() {
        super();
        this._renderer = null;
        this._cubeManager = null;
        this._frameHandle = null;
        this._resizeObserver = null;
        this._container = null;
    }

    protected _cubeManager: CubeManager | null;

    /**
     * The cube manager provides all needed operations for adding, removing,
     * and updating cubes in the 3D scene.
     *
     * @throws Error When viewport is not initialized
     */
    public get cubeManager(): CubeManager {
        if (!this._cubeManager) {
            throw new Error('ViewportManager not initialized yet. Did you forget to call init3d first?');
        }
        return this._cubeManager;
    }

    /**
     * Initialized 3D viewport in the given div element
     *
     * @param container
     */
    public init3d(container: HTMLDivElement) {
        // Do not initialize the renderer multiple times within the same container
        if (this._container === container) {
            return;
        }

        if (this._renderer) {
            this._destroyRenderer();
        }

        this._container = container;

        const {width, height} = container.getBoundingClientRect();

        const renderer = new WebGLRenderer({antialias: true});
        renderer.toneMapping = NoToneMapping;
        renderer.outputColorSpace = 'srgb-linear';
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xaaaaaa);

        container.append(renderer.domElement);

        const scene = new Scene();
        const camera = new PerspectiveCamera(40, width / height, 0.1, 1000);

        camera.position.set(3, 3, 3);
        camera.lookAt(new Vector3(0, 0, 0));

        const orbitControls = new OrbitControls(camera, renderer.domElement);

        const baseLight = new AmbientLight(0xffffff, 0.25 * Math.PI);
        scene.add(baseLight);

        const mainLight = new DirectionalLight(0xffffff);
        mainLight.position.set(2, 2.5, -2);
        mainLight.lookAt(new Vector3(0, 0, 0));
        scene.add(mainLight);

        this._cubeManager = new CubeManager(scene);

        this._resizeObserver = new ResizeObserver(() => {
            const {width, height} = container.getBoundingClientRect();
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
        this._resizeObserver.observe(container);

        const renderFrame = () => {
            orbitControls.update();
            renderer.render(scene, camera);
            this._frameHandle = requestAnimationFrame(renderFrame);
        };

        renderFrame();

        this.dispatchEvent({ type: 'isInitialized' });
    }

    protected _destroyRenderer() {
        if (this._frameHandle !== null) {
            cancelAnimationFrame(this._frameHandle);
        }

        if (this._resizeObserver !== null) {
            this._resizeObserver.disconnect();
        }

        const canvas = this._renderer?.domElement;
        this._renderer?.dispose();

        this._renderer = null;
        this._cubeManager = null;
        this._resizeObserver = null;
        this._container = null;

        if (canvas) {
            canvas.remove();
        }
    }
}

/**
 * Global manager for initializing the viewport and manipulating the scene.
 */
const viewportManager = new ViewportManager();

export default viewportManager;