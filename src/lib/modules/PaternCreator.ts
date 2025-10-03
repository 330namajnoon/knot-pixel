import type { Mesh } from "@babylonjs/core";
import ImagePaletteConfigurator from "./ImagePaletteConfigurator";

export type Knot = {
    x: number;
    y: number;
    color: string;
    mesh?: Mesh
}

export type Patern = {
    imageSrc: string;
    img: HTMLImageElement;
    w: number;
    h: number;
    knots: Knot[][][];
}


class PaternCreator {
    imageSrc: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(src: string) {
        this.imageSrc = src;
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
    }

    getPatern(imageData: ImageData, img: HTMLImageElement): Patern {
        const knots: Knot[][][] = [];
        const pixelData = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        for (let y = height - 1; y >= 0; y--) {
            const row: Knot[][] = [];
            let rowKnots: Knot[] = [];
            for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4;
                const r = pixelData[index];
                const g = pixelData[index + 1];
                const b = pixelData[index + 2];

                const color = ImagePaletteConfigurator.rgbToHex([r, g, b]);
                if (rowKnots.length === 0 || rowKnots[rowKnots.length - 1].color === color) {
                    rowKnots.push({ x, y, color });
                } else {
                    row.push(rowKnots);
                    rowKnots = [{ x, y, color }];
                }
            }
            if (rowKnots.length > 0) {
                row.push(rowKnots);
            }
            knots.push(row);
        }
        return {
            imageSrc: this.imageSrc,
            img: img,
            w: imageData.width,
            h: imageData.height,
            knots: knots,
        };
        
    }

    create(): Promise<Patern> {
        return new Promise<Patern>((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Handle CORS if needed
            img.src = this.imageSrc;
            img.onload = () => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.ctx.drawImage(img, 0, 0);
                const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
                const patern = this.getPatern(imageData, img);
                resolve(patern);
            };
            img.onerror = (error) => {
                reject(error);
            };
        });
    }
}

export default PaternCreator;