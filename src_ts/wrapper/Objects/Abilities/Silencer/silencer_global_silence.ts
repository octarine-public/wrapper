import Ability from "../../Base/Ability"

export default class silencer_global_silence extends Ability {
	public get AOERadius(): number {
		return Number.MAX_SAFE_INTEGER
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("silencer_global_silence", silencer_global_silence)
