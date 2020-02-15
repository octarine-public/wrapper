import Ability from "../../Base/Ability"

export default class skeleton_king_hellfire_blast extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_SkeletonKing_HellfireBlast>

	public get Speed(): number {
		return this.GetSpecialValue("blast_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("skeleton_king_hellfire_blast", skeleton_king_hellfire_blast)
