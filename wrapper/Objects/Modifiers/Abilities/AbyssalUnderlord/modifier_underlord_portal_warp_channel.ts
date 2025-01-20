import { GetSpellTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { AbilityData } from "../../../DataBook/AbilityData"

@WrapperClassModifier()
export class modifier_underlord_portal_warp_channel extends Modifier implements IChannel {
	public readonly ChannelModifierName = this.Name

	protected readonly CanPostDataUpdate = true
	private channelDuration = -1

	public get ForceVisible(): boolean {
		return true
	}
	public get Duration(): number {
		return this.channelDuration
	}
	public IsChannel(): this is IChannel {
		return true
	}
	public GetTexturePath(): string {
		return GetSpellTexture("abyssal_underlord_dark_portal")
	}
	public PostDataUpdate(): void {
		if (this.channelDuration !== -1) {
			return
		}
		const name = "abyssal_underlord_dark_portal",
			abilData = AbilityData.GetAbilityByName(name),
			specialValue = abilData?.GetSpecialValue(
				"warp_channel_duration",
				this.AbilityLevel,
				name
			)
		this.channelDuration = specialValue ?? -1
	}
}
