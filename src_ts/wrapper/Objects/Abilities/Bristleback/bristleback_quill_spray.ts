import Ability from "../../Base/Ability"

export default class bristleback_quill_spray extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Bristleback_QuillSpray

	public get AOERadius(): number {
		return this.GetSpecialValue("radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("bristleback_quill_spray", bristleback_quill_spray)
