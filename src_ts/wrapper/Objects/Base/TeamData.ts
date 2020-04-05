import Entity from "./Entity"
import EntityManager, { EntityPropertyType } from "../../Managers/EntityManager"
import TreeModelReplacement from "../../Base/TreeModelReplacement"
import { Team } from "../../Enums/Team"
import DataTeamPlayer from "../../Base/DataTeamPlayer"
import Vector2 from "../../Base/Vector2"

export default class TeamData extends Entity {
	public NativeEntity: Nullable<C_DOTA_DataNonSpectator>
	public TeamNum = Team.None
	public DataTeam: DataTeamPlayer[] = []
	public WorldTreeModelReplacements: TreeModelReplacement[] = []
	public DesiredWardPlacement: Vector2[] = []
	public EnemyStartingPosition: number[] = []
	public CaptainInspectedHeroID = 0
	public SuggestedWardWeights: number[] = []
	public SuggestedWardIndexes: number[] = []
	public SuggestedLanes: number[] = []
	public SuggestedLaneWeights: number[] = []
	public SuggestedLaneRoam: boolean[] = []
	public SuggestedLaneJungle: boolean[] = []
	public NeutralItemsEarned: number[] = []
	public NeutralStashItems: number[] = []
	public NeutralItemsConsumed: number[] = []

	public toJSON() {
		return {
			TeamNum: this.TeamNum,
			DataTeam: this.DataTeam,
			WorldTreeModelReplacements: this.WorldTreeModelReplacements,
			DesiredWardPlacement: this.DesiredWardPlacement,
			EnemyStartingPosition: this.EnemyStartingPosition,
			CaptainInspectedHeroID: this.CaptainInspectedHeroID,
			SuggestedWardWeights: this.SuggestedWardWeights,
			SuggestedWardIndexes: this.SuggestedWardIndexes,
			SuggestedLanes: this.SuggestedLanes,
			SuggestedLaneWeights: this.SuggestedLaneWeights,
			SuggestedLaneRoam: this.SuggestedLaneRoam,
			SuggestedLaneJungle: this.SuggestedLaneJungle,
			NeutralItemsEarned: this.NeutralItemsEarned,
			NeutralStashItems: this.NeutralStashItems,
			NeutralItemsConsumed: this.NeutralItemsConsumed,
		}
	}
}

import { RegisterClass, RegisterFieldHandler } from "wrapper/Objects/NativeToSDK"
RegisterClass("C_DOTA_DataNonSpectator", TeamData)
RegisterFieldHandler(TeamData, "m_iTeamNum", (data, new_value) => data.TeamNum = new_value as number)
RegisterFieldHandler(TeamData, "m_vecDataTeam", (data, new_val) => {
	// loop-optimizer: FORWARD
	data.DataTeam = (new_val as Map<string, EntityPropertyType>[]).map(map => new DataTeamPlayer(map))
})
RegisterFieldHandler(TeamData, "m_vecWorldTreeModelReplacements", (data, new_val) => {
	// loop-optimizer: FORWARD
	data.WorldTreeModelReplacements = (new_val as Map<string, EntityPropertyType>[]).map(map => new TreeModelReplacement(map))
})
RegisterFieldHandler(TeamData, "m_vDesiredWardPlacement", (data, new_value) => data.DesiredWardPlacement = new_value as Vector2[])
RegisterFieldHandler(TeamData, "m_nEnemyStartingPosition", (data, new_value) => data.EnemyStartingPosition = new_value as number[])
RegisterFieldHandler(TeamData, "m_nCaptainInspectedHeroID", (data, new_value) => data.CaptainInspectedHeroID = new_value as number)
RegisterFieldHandler(TeamData, "m_flSuggestedWardWeights", (data, new_value) => data.SuggestedWardWeights = new_value as number[])
RegisterFieldHandler(TeamData, "m_nSuggestedWardIndexes", (data, new_value) => data.SuggestedWardIndexes = new_value as number[])
RegisterFieldHandler(TeamData, "m_iSuggestedLanes", (data, new_value) => data.SuggestedLanes = new_value as number[])
RegisterFieldHandler(TeamData, "m_iSuggestedLaneWeights", (data, new_value) => data.SuggestedLaneWeights = new_value as number[])
RegisterFieldHandler(TeamData, "m_bSuggestedLaneRoam", (data, new_value) => data.SuggestedLaneRoam = new_value as boolean[])
RegisterFieldHandler(TeamData, "m_bSuggestedLaneJungle", (data, new_value) => data.SuggestedLaneJungle = new_value as boolean[])
RegisterFieldHandler(TeamData, "m_vecNeutralItemsEarned", (data, new_value) => data.NeutralItemsEarned = new_value as number[])
RegisterFieldHandler(TeamData, "m_vecNeutralItemsConsumed", (data, new_value) => data.NeutralItemsConsumed = new_value as number[])
RegisterFieldHandler(TeamData, "m_bWorldTreeState", (_, new_value) => EntityManager.SetWorldTreeState(new_value as bigint[]))
