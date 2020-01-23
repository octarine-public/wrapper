import Ability from "../../Base/Ability"

export default class grimstroke_scepter extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Grimstroke_Scepter>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("grimstroke_scepter", grimstroke_scepter)
