import {
	Unit,
	Ability,
	pudge_rot,
	item_blink,
	item_dagon,
	item_orchid,
	GameSleeper,
	pudge_meat_hook,
	pudge_dismember,
	item_rod_of_atos,
	item_force_staff,
	item_sheepstick,
	item_bloodthorn,
	item_nullifier,
	item_veil_of_discord,
	item_ethereal_blade,
	item_shivas_guard,
	item_urn_of_shadows,
	item_spirit_vessel,
	Vector3,
	Entity,
	Obstacle,
	Creep,
	Hero,
	Vector2,
	MathSDK,
	MovingObstacle,
	NavMeshPathfinding,
	TickSleeper,
	Prediction
} from "wrapper/Imports"

import {
	XAIOInput,
	XAIOPrediction,
	AbilityHelper,
	//UnitsOrbWalker,
	XAIOCollisionTypes,
	XAIOSkillshotType, XAIOHitChance
} from "../../../Helper/bootstrap"

import { ComboKey, ItemsMenu, AbilityMenu, HookDelay } from "../Menu"

let GameSleep = new GameSleeper()
let xAIOPrediction = new XAIOPrediction()
let AbilitiesHelper = new AbilityHelper()


const IsValidBuffsUrn = [
	"modifier_item_urn_heal",
	"modifier_item_spirit_vessel_heal"
]

let rotation = 0
let rotationTime = 0

export let _Unit: Nullable<Unit>
export let _Target: Nullable<Unit>

let bind = Menu.AddEntry(["XAIO", "Pudge", "Test"]).AddKeybind("Test")
let bind_sleeper = new TickSleeper()

function ShouldCastHook(abil: pudge_meat_hook, target: Unit, AbilitiesHelper: AbilityHelper) {
	/*let owner = abil.Owner
	if (!abil || owner === undefined)
		return false

	let InputDataHook = new XAIOInput(
		target,
		owner,
		abil.CastRange + (HookDelay.value / 1000),
		abil.CastPoint,
		target.HullRadius,
		abil.AOERadius,
		XAIOCollisionTypes.AllUnits,
		0,
		true,
		XAIOSkillshotType.Line,
		abil.Speed,
		abil ? true : false
	)


	let predictionOutput = xAIOPrediction.GetPrediction(InputDataHook)

	if (abil.IsInAbilityPhase) {

		if (target.NetworkActivity === GameActivity_t.ACT_DOTA_RUN && target.TurnTime(predictionOutput.CastPosition) !== 0) {
			predictionOutput.HitChance = XAIOHitChance.Impossible
			if (!AbilitiesHelper.Stop(owner))
				return false
		}

		if (predictionOutput.HitChance === XAIOHitChance.Impossible)
			if (!AbilitiesHelper.Stop(owner))
				return false

		if ((predictionOutput.HitChance === XAIOHitChance.Low || predictionOutput.HitChance === XAIOHitChance.Medium)
			&& Math.abs(target.NetworkRotationRad - rotation) > 0.1) {
			rotationTime = Game.RawGameTime
			rotation = target.NetworkRotationRad
			return false
		}

		//	console.log(Math.abs(target.NetworkRotationRad - rotation))
		if ((rotationTime + HookDelay.value) / 1000 >= Game.RawGameTime)
			if (!AbilitiesHelper.Stop(owner))
				return false
	}

	return predictionOutput.HitChance <= XAIOHitChance.Impossible*/
	let owner = abil.Owner
	if (owner === undefined)
		return true
	return new Prediction(owner).GetFirstHitTarget( // stop
		abil.CastRange,
		abil.AOERadius,
		abil.Speed,
		owner.Forward.toVector2(),
		abil.CastPoint + (Game.Ping / 2000)
	) === target
}


function TryPredict(
	start_pos: Vector2,
	hook: pudge_meat_hook,
	rad: number,
	obstacles: Obstacle[],
	obs2ent: Map<Obstacle, Entity>
): Nullable<Vector3> {
	let angle = Vector3.FromAngle(rad)
	let predicted_hit = obs2ent.get(
		new NavMeshPathfinding(
			new MovingObstacle(
				start_pos/*.Add(angle.toVector2().MultiplyScalar(hook.AOERadius * 1.5))*/,
				hook.AOERadius,
				angle.toVector2().MultiplyScalarForThis(hook.Speed),
				hook.CastRange / hook.Speed
			),
			obstacles,
			hook.CastPoint + _Unit!.TurnTime(angle) + (Game.Ping / 2000),
		).GetFirstHitObstacle()!
	)
	if (predicted_hit === _Target)
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

export function InitCombo(Owner: Unit, target: Nullable<Unit>) {

	if (target === undefined || !Owner.IsVisible || GameSleep.Sleeping(target))
		return

	_Unit = Owner
	_Target = target

	const hook = Owner.GetAbilityByClass(pudge_meat_hook)

	let ShouldCast = hook !== undefined && ShouldCastHook(hook, target, AbilitiesHelper)

	// Init Ability logic
	const rot = Owner.GetAbilityByClass(pudge_rot)
	const dismember = Owner.GetAbilityByClass(pudge_dismember)
	const atos = Owner.GetAbilityByClass(item_rod_of_atos)
	const blink = Owner.GetItemByClass(item_blink)
	const force = Owner.GetItemByClass(item_force_staff)
	const hex = Owner.GetItemByClass(item_sheepstick)
	const orchid = Owner.GetItemByClass(item_orchid)
	const bloodthorn = Owner.GetItemByClass(item_bloodthorn)
	const nullifier = Owner.GetItemByClass(item_nullifier)
	const veil = Owner.GetItemByClass(item_veil_of_discord)
	const ethereal = Owner.GetItemByClass(item_ethereal_blade)
	const dagon = Owner.GetItemByClass(item_dagon)
	const shivas = Owner.GetItemByClass(item_shivas_guard)
	const urn = Owner.GetItemByClass(item_urn_of_shadows)
	const vessel = Owner.GetItemByClass(item_spirit_vessel)

	if (hook !== undefined && bind.is_pressed && !bind_sleeper.Sleeping) {
		//let predicted_ang = new Prediction(Owner).GetAngleForObstacleFirstHit(hook.CastRange, hook.AOERadius, target, hook.Speed, hook.CastPoint, ang => Owner!.TurnTime(ang))
		let predicted_pos: Nullable<Vector3> //= predicted_ang !== undefined ? Owner.Position.AddForThis(Vector3.FromAngle(predicted_ang).MultiplyScalarForThis(Owner.Distance(target))) : undefined
		let obs2ent = new Map<Obstacle, Entity>()
		let start_pos = Owner.Position.toVector2()
		EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
			if (ent !== Owner && ent.IsAlive && ent.IsInRange(Owner!, hook.CastRange * 2) && !ent.IsInvulnerable && ent.IsVisible)
				obs2ent.set(MovingObstacle.FromUnit(ent), ent)
		})
		let obstacles = [...obs2ent.keys()]
		let base_ang = Owner.Position.GetDirectionTo(target.Position).Angle
		let predicted_angle = TryPredictInAngles(base_ang, -90, 90, start_pos, hook, obstacles, obs2ent)
		// if (predicted_angle === undefined)
		// 	predicted_angle = TryPredictInAngles(base_ang, -180, -90, start_pos, hook, obstacles, obs2ent)
		// if (predicted_angle === undefined)
		// 	predicted_angle = TryPredictInAngles(base_ang, -270, -180, start_pos, hook, obstacles, obs2ent)
		// if (predicted_angle === undefined)
		// 	predicted_angle = TryPredictInAngles(base_ang, -360, -270, start_pos, hook, obstacles, obs2ent)
		if (predicted_angle !== undefined) {
			predicted_pos = Owner.Position.Rotation(predicted_angle, Owner.Distance(target))
			Owner.CastPosition(hook, predicted_pos)
			bind_sleeper.Sleep(hook.CastPoint * 1000 + 33)
		}
	}

	if (Owner.IsChanneling || !ComboKey.is_pressed)
		return

	if (rot && AbilityMenu.IsEnabled(rot.Name)
		&& !rot.IsToggled
		&& Owner.Distance2D(target) <= 500
		&& !AbilitiesHelper.UseAbility(rot, true, true))
		return

	if (force && ItemsMenu.IsEnabled(force.Name) && Owner.Distance2D(target) > 500 && force.CanBeCasted()) {

		if (Owner.Distance2D(target) < (force && force.CastRange + force.GetSpecialValue("push_length"))) {

			if (Owner.FindRotationAngle(target.Position) <= 0.3)
				if (!AbilitiesHelper.UseAbility(force, true, false, Owner))
					return

			if (!AbilitiesHelper.MoveToDirection(Owner, target))
				return
		}
	}

	if (blink && ItemsMenu.IsEnabled(blink.Name)
		&& blink.CanBeCasted()
		&& Owner.Distance2D(target, true) <= blink.CastRange
		&& Owner.Distance2D(target) > 500
		&& !AbilitiesHelper.UseAbility(blink, false, false, target))
		return

	const cancel = AbilitiesHelper.AbilityForCancel(target)
	const cancelMagicImmune = AbilitiesHelper.CancelMagicImmune(target)
	const isBlockingAbilities = AbilitiesHelper.IsBlockingAbilities(target, true)

	if (!isBlockingAbilities && (cancel || cancelMagicImmune)) {

		{
			const hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff")
			const dismemberReady = dismember && (!AbilityMenu.IsEnabled(dismember.Name) || !dismember.CanBeCasted() || !dismember.CanHit(target))

			// Hex
			if (hex && ItemsMenu.IsEnabled(hex.Name)
				&& hex.CanBeCasted()
				&& hex.CanHit(target)
				&& dismemberReady
				//&& !comboBreaker
				&& (hexDebuff === undefined || !hexDebuff.IsValid || hexDebuff.RemainingTime <= 0.3)
				&& !AbilitiesHelper.UseAbility(hex, true, false, target))
				return

			if (orchid && ItemsMenu.IsEnabled(orchid.Name)
				&& orchid.CanBeCasted()
				&& orchid.CanHit(target)
				//&& !comboBreaker
				&& !AbilitiesHelper.UseAbility(orchid, true, false, target))
				return

			if (bloodthorn && ItemsMenu.IsEnabled(bloodthorn.Name)
				&& bloodthorn.CanBeCasted()
				&& bloodthorn.CanHit(target)
				// && !comboBreaker
				&& !AbilitiesHelper.UseAbility(bloodthorn, true, false, target))
				return

			let hookReady = hook && (!AbilityMenu.IsEnabled(hook.Name) || !hook.CanBeCasted())

			if (nullifier && ItemsMenu.IsEnabled(nullifier.Name)
				&& nullifier.CanBeCasted()
				&& nullifier.CanHit(target)
				&& dismemberReady
				&& hookReady
				//&& !comboBreaker
				&& (hexDebuff === undefined || !hexDebuff.IsValid || hexDebuff.RemainingTime <= 0.5)
				&& !AbilitiesHelper.UseAbility(nullifier, false, false, target))
				return

			let atosDebuff = target.Buffs.some(x => x.Name == "modifier_rod_of_atos_debuff" && x.RemainingTime > 0.5)

			if (atos && ItemsMenu.IsEnabled(atos.Name)
				&& atos.CanBeCasted()
				&& atos.CanHit(target)
				&& dismemberReady
				&& hookReady
				&& !atosDebuff
				&& !AbilitiesHelper.UseAbility(atos, true, false, target))
				return

			if (veil && ItemsMenu.IsEnabled(veil.Name)
				&& veil.CanBeCasted()
				&& veil.CanHit(target)
				&& !AbilitiesHelper.UseAbility(veil, true, false, target)) {
			}

			if (ethereal && ItemsMenu.IsEnabled(ethereal.Name)
				&& ethereal.CanBeCasted()
				&& ethereal.CanHit(target)
				//&& !comboBreaker
				&& !AbilitiesHelper.UseAbility(ethereal, true, false, target)) {
				GameSleep.Sleep(450, ethereal)
				return
			}

			if (shivas && ItemsMenu.IsEnabled(shivas.Name)
				&& shivas.CanBeCasted()
				&& shivas.CanHit(target)
				&& !AbilitiesHelper.UseAbility(shivas, true, false))
				return

			if (!GameSleep.Sleeping(ethereal) || target.IsEthereal) {

				if (dismember && AbilityMenu.IsEnabled(dismember.Name)
					&& dismember.CanBeCasted()
					&& dismember.CanHit(target)
					//&& !comboBreaker
					&& !AbilitiesHelper.UseAbility(dismember, true, false, target)
				) return

				if (hook && AbilityMenu.IsEnabled(hook.Name) && hook.CanBeCasted() && hook.CanHit(target)) {
					//let predicted_ang = new Prediction(Owner).GetAngleForObstacleFirstHit(hook.CastRange, hook.AOERadius, target, hook.Speed, hook.CastPoint, ang => Owner!.TurnTime(ang))
					let predicted_pos: Nullable<Vector3> //= predicted_ang !== undefined ? Owner.Position.AddForThis(Vector3.FromAngle(predicted_ang).MultiplyScalarForThis(Owner.Distance(target))) : undefined
					let obs2ent = new Map<Obstacle, Entity>()
					let start_pos = Owner.Position.toVector2()

					EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
						if (ent !== Owner && ent.IsInRange(Owner!, hook.CastRange * 2))
							obs2ent.set(MovingObstacle.FromUnit(ent), ent)
					})

					let obstacles = [...obs2ent.keys()]
					let base_ang = Owner.Position.GetDirectionTo(target.Position).Angle
					let predicted_angle = TryPredictInAngles(base_ang, -90, 90, start_pos, hook, obstacles, obs2ent)

					if (predicted_angle !== undefined)
						predicted_pos = Owner.Position.Rotation(predicted_angle, 300)

					if (atos && ItemsMenu.IsEnabled(atos.Name)
						&& !GameSleep.Sleeping(atos)
						&& atos.CanBeCasted()
						&& atos.CanHit(target)
						&& !atosDebuff
						&& predicted_pos !== undefined
						&& !AbilitiesHelper.UseAbility(atos, true, false, target)) {
						GameSleep.Sleep(800, atos)
						return
					}

					if (ShouldCast && !GameSleep.Sleeping(atos)
						|| target.HasBuffByName("modifier_rod_of_atos_debuff")
						|| (!blink && predicted_pos !== undefined && AbilitiesHelper.UseAbility(hook, true, false, predicted_pos))
						|| (blink && !blink.CanBeCasted() && predicted_pos !== undefined && AbilitiesHelper.UseAbility(hook, true, false, predicted_pos))
					) return

				}
			}

			// Dagon
			if (dagon && ItemsMenu.IsEnabled("item_dagon_5")
				&& dagon.CanBeCasted()
				&& dagon.CanHit(target)
				//&& !comboBreaker
				&& !AbilitiesHelper.UseAbility(dagon, true, false, target)) {
				return
			}

			if (urn && ItemsMenu.IsEnabled(urn.Name)
				&& urn.CanBeCasted()
				&& urn.CanHit(target)
				//&& !comboBreaker
				&& !target.ModifiersBook.HasAnyBuffByNames(IsValidBuffsUrn)
				&& !AbilitiesHelper.UseAbility(urn, true, false, target))
				return

			if (vessel && ItemsMenu.IsEnabled(vessel.Name)
				&& vessel.CanBeCasted()
				&& vessel.CanHit(target)
				//&& !comboBreaker
				&& !target.ModifiersBook.HasAnyBuffByNames(IsValidBuffsUrn)
				&& !AbilitiesHelper.UseAbility(vessel, true, false, target))
				return
		}
	}

	if (cancel && !cancelMagicImmune && !isBlockingAbilities) {
		if (dismember && AbilityMenu.IsEnabled(dismember.Name)
			&& dismember.CanBeCasted()
			&& dismember.CanHit(target)
			//&& !comboBreaker
			&& !AbilitiesHelper.UseAbility(dismember, true, false, target))
			return
	}

	if (isBlockingAbilities) {

		if (!hook || !AbilityMenu.IsEnabled(hook.Name) || !hook.CanBeCasted() || !hook.CanHit(target))
			return
		//let predicted_ang = new Prediction(Owner).GetAngleForObstacleFirstHit(hook.CastRange, hook.AOERadius, target, hook.Speed, hook.CastPoint, ang => Owner!.TurnTime(ang))
		let predicted_pos: Nullable<Vector3> //= predicted_ang !== undefined ? Owner.Position.AddForThis(Vector3.FromAngle(predicted_ang).MultiplyScalarForThis(Owner.Distance(target))) : undefined
		let obs2ent = new Map<Obstacle, Entity>()
		let start_pos = Owner.Position.toVector2()

		EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).forEach(ent => {
			if (ent !== Owner && ent.IsInRange(Owner!, hook.CastRange * 2))
				obs2ent.set(MovingObstacle.FromUnit(ent), ent)
		})

		let obstacles = [...obs2ent.keys()]
		let base_ang = Owner.Position.GetDirectionTo(target.Position).Angle
		let predicted_angle = TryPredictInAngles(base_ang, -90, 90, start_pos, hook, obstacles, obs2ent)

		if (predicted_angle !== undefined)
			predicted_pos = Owner.Position.Rotation(predicted_angle, 300)
		if (ShouldCast || predicted_pos === undefined || AbilitiesHelper.UseAbility(hook, true, false, predicted_pos))
			return
	}

	// if (!UnitsOrbWalker.get(Owner)?.Execute(target))
	// 	return
}

EventsSDK.on("GameEnded", () => {
	_Unit = undefined
	_Target = undefined
	bind_sleeper.ResetTimer()
})

// EventsSDK.on("UnitAddGesture", (npc, activity) => {
// 	let unit = npc as Unit
// 	if (unit.Name !== "npc_dota_hero_pudge" || !unit.IsControllable)
// 		return

// })