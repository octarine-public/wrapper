import { WrapperClass } from "../../../Decorators"
import Ability from "../../Base/Ability"

@WrapperClass("spectre_spectral_dagger")
export default class spectre_spectral_dagger extends Ability {
	public get ProjectileName() {
		return [
			"particles/units/heroes/hero_spectre/spectre_spectral_dagger_tracking.vpcf",
			"particles/econ/items/spectre/spectre_transversant_soul/spectre_ti7_crimson_spectral_dagger_tracking.vpcf",
			"particles/econ/items/spectre/spectre_transversant_soul/spectre_transversant_spectral_dagger_tracking.vpcf"
		]
	}
}
