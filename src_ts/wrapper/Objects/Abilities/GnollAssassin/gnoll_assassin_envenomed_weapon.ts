import Ability from "../../Base/Ability"

export default class gnoll_assassin_envenomed_weapon extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_GnollAssassin_EnvenomedWeapon>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("gnoll_assassin_envenomed_weapon", gnoll_assassin_envenomed_weapon)
