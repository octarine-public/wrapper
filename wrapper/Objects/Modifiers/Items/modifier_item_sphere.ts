import { WrapperClassModifier } from "../../../Decorators"
import { EventsSDK } from "../../../Managers/EventsSDK"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_sphere extends Modifier implements IBuff, IShield {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name
	protected readonly CanPostDataUpdate = true

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
}
