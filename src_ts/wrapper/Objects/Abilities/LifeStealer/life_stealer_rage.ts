import Ability from "../../Base/Ability"

export default class life_stealer_rage extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Life_Stealer_Rage>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_rage", life_stealer_rage)
