import Ability from "../../Base/Ability"

export default class sniper_assassinate extends Ability {
	public get Speed(): number {
		return this.GetSpecialValue("projectile_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("sniper_assassinate", sniper_assassinate)
