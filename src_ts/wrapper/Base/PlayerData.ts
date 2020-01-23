import { EntityPropertyType } from "../Managers/EntityManager"
import { Team } from "../Enums/Team"

export default class PlayerData {
	constructor(public readonly properties: Map<string, EntityPropertyType>) { }

	public get IsValid(): boolean {
		return this.properties.get("m_bIsValid") as boolean
	}
	public get Name(): string {
		return this.properties.get("m_iszPlayerName") as string
	}
	public get Team(): Team {
		return this.properties.get("m_iPlayerTeam") as Team
	}
	public get FullyJoinedServer(): boolean {
		return this.properties.get("m_bFullyJoinedServer") as boolean
	}
	public get IsFakeClient(): boolean {
		return this.properties.get("m_bFakeClient") as boolean
	}
	public get IsBroadcaster(): boolean {
		return this.properties.get("m_bIsBroadcaster") as boolean
	}
	public get BroadcasterChannel(): number {
		return this.properties.get("m_iBroadcasterChannel") as number
	}
	public get BroadcasterChannelSlot(): number {
		return this.properties.get("m_iBroadcasterChannelSlot") as number
	}
	public get IsBroadcasterChannelCameraman(): boolean {
		return this.properties.get("m_bIsBroadcasterChannelCameraman") as boolean
	}
	public get ConnectionState(): number {
		return this.properties.get("m_iConnectionState") as number
	}
	public get SteamID(): bigint {
		return this.properties.get("m_iPlayerSteamID") as bigint
	}
	public get CoachTeam(): Team {
		return this.properties.get("m_eCoachTeam") as Team
	}
	public get CoachRating(): number {
		return this.properties.get("m_unCoachRating") as number
	}
	public get LiveSpectatorTeam(): Team {
		return this.properties.get("m_eLiveSpectatorTeam") as Team
	}
	public get IsPlusSubscriber(): boolean {
		return this.properties.get("m_bIsPlusSubscriber") as boolean
	}
}
