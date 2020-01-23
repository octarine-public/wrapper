import Ability from "../../Base/Ability"

export default class life_stealer_assimilate_eject extends Ability {
	public NativeEntity: Nullable<CDOTA_Ability_Life_Stealer_AssimilateEject>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("life_stealer_assimilate_eject", life_stealer_assimilate_eject)
