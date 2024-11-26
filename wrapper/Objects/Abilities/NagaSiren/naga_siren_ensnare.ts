import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("naga_siren_ensnare")
export class naga_siren_ensnare extends Ability {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public get CanHitSpellImmuneEnemy(): boolean {
		return (
			super.CanHitSpellImmuneEnemy ||
			this.GetSpecialValue("can_target_magic_immune") !== 0
		)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("net_speed", level)
	}
}
