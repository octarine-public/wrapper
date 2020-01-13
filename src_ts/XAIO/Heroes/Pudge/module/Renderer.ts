import { State } from "../Menu"
import { ParticlesSDK, pudge_meat_hook, Vector3, Entity, Unit, Obstacle, Vector2, MathSDK, NavMeshPathfinding, MovingObstacle, Creep, Hero, TickSleeper, EventsSDK, EntityManager, Menu, Game } from "wrapper/Imports"

import { _Unit, _Target } from "./Combo"
// import { XAIOPrediction } from "../../../Helper/bootstrap"

// let Predisction = new XAIOPrediction()

// TESTED =>>>>>>>>>>>>>
let par: Nullable<number>
let par2: Nullable<number>
let par3: Nullable<number>

function DestroyParticle() {
	if (par !== undefined) {
		ParticlesSDK.Destroy(par, true)
		par = undefined
	}
	if (par2 !== undefined) {
		ParticlesSDK.Destroy(par2, true)
		par2 = undefined
	}
	if (par3 !== undefined) {
		ParticlesSDK.Destroy(par3, true)
		par3 = undefined
	}
}

function TryPredict(
	start_pos: Vector2,
	hook: pudge_meat_hook,
	rad: number,
	obstacles: Obstacle[],
	obs2ent: Map<Obstacle, Entity>
): Nullable<Vector3> {
	let angle = Vector3.FromAngle(rad)
	let predict_res = new NavMeshPathfinding(
		new MovingObstacle(
			start_pos/*.Add(angle.toVector2().MultiplyScalar(hook.AOERadius * 1.5))*/,
			hook.AOERadius,
			angle.toVector2().MultiplyScalarForThis(hook.Speed),
			hook.CastRange / hook.Speed
		),
		obstacles,
		hook.CastPoint + _Unit!.FindRotationAngle(_Unit!.Position.Rotation(angle, 100)) + (Game.Ping / 2000),
	).GetFirstHitObstacle()
	if (predict_res === undefined)
		return undefined
	if (obs2ent.get(predict_res[0]) === _Target)
		return angle
	return undefined
}

function TryPredictInAngles(
	base_ang: number,
	min: number, max: number,
	start_pos: Vector2,
	hook: pudge_meat_hook,
	obstacles: Obstacle[],
	obs2ent: Map<Obstacle, Entity>
): Nullable<Vector3> {
	for (let deg = min; deg < max; deg++) {
		let predicted_angle = TryPredict(start_pos, hook, base_ang + MathSDK.DegreesToRadian(deg), obstacles, obs2ent)
		if (predicted_angle !== undefined)
			return predicted_angle
	}
	return undefined
}

let bind = Menu.AddEntry(["XAIO", "Pudge", "Test"]).AddKeybind("Test")
let bind_sleeper = new TickSleeper()

EventsSDK.on("Draw", () => {
	if (!State.value || _Unit === undefined || _Target === undefined || _Unit.Name !== "npc_dota_hero_pudge")
		return

	const hook = _Unit.GetAbilityByClass(pudge_meat_hook)

	let HitChanceColor = new Vector3()

	if (hook === undefined || !_Target.IsVisible || !_Target.IsAlive || hook.Level === 0 || !hook.CanHit(_Target) || !hook.CanBeCasted()) {
		DestroyParticle()
		return
	}

	// let predicted_ang = new Prediction(Owner).GetAngleForObstacleFirstHit(hook.CastRange, hook.AOERadius, target, hook.Speed, hook.CastPoint, ang => Owner!.TurnTime(_Unit!.Position.Rotation(Vector3.FromAngle(ang), 100)))
	let predicted_pos: Nullable<Vector3> // = predicted_ang !== undefined ? Owner.Position.AddForThis(Vector3.FromAngle(predicted_ang[0]).MultiplyScalarForThis(Owner.Distance(target))) : undefined
	let obs2ent = new Map<Obstacle, Entity>()

	let start_pos = _Unit.Position.toVector2()
	EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
		if (ent !== _Unit && ent.IsAlive && ent.IsInRange(_Unit!, hook.CastRange * 2) && !ent.IsInvulnerable && ent.IsVisible)
			obs2ent.set(MovingObstacle.FromUnit(ent), ent)
	})

	let obstacles = [...obs2ent.keys()]
	let base_ang = _Unit.Position.GetDirectionTo(_Target.Position).Angle

	let predicted_angle = TryPredictInAngles(base_ang, -90, 90, start_pos, hook, obstacles, obs2ent)

	if (predicted_angle !== undefined)
		predicted_pos = _Unit.Position.Rotation(predicted_angle, _Unit.Distance(_Target))

	// if (predicted_angle === undefined)
	// 	predicted_angle = TryPredictInAngles(base_ang, -180, -90, start_pos, hook, obstacles, obs2ent)
	// if (predicted_angle === undefined)
	// 	predicted_angle = TryPredictInAngles(base_ang, -270, -180, start_pos, hook, obstacles, obs2ent)
	// if (predicted_angle === undefined)
	// 	predicted_angle = TryPredictInAngles(base_ang, -360, -270, start_pos, hook, obstacles, obs2ent)

	var pos = _Unit.Position.Extend(predicted_angle ?? _Unit.Position, _Unit.Distance2D(_Target, true))

	if (bind.is_pressed && !bind_sleeper.Sleeping) {
		_Unit.CastPosition(hook, pos)
		bind_sleeper.Sleep(300)
	}
	if (par === undefined)
		par = ParticlesSDK.Create("XAIO/particles/fat_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, _Target)

	if (par3 === undefined)
		par3 = ParticlesSDK.Create("XAIO/particles/fat_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, _Target)

	HitChanceColor = predicted_pos !== undefined ? new Vector3(0, 255, 0) : new Vector3(255, 0, 0)

	if (par !== undefined) {
		ParticlesSDK.SetControlPoint(par, 0, pos)
		ParticlesSDK.SetControlPoint(par, 1, HitChanceColor)
		ParticlesSDK.SetControlPoint(par, 2, new Vector3(80, 255, 20))
	}
	if (par3 !== undefined) {
		ParticlesSDK.SetControlPoint(par3, 0, _Target.VelocityWaypoint(hook.CastPoint + (_Target.Distance(_Unit) / hook.Speed)))
		ParticlesSDK.SetControlPoint(par3, 1, new Vector3(255, 0, 0))
		ParticlesSDK.SetControlPoint(par3, 2, new Vector3(80, 255, 20))
	}

	if (par2 === undefined)
		par2 = ParticlesSDK.Create("XAIO/particles/line.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, _Target)

	if (par2 !== undefined) {
		ParticlesSDK.SetControlPoint(par2, 1, pos.Extend(_Target.Position, 80))
		ParticlesSDK.SetControlPoint(par2, 2, _Target.Position.Extend(pos, 80))
		ParticlesSDK.SetControlPoint(par2, 3, new Vector3(_Target.Distance2D(pos) > 80 ? 255 : 0, 30, 0))
		ParticlesSDK.SetControlPoint(par2, 4, new Vector3(255, 255, 255))
	}
})

EventsSDK.on("GameEnded", () => {
	par = undefined
	par2 = undefined
})

//<====================
