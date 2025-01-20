import { GetItemTexture } from "../../../Data/ImageData"
import { WrapperClassModifier } from "../../../Decorators"
import { modifier_item_moon_shard } from "./modifier_item_moon_shard"

@WrapperClassModifier()
export class modifier_item_moon_shard_consumed extends modifier_item_moon_shard {
	public readonly IsHidden = false

	public get ForceVisible(): boolean {
		return true
	}
	public GetTexturePath(): string {
		return GetItemTexture("item_moon_shard")
	}
	protected UpdateSpecialValues(): void {
		const name = "item_moon_shard"
		this.CachedAttackSpeed = this.GetSpecialValue("consumed_bonus", name)
		this.CachedNightVision = this.GetSpecialValue("consumed_bonus_night_vision", name)
	}
}
