import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_reality_rift")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsModifiersAttachedTo: true,
	Paths: "particles/units/heroes/hero_chaos_knight/chaos_knight_reality_rift.vpcf"
})
export class chaos_knight_reality_rift extends Ability {
	public get CanHitSpellImmuneEnemy(): boolean {
		return (
			super.CanHitSpellImmuneEnemy || this.GetSpecialValue("pierces_immunity") !== 0
		)
	}
}
