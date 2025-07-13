import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_sphere extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name
	protected readonly CanPostDataUpdate = true

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_LINKEN_PROTECTION,
			this.GetLinkenProtection.bind(this)
		]
	])

	private lastChanged = false

	public PostDataUpdate(): void {
		if (this.lastChanged !== this.ForceVisible) {
			this.lastChanged = this.ForceVisible
			EventsSDK.emit("ModifierChanged", false, this)
		}
	}
	public get ForceVisible(): boolean {
		return this.Ability?.IsCooldownReady ?? false
	}
	public IsBuff(): this is IBuff {
		return this.ForceVisible
	}
	public IsShield(): this is IShield {
		return this.ForceVisible
	}
	protected GetLinkenProtection(): [number, boolean] {
		return [(this.Ability?.IsReady ?? false) ? 1 : 0, false]
	}
}
