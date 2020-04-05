import Ability from "../../Base/Ability"

export default class dazzle_shallow_grave extends Ability {

	public get AOERadius(): number {
		return super.Owner?.HasScepter
			? this.GetSpecialValue("scepter_radius")
			: 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("dazzle_shallow_grave", dazzle_shallow_grave)
