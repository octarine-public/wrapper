// import { Game, LocalPlayer, EventsSDK, Team, EntityManager, Player } from "wrapper/Imports"
// import { State } from "./Menu"
// import StockInfo from "../../../wrapper/Objects/GameResources/StockInfo"

// let NonSpec: C_DOTA_DataNonSpectator

// function AutoBuy(x: StockInfo) {
// 	//console.log(x.IsAvalible)
// 	return true
// }
// // m_iReliableGold
// //item_tome_of_knowledge
// export function Init() {
// 	if (!State.value || Game.IsPaused)
// 		return


// 	let Items = Game.StockInfo.filter(x => x.AbilityID === 257)
// 	if (Items.length <= 0 || Items.some(AutoBuy))
// 		return


// }

// EventsSDK.on("EntityCreated", ent => {
// 	if (ent.m_pBaseEntity instanceof C_DOTA_DataNonSpectator) {
// 		//console.log(1)
// 		NonSpec = ent.m_pBaseEntity
// 	}
// })

// globalThis.A = () => {
// 	for (let index = 0; index < 10; index++) {
// 		console.log(index, NonSpec?.m_vecDataTeam[3]?.m_iNetWorth, NonSpec?.m_vecDataTeam[3]?.m_iReliableGold, NonSpec?.m_vecDataTeam[3]?.m_iUnreliableGold)
// 	}
// }

// export function GameEnded() {

// }