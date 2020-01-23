import Ability from "../../Base/Ability"

export default class abaddon_death_coil extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Abaddon_DeathCoil>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abaddon_death_coil", abaddon_death_coil)
