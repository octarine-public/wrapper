import Ability from "../../Base/Ability"

export default class centaur_stampede extends Ability {
	public readonly NativeEntity!: CDOTA_Ability_Centaur_Stampede
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("centaur_stampede", centaur_stampede)
