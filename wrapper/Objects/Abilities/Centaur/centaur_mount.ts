import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("centaur_mount")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsModifiersAttachedTo: true,
	Paths: "particles/units/heroes/hero_centaur/centaur_scepter_mount_despawn.vpcf"
})
export class centaur_mount extends Ability {}
