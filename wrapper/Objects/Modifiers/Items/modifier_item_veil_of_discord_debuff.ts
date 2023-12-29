import { WrapperClassModifier } from "../../../Decorators"
import { Modifier } from "../../Base/Modifier"
import { item_shivas_guard } from "../../Items/item_shivas_guard"

@WrapperClassModifier()
export class modifier_item_veil_of_discord_debuff extends Modifier {
	public readonly IsDebuff = true

	protected SetMoveSpeedAmplifier(_specialName?: string, _subtract?: boolean): void {
		switch (true) {
			case this.Ability instanceof item_shivas_guard:
				super.SetMoveSpeedAmplifier("blast_movement_speed")
				break
		}
	}
}
