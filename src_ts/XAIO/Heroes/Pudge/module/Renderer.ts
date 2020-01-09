import { State } from "../Menu"
import { ParticlesSDK, pudge_meat_hook } from "wrapper/Imports"

import {
	XAIOInput,
	XAIOHitChance,
	XAIOPrediction,
	XAIOSkillshotType,
	XAIOCollisionTypes,
} from "../../../Helper/bootstrap"

import { _Unit, _Target } from "./Combo"

// TESTED =>>>>>>>>>>>>>
let par: Nullable<number>
let par2: Nullable<number>
let xAIOPrediction = new XAIOPrediction()

function DestroyParticle() {
	if (par !== undefined) {
		ParticlesSDK.Destroy(par, true)
		par = undefined
	}
	if (par2 !== undefined) {
		ParticlesSDK.Destroy(par2, true)
		par2 = undefined
	}
}


EventsSDK.on("Draw", () => {
	if (!State.value || _Unit === undefined || _Target === undefined || _Unit.Name !== "npc_dota_hero_pudge")
		return

	const hook = _Unit.GetAbilityByClass(pudge_meat_hook)

	let HitChanceColor = new Vector3()

	if (!hook || !_Target.IsVisible || !_Target.IsAlive || hook.Level === 0 || !hook.CanHit(_Target) || !hook.CanBeCasted()) {
		DestroyParticle()
		return
	}

	let InputDataHook = new XAIOInput(
		_Target,
		_Unit,
		hook.CastRange,
		hook.CastPoint,
		_Target.HullRadius,
		hook.AOERadius,
		XAIOCollisionTypes.AllUnits,
		0,
		false,
		XAIOSkillshotType.Line,
		hook.Speed,
		false
	)

	let predictionOutput = xAIOPrediction.GetPrediction(InputDataHook)

	var pos = _Unit.Position.Extend(predictionOutput.CastPosition, _Unit.Distance2D(_Target, true))

	if (par === undefined)
		par = ParticlesSDK.Create("XAIO/particles/fat_ring.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, _Target)

	switch (predictionOutput.HitChance) {
		case XAIOHitChance.Low:
			HitChanceColor = new Vector3(255, 119, 0)
			break
		case XAIOHitChance.Medium:
			HitChanceColor = new Vector3(255, 255, 0)
			break
		case XAIOHitChance.High:
		case XAIOHitChance.Immobile:
			HitChanceColor = new Vector3(0, 255, 0)
			break
		default:
			HitChanceColor = new Vector3(255, 0, 0)
			break
	}

	if (par !== undefined) {
		ParticlesSDK.SetControlPoint(par, 0, pos)
		ParticlesSDK.SetControlPoint(par, 1, HitChanceColor)
		ParticlesSDK.SetControlPoint(par, 2, new Vector3(80, 255, 20))
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