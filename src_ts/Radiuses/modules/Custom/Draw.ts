import { PARTICLE_RENDER_NAME, ArrayExtensions, ParticlesSDK, LocalPlayer, Menu, EventsSDK, Entity } from "wrapper/Imports"
import { IMenuParticlePicker } from "wrapper/Menu/ITypes"

import { CustomMenu, CustomCount } from "./Menu"
import { ParticleUpdatePattern } from "../../base/MenuParticle"


interface IMenuRangeParticle extends IMenuParticlePicker {
	Range: Menu.Slider
}

// -------

const customRadiusSliders: IMenuRangeParticle[] = []
const customRadiusePartManager = new ParticlesSDK()

// -------

CustomCount.OnValue(({ value }) => {
	var nowCount = customRadiusSliders.length

	if (nowCount < value) {
		for (var i = nowCount; i < value; i++)
			customRadiusSliders.push(AddCustomSlider(i))
	}
	else {
		for (var i = nowCount - 1; i > value - 1; i--) {
			RemoveCustomSlider(i)
			customRadiusSliders.splice(i, 1)
		}
	}
})

// -------

function AddCustomSlider(index: number): IMenuRangeParticle {

	const Style = CustomMenu.AddParticlePicker(`Radius ${index + 1}`, undefined, [
		PARTICLE_RENDER_NAME.NORMAL,
		PARTICLE_RENDER_NAME.ROPE,
		PARTICLE_RENDER_NAME.ANIMATION
	], true)

	// range slider
	const Range = Style.Node.AddSlider("Range", 1200 + (index * 50), 50, 5000)

	// to first Index in Menu
	ArrayExtensions.arrayRemove(Range.parent.entries, Range)
	Range.parent.entries.splice(0, 0, Range)


	const MenuRangeParticle = {
		...Style,
		Range
	}

	{ // updating menu

		Style.State?.OnValue(self => {
			self.value ? CreateOrUpdateCustomRadius(MenuRangeParticle) : RemoveCustomRadius(MenuRangeParticle)
		})

		ParticleUpdatePattern(Style, () => {
			customRadiusePartManager.SetConstrolPointsByKey(MenuRangeParticle,
				[2, Style.Color],			// Color
				[3, Style.Width.value],		// Width
				[4, Style.A.value]			// Alpha
			)
		}, () => {
			RemoveCustomRadius(MenuRangeParticle)
			CreateOrUpdateCustomRadius(MenuRangeParticle)
		})

		Range.OnValue(() => CreateOrUpdateCustomRadius(MenuRangeParticle))
	}

	return MenuRangeParticle
}

function RemoveCustomSlider(index: number) {
	const style = customRadiusSliders[index]

	RemoveCustomRadius(style)

	style.Node.DetachFromParent()
}

// -------

function CreateOrUpdateCustomRadius(style: IMenuRangeParticle) {
	if (!style.State?.value || !LocalPlayer?.Hero)
		return

	customRadiusePartManager.DrawCircle(style,
		LocalPlayer.Hero, style.Range.value,
		{
			Attachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
			RenderStyle: style.Style.selected_id,
			Color: style.Color,
			Width: style.Width.value,
			Alpha: style.A.value
		})
}

function RemoveCustomRadius(style: IMenuRangeParticle) {
	customRadiusePartManager.DestroyByKey(style)
}

// -------

function CustomRadiusDraw() {
	customRadiusSliders.forEach(CreateOrUpdateCustomRadius)
}
function CustomRadiusDestroy() {
	customRadiusePartManager.DestroyAll()
}

// -------

EventsSDK.on("LifeStateChanged", (ent: Entity) => {
	if (LocalPlayer?.Hero !== ent)
		return

	if (ent.LifeState === LifeState_t.LIFE_ALIVE)
		CustomRadiusDraw()
	else if (ent.LifeState === LifeState_t.LIFE_DYING || ent.LifeState === LifeState_t.LIFE_DEAD)
		CustomRadiusDestroy()
})

EventsSDK.on("GameStarted", () => CustomRadiusDraw())
EventsSDK.on("GameEnded", () => CustomRadiusDestroy())