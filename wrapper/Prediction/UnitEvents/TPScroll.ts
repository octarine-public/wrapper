import NetworkedParticle from "../../Base/NetworkedParticle"
import Entity from "../../Objects/Base/Entity"
import Unit from "../../Objects/Base/Unit"
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
		|| !(cpEntTeleporting[0] instanceof Unit)
		|| cpColor.x < 0 || cpColor.x > 1
		|| cpColor.y < 0 || cpColor.y > 1
		|| cpColor.y < 0 || cpColor.z > 1
	)
		return
	const unit = cpEntTeleporting[0]
	unit.LastRealPredictedPositionUpdate = GameState.RawGameTime
	unit.LastPredictedPositionUpdate = GameState.RawGameTime
	if (unit.TPStartTime === -1)
		unit.TPStartTime = GameState.RawGameTime
	if (cpFallbackTeleporting !== undefined)
		unit.TPStartPosition.CopyFrom(cpFallbackTeleporting).CopyTo(unit.PredictedPosition)
	if (cpTarget0 !== undefined)
		unit.TPEndPosition.CopyFrom(cpTarget0)
	else if (cpEntTarget0 instanceof Entity)
		unit.TPEndPosition.CopyFrom(cpEntTarget0.Position)
	else if (cpFallbackTarget0 !== undefined)
		unit.TPEndPosition.CopyFrom(cpFallbackTarget0)
	if (!is_update) {
		// PredictedPosition should be set in Gesture handler if TP actually finished
		unit.TPStartTime = -1
		unit.TPStartPosition.CopyTo(unit.LastTPStartPosition)
		unit.TPEndPosition.CopyTo(unit.LastTPEndPosition)
		unit.TPStartPosition.Invalidate()
		unit.TPEndPosition.Invalidate()
	}
}
