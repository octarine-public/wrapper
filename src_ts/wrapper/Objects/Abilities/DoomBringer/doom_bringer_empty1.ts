import Ability from "../../Base/Ability"

export default class doom_bringer_empty1 extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DoomBringer_Empty1
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("doom_bringer_empty1", doom_bringer_empty1)
