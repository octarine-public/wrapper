import { WrapperClassModifier } from "../../../Decorators"
import { ModifierManager } from "../../../Managers/ModifierManager"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_diffusal_blade_slow extends Modifier {
	public readonly IsDebuff = true

	private isEmited = false

	public Remove(): boolean {
		if (!super.Remove()) {
			return false
		}
		this.BonusMoveSpeedAmplifier = 0
		this.isEmited = false
		return true
	}

	public Update(): void {
		super.Update()
		this.addIntervalThink()
	}

	public OnIntervalThink(): void {
		this.SetMoveSpeedAmplifier()
	}

	protected SetMoveSpeedAmplifier(_specialName?: string, _subtract = false): void {
		if (this.ShouldUnslowable()) {
			this.BonusMoveSpeedAmplifier = 0
			return
		}
		const elapsed = this.ElapsedTime
		// TODO
		this.BonusMoveSpeedAmplifier = -Math.max(1 - (elapsed / 0.8) * 0.2, 0.2)
	}

	private addIntervalThink(): void {
		if (!this.isEmited) {
			this.isEmited = true
			ModifierManager.AddIntervalThinkTemporary(this)
		}
	}
}
