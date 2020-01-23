import Ability from "../../Base/Ability"

export default class life_stealer_assimilate extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Life_Stealer_Assimilate>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_assimilate", life_stealer_assimilate)
