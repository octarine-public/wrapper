interface ITurnData {
	MaxTurnSpeed: number
	TurnAcceleration: number
	TurnDeceleration: number
	ImmediateMovementAngle: number
	FullTurnMovementAngle: number
	CastAngles: number[]
}

const castAngles = [11, 45, 90, 135, 180]
const turnDataEntries: {
	TurnRate: number
	TurnData: ITurnData
}[] = [
	{
		TurnRate: 0.1,
		TurnData: {
			MaxTurnSpeed: 147.6,
			TurnAcceleration: 5000,
			TurnDeceleration: 1800,
			ImmediateMovementAngle: 86.4,
			FullTurnMovementAngle: 126,
			CastAngles: [13.2, 24, 39.6, 54, 69.6]
		}
	},
	{
		TurnRate: 0.4,
		TurnData: {
			MaxTurnSpeed: 494.4,
			TurnAcceleration: 13333,
			TurnDeceleration: 4800,
			ImmediateMovementAngle: 108,
			FullTurnMovementAngle: 138,
			CastAngles: [13.2, 28.8, 50.4, 72, 93.6]
		}
	},
	{
		TurnRate: 0.5,
		TurnData: {
			MaxTurnSpeed: 576,
			TurnAcceleration: 13333,
			TurnDeceleration: 6000,
			ImmediateMovementAngle: 115.2,
			FullTurnMovementAngle: 138,
			CastAngles: [13.2, 31.2, 54, 78, 102]
		}
	},
	{
		TurnRate: 0.6,
		TurnData: {
			MaxTurnSpeed: 648,
			TurnAcceleration: 13333,
			TurnDeceleration: 7200,
			ImmediateMovementAngle: 122.4,
			FullTurnMovementAngle: 138,
			CastAngles: [13.2, 32.4, 58.8, 84, 110.4]
		}
	},
	{
		TurnRate: 1,
		TurnData: {
			MaxTurnSpeed: 756,
			TurnAcceleration: 13333,
			TurnDeceleration: 12000,
			ImmediateMovementAngle: 150,
			FullTurnMovementAngle: 156,
			CastAngles: [13.2, 38.4, 73.2, 108, 141.6]
		}
	}
]

export function GetTurnData(turnRate: number): ITurnData {
	if (turnRate <= turnDataEntries[0].TurnRate) {
		return turnDataEntries[0].TurnData
	}

	let nextMatch = 1
	for (; nextMatch < turnDataEntries.length; nextMatch++) {
		if (turnDataEntries[nextMatch].TurnRate >= turnRate) {
			break
		}
	}
	if (nextMatch === turnDataEntries.length) {
		return turnDataEntries[turnDataEntries.length - 1].TurnData
	}
	if (turnDataEntries[nextMatch].TurnRate === turnRate) {
		return turnDataEntries[nextMatch].TurnData
	}

	const prevData = turnDataEntries[nextMatch - 1]
	const nextData = turnDataEntries[nextMatch]
	const mul = (turnRate - prevData.TurnRate) / (nextData.TurnRate - prevData.TurnRate)
	return {
		MaxTurnSpeed:
			nextData.TurnData.MaxTurnSpeed * mul +
			prevData.TurnData.MaxTurnSpeed * (1 - mul),
		TurnAcceleration:
			nextData.TurnData.TurnAcceleration * mul +
			prevData.TurnData.TurnAcceleration * (1 - mul),
		TurnDeceleration:
			nextData.TurnData.TurnDeceleration * mul +
			prevData.TurnData.TurnDeceleration * (1 - mul),
		ImmediateMovementAngle:
			nextData.TurnData.ImmediateMovementAngle * mul +
			prevData.TurnData.ImmediateMovementAngle * (1 - mul),
		FullTurnMovementAngle:
			nextData.TurnData.FullTurnMovementAngle * mul +
			prevData.TurnData.FullTurnMovementAngle * (1 - mul),
		CastAngles: prevData.TurnData.CastAngles.map(
			(prevAng, i) => nextData.TurnData.CastAngles[i] * mul + prevAng * (1 - mul)
		)
	}
}

export function GetCastAngle(turnData: ITurnData, ang: number, distSqr: number): number {
	if (distSqr < 0.1 || ang <= 11.5) {
		return 180
	}
	let nextMatch = 1
	for (; nextMatch < castAngles.length; nextMatch++) {
		if (castAngles[nextMatch] >= ang) {
			break
		}
	}
	if (nextMatch === castAngles.length) {
		return 180
	}
	const mul =
		(ang - castAngles[nextMatch - 1]) /
		(castAngles[nextMatch] - castAngles[nextMatch - 1])
	const prevCastAngle = turnData.CastAngles[nextMatch - 1]
	const nextCastAngle = turnData.CastAngles[nextMatch]
	return prevCastAngle + (nextCastAngle - prevCastAngle) * mul
}

export function UpdateFacing(
	turnData: ITurnData,
	yawVelocity: number,
	angDiff: number,
	curInterval: number
): [number, number] {
	if (yawVelocity * angDiff < 0) {
		yawVelocity = 0
	}
	const decel = yawVelocity ** 2 / (angDiff * 2)
	if (
		yawVelocity === 0 ||
		angDiff === 0 ||
		Math.abs(decel) < turnData.TurnDeceleration
	) {
		yawVelocity += turnData.TurnAcceleration * curInterval * (angDiff >= 0 ? 1 : -1)
		if (Math.abs(yawVelocity) > turnData.MaxTurnSpeed) {
			yawVelocity = (yawVelocity >= 0 ? 1 : -1) * turnData.MaxTurnSpeed
		}
	} else {
		yawVelocity -= curInterval * decel
		if (yawVelocity * (decel >= 0 ? 1 : -1) < 0) {
			yawVelocity = 0
		}
	}
	const change = yawVelocity * curInterval
	if ((angDiff - change) * angDiff <= 0) {
		return [angDiff, 0]
	}
	return [change, yawVelocity]
}

export function GetAngleToFacePath(turnData: ITurnData, angDiffAbs: number): number {
	if (angDiffAbs <= turnData.ImmediateMovementAngle) {
		return angDiffAbs
	}
	if (turnData.FullTurnMovementAngle >= 180) {
		return turnData.FullTurnMovementAngle
	}
	return (
		turnData.ImmediateMovementAngle +
		(turnData.FullTurnMovementAngle - turnData.ImmediateMovementAngle) *
			((angDiffAbs - turnData.ImmediateMovementAngle) /
				(180 - turnData.ImmediateMovementAngle))
	)
}
