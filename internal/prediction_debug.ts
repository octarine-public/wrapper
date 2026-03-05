import {
	Ability,
	Color,
	EntityManager,
	EventsSDK,
	GameState,
	Hero,
	HitChance,
	InputEventSDK,
	LocalPlayer,
	mirana_arrow,
	ParticlesSDK,
	phoenix_icarus_dive,
	PredictionDebugger,
	PredictionEngine,
	PredictionInput,
	pudge_meat_hook,
	RendererSDK,
	Vector2,
	Vector3,
	VKeys
} from "../wrapper/Imports"

const pSDK = new ParticlesSDK()
const CAST_KEY = VKeys.KEY_F
const MIN_CAST_HITCHANCE = HitChance.High
const CAST_DISPLAY_DURATION = 5
let castRequested = false

interface CachedPrediction {
	ability: Ability
	owner: Hero
	output: ReturnType<typeof PredictionEngine.GetPrediction>
}
const cachedPredictions = new Map<string, CachedPrediction>()

interface CastRecord {
	castPos: Vector3
	predictedPos: Vector3
	targetActualPos: Vector3
	hitChance: HitChance
	timeToHit: number
	castTime: number
	key: string
}
const castHistory: CastRecord[] = []

const abilityClasses: [string, Constructor<Ability>][] = [
	["hook", pudge_meat_hook],
	["arrow", mirana_arrow],
	["dive", phoenix_icarus_dive]
]

function hitChanceColor(hc: HitChance): Color {
	switch (hc) {
		case HitChance.Immobile:
			return Color.Green
		case HitChance.VeryHigh:
			return new Color(0, 200, 0)
		case HitChance.High:
			return Color.Yellow
		case HitChance.Medium:
			return new Color(255, 165, 0)
		case HitChance.Low:
			return new Color(255, 100, 0)
		case HitChance.Impossible:
			return Color.Red
		default:
			return Color.White
	}
}

function hitChanceString(hc: HitChance): string {
	switch (hc) {
		case HitChance.Impossible:
			return "Impossible"
		case HitChance.Low:
			return "Low"
		case HitChance.Medium:
			return "Medium"
		case HitChance.High:
			return "High"
		case HitChance.VeryHigh:
			return "VeryHigh"
		case HitChance.Immobile:
			return "Immobile"
		default:
			return "Unknown"
	}
}

EventsSDK.on("Draw", () => {
	const hero = LocalPlayer?.Hero
	if (hero === undefined) {
		return
	}

	const enemies = EntityManager.GetEntitiesByClass(Hero).filter(
		x => x !== hero && x.IsEnemy() && x.IsAlive && x.IsVisible
	)
	if (enemies.length === 0) {
		for (const [key] of abilityClasses) {
			pSDK.DestroyByKey(`pred_${key}_line`)
			pSDK.DestroyByKey(`pred_${key}_target`)
			pSDK.DestroyByKey(`pred_${key}_cast`)
		}
		return
	}

	const target = enemies.reduce((closest, e) =>
		hero.Distance2D(e) < hero.Distance2D(closest) ? e : closest
	)

	let yOffset = 300
	PredictionDebugger.Enabled = true

	for (const [key, abilClass] of abilityClasses) {
		let ability: Nullable<Ability> = hero.GetAbilityByClass(abilClass)
		let owner: Nullable<Hero> = ability?.Owner as Nullable<Hero>
		if (ability === undefined || ability.Level === 0) {
			for (const enemy of enemies) {
				const enemyAbil = enemy.GetAbilityByClass(abilClass)
				if (enemyAbil !== undefined && enemyAbil.Level > 0) {
					ability = enemyAbil
					owner = enemy
					break
				}
			}
		}
		if (ability === undefined || ability.Level === 0 || owner === undefined) {
			// PredictionDebugger.Destroy(pSDK)
			continue
		}
		const actualTarget = owner === hero ? target : hero
		const input = PredictionInput.FromAbility(ability, actualTarget)
		const output = PredictionEngine.GetPrediction(input)

		const hc = output.HitChance_
		const color = hitChanceColor(hc)

		if (owner === hero) {
			cachedPredictions.set(key, { ability, owner, output })
		}

		if (
			castRequested &&
			owner === hero &&
			hc >= MIN_CAST_HITCHANCE &&
			ability.CanBeCasted()
		) {
			ability.UseAbility(output.CastPosition)
			castHistory.push({
				castPos: output.CastPosition.Clone(),
				predictedPos: output.PredictedPosition.Clone(),
				targetActualPos: actualTarget.Position.Clone(),
				hitChance: hc,
				timeToHit: output.TimeToHit,
				castTime: GameState.RawGameTime,
				key
			})
			castRequested = false
		}

		PredictionDebugger.Draw(input, output, pSDK)
		// pSDK.DrawLine(`pred_${key}_line`, owner, castPos, {
		// 	Position: owner.Position,
		// 	Color: color,
		// 	Width: 80
		// })

		// pSDK.DrawCircle(`pred_${key}_target`, owner, actualTarget.HullRadius + 15, {
		// 	Position: output.PredictedPosition,
		// 	Color: Color.Yellow
		// })

		// const radius = ability.AOERadius
		// if (radius > 0) {
		// 	pSDK.DrawCircle(`pred_${key}_cast`, owner, radius, {
		// 		Position: castPos,
		// 		Color: color
		// 	})
		// }

		const canCast = owner === hero && ability.CanBeCasted()
		RendererSDK.Text(
			`[${key}] ${hitChanceString(hc)} | t=${output.TimeToHit.toFixed(2)}s${canCast ? " [READY]" : ""}`,
			new Vector2(10, yOffset),
			color
		)
		yOffset += 25
	}
	castRequested = false

	const now = GameState.RawGameTime
	for (let i = castHistory.length - 1; i >= 0; i--) {
		const rec = castHistory[i]
		const elapsed = now - rec.castTime
		if (elapsed > CAST_DISPLAY_DURATION) {
			pSDK.DestroyByKey(`cast_${i}_cast`)
			pSDK.DestroyByKey(`cast_${i}_pred`)
			pSDK.DestroyByKey(`cast_${i}_actual`)
			pSDK.DestroyByKey(`cast_${i}_line`)
			castHistory.splice(i, 1)
			continue
		}
		const alpha = Math.max(1 - elapsed / CAST_DISPLAY_DURATION, 0.2)
		const castColor = new Color(255, 50, 50, Math.round(alpha * 255))
		const predColor = new Color(255, 255, 0, Math.round(alpha * 255))
		const actualColor = new Color(255, 255, 255, Math.round(alpha * 255))

		pSDK.DrawCircle(`cast_${i}_cast`, hero, 30, {
			Position: rec.castPos,
			Color: castColor
		})
		pSDK.DrawCircle(`cast_${i}_pred`, hero, 20, {
			Position: rec.predictedPos,
			Color: predColor
		})
		pSDK.DrawCircle(`cast_${i}_actual`, hero, 15, {
			Position: rec.targetActualPos,
			Color: actualColor
		})
		pSDK.DrawLine(`cast_${i}_line`, hero, rec.predictedPos, {
			Position: rec.targetActualPos,
			Color: actualColor,
			Width: 30
		})

		const errDist = rec.castPos.Distance2D(rec.targetActualPos)
		const screenPos = RendererSDK.WorldToScreen(rec.castPos)
		if (screenPos !== undefined) {
			RendererSDK.Text(
				`[${rec.key}] err:${errDist.toFixed(0)} | ${hitChanceString(rec.hitChance)}`,
				screenPos,
				errDist < 100 ? Color.Green : errDist < 200 ? Color.Yellow : Color.Red
			)
		}
	}

	const rotDiff = target.RotationDifference
	const isMoving = target.IsMoving
	const yawVel = target.YawVelocity
	const rotRad = target.RotationRad
	const tPos = target.Position

	const fwdEnd = tPos.Add(target.Forward.MultiplyScalar(200))
	pSDK.DrawLine("pred_rot_fwd", target, fwdEnd, {
		Position: tPos,
		Color: Color.Green,
		Width: 40
	})

	if (Math.abs(rotDiff) > 0.5) {
		const futureRad = rotRad + (rotDiff * Math.PI) / 180
		const futureDir = Vector3.FromAngle(futureRad)
		const futureEnd = tPos.Add(futureDir.MultiplyScalar(200))
		pSDK.DrawLine("pred_rot_diff", target, futureEnd, {
			Position: tPos,
			Color: new Color(255, 0, 255),
			Width: 40
		})
	} else {
		pSDK.DestroyByKey("pred_rot_diff")
	}

	const movingStr = isMoving ? "MOVING" : "STOPPED"
	const rotColor = Math.abs(rotDiff) > 0.5 ? new Color(255, 0, 255) : Color.White
	RendererSDK.Text(
		`RotDiff: ${rotDiff.toFixed(1)}° | ${movingStr} | YawVel: ${yawVel.toFixed(1)}`,
		new Vector2(10, yOffset),
		rotColor
	)
	yOffset += 25
})

InputEventSDK.on("KeyDown", (key: VKeys) => {
	if (key === CAST_KEY) {
		castRequested = true
	}
})
