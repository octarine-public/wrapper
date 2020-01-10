import { State } from "../Menu"
import { ParticlesSDK, pudge_meat_hook, Vector3, MathSDK, Entity, Creep, Hero, Obstacle, Unit, MovingObstacle, NavMeshPathfinding, Menu, TickSleeper, Prediction } from "wrapper/Imports"

import { _Unit, _Target } from "./Combo"

let bind = Menu.AddEntry(["XAIO", "Pudge", "Test"]).AddKeybind("Test")
let bind_sleeper = new TickSleeper()

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


EventsSDK.on("Draw", () => {
	if (!State.value || _Unit === undefined || _Target === undefined || _Unit.Name !== "npc_dota_hero_pudge")
		return

	const hook = _Unit.GetAbilityByClass(pudge_meat_hook)

	let HitChanceColor = new Vector3()

	if (hook === undefined || !_Target.IsVisible || !_Target.IsAlive || hook.Level === 0 || !hook.CanHit(_Target) || !hook.CanBeCasted()) {
		DestroyParticle()
		return
	}

	//let predicted_ang = new Prediction(_Unit).GetAngleForObstacleFirstHit(hook.CastRange, hook.AOERadius, _Target, hook.Speed, hook.CastPoint, ang => _Unit!.TurnTime(ang))
	let predicted_pos: Nullable<Vector3> //= predicted_ang !== undefined ? _Unit.Position.AddForThis(Vector3.FromAngle(predicted_ang).MultiplyScalarForThis(_Unit.Distance(_Target))) : undefined
	let obs2ent = new Map<Obstacle, Entity>()
	let start_pos = _Unit.Position.toVector2()
	EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
		if (ent !== _Unit && ent.IsInRange(_Unit!, hook.CastRange * 2))
			obs2ent.set(MovingObstacle.FromUnit(ent), ent)
	})
	let obstacles = [...obs2ent.keys()]
	for (let deg = 0; deg < 360; deg += 2) {
		let angle = Vector3.FromAngle(MathSDK.DegreesToRadian(deg))
		let predicted_hit = obs2ent.get(
			new NavMeshPathfinding(
				new MovingObstacle(
					start_pos/*.Add(angle.toVector2().MultiplyScalar(hook.AOERadius * 1.5))*/,
					hook.AOERadius,
					angle.toVector2().MultiplyScalarForThis(hook.Speed),
					hook.CastRange / hook.Speed
				),
				obstacles,
				hook.CastPoint + _Unit.TurnTime(angle),
			).GetFirstHitObstacle((res, a) => {
				if (par !== undefined && obs2ent.get(res) === _Target)
					ParticlesSDK.SetControlPoint(par, 0, new Vector3(a.x, a.y, RendererSDK.GetPositionHeight(a)))
			})!
		)
		if (predicted_hit === _Target) {
			predicted_pos = _Unit.Position.Rotation(angle, _Unit.Distance(_Target))
			break
		}
	}
	if (bind.is_pressed && predicted_pos !== undefined && !bind_sleeper.Sleeping) {
		_Unit.CastPosition(hook, predicted_pos)
		bind_sleeper.Sleep(hook.CastPoint * 1000 + 33)
	}

	var pos = predicted_pos ?? _Unit.Position

	if (par === undefined)
		par = ParticlesSDK.Create("XAIO/particles/fat_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, _Target)
	if (par3 === undefined)
		par3 = ParticlesSDK.Create("XAIO/particles/fat_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, _Target)

	HitChanceColor = predicted_pos !== undefined ? new Vector3(0, 255, 0) : new Vector3(255, 0, 0)

	if (par !== undefined) {
		// ParticlesSDK.SetControlPoint(par, 0, pos)
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