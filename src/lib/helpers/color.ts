export class Color {
	alpha: number;

	constructor(alpha: number) {
		this.alpha = alpha;
	}

	string(): string {
		return '';
	}

	clone(alpha: number): Color {
		return new RGB(0, 0, 0, alpha);
	}

	toRGB(): RGB {
		return new RGB(0, 0, 0, this.alpha);
	}
}

export class RGB extends Color {
	red: number;
	green: number;
	blue: number;

	constructor(red: number, green: number, blue: number, alpha: number = 1) {
		super(alpha);
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	string(): string {
		return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
	}

	clone(alpha: number) {
		return new RGB(this.red, this.green, this.blue, alpha);
	}

	toRGB(): RGB {
		return new RGB(this.red, this.green, this.blue, this.alpha);
	}
}

export class HSL extends Color {
	hue: number;
	saturation: number;
	lightness: number;

	constructor(hue: number, saturation: number, lightness: number, aplha: number) {
		super(aplha);
		this.hue = hue;
		this.saturation = saturation;
		this.lightness = lightness;
	}

	string() {
		return `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;
	}

	clone(alpha: number): Color {
		return new HSL(this.hue, this.saturation, this.lightness, alpha);
	}
}
