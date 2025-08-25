import type ImageConfigurator from "./ImagePaletteConfigurator";

class ImageMap {
    parent: ImageConfigurator;
    img: HTMLImageElement;
    x: number;
    y: number;
	w: number
    h: number;

    constructor(img: HTMLImageElement, x: number, y: number, h: number, parent: ImageConfigurator) {
        this.parent = parent;
        this.img = img;
        this.x = x;
        this.y = y;
		this.w = h * this.img.width / this.img.height;
        this.h = h;
    }

    onload(callback: (imageMap: ImageMap) => void) {
        this.img.onload = () => {
            callback(this);
        };
    }

    draw() {
        const { ctx1 } = this.parent;
		const { x, y, w, h } = this.getContentRect();
        ctx1.drawImage(this.img, 0, 0, this.img.width, this.img.height, x, y, w, h);
    }

    getContentRect(): { x: number; y: number; w: number; h: number } {
        const w = this.h * this.img.width / this.img.height;
		const h = this.h;
        const y = this.y - h / 2;
		const x = this.x - w / 2;
		return { x, y, w, h };
	}

	setContentRect({ x, y, h }: {x?: number; y?: number; h?: number}) {
		if (x) this.x = x;
		if (y) this.y = y;
		if (h) this.h = h;
		this.parent.draw();
	}
}

export default ImageMap;
