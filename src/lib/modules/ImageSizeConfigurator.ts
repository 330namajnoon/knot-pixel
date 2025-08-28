class ImageSizeConfigurator {
    root: HTMLElement;
    imgSrc: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    img!: HTMLImageElement;
    xPixels: number;
    yPixels: number;

    constructor(root: HTMLElement, imgSrc: string) {
        this.root = root;
        this.imgSrc = imgSrc;
        root.innerHTML = "";
        this.canvas = document.createElement("canvas");
        this.root.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.img = new Image();
        this.xPixels = 0;
        this.yPixels = 0;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const scale = 0.9;
        const rootRect = this.root.getBoundingClientRect();
        let imageWidth = (this.img.width / this.img.height) * (rootRect.height * scale);
        let imageHeight = rootRect.height * scale;

        
        if (this.img.width > this.img.height) {
            imageWidth = rootRect.width * scale;
            imageHeight = (this.img.height / this.img.width) * (rootRect.width * scale);
        }
        
        if (this.xPixels === 0 || this.yPixels === 0) {
            this.xPixels = imageWidth;
            this.yPixels = imageHeight;
        }

        this.canvas.style.cssText = `width: ${imageWidth}px; height: ${imageHeight}px; position: absolute;`;
        this.canvas.width = this.xPixels;
        this.canvas.height = this.yPixels;
        this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.xPixels, this.yPixels);
    }

    render() {
        return new Promise<ImageSizeConfigurator>((resolve, reject) => {
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

    setRowSize(size: number) {
        this.xPixels = size;
        this.yPixels = this.img.height / this.img.width * size;
        this.draw();
    }

    getSize() {
        return {
            width: Math.round(this.img.width),
            height: Math.round(this.img.height),
        };
    }

    toImageURL() {
        return this.canvas.toDataURL("image/png");
    }
}

export default ImageSizeConfigurator;
