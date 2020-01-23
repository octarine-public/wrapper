import Ability from "../../Base/Ability"

export default class doom_bringer_devour extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_DoomBringer_Devour
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("doom_bringer_devour", doom_bringer_devour)
