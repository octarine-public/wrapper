import { DataTeamPlayer } from "../../Base/DataTeamPlayer"
import { EntityPropertiesNode } from "../../Base/EntityProperties"
import { TreeModelReplacement } from "../../Base/TreeModelReplacement"
import { Vector2 } from "../../Base/Vector2"
import { NetworkedBasicField, WrapperClass } from "../../Decorators"
import { DOTA_RUNES } from "../../Enums/DOTA_RUNES"
import { ERoshanSpawnPhase } from "../../Enums/ERoshanSpawnPhase"
import { EPropertyType } from "../../Enums/PropertyType"
import { Events } from "../../Managers/Events"
import { EventsSDK } from "../../Managers/EventsSDK"
import { RegisterFieldHandler } from "../../Objects/NativeToSDK"
import { GridNav } from "../../Resources/ParseGNV"
import { Entity } from "./Entity"
import { Tree, Trees } from "./Tree"

@WrapperClass("CDOTA_DataNonSpectator")
export class TeamData extends Entity {
	public DataTeam: DataTeamPlayer[] = []
	public WorldTreeModelReplacements: TreeModelReplacement[] = []
	@NetworkedBasicField("m_nNextPowerRuneType")
	public readonly NextPowerRuneType: DOTA_RUNES = DOTA_RUNES.DOTA_RUNE_INVALID
	@NetworkedBasicField("m_nNextPowerRuneSpawnIndex")
	public readonly NextPowerRuneSpawnIndex: number = -1
	@NetworkedBasicField("m_vDesiredWardPlacement")
	public readonly DesiredWardPlacement: Vector2[] = []
	@NetworkedBasicField("m_vPossibleWardPlacement")
	public readonly PossibleWardPlacement: Vector2[] = []
	@NetworkedBasicField("m_nEnemyStartingPosition")
	public readonly EnemyStartingPosition: number[] = []
	@NetworkedBasicField("m_nCaptainInspectedHeroID", EPropertyType.UINT32)
	public readonly CaptainInspectedHeroID = 0
	@NetworkedBasicField("m_flSuggestedWardWeights")
	public readonly SuggestedWardWeights: number[] = []
	@NetworkedBasicField("m_nSuggestedWardIndexes")
	public readonly SuggestedWardIndexes: number[] = []
	@NetworkedBasicField("m_iSuggestedLanes")
	public readonly SuggestedLanes: number[] = []
	@NetworkedBasicField("m_iSuggestedLaneWeights")
	public readonly SuggestedLaneWeights: number[] = []
	@NetworkedBasicField("m_bSuggestedLaneRoam")
	public readonly SuggestedLaneRoam: boolean[] = []
	@NetworkedBasicField("m_bSuggestedLaneJungle")
	public readonly SuggestedLaneJungle: boolean[] = []
	@NetworkedBasicField("m_vecNeutralItemsConsumed")
	public readonly NeutralItemsConsumed: number[] = []
	@NetworkedBasicField("m_vecKnownClearCamps")
	public readonly KnownClearCamps: number[] = []
	@NetworkedBasicField("m_flRoshanPhaseEndTime")
	public readonly RoshanPhaseEndTime: number = 0
	@NetworkedBasicField("m_flRoshanPhaseStartTime")
	public readonly RoshanPhaseStartTime: number = 0
	public NPCVisibleState: bigint[] = []
	public RoshanPhase: ERoshanSpawnPhase = ERoshanSpawnPhase.ROSHAN_SPAWN_PHASE_ALIVE

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
RegisterFieldHandler<TeamData, bigint>(TeamData, "m_eRoshanPhase", (data, newVal) => {
	data.RoshanPhase = Number(newVal)
})
RegisterFieldHandler<TeamData, EntityPropertiesNode[]>(
	TeamData,
	"m_vecDataTeam",
	(data, newVal) => {
		data.DataTeam = newVal.map(map => new DataTeamPlayer(map))
	}
)
RegisterFieldHandler<TeamData, EntityPropertiesNode[]>(
	TeamData,
	"m_vecWorldTreeModelReplacements",
	(data, newVal) => {
		data.WorldTreeModelReplacements = newVal.map(map => new TreeModelReplacement(map))
	}
)
RegisterFieldHandler<TeamData, bigint[]>(TeamData, "m_bWorldTreeState", (_, newValue) => {
	Tree.TreeActiveMask = newValue
	if (GridNav !== undefined) {
		for (let i = 0, end = Trees.length; i < end; i++) {
			GridNav.UpdateTreeState(Trees[i])
		}
	}
})

RegisterFieldHandler<TeamData, bigint[]>(
	TeamData,
	"m_bNPCVisibleState",
	(data, newValue) => {
		data.NPCVisibleState = newValue
		EventsSDK.emit("UnitVisibleStateChanged", false, data)
	}
)

Events.on("NewConnection", () => Tree.TreeActiveMask.clear())
