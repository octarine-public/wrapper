import Ability from "../../Base/Ability"

export default class broodmother_spin_web_destroy extends Ability {
	public readonly NativeEntity!: CDOTA_Ability_Broodmother_SpinWeb_Destroy
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("broodmother_spin_web_destroy", broodmother_spin_web_destroy)
