import { Unit, Game } from "wrapper/Imports"
export default class ItemManagerBase {
	constructor(public readonly unit?: Unit) { }
	public get MaxMoveSpeed(): number {
		return Number.MAX_SAFE_INTEGER
	}
	public get GetDelayCast() {
		return (((Game.Ping / 2) + 30) + 250)
	}
	// public GetNetWorth() {
	// 	return (from x in owner.Hero.Abilities where x.IsItem select x).Sum((Ability9 x) => x.Id.GetPrice()) + owner.Player.ReliableGold + owner.Player.UnreliableGold
	// }
	// public GetBuybackCost() {
	// 	return (100 + this.unit.GetNetWorth() / 13)
	// }
	// public GetAvailableGold(saveForBuyback: number): number {

	// 	let NonSpec = EntityManager.GetEntitiesByClass(C_DOTA_DataNonSpectator, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY)
	// 	let num = NonSpec.find(x => x?.m_vecDataTeam[LocalPlayer.PlayerID]?.m_iReliableGold)
	// 	let num2 = NonSpec.find(x => x?.m_vecDataTeam[LocalPlayer.PlayerID]?.m_iUnreliableGold)

	// 	if (Game.GameTime / 60 >= saveForBuyback) {
	// 		let num3 = this.unit.GetBuybackCost() + this.unit.GetGoldLossOnDeath();
	// 	}
	// 	return
	// }
}
