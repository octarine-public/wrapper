import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { TreeModelReplacement } from "../../Base/TreeModelReplacement"
import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { Events } from "../../Managers/Events"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GridNav } from "../../Resources/ParseGNV"
import { Entity } from "./Entity"
import { Tree, Trees } from "./Tree"

@WrapperClass("CDOTA_DataNonSpectator")
export class TeamData extends Entity {
	public DataTeam: DataTeamPlayer[] = []
	public WorldTreeModelReplacements: TreeModelReplacement[] = []
	@NetworkedBasicField("m_vDesiredWardPlacement")
	public DesiredWardPlacement: Vector2[] = []
	@NetworkedBasicField("m_vPossibleWardPlacement")
	public PossibleWardPlacement: Vector2[] = []
	@NetworkedBasicField("m_nEnemyStartingPosition")
	public EnemyStartingPosition: number[] = []
	@NetworkedBasicField("m_nCaptainInspectedHeroID")
	public CaptainInspectedHeroID = 0
	@NetworkedBasicField("m_flSuggestedWardWeights")
	public SuggestedWardWeights: number[] = []
	@NetworkedBasicField("m_nSuggestedWardIndexes")
	public SuggestedWardIndexes: number[] = []
	@NetworkedBasicField("m_iSuggestedLanes")
	public SuggestedLanes: number[] = []
	@NetworkedBasicField("m_iSuggestedLaneWeights")
	public SuggestedLaneWeights: number[] = []
	@NetworkedBasicField("m_bSuggestedLaneRoam")
	public SuggestedLaneRoam: boolean[] = []
	@NetworkedBasicField("m_bSuggestedLaneJungle")
	public SuggestedLaneJungle: boolean[] = []
	@NetworkedBasicField("m_vecNeutralItemsConsumed")
	public NeutralItemsConsumed: number[] = []
	@NetworkedBasicField("m_vecKnownClearCamps")
	public KnownClearCamps: number[] = []

	public toJSON() {
		return {
			Team: this.Team,
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
			NeutralItemsConsumed: this.NeutralItemsConsumed
		}
	}
}

RegisterFieldHandler(TeamData, "m_vecDataTeam", (data, newVal) => {
	data.DataTeam = (newVal as EntityPropertiesNode[]).map(map => new DataTeamPlayer(map))
})

RegisterFieldHandler(TeamData, "m_vecWorldTreeModelReplacements", (data, newVal) => {
	data.WorldTreeModelReplacements = (newVal as EntityPropertiesNode[]).map(
		map => new TreeModelReplacement(map)
	)
})
RegisterFieldHandler(TeamData, "m_bWorldTreeState", (_, newValue) => {
	Tree.TreeActiveMask = newValue as bigint[]
	if (GridNav !== undefined) {
		for (let i = 0, end = Trees.length; i < end; i++) {
			GridNav.UpdateTreeState(Trees[i])
		}
	}
})

Events.on("NewConnection", () => (Tree.TreeActiveMask = []))
