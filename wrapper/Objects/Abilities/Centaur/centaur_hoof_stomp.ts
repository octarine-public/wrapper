import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("centaur_hoof_stomp")
@WrapperClassNetworkParticle({
	Attachs: 0,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_centaur/centaur_warstomp.vpcf"
})
export class centaur_hoof_stomp extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("stomp_damage", level)
	}
}
