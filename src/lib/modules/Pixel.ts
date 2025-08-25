import Patern from "./PaternCreator";

class Pixel {
	parent: Patern;
	color: string;
	x: number;
	y: number;
	width: string;
	height: string
	element: HTMLElement;
	constructor(x: number, y: number, width: string, height: string, color: string, parent: Patern) {
		this.color = color;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height
		this.parent = parent;
		this.element = document.createElement("div");
		this.element.style.backgroundColor = color;
		this.element.style.width = width;
		this.element.style.height = height;
		this.element.style.boxSizing = "border-box";
	}

	select() {
		this.element.style.border = "solid 1px";
	}

	setSize(width: string, height: string) {
		this.width = width;
		this.height = height;
		this.element.style.width = width;
		this.element.style.height = height;
	}
}

export default Pixel;
