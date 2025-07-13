import { WrapperClass, WrapperClassNetworkParticle } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("CDOTA_Ability_Centaur_Work_Horse")
@WrapperClassNetworkParticle({
	Attachs: 2,
	IsModifiersAttachedTo: true,
	Paths: "particles/units/heroes/hero_centaur/centaur_scepter_mount_spawn.vpcf"
})
export class centaur_work_horse extends Ability {
	public get ShouldBeDrawable(): boolean {
		return false
	}
}
