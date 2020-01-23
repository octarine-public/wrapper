import Ability from "../../Base/Ability"

export default class undying_tombstone extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Undying_Tombstone>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("undying_tombstone", undying_tombstone)
