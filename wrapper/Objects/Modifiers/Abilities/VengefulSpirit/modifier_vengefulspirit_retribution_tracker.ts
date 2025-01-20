import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_vengefulspirit_retribution_tracker
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedIncomingDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source !== caster) {
			return [0, false]
		}
		return [this.cachedIncomingDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedIncomingDamage = this.GetSpecialValue(
			"bonus_damage",
			"vengefulspirit_retribution"
		)
	}
}
