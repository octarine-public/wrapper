import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("axe_berserkers_call")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_axe/axe_beserkers_call_owner.vpcf"
})
export class axe_berserkers_call extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
