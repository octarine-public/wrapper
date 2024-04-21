import { PredictionInput } from "./Objects/PredictionInput"
import { PredictionOutput } from "./Objects/PredictionOutput"

export interface IPrediction {
	GetPrediction(input: PredictionInput): PredictionOutput
	GetSimplePrediction(input: PredictionInput): PredictionOutput
}
