import NetworkedParticle from "../../Base/NetworkedParticle"
import FakeUnit, { GetPredictionTarget } from "../../Objects/Base/FakeUnit"
import Unit from "../../Objects/Base/Unit"
import { arrayRemove, arrayRemoveCallback } from "../../Utils/ArrayExtensions"
import GameState from "../../Utils/GameState"

const lastTeleports: [NetworkedParticle, Unit | FakeUnit][] = [],
	lastParticles: NetworkedParticle[] = []
export function HandleParticleChangeFurionTP(par: NetworkedParticle, is_update: boolean): void {
	if (!par.Path.includes("furion_teleport"))
		return
	const is_end = par.Path.includes("furion_teleport_end"),
		unit = par.AttachedTo
	if (!is_update) {
		if (!is_end) {
			const target = GetPredictionTarget(unit)
			if (target !== undefined) {
				// PredictedPosition should be set in Gesture handler if TP actually finished
				target.TPStartTime = -1
				target.TPStartPosition.CopyTo(target.LastTPStartPosition)
				target.TPEndPosition.CopyTo(target.LastTPEndPosition)
				target.TPStartPosition.Invalidate()
				target.TPEndPosition.Invalidate()
			}
		}
		arrayRemove(lastParticles, par)
		arrayRemoveCallback(lastTeleports, ([otherPar]) => par === otherPar)
		return
	}
	if (lastParticles.includes(par))
		return
	const cpPosision = par.ControlPoints.get(is_end ? 1 : 0),
		cp2 = par.ControlPoints.get(2)
	// simple sanity checks for furion TP
	if (
		cpPosision === undefined
		|| cp2 === undefined
		|| cp2.x !== 1
		|| cp2.y !== 0
		|| cp2.z !== 0
	)
		return
	if (is_end) {
		const firstTP = lastTeleports[0]
		lastTeleports.splice(0, 1)
		if (firstTP !== undefined)
			firstTP[1].TPEndPosition.CopyFrom(cpPosision)
	} else {
		const target = GetPredictionTarget(unit)
		if (target === undefined)
			return
		if (target.TPStartTime === -1)
			target.TPStartTime = GameState.RawGameTime
		target.TPStartPosition.CopyFrom(cpPosision).CopyTo(target.PredictedPosition)
		lastTeleports.push([par, target])
	}
	lastParticles.push(par)
}
