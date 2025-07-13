import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("centaur_stampede")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsModifiersAttachedTo: true,
	Paths: [
		"particles/units/heroes/hero_centaur/centaur_stampede.vpcf",
		"particles/units/heroes/hero_centaur/centaur_stampede_cast.vpcf",
		"particles/units/heroes/hero_centaur/centaur_stampede_overhead.vpcf"
	]
})
export class centaur_stampede extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
}
