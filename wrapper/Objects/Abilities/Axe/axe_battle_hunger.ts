import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("axe_battle_hunger")
@WrapperClassNetworkParticle({
	Attachs: 1,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_axe/axe_battle_hunger_cast.vpcf"
})
export class axe_battle_hunger extends Ability {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.Owner?.HasScepter ? this.GetSpecialValue("scepter_range", level) : 0
	}
}
