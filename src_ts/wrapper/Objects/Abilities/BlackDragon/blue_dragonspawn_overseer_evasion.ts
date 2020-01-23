import Ability from "../../Base/Ability"

export default class blue_dragonspawn_overseer_evasion extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_BlueDragonspawnOverseer_Evasion>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("blue_dragonspawn_overseer_evasion", blue_dragonspawn_overseer_evasion)
