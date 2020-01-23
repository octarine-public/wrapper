import Ability from "../../Base/Ability"

export default class legion_commander_duel extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Legion_Commander_Duel>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("legion_commander_duel", legion_commander_duel)
