import { WrapperClassModifier } from "../../../../Decorators"
import { ModifierManager } from "../../../../Managers/ModifierManager"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_axe_battle_hunger extends Modifier {
	public readonly IsDebuff = true
	private isEmited = false

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetMoveSpeedAmplifier()
	}

	public SetMoveSpeedAmplifier(specialName = "slow", subtract = false): void {
		const owner = this.Parent
		const caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return
		}
		if (owner.GetAngle(caster.Position) <= Math.PI / 2) {
			this.BonusMoveSpeedAmplifier = 0
			return
		}
		super.SetMoveSpeedAmplifier(specialName, subtract)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThinkTemporary(this)
		}
	}
}
