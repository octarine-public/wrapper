import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("chaos_knight_chaos_strike")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsModifiersAttachedTo: true,
	Paths: "particles/units/heroes/hero_chaos_knight/chaos_knight_crit_tgt.vpcf"
})
export class chaos_knight_chaos_strike extends Ability {}
