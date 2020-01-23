import Ability from "../../Base/Ability"

export default class antimage_mana_void extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_AntiMage_ManaVoid>

	public get AOERadius(): number {
		return this.GetSpecialValue("mana_void_aoe_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("antimage_mana_void", antimage_mana_void)
