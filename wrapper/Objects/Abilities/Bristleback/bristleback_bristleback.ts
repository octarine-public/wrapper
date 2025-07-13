import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_bristleback")
@WrapperClassNetworkParticle({
	Attachs: 8,
	IsModifiersAttachedTo: true,
	Paths: "particles/units/heroes/hero_bristleback/bristleback_quill_spray_conical.vpcf"
})
export class bristleback_bristleback extends Ability {
	public get AbilityBehaviorMask(): DOTA_ABILITY_BEHAVIOR {
		const mask = super.AbilityBehaviorMask
		return this.OwnerHasScepter
			? mask | DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
			: mask
	}
	public GetBaseActivationDelayForLevel(level: number): number {
		return this.GetSpecialValue("activation_delay", level)
	}
}
