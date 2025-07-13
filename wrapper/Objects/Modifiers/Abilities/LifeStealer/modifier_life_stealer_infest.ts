import { WrapperClassModifier } from "../../../../Decorators"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_life_stealer_infest extends Modifier implements IBuff, IDebuff {
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	public IsBuff(): this is IBuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsDebuff(): this is IDebuff {
		return !this.IsBuff()
	}
	public UnitPropertyChanged(changed?: boolean): boolean {
		const owner = this.Parent
		const state = (changed ??= true)
		if (owner === undefined) {
			return super.UnitPropertyChanged(changed)
		}
		owner.IsHideWorldHud = state
		EventsSDK.emit("UnitPropertyChanged", false, owner)
		return super.UnitPropertyChanged(changed)
	}
}
