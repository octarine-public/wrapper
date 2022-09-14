import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"

@WrapperClass("spectre_spectral_dagger")
export class spectre_spectral_dagger extends Ability {
	public readonly ProjectilePath = "particles/units/heroes/hero_spectre/spectre_spectral_dagger_tracking.vpcf"
}
