import Ability from "../../Base/Ability"

export default class bristleback_quill_spray extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Bristleback_QuillSpray

	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bristleback_quill_spray", bristleback_quill_spray)
