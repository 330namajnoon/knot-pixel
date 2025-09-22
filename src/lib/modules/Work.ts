import type { Knot, Patern } from "./PaternCreator";

class Work {
    root: HTMLElement;
    patern: Patern;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
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
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d")!;
        this.canvas.width = root.getBoundingClientRect().width;
        this.canvas.height = root.getBoundingClientRect().height;
        this.view = { x: 0, y: 0, w: patern.w, h: patern.h, zoom: 1, offsetX: 0, offsetY: 0, mouse: { x: 0, y: 0 } };
        root.innerHTML = "";
        root.appendChild(this.canvas);
        this.draw();
        this.setEvents();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.patern.knots.flat().flat().forEach((knot: Knot) => {
            this.ctx.fillStyle = knot.color;
            this.ctx.fillRect(
                knot.x * this.view.zoom + this.view.offsetX,
                knot.y * this.view.zoom + this.view.offsetY,
                this.view.zoom,
                this.view.zoom
            );
        });
    }

    update() {
        this.draw();
    }

    handleOnZoom(e: WheelEvent) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();

            const rect = this.canvas.getBoundingClientRect();

            // 1. Coordenadas del ratón relativas al canvas
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // 2. Convertir esas coordenadas al mundo (antes de cambiar zoom)
            const worldX = (mouseX - this.view.offsetX) / this.view.zoom;
            const worldY = (mouseY - this.view.offsetY) / this.view.zoom;

            // 3. Nuevo zoom
            const scale = e.deltaY < 0 ? 1.1 : 0.9;
            const newZoom = Math.max(0.1, this.view.zoom * scale);

            // 4. Ajustar offset para mantener el punto fijo
            this.view.offsetX = mouseX - worldX * newZoom;
            this.view.offsetY = mouseY - worldY * newZoom;

            // 5. Guardar zoom
            this.view.zoom = newZoom;

            this.update();
        }
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
                console.log(this.view.zoom);
                this.update();
            }
        });
        window.removeEventListener("mousedown", () => {});
        window.removeEventListener("mouseup", () => {});
        window.removeEventListener("mousemove", () => {});

        window.addEventListener("wheel", (e) => this.handleOnZoom(e), { passive: false });

        let moveEnabled = false;
        let clientX = 0;
        let clientY = 0;

        window.addEventListener("mousedown", (e) => {
            moveEnabled = true;
            clientX = e.clientX;
            clientY = e.clientY;
        });
        window.addEventListener("mouseup", (e) => {
            moveEnabled = false;
            clientX = e.clientX;
            clientY = e.clientY;
        });
        window.addEventListener("mousemove", (e) => {
            if (moveEnabled) {
                this.handleMove(e.clientX - clientX, e.clientY - clientY);
                clientX = e.clientX;
                clientY = e.clientY;
            }
        });
    }
}

export default Work;
