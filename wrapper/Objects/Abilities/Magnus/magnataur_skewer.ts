import Ability from "../../Base/Ability"

export default class magnataur_skewer extends Ability {
	public get AOERadius(): number {
		return this.GetSpecialValue("skewer_radius")
	}

	public get Speed(): number {
		return this.GetSpecialValue("skewer_speed")
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("magnataur_skewer", magnataur_skewer)
