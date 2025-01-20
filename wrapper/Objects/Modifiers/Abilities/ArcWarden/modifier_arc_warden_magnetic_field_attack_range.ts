import { GetSpellTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Entity } from "../../../Base/Entity"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_arc_warden_magnetic_field_attack_range
	extends Modifier
	implements IBuff
{
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedRange = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
			this.GetAttackRangeBonus.bind(this)
		]
	])
	public GetTexturePath(): string {
		return GetSpellTexture("arc_warden_magnetic_field_tempest")
	}
	public IsEnemy(_ent?: Entity): boolean {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsEnemy()
	}
	protected GetAttackRangeBonus(): [number, boolean] {
		const parent = this.Parent
		if (this.IsEnemy() || !(parent?.IsRanged ?? false)) {
			return [0, false]
		}
		return [this.cachedRange, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedRange = this.GetSpecialValue(
			"attack_range_bonus",
			"arc_warden_magnetic_field"
		)
	}
}
