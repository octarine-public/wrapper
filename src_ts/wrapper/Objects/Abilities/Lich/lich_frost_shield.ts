import Ability from "../../Base/Ability"

export default class lich_frost_shield extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Lich_FrostShield>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("lich_frost_shield", lich_frost_shield)
