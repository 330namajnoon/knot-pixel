import type { Knot, Patern } from "./PaternCreator";

class Work {
    root: HTMLElement;
    patern: Patern;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    flatedKnots: Knot[];
    view: {
        x: number;
        y: number;
        zoom: number;
        w: number;
        h: number;
        offsetX: number;
        offsetY: number;
        mouse: { x: number; y: number };
    };

    constructor(patern: Patern, root: HTMLElement) {
        this.root = root;
        this.patern = patern;
        this.flatedKnots = patern.knots.flat().flat();
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.width = root.getBoundingClientRect().width;
        this.canvas.height = root.getBoundingClientRect().height;
        this.view = { x: 0, y: 0, w: patern.w, h: patern.h, zoom: 10, offsetX: 0, offsetY: 0, mouse: { x: 0, y: 0 } };
        root.innerHTML = "";
        root.appendChild(this.canvas);
        this.draw();
        this.setEvents();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const x = this.view.zoom + this.view.offsetX;
        const y = this.view.zoom + this.view.offsetY;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage(
            this.patern.img,
            0,
            0,
            this.patern.img.width,
            this.patern.img.height,
            x,
            y,
            this.patern.img.width * this.view.zoom,
            this.patern.img.height * this.view.zoom
        );

        this.patern.knots[2][2].forEach((knot) => {
            const x = (knot.x + 1) * this.view.zoom + this.view.offsetX;
            const y = (knot.y + 1) * this.view.zoom + this.view.offsetY;
            this.ctx.strokeStyle = "red";
            this.ctx.strokeRect(x, y, this.view.zoom, this.view.zoom);
        });
    }

    update() {
        this.draw();
    }

    handleOnZoom(clientX: number, clientY: number, deltaY?: number) {
        const rect = this.canvas.getBoundingClientRect();

        // 1. Coordenadas del ratón relativas al canvas
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;

        // 2. Convertir esas coordenadas al mundo (antes de cambiar zoom)
        const worldX = (mouseX - this.view.offsetX) / this.view.zoom;
        const worldY = (mouseY - this.view.offsetY) / this.view.zoom;

        // 3. Nuevo zoom
        const scale = deltaY === undefined ? 1 : deltaY < 0 ? 1.1 : 0.9;
        const newZoom = Math.max(0.1, this.view.zoom * scale);

        // 4. Ajustar offset para mantener el punto fijo
        this.view.offsetX = mouseX - worldX * newZoom;
        this.view.offsetY = mouseY - worldY * newZoom;

        // 5. Guardar zoom
        this.view.zoom = newZoom;

        this.update();
    }

    handleMove(x: number, y: number) {
        this.view.offsetX += x;
        this.view.offsetY += y;
        this.update();
    }

    setEvents() {
        window.removeEventListener("wheel", (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = -e.deltaY * 0.05; // sensibilidad
                this.view.zoom = Math.max(0.1, this.view.zoom + delta);
                this.update();
            }
        });
        window.removeEventListener("mousedown", () => {});
        window.removeEventListener("mouseup", () => {});
        window.removeEventListener("mousemove", () => {});
        window.removeEventListener("touchmove", () => {});
        window.removeEventListener("touchstart", () => {});
        window.removeEventListener("touchend", () => {});
        window.removeEventListener("keydown", () => {});

        window.addEventListener(
            "wheel",
            (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.handleOnZoom(e.clientX, e.clientY, e.deltaY);
                }
            },
            { passive: false }
        );

        let moveEnabled = false;
        let clientX = 0;
        let clientY = 0;

        window.addEventListener("mousedown", (e) => {
            moveEnabled = true;
            clientX = e.clientX;
            clientY = e.clientY;
        });
        window.addEventListener("touchstart", (e) => {
            moveEnabled = true;
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        });

        window.addEventListener("mouseup", (e) => {
            moveEnabled = false;
            clientX = e.clientX;
            clientY = e.clientY;
        });
        window.addEventListener("touchend", (e) => {
            moveEnabled = false;
            clientX = e?.changedTouches[0]?.clientX;
            clientY = e?.changedTouches[0]?.clientY;
        });

        window.addEventListener("mousemove", (e) => {
            if (moveEnabled) {
                this.handleMove(e.clientX - clientX, e.clientY - clientY);
                clientX = e.clientX;
                clientY = e.clientY;
            }
        });
        window.addEventListener("touchmove", (e) => {
            if (moveEnabled) {
                this.handleMove(e.touches[0].clientX - clientX, e.touches[0].clientY - clientY);
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            }
        });
        let xp = 2;
        window.addEventListener(
            "keydown",
            (e) => {
                if (e.key === " ") {
                    const knot = this.patern.knots[2][xp].pop();
                    if (knot) {
                        const x = (knot.x + 1) * this.view.zoom + this.view.offsetX;
                        const y = (knot.y + 1) * this.view.zoom + this.view.offsetY;
                        this.handleMove(-x + (innerWidth / 2), -y + (innerHeight / 2));
                        xp++;
                    }
                }
            },
            { passive: false }
        );
    }
}

export default Work;
