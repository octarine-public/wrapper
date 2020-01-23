import Ability from "../../Base/Ability"

export default class abyssal_underlord_firestorm extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_AbyssalUnderlord_Firestorm>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("abyssal_underlord_firestorm", abyssal_underlord_firestorm)
