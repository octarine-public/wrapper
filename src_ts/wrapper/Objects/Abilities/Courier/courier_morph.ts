import Ability from "../../Base/Ability"

export default class courier_morph extends Ability {
	public readonly NativeEntity!: CDOTA_Ability_Courier_Morph
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("courier_morph", courier_morph)
