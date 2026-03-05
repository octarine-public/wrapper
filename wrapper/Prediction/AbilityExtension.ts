import { Ability } from "../Objects/Base/Ability"
import { Unit } from "../Objects/Base/Unit"
import { IPredictionOverrides, PredictionInput } from "./Input/PredictionInput"
import { PredictionOutput } from "./Output/PredictionOutput"
import { PredictionEngine } from "./PredictionEngine"

declare module "../Objects/Base/Ability" {
	interface Ability {
		GetPrediction(
			target: Unit | Unit[],
			overrides?: Partial<IPredictionOverrides>
		): PredictionOutput
	}
}

Ability.prototype.GetPrediction = function (
	this: Ability,
	target: Unit | Unit[],
	overrides?: Partial<IPredictionOverrides>
): PredictionOutput {
	if (Array.isArray(target)) {
		return PredictionEngine.GetAoEPrediction(this, target, overrides)
	}
	const input = PredictionInput.FromAbility(this, target, overrides)
	return PredictionEngine.GetPrediction(input)
}
