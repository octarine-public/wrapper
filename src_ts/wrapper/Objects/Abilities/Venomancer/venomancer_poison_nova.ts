import Ability from "../../Base/Ability"

export default class venomancer_poison_nova extends Ability {
	public NativeEntity: Nullable<C_DOTA_Ability_Venomancer_PoisonNova>

	public get AOERadius(): number {
		return this.GetSpecialValue("radius") + (this.Owner?.GetTalentValue("special_bonus_unique_venomancer_6") ?? 0)
	}
}

import { RegisterClass } from "wrapper/Objects/NativeToSDK"
RegisterClass("venomancer_poison_nova", venomancer_poison_nova)
