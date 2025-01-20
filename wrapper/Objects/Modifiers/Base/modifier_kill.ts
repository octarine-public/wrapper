import { WrapperClassModifier } from "../../../Decorators"
import { arc_warden_tempest_double } from "../../../Objects/Abilities/ArcWarden/arc_warden_tempest_double"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kill extends Modifier {
	public get ForceVisible(): boolean {
		return this.Ability instanceof arc_warden_tempest_double
	}
}
