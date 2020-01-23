import Ability from "../../Base/Ability"

export default class razor_plasma_field extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Razor_PlasmaField>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("razor_plasma_field", razor_plasma_field)
