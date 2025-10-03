import type ImageConfigurator from "./ImagePaletteConfigurator";

class ImagePreview {
    parent: ImageConfigurator;
    palette: number[][];
    pixels: number[][];
    lastData: {
        x: number;
        y: number;
        w: number;
        h: number;
        colorCount: number;
        colorSpace: number;
        palette: number[][];
    };

    colorCount: number;
    colorSpace: number;
    imageData!: ImageData;
    quantizedPalette: boolean;
    changedColorIndex: number;
    changedColor: number[];

    constructor(parent: ImageConfigurator) {
        this.parent = parent;
        this.palette = [];
        this.pixels = [];
        this.lastData = { x: 0, y: 0, w: 0, h: 0, colorCount: 0, colorSpace: 0, palette: [] };
        this.colorCount = 10;
        this.colorSpace = 72;
        this.quantizedPalette = false;
        this.changedColorIndex = 0;
        this.changedColor = [0, 0, 0];
    }

    draw() {
        const { ctx2, image, cuter, canvas2 } = this.parent;
        const { x, y, w, h } = this.getContentRect();
        const cuterSize = cuter.getSize();
        canvas2.width = cuterSize.w;
        canvas2.height = cuterSize.h;
        ctx2.drawImage(image.img, x, y, w, h, 0, 0, cuterSize.w, cuterSize.h);
        this.imageData = ctx2.getImageData(0, 0, cuterSize.w, cuterSize.h);
        const data = this.imageData.data;
        if (x !== this.lastData.x || y !== this.lastData.y || w !== this.lastData.w || h !== this.lastData.h) {
            this.pixels = [];
            for (let i = 0; i < data.length; i += 4) {
                this.pixels.push([data[i], data[i + 1], data[i + 2]]);
            }
            this.lastData = { ...this.lastData, x, y, w, h };
        }
        if (
            this.lastData.colorCount !== this.colorCount ||
            (this.lastData.colorSpace !== this.colorSpace,
            this.palette.reduce((_, p, i) => this.colorCompare(p, this.lastData.palette[i]), true))
        ) {
            if (!this.quantizedPalette)
                this.palette = this.quantize(this.pixels, this.colorCount, this.colorSpace, () => {});
            for (let index = 0; index < data.length; index += 4) {
                const rgb = [data[index], data[index + 1], data[index + 2]];
                const [r, g, b] = this.closestColor(rgb, this.palette);
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
            }
            // if (this.quantizedPalette) {
            //     const changedColor = this.lastData.palette[this.changedColorIndex].join();
            //     for (let index = 0; index < data.length; index += 4) {
            //         const rgb = `${data[index]},${data[index + 1]},${data[index + 2]}`;
            //         if (rgb === changedColor) {
            //             const [r, g, b] = this.changedColor;
            //             data[index] = r;
            //             data[index + 1] = g;
            //             data[index + 2] = b;
            //         }
            //     }
            // }

            this.lastData.palette = this.palette;
        }

        ctx2.putImageData(this.imageData, 0, 0);
    }

    getContentRect(): { x: number; y: number; w: number; h: number } {
        const imageRect = this.parent.image.getContentRect();
        const cuterRect = this.parent.cuter.getContentRect();
        const cuterSize = this.parent.cuter.getSize();
        const dw = cuterSize.w / this.parent.image.img.width;
        const dh = cuterSize.h / this.parent.image.img.height;
        const mx = (cuterRect.x - imageRect.x) * dw;
        const my = (cuterRect.y - imageRect.y) * dh;
        const msx = (imageRect.x + imageRect.w - (cuterRect.x + cuterRect.w)) * dw;
        const msy = (imageRect.y + imageRect.h - (cuterRect.y + cuterRect.h)) * dh;
        const x = mx;
        const y = my;
        const w = this.parent.image.img.width - mx - msx;
        const h = this.parent.image.img.height - my - msy;
        return { x, y, w, h };
    }

    colorCompare(c1: number[], c2: number[]): boolean {
        return c1.reduce((_, c, i) => c === c2[i], true);
    }

    setColorCount(value: number) {
        this.colorCount = value;
        this.quantizedPalette = false;
        this.parent.draw();
    }

    setColorSpace(value: number) {
        this.colorSpace = value;
        this.quantizedPalette = false;
        this.parent.draw();
    }

    setPaletteColor(color: number[], index: number) {
        const { ctx2 } = this.parent;
        const data = this.imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const rgb = [data[i], data[i + 1], data[i + 2]];
            if (rgb?.join() === this.palette[index]?.join()) {
                const [r, g, b] = color;
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
            }
        }
        this.palette[index] = color;
        this.quantizedPalette = true;
        this.changedColorIndex = index;
        this.changedColor = color;
        ctx2.putImageData(this.imageData, 0, 0);
    }

    closestColor(rgb: number[], customPalette: number[][]): number[] {
        const [r1, g1, b1] = rgb;
        let minDist = Infinity;
        let bestMatch = rgb;
        for (const [r2, g2, b2] of customPalette) {
            const dist = (r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2;
            if (dist < minDist) {
                minDist = dist;
                bestMatch = [r2, g2, b2];
            }
        }
        return bestMatch;
    }

    static hexToRgb(hex: string) {
        hex = hex.replace(/^#/, "");

        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        return [r, g, b];
    }

    static rgbToHex([r, g, b]: number[]) {
        return (
            "#" +
            [r, g, b]
                .map((x) => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                })
                .join("")
        );
    }

    static rgbToCmyk([r, g, b]: number[]) {
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
      
        // Calculamos K (Key, negro)
        const k = 1 - Math.max(rNorm, gNorm, bNorm);
      
        // Si el color es negro puro
        if (k === 1) {
          return { c: 0, m: 0, y: 0, k: 100 };
        }
      
        // Calculamos C, M, Y
        const c = (1 - rNorm - k) / (1 - k);
        const m = (1 - gNorm - k) / (1 - k);
        const y = (1 - bNorm - k) / (1 - k);
      
        // Convertimos a porcentajes y redondeamos
        return {
          c: Math.round(c * 100),
          m: Math.round(m * 100),
          y: Math.round(y * 100),
          k: Math.round(k * 100)
        };
      }

    quantize(pixels = [[1, 1, 1]], count: number, space: number, load: (progress: number) => void) {
        const map = new Map();
        const total = pixels.length;
        const reportInterval = Math.floor(total / 100); // Actualiza progreso cada 1%

        for (let i = 0; i < total; i++) {
            if (i % reportInterval === 0) {
                load((i / total) * 100);
            }

            const [r, g, b] = pixels[i];
            const key = `${r},${g},${b}`;

            if (map.has(key)) {
                map.set(key, map.get(key) + 1);
            } else {
                map.set(key, 1);
            }
        }
        const arrayMap = [...map.entries()];
        const sorted = arrayMap
            .sort((a, b) => b[1] - a[1])
            .slice(0, count * space)
            .filter((v, i) => i % space === 0)
            .map(([key]) => key.split(",").map(Number));

        return sorted;
    }
}

export default ImagePreview;
