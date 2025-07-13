import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { modifier_bristleback_quill_spray } from "../../Modifiers/Abilities/Bristleback/modifier_bristleback_quill_spray"

@WrapperClass("bristleback_quill_spray")
@WrapperClassNetworkParticle({
	Attachs: [1, 8],
	IsModifiersAttachedTo: true,
	Paths: [
		"particles/units/heroes/hero_bristleback/bristleback_quill_spray.vpcf",
		"particles/units/heroes/hero_bristleback/bristleback_quill_spray_hit.vpcf"
	]
})
@WrapperClassNetworkParticle({
	Attachs: 2,
	SourceCP: 2,
	Paths: "particles/units/heroes/hero_bristleback/bristleback_quill_spray_impact.vpcf"
})
export class bristleback_quill_spray extends Ability implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("quill_base_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const baseDamage = super.GetRawDamage(target)
		const modifier = target.GetBuffByClass(modifier_bristleback_quill_spray),
			bonusDamage = modifier?.GetBonusDamagePerStack(target) ?? 0
		return baseDamage + bonusDamage
	}
}
