import NetworkedParticle from "../../Base/NetworkedParticle"
import Unit from "../../Objects/Base/Unit"
import { arrayRemove, arrayRemoveCallback } from "../../Utils/ArrayExtensions"
import GameState from "../../Utils/GameState"

const lastTeleports: [NetworkedParticle, Unit][] = [],
	lastParticles: NetworkedParticle[] = []
export function HandleParticleChangeFurionTP(par: NetworkedParticle, is_update: boolean): void {
	if (!par.Path.includes("furion_teleport"))
		return
	const is_end = par.Path.includes("furion_teleport_end"),
		unit = par.AttachedTo
	if (!is_update) {
		if (!is_end && unit instanceof Unit) {
			// PredictedPosition should be set in Gesture handler if TP actually finished
			unit.TPStartTime = -1
			unit.TPStartPosition.CopyTo(unit.LastTPStartPosition)
			unit.TPEndPosition.CopyTo(unit.LastTPEndPosition)
			unit.TPStartPosition.Invalidate()
			unit.TPEndPosition.Invalidate()
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
	} else if (unit instanceof Unit) {
		if (unit.TPStartTime === -1)
			unit.TPStartTime = GameState.RawGameTime
		unit.TPStartPosition.CopyFrom(cpPosision).CopyTo(unit.PredictedPosition)
		lastTeleports.push([par, unit])
	} else
		return
	lastParticles.push(par)
}
