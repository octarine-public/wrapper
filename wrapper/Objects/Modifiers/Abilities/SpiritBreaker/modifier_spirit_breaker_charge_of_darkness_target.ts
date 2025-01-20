import { GetUnitTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"
import { Units } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_spirit_breaker_charge_of_darkness_target extends Modifier {
	private targetName: Nullable<string>

	public get ForceVisible(): boolean {
		return true
	}
	public GetTexturePath(): string {
		return GetUnitTexture(this.targetName ?? "") ?? ""
	}

	public UnitPropertyChanged(_changed?: boolean): boolean {
		const owner = this.Parent
		if (owner === undefined) {
			return super.UnitPropertyChanged(_changed)
		}
		this.targetName = this.GetTarget()?.Name
		return super.UnitPropertyChanged(_changed)
	}

	public AddModifier(): boolean {
		if (!super.AddModifier()) {
			return false
		}
		this.targetName = this.GetTarget()?.Name
		return true
	}

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.targetName = this.GetTarget()?.Name
		return true
	}

	private GetTarget() {
		return Units.find(x => {
			if (!x.IsAlive || x.IsBuilding || x.IsCourier) {
				return false
			}
			const modifier = x.GetBuffByName(
				"modifier_spirit_breaker_charge_of_darkness_vision"
			)
			if (modifier === undefined || modifier.Caster !== this.Parent) {
				return false
			}
			return modifier !== undefined && modifier.Caster === this.Parent
		})
	}
}
