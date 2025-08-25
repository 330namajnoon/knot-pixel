import type ImageConfigurator from "./ImagePaletteConfigurator";

class Cuter {
    parent: ImageConfigurator;
    w: number;
    h: number;
    lenght: number;

    constructor(w: number, h: number, length: number, parent: ImageConfigurator) {
        this.w = w;
        this.h = h;
        this.lenght = length;
        this.parent = parent;
    }

    draw() {
        const { ctx3, canvas3 } = this.parent;
        const { x, y, w, h } = this.getContentRect();
        ctx3.fillStyle = "#FFFFFF30";
        ctx3.strokeStyle = "#FFFFFF";
        ctx3.lineWidth = this.lenght;
        ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
        ctx3.clearRect(x, y, w, h);
        ctx3.strokeRect(x, y, w, h);
    }

    getContentRect(): { x: number; y: number; w: number; h: number } {
        const { canvas3, image } = this.parent;
        const imageRect = image.getContentRect();
        let w = imageRect.w;
        let h = imageRect.h;
        if (this.h > this.w ) {
            h = imageRect.h;
            w = (h * this.w) / this.h;
        } 
        if (this.h < this.w) {
            w = imageRect.w;
            h = (w * this.h) / this.w;
        }
        const x = canvas3.width / 2 - w / 2;
        const y = canvas3.height / 2 - h / 2;
        return { x, y, w, h };
    }

    getSize(): { w: number; h: number } {
        return { w: this.w, h: this.h };
    }

    setSize({ w, h }: { w?: number; h?: number }) {
        if (w) this.w = w;
        if (h) this.h = h;
        this.parent.draw();
    }
}

export default Cuter;
