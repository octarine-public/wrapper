import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"

@WrapperClass("item_nullifier")
export class item_nullifier extends Item {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("projectile_speed", level)
	}
}
