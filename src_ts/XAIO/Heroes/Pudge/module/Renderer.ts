// import { XAIOState, XAIOComboKey } from "../Menu"

// import { Owner, Enemy } from "./Combo"
// import { XAIOPrediction, XAIOHitChance } from "../../bootstrap"
// import { ParticlesSDK, pudge_meat_hook, Vector3, EventsSDK, Color } from "wrapper/Imports"

// let Prediction = new XAIOPrediction()

// function ParticleDestroyed() {
// 	ParticlesSDK.Remove("HookLine")
// 	ParticlesSDK.Remove("HookCircle")
// 	ParticlesSDK.Remove("DrawLineToTarget")
// }

// EventsSDK.on("Draw", () => {
// 	if (!XAIOState.value || Owner === undefined || Owner.Name !== "npc_dota_hero_pudge")
// 		return

// 	if (Enemy === undefined || !Enemy.IsAlive || !Enemy.IsVisible || !Owner.IsAlive) {
// 		ParticleDestroyed()
// 		return
// 	}

// 	let colorLineTarget = Color.Yellow

// 	if (XAIOComboKey.is_pressed)
// 		colorLineTarget = Color.Green

// 	ParticlesSDK.DrawLineToTarget("DrawLineToTarget", Owner, Enemy, colorLineTarget)

// 	const hook = Owner.GetAbilityByClass(pudge_meat_hook)

// 	if (hook === undefined)
// 		return

// 	let colorPrediction = Color.White

// 	let predict = Prediction.GetPrediction(hook, Owner, Enemy, true)

// 	let pos = Owner.Position.Extend(predict.CastPosition, Owner.Distance2D(Enemy, true))
// 	let castRange = (hook.CastRange + hook.AOERadius + (Enemy.HullRadius + Enemy.CollisionPadding))

// 	if (Owner.Distance2D(pos) <= castRange && hook.CanBeCasted()) {

// 		switch (predict.HitChance) {
// 			case XAIOHitChance.Immobile:
// 			case XAIOHitChance.High:
// 				colorPrediction = Color.Green
// 				break
// 			case XAIOHitChance.Medium:
// 				colorPrediction = Color.Yellow
// 				break
// 			case XAIOHitChance.Low:
// 				colorPrediction = Color.Orange
// 				break
// 			case XAIOHitChance.Impossible:
// 				colorPrediction = Color.Red
// 				break
// 			default: colorPrediction = Color.Red; break
// 		}

// 		ParticlesSDK.AddOrUpdate(
// 			"HookLine",
// 			"materials/ensage_ui/particles/line.vpcf",
// 			ParticleAttachment_t.PATTACH_ABSORIGIN,
// 			Owner,
// 			1, pos.Extend(Enemy.Position, 80),
// 			2, Enemy.Position.Extend(pos, 80),
// 			3, new Vector3(Enemy.Distance2D(pos) > 80 ? 255 : 0, 50, 0),
// 			4, Color.RoyalBlue
// 		)

// 		ParticlesSDK.AddOrUpdate(
// 			"HookCircle",
// 			"materials/ensage_ui/particles/fat_ring.vpcf",
// 			ParticleAttachment_t.PATTACH_ABSORIGIN,
// 			Owner,
// 			0, pos,
// 			1, colorPrediction,
// 			2, new Vector3(80, 255, 20)
// 		)

// 	} else {
// 		ParticlesSDK.Remove("HookLine")
// 		ParticlesSDK.Remove("HookCircle")
// 	}
// })



// //<====================