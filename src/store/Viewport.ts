import * as THREE from 'three';
import * as TYPE from "./Type";
import { makeObservable, observable, action } from "mobx";
import { createContext, useContext } from 'react';
import { Editor } from '@orb_Editor';
import { TransformControls, TransformControlsGizmo } from 'three/examples/jsm/controls/TransformControls';
import { OrbitControls } from 'three/examples/jsm/Addons';
import { translateOriginPoint } from '@orb_utils/Geometry';

export const ViewportContext = createContext<Viewport>({} as any)
export const useViewport = () => useContext(ViewportContext);

// This controls all related content that allows the user to interact with the scene
export class Viewport {

    private editor: Editor;
    static _instance: Viewport;

    /** Currently selected Objects */
    @observable target: THREE.Object3D | null = null;

    targetLastPlace: THREE.Vector3 | null = null;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    cameraControls = new OrbitControls(this.camera);

    /** True when moving/rotating/scaling */
    @observable transforming: boolean = false;
    @observable transformControlsMode: TYPE.TransformModes = "translate";
    @observable transformControlsSpace: TYPE.TransformSpaces = "world";
    controls = new TransformControls(this.camera);

    grid = new THREE.Group().add(
        new THREE.GridHelper(100, 100, 0x2080ff, 0x2080ff),
        new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 0.0005, 0.25),
            new THREE.MeshBasicMaterial({ color: "red" })
        )
    )

    @observable targetBoundingBox: THREE.Box3 = new THREE.Box3();
    @observable targetWireframeHelper?: THREE.LineSegments;

    @observable boundingBoxEnabled: boolean = true;
    @observable gridEnabled: boolean = true;
    @observable fpsEnabled: boolean = false;
    @observable viewHelperEnabled: boolean = true;

    private cameraDragStart: boolean = false;

    constructor(editor: Editor) {
        makeObservable(this)
        Viewport._instance = this;
        this.editor = editor;
        this.camera.position.set(2.5, 1.5, 2.5);
        this.camera.lookAt(new THREE.Vector3());

        // Removing multi 3-gizmo controls to avoid the controls being overwhelming, to-do: Make this a toggle option!
        const controlsHelper = this.controls.getHelper().children[0] as TransformControlsGizmo;
        const picker = controlsHelper.picker;
        const gizmo = controlsHelper.gizmo;

        // Translate
        // Multi 3-gizmo can be confusing
        picker.translate.remove(...picker.translate.children.filter(c => c.name == "XYZ"));
        gizmo.translate.remove(...gizmo.translate.children.filter(c => c.name == "XYZ"));

        // Rotate
        picker.rotate.remove(...picker.rotate.children.filter(c => c.name == "XYZE" || c.name == "E"));
        gizmo.rotate.remove(...gizmo.rotate.children.filter(c => c.name == "XYZE" || c.name == "E"));
    }

    public static get Instance() { return this._instance; }

    @action setTarget = (object: THREE.Object3D | null) => {
        if (this.target == object) return;
        // Selects the highest in the hierachy regardless of which one clicked for now
        while (this.editor.useRootSelection && object?.parent && !(object.parent instanceof THREE.Scene)) {
            object = object.parent;
        }
        this.target = object;
        if (this.target instanceof THREE.Mesh) {
            this.targetBoundingBox.setFromObject(this.target);
            this.setWireframeHelper(this.target.geometry);
        }
        else
            this.setWireframeHelper(undefined);

        console.log("new target =>", this.target);

        this.transforming = false;
        this.cameraControls.enabled = true;
        if (object) {
            if (this.editor.hasFlag("geometry_tools")) {
                const transHelper = this.editor.scene.getObjectByName("TRANSFORM_ORIGIN_DRAGGER");
                transHelper && this.controls.attach(transHelper)
            }
            else
                this.controls.attach(object);
            if (this.controls.domElement) this.controls.connect();
        }
        else {
            this.controls.detach();
            if (this.controls.domElement) this.controls.disconnect();
        }

    }

    @action setTransforming = (b?: boolean) => { this.transforming = b != undefined ? b : !this.transforming }

    // 0 = translate | 1 = rotate | 2 = scale
    @action setTransformControlsMode = (mode: TYPE.Range<0, 3> | TYPE.TransformModes) => {
        this.transformControlsMode = typeof mode == "number" ? TYPE.transformModes[mode] : mode;
        this.controls.setMode(this.transformControlsMode);
    }
    // 0 = world | 1 = local
    @action setTransformControlsSpace = (mode: TYPE.Range<0, 2> | TYPE.TransformSpaces) => {
        this.transformControlsSpace = typeof mode == "number" ? TYPE.transformSpaces[mode] : mode;
        this.controls.setSpace(this.transformControlsSpace);
    }

    @action setGrid = (b: boolean) => { this.gridEnabled = b; }
    @action setFPS = (b: boolean) => { this.fpsEnabled = b; }
    @action setViewHelper = (b: boolean) => { this.viewHelperEnabled = b; }
    @action setBoundingBox = (b: boolean) => { this.boundingBoxEnabled = b; }
    @action setWireframeHelper = (geometry?: THREE.BufferGeometry) => {
        this.targetWireframeHelper && this.targetWireframeHelper.geometry.dispose();
        this.targetWireframeHelper = geometry ? new THREE.LineSegments(new THREE.WireframeGeometry(geometry)) : undefined;
        if (this.targetWireframeHelper) {
            (this.targetWireframeHelper.material as THREE.Material).dispose();
            const material = new THREE.LineBasicMaterial({ color: 0xFF00FF, linecap: 'round', linejoin: 'round', linewidth: 3, transparent: true, depthTest: false, opacity: 0.5 });
            this.targetWireframeHelper.material = material;
        }
    }

    /** Runs when left clicking on the Canvas */
    onSelectObject = (e: MouseEvent) => {
        // When adjusting objects with the controls or moving the camera in any way
        if (this.transforming) return;
        // Left Click only
        if (e.button != 0) return;
        console.log("selecting an object...")
        // Bounds are used to calculate an offseted AND/OR resized canvas that doesn't take the entire screen due to inspector.
        const bounds = this.editor.gl.domElement.getBoundingClientRect();
        const pointer = new THREE.Vector2(((e.clientX - bounds.left) / (bounds.right - bounds.left)) * 2 - 1, -((e.clientY - bounds.top) / (bounds.bottom - bounds.top)) * 2 + 1);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, this.camera);
        const intersects = raycaster.intersectObjects([...this.editor.sceneObjects, ...this.editor.sceneHelpers], true);

        console.log("onSelectObject()::intersections.faces = \n", ...intersects.map((i) => i.face));
        console.log("onSelectObject()::intersections.geometry data = \n", ...intersects.map((i) => { if (i.object instanceof THREE.Mesh) return i.object; }).map((i) => i && i.geometry));

        if (intersects.length <= 0) return;

        let hit = intersects[0].object;
        if (hit.userData.object as THREE.Object3D) hit = hit.userData.object;
        this.setTarget(hit);
    }

    onLoad = (canvas: HTMLCanvasElement, _gl: THREE.WebGLRenderer) => {
        canvas.onpointerup = this.onSelectObject;
        this.cameraControls.domElement = canvas;
        this.cameraControls.connect();

        this.cameraControls.enableDamping = true;
        this.cameraControls.dampingFactor = 0.15;
        this.cameraControls.zoomSpeed = 2;

        this.controls.domElement = canvas;
        this.controls.connect();

        // Handles whether we should consider left click selection for tracing and selecting an object in the scene,
        // if transforming becomes true then we ignore onSelectObject
        this.controls.addEventListener('dragging-changed', (e) => {
            e.value ? this.onDragStart() : this.onDragEnd();
        });
        this.cameraControls.addEventListener('start', () => this.cameraDragStart = true);
        this.cameraControls.addEventListener('change', () => this.cameraDragStart && !this.transforming && (this.transforming = true));
        this.cameraControls.addEventListener('end', () => {
            this.transforming = false; this.cameraDragStart = false;

        });
        // Update boundingbox on drag
        this.controls.addEventListener('change', () => {
            if (this.target instanceof THREE.Mesh) {
                this.targetBoundingBox.setFromObject(this.target);
                /** Bugged wtih Skinned Mesh */
                if(this.targetWireframeHelper) {
                    this.target.getWorldPosition(this.targetWireframeHelper.position)
                    this.target.getWorldQuaternion(this.targetWireframeHelper.quaternion)
                    this.target.getWorldScale(this.targetWireframeHelper.scale)
                }
            }
        });
    }

    onDragStart = () => {
        this.cameraControls.enabled = false;
        this.transforming = true;
        this.targetLastPlace = this.target?.position.clone() || null;
    }

    onDragEnd = () => {
        this.cameraControls.enabled = true;
        this.transforming = false;
        if (this.target instanceof THREE.Mesh) {
            this.targetBoundingBox.setFromObject(this.target);
        }
        if (this.editor.hasFlag("geometry_tools") && this.target && this.target instanceof THREE.Mesh) {

            const originGroup = this.editor.scene.getObjectByName("TRANSFORM_ORIGIN_GROUP");
            const transHelper = originGroup?.children[0];
            if (!transHelper || !originGroup) return;
            const geometry = this.target.geometry as THREE.BufferGeometry;
            switch (this.transformControlsMode) {
                case "translate":
                    if (!this.editor.hasFlag("drag_object")) {
                        const draggerPos = transHelper.position;
                        translateOriginPoint(this.target, draggerPos);
                        draggerPos.set(0, 0, 0);
                        originGroup?.position.copy(this.target.position);
                    }
                    else {
                        if (!this.targetLastPlace) return;
                        if (!this.target) return;
                        this.target.position.copy(this.targetLastPlace);
                        const draggedTo = this.target.position.clone();
                        translateOriginPoint(this.target, draggedTo, true);
                    }
                    break;
                case "rotate":
                    const draggerRot = transHelper.rotation;
                    geometry.rotateX(draggerRot.x);
                    geometry.rotateY(draggerRot.y);
                    geometry.rotateZ(draggerRot.z);
                    transHelper.rotation.set(0, 0, 0);
                    break;
                case "scale":
                    const draggerScale = transHelper.scale;
                    geometry.scale(draggerScale.x, draggerScale.y, draggerScale.z);
                    transHelper.scale.set(1, 1, 1);
                    break;
            }

        }
        this.targetLastPlace = null;
    }

    update = (delta: number) => {
        this.cameraControls.update(delta);
    }

    onAddFlag = (flags: string[]) => {
        console.log(flags, flags.includes("geometry_tools"));
        if (flags.includes("geometry_tools")) {
            // VERY BAD!!!
            setTimeout(() => {
                const transHelper = this.editor.scene.getObjectByName("TRANSFORM_ORIGIN_DRAGGER");
                transHelper && this.controls.attach(transHelper);
                if (this.controls.domElement) this.controls.connect();
            }, 1);
        }
    }

    onRemoveFlag = (flags: string[]) => {
        if (flags.includes("geometry_tools")) {
            this.target && this.controls.attach(this.target);
        }
    }
}