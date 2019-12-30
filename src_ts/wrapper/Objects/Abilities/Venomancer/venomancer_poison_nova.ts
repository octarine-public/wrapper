import Ability from "../../Base/Ability"

export default class venomancer_poison_nova extends Ability {
	public readonly m_pBaseEntity!: C_DOTA_Ability_Venomancer_PoisonNova

	public get AOERadius(): number {
		let range = this.GetSpecialValue("radius")
		let talant = this.Owner?.GetTalentValue("special_bonus_unique_venomancer_6")!
		return range += talant !== 0 ? talant : 0
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("venomancer_poison_nova", venomancer_poison_nova)
