import Ability from "../../Base/Ability"

export default class nyx_assassin_burrow extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Nyx_Assassin_Burrow>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("nyx_assassin_burrow", nyx_assassin_burrow)
