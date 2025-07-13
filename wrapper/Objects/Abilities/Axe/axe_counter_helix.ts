import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("axe_counter_helix")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_axe/axe_counterhelix.vpcf"
})
export class axe_counter_helix extends Ability {
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
