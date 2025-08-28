class ImagePaletteConfigurator {
    root: HTMLElement;
    imgSrc: string;
    canvas: HTMLCanvasElement;
    canvasOriginal: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    ctxOriginal: CanvasRenderingContext2D;
    img!: HTMLImageElement;
    paletteSize: number;
    xPixels: number;
    yPixels: number;
    palette: number[][];

    constructor(root: HTMLElement, imgSrc: string, paletteSize = 4) {
        this.root = root;
        this.imgSrc = imgSrc;
        this.canvasOriginal = document.createElement("canvas");
        this.canvas = document.createElement("canvas");
        if (root.querySelector("canvas")) {
            this.canvas = root.querySelector("canvas") as HTMLCanvasElement;
        } else {
            this.root.appendChild(this.canvas);
        }
        this.ctx = this.canvas.getContext("2d")!;
        this.ctxOriginal = this.canvasOriginal.getContext("2d")!;
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.img = new Image();
        this.paletteSize = paletteSize;
        this.xPixels = 0;
        this.yPixels = 0;
        this.palette = [];
    }

    medianCutQuantization(pixels: number[][], depth: number, maxDepth: number): number[][] {
        if (depth === maxDepth || pixels.length === 0) {
            // Promedio de colores en este grupo
            let r = 0,
                g = 0,
                b = 0;
            for (const p of pixels) {
                r += p[0];
                g += p[1];
                b += p[2];
            }
            r = Math.round(r / pixels.length);
            g = Math.round(g / pixels.length);
            b = Math.round(b / pixels.length);
            return [[r, g, b]];
        }

        // Encontrar canal con mayor rango
        let rMin = 255,
            rMax = 0,
            gMin = 255,
            gMax = 0,
            bMin = 255,
            bMax = 0;
        for (const p of pixels) {
            if (p[0] < rMin) rMin = p[0];
            if (p[0] > rMax) rMax = p[0];
            if (p[1] < gMin) gMin = p[1];
            if (p[1] > gMax) gMax = p[1];
            if (p[2] < bMin) bMin = p[2];
            if (p[2] > bMax) bMax = p[2];
        }
        const rRange = rMax - rMin;
        const gRange = gMax - gMin;
        const bRange = bMax - bMin;

        let channel = 0;
        if (gRange >= rRange && gRange >= bRange) channel = 1;
        else if (bRange >= rRange && bRange >= gRange) channel = 2;

        // Ordenar por ese canal y dividir en 2
        pixels.sort((a, b) => a[channel] - b[channel]);
        const mid = Math.floor(pixels.length / 2);

        const left = pixels.slice(0, mid);
        const right = pixels.slice(mid);

        return [
            ...this.medianCutQuantization(left, depth + 1, maxDepth),
            ...this.medianCutQuantization(right, depth + 1, maxDepth),
        ];
    }

    quantizeImageKMeans(
        imageData: ImageData,
        paletteSize: number,
        maxIterations = 20
    ): { palette: number[][]; indexedData: Uint8ClampedArray } {
        const data = imageData.data;
        const pixels: number[][] = [];

        // Convertimos a lista de píxeles [r,g,b]
        for (let i = 0; i < data.length; i += 4) {
            pixels.push([data[i], data[i + 1], data[i + 2]]);
        }

        // Inicialización aleatoria de centroides
        let centroids: number[][] = [];
        for (let i = 0; i < paletteSize; i++) {
            centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);
        }

        const assignments: number[] = new Array(pixels.length).fill(0);

        for (let iter = 0; iter < maxIterations; iter++) {
            // Asignar cada píxel al centroide más cercano
            for (let i = 0; i < pixels.length; i++) {
                let minDist = Infinity;
                let cluster = 0;
                for (let j = 0; j < centroids.length; j++) {
                    const d = this.distance(pixels[i], centroids[j]);
                    if (d < minDist) {
                        minDist = d;
                        cluster = j;
                    }
                }
                assignments[i] = cluster;
            }

            // Recalcular centroides
            const newCentroids: number[][] = Array.from({ length: paletteSize }, () => [0, 0, 0]);
            const counts: number[] = new Array(paletteSize).fill(0);

            for (let i = 0; i < pixels.length; i++) {
                const cluster = assignments[i];
                newCentroids[cluster][0] += pixels[i][0];
                newCentroids[cluster][1] += pixels[i][1];
                newCentroids[cluster][2] += pixels[i][2];
                counts[cluster]++;
            }

            for (let j = 0; j < paletteSize; j++) {
                if (counts[j] > 0) {
                    newCentroids[j][0] = Math.round(newCentroids[j][0] / counts[j]);
                    newCentroids[j][1] = Math.round(newCentroids[j][1] / counts[j]);
                    newCentroids[j][2] = Math.round(newCentroids[j][2] / counts[j]);
                } else {
                    // Si un cluster queda vacío, lo reinicializamos
                    newCentroids[j] = pixels[Math.floor(Math.random() * pixels.length)];
                }
            }

            // Convergencia: si no cambió mucho, paramos
            if (JSON.stringify(newCentroids) === JSON.stringify(centroids)) {
                break;
            }

            centroids = newCentroids;
        }

        // Generar nueva imagen indexada
        const newImageData = new Uint8ClampedArray(data.length);
        for (let i = 0; i < pixels.length; i++) {
            const cluster = assignments[i];
            const [r, g, b] = centroids[cluster];
            newImageData[i * 4] = r;
            newImageData[i * 4 + 1] = g;
            newImageData[i * 4 + 2] = b;
            newImageData[i * 4 + 3] = 255;
        }

        return { palette: centroids, indexedData: newImageData };
    }

    distance(c1: number[], c2: number[]): number {
        return (c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2;
    }

    draw() {
        try {
            const rootRect = this.root.getBoundingClientRect();
            this.ctx.clearRect(0, 0, innerWidth, innerHeight);
            this.ctxOriginal.clearRect(0, 0, this.img.width, this.img.height);
            const scale = 0.9;

            let imagePos = { width: 0, height: 0 };
            if (this.img.width < this.img.height) {
                imagePos = {
                    width: (this.img.width / this.img.height) * (rootRect.height * scale),
                    height: rootRect.height * scale,
                };
            } else {
                imagePos = {
                    width: rootRect.width * scale,
                    height: (this.img.height / this.img.width) * (rootRect.width * scale),
                };
            }
            this.canvas.width = imagePos.width;
            this.canvas.height = imagePos.height;
            this.canvasOriginal.width = this.img.width;
            this.canvasOriginal.height = this.img.height;

            this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, imagePos.width, imagePos.height);
            this.ctxOriginal.drawImage(
                this.img,
                0,
                0,
                this.img.width,
                this.img.height,
                0,
                0,
                this.img.width,
                this.img.height
            );
            const imageData = this.ctx.getImageData(0, 0, imagePos.width, imagePos.height);
            const imageDataOriginal = this.ctxOriginal.getImageData(0, 0, this.img.width, this.img.height);
            const { indexedData, palette } = this.quantizeImageKMeans(imageData, this.paletteSize, 2000);
            const { indexedData: indexedDataOriginal } = this.quantizeImageKMeans(
                imageDataOriginal,
                this.paletteSize,
                2000
            );
            // const pixels = [];
            // for (let i = 0; i < data.length; i += 4) {
            //     pixels.push([data[i], data[i + 1], data[i + 2]]);
            // }

            // const maxDepth = Math.floor(Math.log2(this.paletteSize));
            // const palette = this.medianCutQuantization(pixels, 0, maxDepth);

            // // Reasignar cada píxel al color más cercano de la paleta
            // function nearestColor([r, g, b]: number[]): number[] {
            //     let best = palette[0],
            //         minDist = Infinity;
            //     for (const c of palette) {
            //         const dist = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
            //         if (dist < minDist) {
            //             minDist = dist;
            //             best = c;
            //         }
            //     }
            //     return best;
            // }

            // for (let i = 0; i < data.length; i += 4) {
            //     const [r, g, b] = nearestColor([data[i], data[i + 1], data[i + 2]]);
            //     data[i] = r;
            //     data[i + 1] = g;
            //     data[i + 2] = b;
            // }
            imageData.data.set(indexedData);
            imageDataOriginal.data.set(indexedDataOriginal);
            this.ctx.putImageData(imageData, 0, 0);
            this.ctxOriginal.putImageData(imageDataOriginal, 0, 0);
            this.palette = palette;
        } catch (error) {
            console.error("Error al dibujar la imagen:", error);
        }
    }

    render() {
        return new Promise<ImagePaletteConfigurator>((resolve, reject) => {
            this.img.src = this.imgSrc;
            this.img.onload = () => {
                this.draw();
                resolve(this);
            };
            this.img.onerror = (error) => {
                reject(error);
            };
        });
    }

    setPaletteSize(size: number) {
        this.paletteSize = size;
        this.draw();
    }

    setRowSize(size: number) {
        this.xPixels = size;
        this.yPixels = (this.img.height / this.img.width) * size;
        this.draw();
    }

    getPalette(): number[][] {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;

        const pixels: number[][] = [];
        for (let i = 0; i < data.length; i += 4) {
            pixels.push([data[i], data[i + 1], data[i + 2]]);
        }

        const map = new Map<string, number[]>();
        pixels.forEach((p) => {
            const hex = ImagePaletteConfigurator.rgbToHex(p);
            if (!map.has(hex)) {
                map.set(hex, p);
            }
        });

        const values = Array.from(map.values());

        [...values].forEach((v) => {
            const index = this.palette.findIndex((c) => c[0] === v[0] && c[1] === v[1] && c[2] === v[2]);
            if (index !== -1) {
                values[index] = this.palette[index];
            }
        });

        return values;
    }

    changePaletteColor(index: number, newColor_: string) {
        if (!this.palette.find((c) => ImagePaletteConfigurator.rgbToHex(c) === newColor_)) {
            const newColor = ImagePaletteConfigurator.hexToRgb(newColor_);
            const oldColor = this.palette[index];

            if (!this.palette || index < 0 || index >= this.palette.length) {
                console.error("Índice fuera de rango o paleta no generada");
                return;
            }

            const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                if (r === oldColor[0] && g === oldColor[1] && b === oldColor[2]) {
                    // cambiar color
                    data[i] = newColor[0];
                    data[i + 1] = newColor[1];
                    data[i + 2] = newColor[2];
                }
            }

            this.ctx.putImageData(imageData, 0, 0);

            this.palette[index] = newColor;
        }
    }

    toImageURL(): string {
        return this.canvasOriginal.toDataURL("image/png");
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
            k: Math.round(k * 100),
        };
    }

    static rgbToHsl([r, g, b]: number[]): [number, number, number] {
        r /= 255;
        g /= 255;
        b /= 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return [
            Math.round(h * 360), // Hue en grados 0–360
            Math.round(s * 100), // Saturación en %
            Math.round(l * 100), // Luminosidad en %
        ];
    }

    static hslToRgb([h, s, l]: number[]): [number, number, number] {
        h /= 360;
        s /= 100;
        l /= 100;

        let r: number, g: number, b: number;

        if (s === 0) {
            // escala de grises
            r = g = b = l;
        } else {
            const hue2rgb = (p: number, q: number, t: number): number => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}

export default ImagePaletteConfigurator;
