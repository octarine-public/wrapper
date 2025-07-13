import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("abaddon_borrowed_time")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsAttachedTo: true,
	Paths: "particles/units/heroes/hero_abaddon/abaddon_borrowed_time_heal.vpcf"
})
export class abaddon_borrowed_time extends Ability {}
