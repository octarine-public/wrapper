import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abaddon_aphotic_shield")
@WrapperClassNetworkParticle({
	Attachs: 2,
	FindCaster: true,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_abaddon/abaddon_aphotic_shield_hit.vpcf"
})
export class abaddon_aphotic_shield extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
