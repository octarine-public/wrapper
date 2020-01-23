import Ability from "../../Base/Ability"

export default class legion_commander_overwhelming_odds extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Legion_Commander_OverwhelmingOdds>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("legion_commander_overwhelming_odds", legion_commander_overwhelming_odds)
