import Ability from "../../Base/Ability"

export default class void_spirit_resonant_pulse extends Ability {
	// TODO :use cooldown reductions
	public get CooldownLength(): number {
		return this.GetSpecialValue("charge_restore_time")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("void_spirit_resonant_pulse", void_spirit_resonant_pulse)
