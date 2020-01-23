import Ability from "../../Base/Ability"

export default class techies_remote_mines_self_detonate extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Techies_RemoteMines_SelfDetonate>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("techies_remote_mines_self_detonate", techies_remote_mines_self_detonate)
