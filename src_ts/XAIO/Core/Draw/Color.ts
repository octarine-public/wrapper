import { Color } from "wrapper/Imports"

export abstract class XColor extends Color {
	public static get DarkOliveGreen(): Color {
		return new Color(85, 107, 47)
	}
	public static get LightGreen(): Color {
		return new Color(144, 238, 144)
	}
}
