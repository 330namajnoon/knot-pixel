class ImageCuter {
    imgSrc: string;
    root: HTMLElement;
    imagePos!: { x: number; y: number; width: number; height: number };
    cuterPos!: { x: number; y: number; width: number; height: number };
    img!: HTMLImageElement;
    mosueDown: boolean | string;
    cuter!: {
        lineWidth: number;
        top: HTMLDivElement;
        bottom: HTMLDivElement;
        left: HTMLDivElement;
        right: HTMLDivElement;
    };
    cuterPosCopy!: { x: number; y: number; width: number; height: number };
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    canvasSecond: HTMLCanvasElement;
    ctxSecond: CanvasRenderingContext2D;

    constructor(root: HTMLElement, imgSrc: string) {
        this.imgSrc = imgSrc;
        this.root = root;
        this.mosueDown = false;
        root.innerHTML = "";
        this.canvas = document.createElement("canvas");
        this.canvas.width = root.getBoundingClientRect().width;
        this.canvas.height = root.getBoundingClientRect().height;
        this.root.appendChild(this.canvas);
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.canvas.getContext("2d")!;
        this.canvasSecond = document.createElement("canvas");
        this.canvasSecond.width = root.getBoundingClientRect().width;
        this.canvasSecond.height = root.getBoundingClientRect().height;
        this.root.appendChild(this.canvasSecond);
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctxSecond = this.canvasSecond.getContext("2d")!;

        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvasSecond.style.position = "absolute";
        this.canvasSecond.style.top = "0";
        this.canvasSecond.style.left = "0";
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.img,
            0,
            0,
            this.img.width,
            this.img.height,
            this.imagePos.x,
            this.imagePos.y,
            this.imagePos.width,
            this.imagePos.height
        );
        this.ctxSecond.fillStyle = "transparent";
        this.ctxSecond.fillRect(0, 0, this.canvasSecond.width, this.canvasSecond.height);
        this.ctxSecond.clearRect(this.cuterPos.x, this.cuterPos.y, this.cuterPos.width, this.cuterPos.height);
        this.cuter.top.style.top = `${this.cuterPos.y}px`;
        this.cuter.top.style.left = `${this.cuterPos.x}px`;
        this.cuter.top.style.width = `${this.cuterPos.width}px`;
        this.cuter.bottom.style.top = `${this.cuterPos.y + this.cuterPos.height}px`;
        this.cuter.bottom.style.left = `${this.cuterPos.x}px`;
        this.cuter.bottom.style.width = `${this.cuterPos.width + this.cuter.lineWidth}px`;
        this.cuter.left.style.top = `${this.cuterPos.y}px`;
        this.cuter.left.style.left = `${this.cuterPos.x}px`;
        this.cuter.left.style.height = `${this.cuterPos.height}px`;
        this.cuter.right.style.top = `${this.cuterPos.y}px`;
        this.cuter.right.style.left = `${this.cuterPos.x + this.cuterPos.width}px`;
        this.cuter.right.style.height = `${this.cuterPos.height}px`;
        this.cuter.top.style.height = `${this.cuter.lineWidth}px`;
        this.cuter.bottom.style.height = `${this.cuter.lineWidth}px`;
        this.cuter.left.style.width = `${this.cuter.lineWidth}px`;
        this.cuter.right.style.width = `${this.cuter.lineWidth}px`;
    }

    render() {
        return new Promise<ImageCuter>((resolve, reject) => {
            this.img = new Image();
            this.img.crossOrigin = "anonymous";
            this.img.src = this.imgSrc;
            this.img.onload = () => {
                if (this.img.width < this.img.height) {
                    this.imagePos = {
                        x:
                            this.canvas.width / 2 -
                            ((this.img.width / this.img.height) * (this.canvas.height * 0.9)) / 2,
                        y: this.canvas.height * 0.05,
                        width: (this.img.width / this.img.height) * (this.canvas.height * 0.9),
                        height: this.canvas.height * 0.9,
                    };
                    this.cuterPos = {
                        x:
                            this.canvas.width / 2 -
                            ((this.img.width / this.img.height) * (this.canvas.height * 0.9)) / 2,
                        y: this.canvas.height * 0.05,
                        width: (this.img.width / this.img.height) * (this.canvas.height * 0.9),
                        height: this.canvas.height * 0.9,
                    };
                } else {
                    this.imagePos = {
                        x: this.canvas.width * 0.05,
                        y:
                            this.canvas.height / 2 -
                            ((this.img.height / this.img.width) * (this.canvas.width * 0.9)) / 2,
                        width: this.canvas.width * 0.9,
                        height: (this.img.height / this.img.width) * (this.canvas.width * 0.9),
                    };
                    this.cuterPos = {
                        x: this.canvas.width * 0.05,
                        y:
                            this.canvas.height / 2 -
                            ((this.img.height / this.img.width) * (this.canvas.width * 0.9)) / 2,
                        width: this.canvas.width * 0.9,
                        height: (this.img.height / this.img.width) * (this.canvas.width * 0.9),
                    };
                }
                this.cuter = {
                    lineWidth: 5,
                    top: document.createElement("div"),
                    bottom: document.createElement("div"),
                    left: document.createElement("div"),
                    right: document.createElement("div"),
                };
                this.cuter.top.className = "cuter";
                this.cuter.bottom.className = "cuter";
                this.cuter.left.className = "cuter";
                this.cuter.right.className = "cuter";
                this.cuter.top.style.position = "absolute";
                this.cuter.bottom.style.position = "absolute";
                this.cuter.left.style.position = "absolute";
                this.cuter.right.style.position = "absolute";
                this.cuter.top.style.cursor = "ns-resize";
                this.cuter.bottom.style.cursor = "ns-resize";
                this.cuter.left.style.cursor = "ew-resize";
                this.cuter.right.style.cursor = "ew-resize";

                this.cuter.top.addEventListener("mousedown", () => {
                    this.mosueDown = "top";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });
                this.cuter.bottom.addEventListener("mousedown", () => {
                    this.mosueDown = "bottom";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });
                this.cuter.left.addEventListener("mousedown", () => {
                    this.mosueDown = "left";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });
                this.cuter.right.addEventListener("mousedown", () => {
                    this.mosueDown = "right";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });

                this.cuter.top.addEventListener("touchstart", () => {
                    this.mosueDown = "top";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });
                this.cuter.bottom.addEventListener("touchstart", () => {
                    this.mosueDown = "bottom";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });
                this.cuter.left.addEventListener("touchstart", () => {
                    this.mosueDown = "left";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });
                this.cuter.right.addEventListener("touchstart", () => {
                    this.mosueDown = "right";
                    this.cuterPosCopy = {
                        ...this.cuterPos,
                    };
                });

                this.cuter.top.addEventListener("mouseup", () => {
                    this.mosueDown = false;
                });
                this.cuter.bottom.addEventListener("mouseup", () => {
                    this.mosueDown = false;
                });
                this.cuter.left.addEventListener("mouseup", () => {
                    this.mosueDown = false;
                });
                this.cuter.right.addEventListener("mouseup", () => {
                    this.mosueDown = false;
                });

                this.cuter.top.addEventListener("touchend", () => {
                    this.mosueDown = false;
                });
                this.cuter.bottom.addEventListener("touchend", () => {
                    this.mosueDown = false;
                });
                this.cuter.left.addEventListener("touchend", () => {
                    this.mosueDown = false;
                });
                this.cuter.right.addEventListener("touchend", () => {
                    this.mosueDown = false;
                });

                this.root.addEventListener("mousemove", (e) => {
                    if (this.mosueDown) {
                        const rect = this.canvas.getBoundingClientRect();
                        const mouseX = e.clientX - rect.left;
                        const mouseY = e.clientY - rect.top;
                        if (this.mosueDown === "top" && mouseY > this.imagePos.y) {
                            this.cuterPos.y = mouseY;
                            this.cuterPos.height = this.cuterPosCopy.y + this.cuterPosCopy.height - this.cuterPos.y;
                        } else if (this.mosueDown === "bottom" && mouseY < this.imagePos.y + this.imagePos.height) {
                            this.cuterPos.height = mouseY - this.cuterPos.y;
                        } else if (this.mosueDown === "left" && mouseX > this.imagePos.x) {
                            this.cuterPos.x = mouseX;
                            this.cuterPos.width = this.cuterPosCopy.x + this.cuterPosCopy.width - this.cuterPos.x;
                        } else if (this.mosueDown === "right" && mouseX < this.imagePos.x + this.imagePos.width) {
                            this.cuterPos.width = mouseX - this.cuterPos.x;
                        }
                        this.draw();
                    }
                });

                this.root.addEventListener("touchmove", (e) => {
                    if (this.mosueDown) {
                        const rect = this.canvas.getBoundingClientRect();
                        const mouseX = e.touches[0].clientX - rect.left;
                        const mouseY = e.touches[0].clientY - rect.top;
                        if (this.mosueDown === "top" && mouseY > this.imagePos.y) {
                            this.cuterPos.y = mouseY;
                            this.cuterPos.height = this.cuterPosCopy.y + this.cuterPosCopy.height - this.cuterPos.y;
                        } else if (this.mosueDown === "bottom" && mouseY < this.imagePos.y + this.imagePos.height) {
                            this.cuterPos.height = mouseY - this.cuterPos.y;
                        } else if (this.mosueDown === "left" && mouseX > this.imagePos.x) {
                            this.cuterPos.x = mouseX;
                            this.cuterPos.width = this.cuterPosCopy.x + this.cuterPosCopy.width - this.cuterPos.x;
                        } else if (this.mosueDown === "right" && mouseX < this.imagePos.x + this.imagePos.width) {
                            this.cuterPos.width = mouseX - this.cuterPos.x;
                        }
                        this.draw();
                    }
                });

                this.cuter.top.style.backgroundColor = "#ffffff";
                this.cuter.bottom.style.backgroundColor = "#ffffff";
                this.cuter.left.style.backgroundColor = "#ffffff";
                this.cuter.right.style.backgroundColor = "#ffffff";
                this.root.appendChild(this.cuter.top);
                this.root.appendChild(this.cuter.bottom);
                this.root.appendChild(this.cuter.left);
                this.root.appendChild(this.cuter.right);
                this.draw();
                resolve(this);
            };
            this.img.onerror = (error) => {
                reject(error);
            };
        });
    }

    cut() {
        const cutCanvas = document.createElement("canvas");
        const cutCtx = cutCanvas.getContext("2d")!;

        const widthDiff = this.img.width / this.imagePos.width;
        const heightDiff = this.img.height / this.imagePos.height;
        const x = (this.cuterPos.x - this.imagePos.x) * widthDiff;
        const y = (this.cuterPos.y - this.imagePos.y) * heightDiff;
        const width = this.cuterPos.width * widthDiff;
        const height = this.cuterPos.height * heightDiff;
        cutCanvas.width = width;
        cutCanvas.height = height;
		cutCtx.drawImage(
			this.img,
			x,
			y,
			width,
			height,
			0,
			0,
			width,
			height
		);
		return cutCanvas;
    }
}

export default ImageCuter;
