// import { Game, RendererSDK, Hero, Entity, ArrayExtensions, Color, Vector2, Vector3 } from 'wrapper/Imports';
// import {BaseTree,State,NotificationTopVision,topSentry} from "./Menu"
// import { LocalPlayer } from '../../../wrapper/Managers/EntityManager';

// const rectSize = new Vector2(62,5),
//     dire = new Vector2(938,39),
//     radiant = new Vector2(438,39)

// let enemies:Hero[] = [],
//     allies:Hero[] = []

// export function gameStarted(){
//     // let screen_size = RendererSDK.WindowSize
//     // if(screen_size.x == )
// }
// export function gameEnded(){
// 	enemies = []
// 	allies = []
// }
// export function Draw(){
//     if(!State.value)
//         return
//     const team = LocalPlayer.Team,
//         vec = team===DOTATeam_t.DOTA_TEAM_GOODGUYS?radiant:dire,
//         add = team===DOTATeam_t.DOTA_TEAM_GOODGUYS?0:5
//     allies.forEach((hero,i)=>{
//         if(hero.IsAlive){
//             if(NotificationTopVision.value && hero.IsVisibleForEnemies)
//                 RendererSDK.FilledRect(new Vector2(vec.x+((hero.PlayerID-add)*rectSize.x),vec.y), rectSize, Color.Blue)
//             if(topSentry.value && hero.IsTrueSightedForEnemies)
//                 RendererSDK.FilledRect(new Vector2(vec.x+((hero.PlayerID-add)*rectSize.x),vec.y+rectSize.y), rectSize, Color.RoyalBlue)
//         }
//     })
// 	return true;
// }
// export function entityDestroy(ent:Entity){
// 	if (ent instanceof Hero){
// 		if(ent.IsEnemy())
// 			ArrayExtensions.arrayRemove(enemies, ent)
// 		else
// 			ArrayExtensions.arrayRemove(allies, ent)
// 	}
// }
// export function entityCreate(ent:Entity){
// 	if (ent instanceof Hero && !ent.IsIllusion){
// 		if(ent.IsEnemy()){
// 			enemies.push(ent)
//         }else{
//             allies.push(ent)
//         }
// 	}
// }