import Entity from "./Entity"

// move to enum
declare const enum ConnectionState {
	Unknown = 0,
	NotYetConnected = 1,
	Connected = 2,
	Disconnected = 3,
	Abandoned = 4,
	Loading = 5,
	Failed = 6,
}

export default class Player extends Entity {
	m_pBaseEntity: C_DOTAPlayer

	get Assists(): number {
		return this.PlayerTeamData.m_iAssists
	}
	get ButtleBonusRate(): number {
		return this.PlayerTeamData.m_iBattleBonusRate
	}
	/* get BuybackCooldownTime(): number {
		return this.PlayerTeamData.
	} */

	get ID(): number {
		return this.m_pBaseEntity.m_iPlayerID
	}

	get PlayerData(): PlayerResourcePlayerData_t {
		return PlayerResource.m_vecPlayerData[this.ID]
	}
	get PlayerTeamData(): PlayerResourcePlayerTeamData_t {
		return PlayerResource.m_vecPlayerTeamData[this.ID]
	}

	// add more

	get CompendiumLevel(): number {
		return this.PlayerTeamData.m_unCompendiumLevel
	}
	get ConnectionState(): ConnectionState {
		return this.PlayerData.m_iConnectionState
	}

	// add more

	get Deaths(): number {
		return this.PlayerTeamData.m_iDeaths
	}

	// add more

	get HasRandomed(): boolean {
		return this.PlayerTeamData.m_bHasRandomed
	}
	/**
	 * need getting from entitymanager
	 */
	/* get Hero(): Hero {
		return this.m_pBaseEntity.m_hAssignedHero;
	} */
}
