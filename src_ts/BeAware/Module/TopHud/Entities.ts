// import { ArrayExtensions, Color, Entity, Game, Hero, RendererSDK, Vector2, Vector3 } from "wrapper/Imports"
// import { BuybackCooldown } from "../../../wrapper/Data/GameData"
// import { Team } from "../../../wrapper/Helpers/Team"
// import { LocalPlayer } from "../../../wrapper/Managers/EntityManager"
// import {altKey,BaseTree,NotificationTopVision,State,topSentry} from "./Menu"

// let rectSize = new Vector2(61,5),
// 	barsSize = new Vector2(61,15),
// 	dire = new Vector2(878,39),
// 	radiant = new Vector2(438,39),
// 	heroes: Hero[] = [],
// 	buyBacks = [undefined,undefined,undefined,undefined,undefined],
// 	vision = [undefined,undefined,undefined,undefined,undefined],
// 	scrolls = [true,true,true,true,true]

// export function gameStarted() {
// 	let ratio = RendererSDK.GetAspectRatio()
// 	if(ratio === "21x9") {
// 		rectSize = new Vector2(83,5)
// 		barsSize = new Vector2(83,15)
// 		dire = new Vector2(1776,53)
// 		radiant = new Vector2(1170,53)
// 	}else if(ratio === "16x9") {
// 		rectSize = new Vector2(63,5)
// 		barsSize = new Vector2(63,15)
// 		dire = new Vector2(1000,39)
// 		radiant = new Vector2(545,39)
// 	}else if(ratio === "4x3") {
// 		rectSize = new Vector2(56,5)
// 		barsSize = new Vector2(56,15)
// 		dire = new Vector2(677,39)
// 		radiant = new Vector2(269,39)
// 	}
// }
// export function gameEnded() {
// 	heroes = []
// }
// export function Draw() {
// 	if(!State.value)
// 		return
// 	let team = LocalPlayer.Team,
// 		vec = team===Team.Radiant?radiant:dire,
// 		add = team===Team.Radiant?0:5,
// 		enemy = team===Team.Radiant?dire:radiant,
// 		enemyAdd = team===Team.Radiant?4:0
// 	heroes.forEach(hero => {
// 		if (hero.IsEnemy()) {
// 			if(altKey.is_pressed) {
// 				let vec = new Vector2(enemy.x+((hero.PlayerID-enemyAdd)*barsSize.x),enemy.y)
// 				RendererSDK.FilledRect(vec, barsSize, Color.Red)
// 				RendererSDK.FilledRect(vec, new Vector2(barsSize.x*hero.HPPercent*0.01,barsSize.y), Color.Green)
// 				RendererSDK.OutlinedRect(vec,barsSize, Color.Blue)
// 				vec.AddScalarY(-1)
// 				vec.AddScalarX(barsSize.x*0.2)
// 				RendererSDK.Text(`${hero.HP.toFixed(0)}/${hero.MaxHP.toFixed(0)}`,vec,Color.White, "Calibri", new Vector2(17, 700),FontFlags_t.OUTLINE)
// 				vec.AddScalarY(1+barsSize.y)
// 				vec.AddScalarX(-barsSize.x*0.2)
// 				RendererSDK.FilledRect(vec, barsSize, Color.Blue)
// 				RendererSDK.FilledRect(vec, new Vector2(barsSize.x*hero.ManaPercent*0.01,barsSize.y), Color.RoyalBlue)
// 				RendererSDK.OutlinedRect(vec,barsSize, Color.Red)
// 				vec.AddScalarY(-1)
// 				vec.AddScalarX(barsSize.x*0.2)
// 				RendererSDK.Text(`${hero.Mana.toFixed(0)}/${hero.MaxMana.toFixed(0)}`,vec,Color.White, "Calibri", new Vector2(17, 700),FontFlags_t.OUTLINE)
// 				vec.AddScalarY(14)
// 				RendererSDK.Image(buyBacks[hero.PlayerID-enemyAdd-1]===undefined?"panorama/images/spellicons/buyback_png.vtex_c":"panorama/images/spellicons/modifier_buyback_gold_penalty_png.vtex_c",vec,new Vector2(25,25),Color.White)
// 				if(buyBacks[hero.PlayerID-enemyAdd-1] !== undefined)
// 					RendererSDK.Text((buyBacks[hero.PlayerID-enemyAdd-1]-Game.GameTime).toFixed(0),vec,Color.White, "Calibri", new Vector2(20, 700),FontFlags_t.OUTLINE)
// 				if(vision[hero.PlayerID-enemyAdd-1] !== undefined) {
// 					RendererSDK.Text((Game.GameTime-vision[hero.PlayerID-enemyAdd-1]).toFixed(0),new Vector2(vec.x+20,vec.y+25),Color.White, "Calibri", new Vector2(20, 700),FontFlags_t.OUTLINE)
// 				}
// 			}
// 		} else if (hero.IsAlive) {
// 			if(NotificationTopVision.value && hero.IsVisibleForEnemies) {
// 				RendererSDK.FilledRect(new Vector2(vec.x+((hero.PlayerID-add)*rectSize.x),altKey.is_pressed?vec.y*1.4:vec.y), rectSize, Color.Blue)
// 			}
// 			if(topSentry.value && hero.IsTrueSightedForEnemies) {
// 				RendererSDK.FilledRect(new Vector2(vec.x+((hero.PlayerID-add)*rectSize.x),(altKey.is_pressed?vec.y*1.4:vec.y)+rectSize.y), rectSize, Color.RoyalBlue)
// 			}
// 		}
// 	})
// 	return true
// }
// export function Tick() {
// 	if(!State.value)
// 		return
// 	let team = LocalPlayer.Team,
// 		enemyAdd = team===Team.Radiant?5:0
// 	heroes.forEach(hero => {
// 		if (!hero.IsEnemy())
// 			return
// 		let penalty = hero.RespawnTimePenalty,
// 			id = hero.PlayerID-enemyAdd
// 		if(buyBacks[id] !== undefined && buyBacks[id] > 0 && Game.GameTime >= buyBacks[id])
// 			buyBacks[id] = undefined
// 		if(penalty === 25 && buyBacks[id] === undefined)
// 			buyBacks[id] = Game.GameTime+BuybackCooldown
// 		if(vision[id]===undefined) {
// 			if(!hero.IsVisible)
// 				vision[id] = Game.GameTime
// 		} else {
// 			if (hero.IsVisible)
// 				vision[id] = undefined
// 		}
// 	})
// }
// export function entityDestroy(ent:Entity) {
// 	if (ent instanceof Hero && !ent.IsIllusion)
// 		ArrayExtensions.arrayRemove(heroes, ent)
// }
// export function entityCreate(ent:Entity) {
// 	if (ent instanceof Hero && !ent.IsIllusion)
// 		heroes.push(ent)
// }
