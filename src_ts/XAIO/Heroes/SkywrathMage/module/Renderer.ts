
import { EnemyMouse } from "./index"
import { ComboActived } from "./Combo"
import { array_sky_radiuses } from "../Data"
import { XAIOParticle } from "../../../Core/bootstrap"
import { Units, XAIOStateGlobal } from "../../../bootstrap"

import {
	Game, Color, Vector2, Ability,
	RendererSDK, FontFlags_t,
	DOTAGameUIState_t, skywrath_mage_concussive_shot,
} from "wrapper/Imports"

import {
	XAIOState, XAIOComboKey, XAIOStyleCombo,
	SkyAutoComboState, BlinkRadiusItemColor,
	XAIORangeRadiusesStyle, ArcaneBoltRadiusColor,
	AncientSealRadiusColor, MysticFlareRadiusColor,
	SkyRangeRadiusesSelector, ConcussiveShotRadiusColor,
	XIAORadiusColorAttackRange, SkyConShotPositionZ,
	XAIOAttackRadiusesStyle, SkyDrawingtargetStateShot,
	XIAODrawingtargetState, XIAODrawingtargetLineActive,
	XIAODrawingtargetLineDeactive, XAIOAttackRangeRadiusState,
	SkyAutoComboDisableWhen, SkyPanelTextItem,
	SkyPanelTextXItem, SkyPanelTextYItem,
	SkyPanelTextSize, XAIORenderBindKey,
	XAIORenderBindKeyStyle, SmartArcaneAutoBoltState,
} from "../Menu"

export let RenderActived: boolean = true
let classParticle = new XAIOParticle()


XAIOState.OnDeactivate(classParticle.removePartsAllByName)
XAIOStateGlobal.OnDeactivate(classParticle.removePartsAllByName)


XAIORenderBindKey.OnRelease(() => {
	RenderActived = !RenderActived
	classParticle.removePartsAllByName()
})

export function InfoPanel() {

	if (SkyPanelTextItem.value && Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {

		let Combo = (XAIOStyleCombo.selected_id === 1 && ComboActived) || (XAIOStyleCombo.selected_id === 0 && XAIOComboKey.is_pressed),
			autoArcaneBolt = !Combo && SmartArcaneAutoBoltState.value,
			AutoCombo = SkyAutoComboState.value && (!SkyAutoComboDisableWhen.value || !Combo)

		let wSize = RendererSDK.WindowSize,
			text: [string, boolean, boolean][] = [
				["Combo: ", Combo, true],
				["Auto Bolt: ", autoArcaneBolt, true],
				["Auto Combo: ", AutoCombo, true],
			]

		let i = 0
		// loop-optimizer: KEEP
		text.forEach(([name, value, render_disabled]) => {
			if (!render_disabled && !value)
				return
			let pos = new Vector2(
				wSize.x / 100 * SkyPanelTextXItem.value,
				wSize.y / 100 * SkyPanelTextYItem.value + (i * SkyPanelTextSize.value),
			)
			RendererSDK.Text(
				name,
				pos,
				Color.White,
				"Consoles",
				SkyPanelTextSize.value,
				FontFlags_t.ANTIALIAS,
			)
			RendererSDK.Text(
				value ? "ON" : "OFF",
				pos.AddScalarX(RendererSDK.GetTextSize(name, "Consoles", SkyPanelTextSize.value, FontFlags_t.ANTIALIAS).x),
				new Color(value ? 0 : 255, value ? 255 : 0, 0, 255),
				"Consoles",
				SkyPanelTextSize.value,
				FontFlags_t.ANTIALIAS,
			)
			i++
		})
	}
}

export function ParticleRadius(Particle: XAIOParticle) {

	if (!XAIOStateGlobal.value || !XAIOState.value || Particle.unit === undefined)
		return

	let colorLineTarget = XIAODrawingtargetLineDeactive.Color

	if ((XAIOStyleCombo.selected_id === 1 && ComboActived) || (XAIOStyleCombo.selected_id === 0 && XAIOComboKey.is_pressed))
		colorLineTarget = XIAODrawingtargetLineActive.Color

	let RenderConShot = Particle.RenderConShot(
		SkyDrawingtargetStateShot,
		Particle.unit.GetAbilityByClass(skywrath_mage_concussive_shot)!,
		SkyConShotPositionZ,
		Units
	)

	let DrawLineTarget = Particle.RenderLineTarget(XIAODrawingtargetState, EnemyMouse, colorLineTarget)
	let DrawAttackRadius = Particle.DrawAttackRange(XAIOAttackRangeRadiusState, XIAORadiusColorAttackRange.Color, XAIOAttackRadiusesStyle)

	if (RenderConShot !== undefined)
		Particle.addPartToUnit(RenderConShot)

	if (DrawLineTarget !== undefined)
		Particle.addPartToUnit(DrawLineTarget)

	if (DrawAttackRadius !== undefined)
		Particle.addPartToUnit(DrawAttackRadius)

	if ((XAIORenderBindKeyStyle.selected_id === 1 && !RenderActived) || (XAIORenderBindKeyStyle.selected_id === 0 && !XAIORenderBindKey.is_pressed))
		return

	Particle.RenderAbilityItems(array_sky_radiuses, SkyRangeRadiusesSelector, XAIORangeRadiusesStyle, (abil: Ability, defColor: Color) => {
		switch (abil.Name) {
			case "item_blink":
				return BlinkRadiusItemColor.Color
			case "skywrath_mage_arcane_bolt":
				return ArcaneBoltRadiusColor.Color
			case "skywrath_mage_ancient_seal":
				return AncientSealRadiusColor.Color
			case "skywrath_mage_mystic_flare":
				return MysticFlareRadiusColor.Color
			case "skywrath_mage_concussive_shot":
				return ConcussiveShotRadiusColor.Color
			default: return defColor
		}
	})
}
