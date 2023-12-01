import { Paths } from "../../Data/ImageData"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { PowerTreadsAttribute } from "../../Enums/PowerTreadsAttribute"
import { Item } from "../Base/Item"

@WrapperClass("item_power_treads")
export class item_power_treads extends Item {
	@NetworkedBasicField("m_iStat")
	public ActiveAttribute = PowerTreadsAttribute.STRENGTH

	public get TexturePath(): string {
		const path = Paths.ItemIcons
		switch (this.ActiveAttribute) {
			case PowerTreadsAttribute.STRENGTH:
				return path + "/power_treads_str_png.vtex_c"
			case PowerTreadsAttribute.INTELLIGENCE:
				return path + "/power_treads_int_png.vtex_c"
			case PowerTreadsAttribute.AGILITY:
				return path + "/power_treads_agi_png.vtex_c"
			default:
				return super.TexturePath
		}
	}
	public SwitchAttribute(target: PowerTreadsAttribute, queue: boolean): void {
		const owner = this.Owner
		if (target === this.ActiveAttribute || owner === undefined) {
			return
		}
		let switchCount = 0
		// TODO: that's really bad code, rewrite it in a good way once we know one
		switch (this.ActiveAttribute) {
			case PowerTreadsAttribute.STRENGTH:
				switch (target) {
					default:
					case PowerTreadsAttribute.STRENGTH:
						break
					case PowerTreadsAttribute.INTELLIGENCE:
						switchCount = 1
						break
					case PowerTreadsAttribute.AGILITY:
						switchCount = 2
						break
				}
				break
			case PowerTreadsAttribute.INTELLIGENCE:
				switch (target) {
					case PowerTreadsAttribute.STRENGTH:
						switchCount = 2
						break
					default:
					case PowerTreadsAttribute.INTELLIGENCE:
						break
					case PowerTreadsAttribute.AGILITY:
						switchCount = 1
						break
				}
				break
			case PowerTreadsAttribute.AGILITY:
				switch (target) {
					case PowerTreadsAttribute.STRENGTH:
						switchCount = 1
						break
					case PowerTreadsAttribute.INTELLIGENCE:
						switchCount = 2
						break
					default:
					case PowerTreadsAttribute.AGILITY:
						break
				}
				break
			default:
				break
		}
		for (let i = 0; i < switchCount; i++) {
			owner.CastNoTarget(this, queue)
		}
	}
}
