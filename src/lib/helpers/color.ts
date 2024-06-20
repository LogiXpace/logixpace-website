export class Color {
	string(): string {
		return '';
	}
}

export class RGB extends Color {
	red: number;
	green: number;
	blue: number;

	constructor(red: number, green: number, blue: number) {
		super();
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	string(): string {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}
}

export class RGBA extends RGB {
	alpha: number;

	constructor(red: number, green: number, blue: number, aplha: number) {
		super(red, green, blue);
		this.alpha = aplha;
	}

	string(): string {
		return `rgb(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
	}
}

export class HSL extends Color {
	hue: number;
	saturation: number;
	lightness: number;

	constructor(hue: number, saturation: number, lightness: number) {
		super();
		this.hue = hue;
		this.saturation = saturation;
		this.lightness = lightness;
	}

	string() {
		return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
	}
}
