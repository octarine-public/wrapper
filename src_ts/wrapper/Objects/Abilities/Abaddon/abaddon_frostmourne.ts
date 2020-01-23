import Ability from "../../Base/Ability"

export default class abaddon_frostmourne extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Abaddon_Frostmourne>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abaddon_frostmourne", abaddon_frostmourne)
