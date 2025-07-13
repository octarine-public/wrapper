import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("alchemist_acid_spray")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_alchemist/alchemist_acid_spray_cast.vpcf"
})
export class alchemist_acid_spray extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
}
