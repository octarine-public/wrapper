import Ability from "../../Base/Ability"

export default class leshrac_diabolic_edict extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Leshrac_Diabolic_Edict>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("leshrac_diabolic_edict", leshrac_diabolic_edict)
