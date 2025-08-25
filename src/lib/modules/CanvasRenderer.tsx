import type CanvasRendererEntity from "./CanvasRendererEntity";

class CanvasRenderer {
    root: HTMLElement;
    entities: CanvasRendererEntity[];
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(root: HTMLElement, option: { canvas?: { width?: number; height?: number } }) {
        this.root = root;
        this.entities = [];
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.width = option.canvas?.width || 100;
        this.canvas.height = option.canvas?.height || 100;
		root.appendChild(this.canvas);
    }

    async render(entity: CanvasRendererEntity) {
        entity.parent = this;
        this.entities.push(entity);
        await entity.create();
        this.update();
    }

    draw() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.entities.forEach((e) => e?.draw?.());
    }

    update() {
        this.entities.forEach((e) => e?.update?.());
        this.draw();
    }
}

export default CanvasRenderer;
