import Ability from "../../Base/Ability"

export default class juggernaut_healing_ward extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("healing_ward_aura_radius")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("juggernaut_healing_ward", juggernaut_healing_ward)
