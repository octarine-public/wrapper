import Ability from "../../Base/Ability"

export default class windrunner_powershot extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Windrunner_Powershot>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_powershot", windrunner_powershot)
