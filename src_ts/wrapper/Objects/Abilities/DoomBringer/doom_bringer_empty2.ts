import Ability from "../../Base/Ability"

export default class doom_bringer_empty2 extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DoomBringer_Empty2
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("doom_bringer_empty2", doom_bringer_empty2)
