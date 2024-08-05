import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_aeon_disk")
export class item_aeon_disk extends Item {
	public static readonly ModifierName: string = "modifier_item_aeon_disk_buff"

	public get MaxLevel(): number {
		return this.MaxLevelOverride !== -1
			? this.MaxLevelOverride
			: this.GetSpecialValue("max_level")
	}

	public get CurrentCharges() {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		return Math.max(Math.min(owner.AeonChargesUsed, this.MaxLevel), this.Level)
	}
	public set CurrentCharges(_newVal: number) {
		// to be implemented
	}
}
