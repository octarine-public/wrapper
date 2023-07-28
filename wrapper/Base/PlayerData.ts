import { Team } from "../Enums/Team"
import { EntityPropertiesNode } from "./EntityProperties"

export class PlayerData {
	constructor(public readonly properties: EntityPropertiesNode) {}

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
		return Number(this.properties.get("m_eCoachTeam")) as Team
	}
	public get CoachRating(): number {
		return this.properties.get("m_unCoachRating") as number
	}
	public get LiveSpectatorTeam(): Team {
		return Number(this.properties.get("m_eLiveSpectatorTeam")) as Team
	}
	public get IsPlusSubscriber(): boolean {
		return this.properties.get("m_bIsPlusSubscriber") as boolean
	}
	public get WasMVPLastGame(): boolean {
		return this.properties.get("m_bWasMVPLastGame") as boolean
	}
	public get AccoladeType(): number[] {
		return this.properties.get("m_eAccoladeType") as number[]
	}
	public get AccoladeData(): bigint[] {
		return this.properties.get("m_unAccoladeData") as bigint[]
	}
	public get RankTier(): number {
		return this.properties.get("m_iRankTier") as number
	}
	public get Title(): number {
		return this.properties.get("m_iTitle") as number
	}

	public toJSON() {
		return {
			IsValid: this.IsValid,
			Name: this.Name,
			Team: this.Team,
			FullyJoinedServer: this.FullyJoinedServer,
			IsFakeClient: this.IsFakeClient,
			IsBroadcaster: this.IsBroadcaster,
			BroadcasterChannel: this.BroadcasterChannel,
			BroadcasterChannelSlot: this.BroadcasterChannelSlot,
			IsBroadcasterChannelCameraman: this.IsBroadcasterChannelCameraman,
			ConnectionState: this.ConnectionState,
			SteamID: this.SteamID,
			CoachTeam: this.CoachTeam,
			CoachRating: this.CoachRating,
			LiveSpectatorTeam: this.LiveSpectatorTeam,
			IsPlusSubscriber: this.IsPlusSubscriber,
			WasMVPLastGame: this.WasMVPLastGame,
			AccoladeType: this.AccoladeType,
			AccoladeData: this.AccoladeData,
			RankTier: this.RankTier,
			Title: this.Title
		}
	}
}
