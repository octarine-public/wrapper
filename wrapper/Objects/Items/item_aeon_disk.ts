import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_aeon_disk")
export class item_aeon_disk extends Item {
	public static readonly ModifierName: string = "modifier_item_aeon_disk_buff"

	public get CurrentCharges() {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const maxCharges = Math.min(
			owner.AeonChargesUsed,
			this.GetSpecialValue("max_level")
		)
		return Math.max(maxCharges, this.Level)
	}
	public set CurrentCharges(_newVal: number) {
		// to be implemented
	}
}
