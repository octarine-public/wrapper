import Ability from "../../Base/Ability"

export default class brewmaster_earth_spell_immunity extends Ability {
	public readonly NativeEntity!: C_DOTA_Ability_Brewmaster_SpellImmunity
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("brewmaster_earth_spell_immunity", brewmaster_earth_spell_immunity)
