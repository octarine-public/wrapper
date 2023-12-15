import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTA_RUNES } from "../../Enums/DOTA_RUNES"
import { RegisterFieldHandler } from "../NativeToSDK"
import { Entity } from "./Entity"

@WrapperClass("CDOTA_Item_Rune")
export class Rune extends Entity {
	public Type = DOTA_RUNES.DOTA_RUNE_INVALID
	@NetworkedBasicField("m_flRuneTime")
	public readonly RuneTime = 0
	@NetworkedBasicField("m_nMapLocationTeam")
	public readonly MapLocationTeam = 0
	@NetworkedBasicField("m_szLocation")
	public readonly Location = ""

	private name_ = ""
	private fullName_ = ""

	public get Name() {
		return !super.Name.length ? this.name_ : super.Name
	}

	public get FullName() {
		return this.fullName_
	}

	/**
	 * @ignore
	 * @internal
	 */
	public SetRuneName() {
		switch (this.Type) {
			case DOTA_RUNES.DOTA_RUNE_DOUBLEDAMAGE:
				this.fullName_ = this.name_ = "doubledamage"
				break
			case DOTA_RUNES.DOTA_RUNE_HASTE:
				this.fullName_ = this.name_ = "haste"
				break
			case DOTA_RUNES.DOTA_RUNE_ILLUSION:
				this.fullName_ = this.name_ = "illusion"
				break
			case DOTA_RUNES.DOTA_RUNE_INVISIBILITY:
				this.name_ = "invis"
				this.fullName_ = "invisibility"
				break
			case DOTA_RUNES.DOTA_RUNE_REGENERATION:
				this.name_ = "regen"
				this.fullName_ = "regeneration"
				break
			case DOTA_RUNES.DOTA_RUNE_BOUNTY:
				this.fullName_ = this.name_ = "bounty"
				break
			case DOTA_RUNES.DOTA_RUNE_ARCANE:
				this.name_ = this.fullName_ = "arcane"
				break
			case DOTA_RUNES.DOTA_RUNE_WATER:
				this.fullName_ = this.name_ = "water"
				break
			case DOTA_RUNES.DOTA_RUNE_XP:
				this.fullName_ = this.name_ = "xp"
				break
			case DOTA_RUNES.DOTA_RUNE_SHIELD:
				this.fullName_ = this.name_ = "shield"
				break
			default: {
				this.fullName_ = this.name_ = "unknown"
				break
			}
		}
	}
}

/**
 * @ignore
 * @internal
 */
RegisterFieldHandler(Rune, "m_iRuneType", (rune, newVal) => {
	rune.Type = newVal as DOTA_RUNES
	rune.SetRuneName()
})
