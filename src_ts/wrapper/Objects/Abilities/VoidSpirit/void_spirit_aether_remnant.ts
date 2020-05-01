import Ability from "../../Base/Ability"

export default class void_spirit_aether_remnant extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
	public get ActivationDelay(): number {
		return this.GetSpecialValue("activation_delay")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("void_spirit_aether_remnant", void_spirit_aether_remnant)
