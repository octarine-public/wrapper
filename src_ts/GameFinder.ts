import { Team, Menu as MenuSDK } from "./wrapper/Imports"

let Menu = MenuSDK.AddEntry("Game Finder"),
	SafeLaneFactor = Menu.AddSlider("Safe Lane factor", 4, 0, 5),
	OffLaneFactor = Menu.AddSlider("Off Lane factor", 3, 0, 5),
	MidLaneFactor = Menu.AddSlider("Mid Lane factor", 5, 0, 5),
	SoftSupportFactor = Menu.AddSlider("Soft Support factor", 1.5, 0, 5),
	HardSupportFactor = Menu.AddSlider("Hard Support factor", 2, 0, 5),
	AvgGameFactor = Menu.AddSlider("Average Game factor", 1, -5, 5)

function print(obj: any) {
	console.log(JSON.parse(JSON.stringify(obj, (key, value) => {
		if (typeof value === 'bigint')
			return value.toString() + "n"
		else
			return value
	})))
}

function SteamID2FriendID(steamid: bigint) {
	return parseInt((steamid - 0x110000100000000n) as any)
}

/*let APIKeys = [ // steam fallback
	"D9760C1ADBD0CBF5BAAAC44242870917", // moofMonkey
	"93A8AE0DD93F32BF434F10853E55D997", // Jkee
	"5BE28FED1F4AD86D66F1BBEEF95D0BD0", // Jkee 2
	"BF26C0D509AA2C128E835C0E5F7189DF", // Kuja
	"F751B29DB76DD2E6B6C412C597E58446", // Kuja 2
]
function PickRandomAPIKey() {
	return APIKeys[Math.floor(APIKeys.length * Math.random())]
}*/

interface CDOTALobbyMember {
	id: bigint // steamid
	team: number
	party_id: bigint
	meta_level: number
	lane_selection_flags: number
}

interface CSODOTALobby {
	members: CDOTALobbyMember[]
}

interface MatchRecord {
	match_id: number
	player_slot: number
	radiant_win: boolean
	lobby_type: number
	kills: number
	deaths: number
	assists: number
	skill: number
	leaver_status: number
}

enum LaneSelectionFlags_t {
	SAFE_LANE = 1 << 0,
	OFF_LANE = 1 << 1,
	MID_LANE = 1 << 2,
	SOFT_SUPPORT = 1 << 3,
	HARD_SUPPORT = 1 << 4,
}

function GetLaneFactor(lane_selection_flags: LaneSelectionFlags_t) {
	switch (lane_selection_flags) {
		case LaneSelectionFlags_t.MID_LANE:
			return MidLaneFactor.value
		case LaneSelectionFlags_t.SAFE_LANE:
			return SafeLaneFactor.value
		case LaneSelectionFlags_t.OFF_LANE:
			return OffLaneFactor.value
		case LaneSelectionFlags_t.HARD_SUPPORT:
			return HardSupportFactor.value
		case LaneSelectionFlags_t.SOFT_SUPPORT:
			return SoftSupportFactor.value
		default:
			return 1
	}
}

class LobbyMember {
	public MatchHistory: MatchRecord[]

	constructor(public account_id: number, public meta_level: number, public lane_selection_flags: LaneSelectionFlags_t) {}

	public CalculateScore() {
		let score = 0
		if (this.meta_level < 15)
			score--
		if (this.MatchHistory === undefined || this.MatchHistory.length === 0) {
			score--
			return score
		}
		if (this.MatchHistory.filter(record => (record.radiant_win && record.player_slot < 128) || (!record.radiant_win && record.player_slot >= 128)).length / this.MatchHistory.length < 0.5)
			score--
		else
			score++
		var max_losestreak = Math.min(5, this.MatchHistory.length),
			losestreak = 0,
			gap = 0
		for (let i = 0; i < this.MatchHistory.length; i++) {
			let record = this.MatchHistory[i]
			if (!((record.radiant_win && record.player_slot < 128) || (!record.radiant_win && record.player_slot >= 128))) {
				losestreak++
				gap = 0
				if (losestreak >= max_losestreak) {
					score--
					break
				}
			} else if (gap === 0)
				gap++
			else
				break
		}
		var max_winstreak = Math.min(3, this.MatchHistory.length),
			winstreak = 0
		for (let i = 0; i < this.MatchHistory.length; i++) {
			let record = this.MatchHistory[i]
			if (!((record.radiant_win && record.player_slot < 128) || (!record.radiant_win && record.player_slot >= 128))) {
				winstreak++
				if (winstreak >= max_winstreak) {
					score++
					break
				}
			} else
				break
		}
		
		return score
	}
}

let owner_party_id = 0n,
	owner_party_team = Team.Radiant
class Party {
	public members: LobbyMember[] = []

	constructor(public party_id: bigint) {}

	public CalculateScore() {
		if (this.party_id === owner_party_id)
			return 1
		return this.members.reduce((prev, cur) => cur.CalculateScore() * GetLaneFactor(cur.lane_selection_flags) + prev * 1.25, 0) / this.members.length
	}
}

class LobbyTeam {
	public parties: Party[] = []

	constructor(public team: Team) {}

	public get IsEnemy() {
		return this.team !== owner_party_team
	}
	public CalculateScore() {
		let score = this.parties.reduce((prev, cur) => cur.CalculateScore() + prev, 0) / this.parties.length
		if (this.IsEnemy)
			score *= -1
		return score
	}
}

class Lobby {
	public teams: LobbyTeam[] = []
	constructor(members: CDOTALobbyMember[]) {
		owner_party_team = members.find(member => member.party_id === owner_party_id).team + Team.Radiant
		members.forEach(member => {
			let team = this.teams.find(team_ => team_.team === (member.team + Team.Radiant))
			if (team === undefined) {
				team = new LobbyTeam(member.team + Team.Radiant)
				this.teams.push(team)
			}
			let party = team.parties.find(party_ => party_.party_id === member.party_id)
			if (party === undefined) {
				party = new Party(member.party_id)
				team.parties.push(party)
			}
			party.members.push(new LobbyMember(SteamID2FriendID(member.id), member.meta_level, member.lane_selection_flags))
		})
		this.FetchMatchHistory()
	}

	private FetchMatchHistory() {
		// loop-optimizer: KEEP
		let res = HTTPRequest(...this.teams.map(team => team.parties.map(party => party.members.map(member =>
			//`https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/V001/?key=${PickRandomAPIKey()}&account_id=${member.account_id}&matches_requested=20`
			`https://api.opendota.com/api/players/${member.account_id}/recentMatches`
		))).flat(2)).reverse()
		// loop-optimizer: KEEP
		this.teams.map(team => team.parties.map(party => party.members.map(member => {
			let [status, body] = res.pop()
			if (status !== 200)
				throw "Bad HTTP status: " + status
			let json = JSON.parse(body)
			/*if (json.result === undefined)
				throw "Invalid JSON response: no 'result' field"
			json = json.result
			if (json.status !== 1 && json.status !== 15) // don't expose public match data
				throw "Invalid API status: " + json.status + ". Detail: " + json.statusDetail
			member.MatchHistory = json.matches*/
			member.MatchHistory = json
		})))
	}
	public CalculateScore() {
		return this.teams.reduce((prev, cur) => cur.CalculateScore() + prev, 0) / this.teams.length
	}
}

Events.on("SharedObjectChanged", (id, reason, uuid, obj) => {
	console.log("SharedObjectChanged", id, reason, uuid.toString())
	if (id === 2003)
		owner_party_id = obj.party_id
	if (id === 2004 && reason === 0) {
		print(obj)
		try {
			let lobby = new Lobby((obj as CSODOTALobby).members)
			let score = lobby.CalculateScore()
			console.log(score)
			if (score < AvgGameFactor.value)
				StopFindingMatch()
		} catch(e) {
			console.log(e)
			StopFindingMatch()
		}
	}
})
