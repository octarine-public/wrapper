import Ability from "../../Base/Ability"

export default class windrunner_windrun extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Windrunner_Windrun>
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("windrunner_windrun", windrunner_windrun)
