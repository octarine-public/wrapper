import { Menu as MenuSDK, PARTICLE_RENDER_NAME } from "wrapper/Imports"
import { IMenuParticlePicker, IMenuColorPicker } from "wrapper/Menu/ITypes"


// -------

export interface IMenuPattern {
	Node: MenuSDK.Node
	State: MenuSDK.Toggle
}
export interface IParticlePattern {
	Style: IMenuParticlePicker
}
export interface IColorPattern {
	Style: IMenuColorPicker
}

// -------

export const MenuPattternBase = (name: string, Node: MenuSDK.Node): IMenuPattern => {
	Node = Node.AddNode(name)
	return {
		Node,
		State: Node.AddToggle("State")
	}
}

export const MenuPatternParticle = (Node: MenuSDK.Node): IParticlePattern => ({
	Style: Node.AddParticlePicker("Style", undefined, [
		PARTICLE_RENDER_NAME.NORMAL,
		PARTICLE_RENDER_NAME.ROPE,
		PARTICLE_RENDER_NAME.ANIMATION
	])
})

export const MenuPatternColor = (Node: MenuSDK.Node): IColorPattern => ({
	Style: Node.AddColorPicker("Style")
})


// -------

export function ParticleUpdatePattern(
	style: IMenuParticlePicker | IMenuColorPicker,
	updateCallback: () => void,
	restartCallback: () => void) {

	style.R.OnValue(updateCallback)
	style.G.OnValue(updateCallback)
	style.B.OnValue(updateCallback)
	style.A.OnValue(updateCallback);

	(style as IMenuParticlePicker).Width?.OnValue(updateCallback);
	(style as IMenuParticlePicker).Style?.OnValue(restartCallback)
}