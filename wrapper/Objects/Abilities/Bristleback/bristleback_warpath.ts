import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("bristleback_warpath")
@WrapperClassNetworkParticle({
	Attachs: 7,
	IsAttachedTo: true,
	Paths: "particles/generic_gameplay/no_vision.vpcf"
})
export class bristleback_warpath extends Ability {}
