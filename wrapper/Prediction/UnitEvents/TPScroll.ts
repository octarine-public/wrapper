import NetworkedParticle from "../../Base/NetworkedParticle"
import Entity from "../../Objects/Base/Entity"
import { GetPredictionTarget } from "../../Objects/Base/FakeUnit"
import GameState from "../../Utils/GameState"

export function HandleParticleChangeTPScroll(par: NetworkedParticle, is_update: boolean): void {
	if (!par.Path.includes("teleport_end"))
		return
	const cpEntTarget0 = par.ControlPointsEnt.get(0),
		cpEntTarget1 = par.ControlPointsEnt.get(1),
		cpFallbackTarget0 = par.ControlPointsFallback.get(0),
		cpFallbackTeleporting = par.ControlPointsFallback.get(3),
		cpEntTeleporting = par.ControlPointsEnt.get(3),
		cpTarget0 = par.ControlPoints.get(0),
		cpTarget1 = par.ControlPoints.get(1),
		cpColor = par.ControlPoints.get(2)
	// sanity check: default TPs have CP0-1 identical, CP2 is set to color and CPEnt3 is set to teleporting unit
	// in case of teleporting to unit CPEnt0-1 are identical, CP2 is set to color and CPEnt3 is set to teleporting unit
	if (
		cpEntTeleporting === undefined
		|| (
			(cpTarget0 === undefined || cpTarget1 === undefined || !cpTarget0.Equals(cpTarget1))
			&& (cpEntTarget0 === undefined || cpEntTarget1 === undefined || cpEntTarget0[0] !== cpEntTarget1[0])
		)
		|| cpFallbackTeleporting === undefined
		|| cpColor === undefined
		|| cpColor.x < 0 || cpColor.x > 1
		|| cpColor.y < 0 || cpColor.y > 1
		|| cpColor.y < 0 || cpColor.z > 1
	)
		return
	const target = GetPredictionTarget(cpEntTeleporting[0])
	if (target === undefined)
		return
	target.LastRealPredictedPositionUpdate = GameState.RawGameTime
	target.LastPredictedPositionUpdate = GameState.RawGameTime
	if (target.TPStartTime === -1)
		target.TPStartTime = GameState.RawGameTime
	if (cpFallbackTeleporting !== undefined)
		target.TPStartPosition.CopyFrom(cpFallbackTeleporting).CopyTo(target.PredictedPosition)
	if (cpTarget0 !== undefined)
		target.TPEndPosition.CopyFrom(cpTarget0)
	else if (cpEntTarget0 instanceof Entity)
		target.TPEndPosition.CopyFrom(cpEntTarget0.Position)
	else if (cpFallbackTarget0 !== undefined)
		target.TPEndPosition.CopyFrom(cpFallbackTarget0)
	if (!is_update) {
		// PredictedPosition should be set in Gesture handler if TP actually finished
		target.TPStartTime = -1
		target.TPStartPosition.CopyTo(target.LastTPStartPosition)
		target.TPEndPosition.CopyTo(target.LastTPEndPosition)
		target.TPStartPosition.Invalidate()
		target.TPEndPosition.Invalidate()
	}
}
