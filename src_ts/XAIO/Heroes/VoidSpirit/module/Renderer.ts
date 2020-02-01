import { array_ability_render } from "../Data"
import { ComboActived } from "./Combo"
import { EnemyMouse } from "./index"
import XAIOParticle from "XAIO/Core/Draw/Draw"
import { Color, Ability } from "wrapper/Imports"
import {
	XAIOState, XAIOStateGlobal, XAIOComboKey,
	XIAODrawingtargetLineDeactive, XAIOStyleCombo,
	XIAODrawingtargetLineActive, XIAORadiusColorAttackRange,
	BlinkRadiusItemColor, DissimilateRadiusColor, AetherRemnantRadiusColor,
	XIAODrawingtargetState, XAIOAttackRangeRadiusState, XAIORangeRadiusesStyle,
	XAIOAttackRadiusesStyle, XAIORenderBindKeyStyle, XAIORenderBindKey,
	VoidSpiritRangeRadiusesSelector, ResonantPulseRadiusColor, AstralStepRadiusColor
} from "../Menu"


let RenderActived: boolean = true
let classParticle = new XAIOParticle()

XAIORenderBindKey.OnRelease(() => {
	RenderActived = !RenderActived
	classParticle.removePartsAllByName()
})


XAIOState.OnDeactivate(classParticle.removePartsAllByName)
XAIOStateGlobal.OnDeactivate(classParticle.removePartsAllByName)

export function ParticleRadius(Particle: XAIOParticle) {
	if (!XAIOStateGlobal.value || !XAIOState.value || Particle.unit === undefined)
		return

	let colorLineTarget = XIAODrawingtargetLineDeactive.Color

	if ((XAIOStyleCombo.selected_id === 1 && ComboActived) || (XAIOStyleCombo.selected_id === 0 && XAIOComboKey.is_pressed))
		colorLineTarget = XIAODrawingtargetLineActive.Color

	let DrawLineTarget = Particle.RenderLineTarget(XIAODrawingtargetState, EnemyMouse, colorLineTarget)
	let DrawAttackRadius = Particle.DrawAttackRange(XAIOAttackRangeRadiusState, XIAORadiusColorAttackRange.Color, XAIOAttackRadiusesStyle)

	if (DrawLineTarget !== undefined)
		Particle.addPartToUnit(DrawLineTarget)

	if (DrawAttackRadius !== undefined)
		Particle.addPartToUnit(DrawAttackRadius)

	if ((XAIORenderBindKeyStyle.selected_id === 1 && !RenderActived) || (XAIORenderBindKeyStyle.selected_id === 0 && !XAIORenderBindKey.is_pressed))
		return

	Particle.RenderAbilityItems(array_ability_render, VoidSpiritRangeRadiusesSelector, XAIORangeRadiusesStyle, (abil: Ability, defColor: Color) => {
		switch (abil.Name) {
			case "item_blink":
				return BlinkRadiusItemColor.Color
			case "void_spirit_dissimilate":
				return DissimilateRadiusColor.Color
			case "void_spirit_astral_step":
				return AstralStepRadiusColor.Color
			case "void_spirit_aether_remnant":
				return AetherRemnantRadiusColor.Color
			case "void_spirit_resonant_pulse":
				return ResonantPulseRadiusColor.Color
			default:
				return defColor
		}
	})
}
