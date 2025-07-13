import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("centaur_return")
@WrapperClassNetworkParticle({
	Attachs: 2,
	SourceCP: 0,
	FindCaster: true,
	Paths: "particles/units/heroes/hero_centaur/centaur_return.vpcf"
})
export class centaur_return extends Ability {}
