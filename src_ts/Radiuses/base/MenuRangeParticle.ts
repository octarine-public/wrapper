import { Menu as MenuSDK, Color } from "wrapper/Imports"
import { PARTICLE_RENDER_NAME } from "./ParticlesPaths"

export interface MenuRangeParticle {
	Node: MenuSDK.Node
	State: Nullable<MenuSDK.Toggle>
	R: MenuSDK.Slider
	G: MenuSDK.Slider
	B: MenuSDK.Slider
	A: MenuSDK.Slider
	Width: MenuSDK.Slider
	Style: MenuSDK.Switcher
	Color: Color
}

export function AddRangeParticle(
	parent: MenuSDK.Node,
	name: string,
	color: Color | number = new Color(0, 255, 0),
	render: PARTICLE_RENDER_NAME[] = [
		PARTICLE_RENDER_NAME.NORMAL,
		PARTICLE_RENDER_NAME.ROPE,
		PARTICLE_RENDER_NAME.ANIMATION
	],
	isToggleTree?: boolean
): MenuRangeParticle {

	if (typeof color === "number")
		color = new Color(color, color, color)

	const Node = parent.AddNode(name)

	let State: Nullable<MenuSDK.Toggle>

	if (isToggleTree) {
		State = Node.AddToggle("State")
	}

	const R = Node.AddSlider("Color: R (red)", color.r, 0, 255)
	const G = Node.AddSlider("Color: G (green)", color.g, 0, 255)
	const B = Node.AddSlider("Color: B (blue)", color.b, 0, 255)
	const A = Node.AddSlider("Opacity (alpha)", color.a, 1, 255)

	const Width = Node.AddSlider("Width", 15, 1, 150)
	const Style = Node.AddSwitcher("Style", render)

	return {
		Node,
		State,
		R, G, B, A,
		Width, Style,
		get Color(): Color {
			return new Color(R.value, G.value, B.value, A.value)
		},
		set Color({ r, g, b, a }: Color) {
			R.value = r
			G.value = g
			B.value = b
			A.value = a
		}
	}
}

export function ParticleUpdatePattern(
	style: MenuRangeParticle,
	updateCallback: () => void,
	restartCallback: () => void) {

	style.R.OnValue(updateCallback)
	style.G.OnValue(updateCallback)
	style.B.OnValue(updateCallback)
	style.A.OnValue(updateCallback)

	style.Width.OnValue(updateCallback)
	style.Style.OnValue(restartCallback)
}