import { SOType } from "../Enums/SOType"
import { ParseProtobufDesc, ParseProtobufNamed } from "../Utils/Protobuf"
import { Events } from "./Events"
import { EventsSDK } from "./EventsSDK"

ParseProtobufDesc(`
message CSOEconItemEquipped {
	optional uint32 new_class = 1;
	optional uint32 new_slot = 2;
}
message CSOEconItemAttribute {
	optional uint32 def_index = 1 [default = 65535];
	optional uint32 value = 2;
	optional bytes value_bytes = 3;
}
message CSOEconItem {
	optional uint64 id = 1;
	optional uint32 account_id = 2;
	optional uint32 inventory = 3;
	optional uint32 def_index = 4;
	optional uint32 quantity = 5 [default = 1];
	optional uint32 level = 6 [default = 1];
	optional uint32 quality = 7 [default = 4];
	optional uint32 flags = 8 [default = 0];
	optional uint32 origin = 9 [default = 0];
	repeated .CSOEconItemAttribute attribute = 12;
	optional .CSOEconItem interior_item = 13;
	optional uint32 style = 15 [default = 0];
	optional uint64 original_id = 16;
	repeated .CSOEconItemEquipped equipped_state = 18;
}

message CSOEconItemDropRateBonus {
	optional uint32 account_id = 1 [(key_field) = true];
	optional fixed32 expiration_date = 2;
	optional float bonus = 3 [(key_field) = true];
	optional uint32 bonus_count = 4;
	optional uint64 item_id = 5;
	optional uint32 def_index = 6;
	optional uint32 seconds_left = 7;
	optional uint32 booster_type = 8 [(key_field) = true];
}
message CSOEconItemTournamentPassport {
	optional uint32 account_id = 1;
	optional uint32 league_id = 2;
	optional uint64 item_id = 3;
	optional uint32 original_purchaser_id = 4;
	optional uint32 passports_bought = 5;
	optional uint32 version = 6;
	optional uint32 def_index = 7;
	optional uint32 reward_flags = 8;
}
enum PartnerAccountType {
	PARTNER_NONE = 0;
	PARTNER_PERFECT_WORLD = 1;
	PARTNER_INVALID = 3;
}
message CSODOTAGameAccountClient {
	message RoleHandicap {
		optional uint32 role = 1;
		optional float handicap = 2;
	}

	optional uint32 account_id = 1 [(key_field) = true];
	optional uint32 wins = 3;
	optional uint32 losses = 4;
	optional uint32 xp = 12;
	optional uint32 level = 13;
	optional uint32 initial_skill = 14;
	optional uint32 leaver_count = 15;
	optional uint32 secondary_leaver_count = 58;
	optional uint32 low_priority_until_date = 18;
	optional uint32 prevent_text_chat_until_date = 20;
	optional uint32 prevent_voice_until_date = 21;
	optional uint32 prevent_public_text_chat_until_date = 86;
	optional uint32 prevent_new_player_chat_until_date = 122;
	optional uint32 last_abandoned_game_date = 22;
	optional uint32 last_secondary_abandoned_game_date = 59;
	optional uint32 leaver_penalty_count = 23;
	optional uint32 completed_game_streak = 24;
	optional uint32 account_disabled_until_date = 38;
	optional uint32 account_disabled_count = 39;
	optional uint32 match_disabled_until_date = 41;
	optional uint32 match_disabled_count = 42;
	optional uint32 shutdownlawterminatetimestamp = 47;
	optional uint32 low_priority_games_remaining = 48;
	optional uint32 recruitment_level = 55;
	optional bool has_new_notifications = 56;
	optional bool is_league_admin = 57;
	optional uint32 casual_games_played = 60;
	optional uint32 solo_competitive_games_played = 61;
	optional uint32 party_competitive_games_played = 62;
	optional uint32 casual_1v1_games_played = 65;
	optional uint32 curr_all_hero_challenge_id = 67;
	optional uint32 play_time_points = 68;
	optional uint32 account_flags = 69;
	optional uint32 play_time_level = 70;
	optional uint32 player_behavior_seq_num_last_report = 71;
	optional uint32 player_behavior_score_last_report = 72;
	optional bool player_behavior_report_old_data = 73;
	optional uint32 tourney_skill_level = 74;
	optional uint32 tourney_recent_participation_date = 85;
	optional uint64 anchored_phone_number_id = 88;
	optional uint32 ranked_matchmaking_ban_until_date = 89;
	optional uint32 recent_game_time_1 = 90;
	optional uint32 recent_game_time_2 = 91;
	optional uint32 recent_game_time_3 = 92;
	optional uint64 favorite_team_packed = 103;
	optional uint32 recent_report_time = 104;
	optional uint32 custom_game_disabled_until_date = 105;
	optional uint32 recent_win_time_1 = 106;
	optional uint32 recent_win_time_2 = 107;
	optional uint32 recent_win_time_3 = 108;
	optional uint32 coach_rating = 109;
	optional uint32 queue_points = 114;
	repeated .CSODOTAGameAccountClient.RoleHandicap role_handicaps = 115;
	optional uint32 event_mode_recent_time = 120;
	optional uint32 mmr_recalibration_time = 121;
}
enum ETourneyQueueDeadlineState {
	k_ETourneyQueueDeadlineState_Normal = 0;
	k_ETourneyQueueDeadlineState_Missed = 1;
	k_ETourneyQueueDeadlineState_ExpiredOK = 2;
	k_ETourneyQueueDeadlineState_SeekingBye = 3;
	k_ETourneyQueueDeadlineState_EligibleForRefund = 4;
	k_ETourneyQueueDeadlineState_NA = -1;
	k_ETourneyQueueDeadlineState_ExpiringSoon = 101;
}
enum MatchType {
	MATCH_TYPE_CASUAL = 0;
	MATCH_TYPE_COOP_BOTS = 1;
	MATCH_TYPE_COMPETITIVE = 4;
	MATCH_TYPE_WEEKEND_TOURNEY = 5;
	MATCH_TYPE_EVENT = 7;
	MATCH_TYPE_COACHES_CHALLENGE = 12;
	MATCH_TYPE_NEW_PLAYER_POOL = 14;
}
message CSODOTAPartyMember {
	optional bool is_coach = 2;
	repeated uint32 region_ping_codes = 4 [packed = true];
	repeated uint32 region_ping_times = 5 [packed = true];
	optional uint32 region_ping_failed_bitmask = 6;
	optional bool is_plus_subscriber = 10;
	optional uint32 tourney_skill_level = 7;
	optional uint32 tourney_buyin = 8;
	optional uint32 tourney_prevent_until = 9;
	optional bool mm_data_valid = 13;
	optional uint32 lane_selection_flags = 11;
	optional bool high_priority_disabled = 14;
	optional bool has_hp_resource = 15;
	optional bool joined_from_partyfinder = 12;
	optional bool is_steam_china = 16;
}
enum DOTABotDifficulty {
	BOT_DIFFICULTY_PASSIVE = 0;
	BOT_DIFFICULTY_EASY = 1;
	BOT_DIFFICULTY_MEDIUM = 2;
	BOT_DIFFICULTY_HARD = 3;
	BOT_DIFFICULTY_UNFAIR = 4;
	BOT_DIFFICULTY_INVALID = 5;
	BOT_DIFFICULTY_EXTRA1 = 6;
	BOT_DIFFICULTY_EXTRA2 = 7;
	BOT_DIFFICULTY_EXTRA3 = 8;
	BOT_DIFFICULTY_NPX = 9;
}
message CSODOTAPartyInvite {
	message PartyMember {
		optional string name = 1;
		optional fixed64 steam_id = 2;
		optional bool is_coach = 4;
	}

	optional uint64 group_id = 1 [(key_field) = true];
	optional fixed64 sender_id = 2;
	optional string sender_name = 3;
	repeated .CSODOTAPartyInvite.PartyMember members = 4;
	optional uint32 team_id = 5;
	optional bool low_priority_status = 6;
	optional bool as_coach = 7;
	optional fixed64 invite_gid = 8;
}
enum EReadyCheckStatus {
	k_EReadyCheckStatus_Unknown = 0;
	k_EReadyCheckStatus_NotReady = 1;
	k_EReadyCheckStatus_Ready = 2;
}
message CMsgReadyCheckStatus {
	message ReadyMember {
		optional uint32 account_id = 1;
		optional .EReadyCheckStatus ready_status = 2 [default = k_EReadyCheckStatus_Unknown];
	}

	optional uint32 start_timestamp = 1;
	optional uint32 finish_timestamp = 2;
	optional uint32 initiator_account_id = 3;
	repeated .CMsgReadyCheckStatus.ReadyMember ready_members = 4;
}
enum EHighPriorityMMState {
	k_EHighPriorityMM_Unknown = 0;
	k_EHighPriorityMM_MissingMMData = 1;
	k_EHighPriorityMM_ResourceMissing = 2;
	k_EHighPriorityMM_ManuallyDisabled = 3;
	k_EHighPriorityMM_Min_Enabled = 64;
	k_EHighPriorityMM_AllRolesSelected = 65;
	k_EHighPriorityMM_UsingResource = 66;
	k_EHighPriorityMM_FiveStack = 67;
	k_EHighPriorityMM_HighDemand = 68;
}
message CSODOTAParty {
	enum State {
		UI = 0;
		FINDING_MATCH = 1;
		IN_MATCH = 2;
	}

	optional uint64 party_id = 1 [(key_field) = true];
	optional fixed64 leader_id = 2;
	repeated fixed64 member_ids = 3;
	optional uint32 game_modes = 4;
	optional .CSODOTAParty.State state = 6 [default = UI];
	optional uint32 effective_started_matchmaking_time = 7;
	optional uint32 raw_started_matchmaking_time = 32;
	optional uint32 attempt_start_time = 33;
	optional uint32 attempt_num = 34;
	optional uint32 matchgroups = 11;
	optional uint32 low_priority_account_id = 19;
	optional .MatchType match_type = 21 [default = MATCH_TYPE_CASUAL];
	optional uint32 team_id = 23;
	optional string team_name = 51;
	optional uint64 team_ui_logo = 52;
	optional uint64 team_base_logo = 53;
	optional uint32 match_disabled_until_date = 24;
	optional uint32 match_disabled_account_id = 25;
	optional uint32 matchmaking_max_range_minutes = 26;
	optional uint32 matchlanguages = 27;
	repeated .CSODOTAPartyMember members = 29;
	optional uint32 low_priority_games_remaining = 35;
	optional bool open_for_join_requests = 40;
	repeated .CSODOTAPartyInvite sent_invites = 41;
	repeated .CSODOTAPartyInvite recv_invites = 42;
	optional uint32 account_flags = 43;
	optional uint32 region_select_flags = 44;
	optional uint32 exclusive_tournament_id = 45;
	optional uint32 tourney_division_id = 47;
	optional uint32 tourney_schedule_time = 48;
	optional uint32 tourney_skill_level = 49;
	optional uint32 tourney_bracket_round = 50;
	optional uint32 tourney_queue_deadline_time = 54;
	optional .ETourneyQueueDeadlineState tourney_queue_deadline_state = 55 [default = k_ETourneyQueueDeadlineState_Normal];
	optional uint32 party_builder_slots_to_fill = 56;
	optional uint32 party_builder_match_groups = 57;
	optional uint32 party_builder_start_time = 58;
	optional bool solo_queue = 59;
	optional uint32 steam_clan_account_id = 61;
	optional .CMsgReadyCheckStatus ready_check = 62;
	optional uint32 custom_game_disabled_until_date = 63;
	optional uint32 custom_game_disabled_account_id = 64;
	optional bool is_challenge_match = 65;
	optional bool party_search_beacon_active = 66;
	optional uint32 matchmaking_flags = 67;
	optional .EHighPriorityMMState high_priority_state = 68 [default = k_EHighPriorityMM_Unknown];
	optional bool lane_selections_enabled = 69;
	optional uint32 custom_game_difficulty_mask = 70;
	optional bool is_steam_china = 71;
	optional uint32 bot_difficulty_mask = 72;
	optional uint32 bot_script_index_mask = 73;
}
message CMsgLobbyPlayerPlusSubscriptionData {
	message HeroBadge {
		optional uint32 hero_id = 1;
		optional uint32 hero_badge_xp = 2;
	}

	repeated .CMsgLobbyPlayerPlusSubscriptionData.HeroBadge hero_badges = 1;
}
message CMsgLobbyEventPoints {
	message PeriodicResourceData {
		optional uint32 periodic_resource_id = 1;
		optional uint32 remaining = 2;
		optional uint32 max = 3;
	}

	message NetworkedEventAction {
		optional uint32 action_id = 1;
		optional uint32 times_granted = 2;
	}

	message AccountPoints {
		optional uint32 account_id = 1;
		optional uint32 normal_points = 2;
		optional uint32 premium_points = 3;
		optional bool owned = 4;
		optional uint64 active_effects_mask = 12;
		optional uint32 wager_streak = 23;
		repeated .CMsgLobbyEventPoints.NetworkedEventAction event_game_custom_actions = 25;
		optional uint32 tip_amount_index = 26;
		optional uint32 active_event_season_id = 27;
		optional uint32 teleport_fx_level = 28;
		repeated .CMsgLobbyEventPoints.NetworkedEventAction networked_event_actions = 30;
		repeated .CMsgLobbyEventPoints.PeriodicResourceData periodic_resources = 31;
	}

	optional uint32 event_id = 1;
	repeated .CMsgLobbyEventPoints.AccountPoints account_points = 2;
}
enum DOTA_GC_TEAM {
	DOTA_GC_TEAM_GOOD_GUYS = 0;
	DOTA_GC_TEAM_BAD_GUYS = 1;
	DOTA_GC_TEAM_BROADCASTER = 2;
	DOTA_GC_TEAM_SPECTATOR = 3;
	DOTA_GC_TEAM_PLAYER_POOL = 4;
	DOTA_GC_TEAM_NOTEAM = 5;
	DOTA_GC_TEAM_CUSTOM_1 = 6;
	DOTA_GC_TEAM_CUSTOM_2 = 7;
	DOTA_GC_TEAM_CUSTOM_3 = 8;
	DOTA_GC_TEAM_CUSTOM_4 = 9;
	DOTA_GC_TEAM_CUSTOM_5 = 10;
	DOTA_GC_TEAM_CUSTOM_6 = 11;
	DOTA_GC_TEAM_CUSTOM_7 = 12;
	DOTA_GC_TEAM_CUSTOM_8 = 13;
	DOTA_GC_TEAM_NEUTRALS = 14;
}
message CLobbyGuildDetails {
	optional uint32 guild_id = 1;
	optional uint32 guild_primary_color = 2;
	optional uint32 guild_secondary_color = 3;
	optional uint32 guild_pattern = 4;
	optional uint64 guild_logo = 5;
	optional uint32 guild_points = 6;
	optional uint32 guild_event = 7;
	optional uint32 guild_flags = 8;
	optional .DOTA_GC_TEAM team_for_guild = 9 [default = DOTA_GC_TEAM_GOOD_GUYS];
	optional string guild_tag = 10;
	optional uint32 guild_weekly_percentile = 11;
}
enum EEvent {
	EVENT_ID_NONE = 0;
	EVENT_ID_DIRETIDE = 1;
	EVENT_ID_SPRING_FESTIVAL = 2;
	EVENT_ID_FROSTIVUS_2013 = 3;
	EVENT_ID_COMPENDIUM_2014 = 4;
	EVENT_ID_NEXON_PC_BANG = 5;
	EVENT_ID_PWRD_DAC_2015 = 6;
	EVENT_ID_NEW_BLOOM_2015 = 7;
	EVENT_ID_INTERNATIONAL_2015 = 8;
	EVENT_ID_FALL_MAJOR_2015 = 9;
	EVENT_ID_ORACLE_PA = 10;
	EVENT_ID_NEW_BLOOM_2015_PREBEAST = 11;
	EVENT_ID_FROSTIVUS = 12;
	EVENT_ID_WINTER_MAJOR_2016 = 13;
	EVENT_ID_INTERNATIONAL_2016 = 14;
	EVENT_ID_FALL_MAJOR_2016 = 15;
	EVENT_ID_WINTER_MAJOR_2017 = 16;
	EVENT_ID_NEW_BLOOM_2017 = 17;
	EVENT_ID_INTERNATIONAL_2017 = 18;
	EVENT_ID_PLUS_SUBSCRIPTION = 19;
	EVENT_ID_SINGLES_DAY_2017 = 20;
	EVENT_ID_FROSTIVUS_2017 = 21;
	EVENT_ID_INTERNATIONAL_2018 = 22;
	EVENT_ID_FROSTIVUS_2018 = 23;
	EVENT_ID_NEW_BLOOM_2019 = 24;
	EVENT_ID_INTERNATIONAL_2019 = 25;
	EVENT_ID_NEW_PLAYER_EXPERIENCE = 26;
	EVENT_ID_FROSTIVUS_2019 = 27;
	EVENT_ID_NEW_BLOOM_2020 = 28;
	EVENT_ID_INTERNATIONAL_2020 = 29;
	EVENT_ID_TEAM_FANDOM = 30;
	EVENT_ID_DIRETIDE_2020 = 31;
	EVENT_ID_SPRING_2021 = 32;
	EVENT_ID_FALL_2021 = 33;
	EVENT_ID_TEAM_FANDOM_FALL_2021 = 34;
	EVENT_ID_TEAM_2021_2022_TOUR2 = 35;
	EVENT_ID_INTERNATIONAL_2022 = 36;
	EVENT_ID_TEAM_2021_2022_TOUR3 = 37;
	EVENT_ID_TEAM_INTERNATIONAL_2022 = 38;
	EVENT_ID_PERMANENT_GRANTS = 39;
	EVENT_ID_MUERTA_RELEASE_SPRING2023 = 40;
	EVENT_ID_TEAM_2023_TOUR1 = 41;
}
message CLobbyGuildChallenge {
	optional uint32 guild_id = 1;
	optional .EEvent event_id = 2 [default = EVENT_ID_NONE];
	optional uint32 challenge_instance_id = 3;
	optional uint32 challenge_parameter = 4;
	optional uint32 challenge_timestamp = 5;
	optional uint32 challenge_period_serial = 6;
	optional uint32 challenge_progress_at_start = 7;
	repeated uint32 eligible_account_ids = 8;
}
enum DOTASelectionPriorityChoice {
	k_DOTASelectionPriorityChoice_Invalid = 0;
	k_DOTASelectionPriorityChoice_FirstPick = 1;
	k_DOTASelectionPriorityChoice_SecondPick = 2;
	k_DOTASelectionPriorityChoice_Radiant = 3;
	k_DOTASelectionPriorityChoice_Dire = 4;
}
enum DOTASelectionPriorityRules {
	k_DOTASelectionPriorityRules_Manual = 0;
	k_DOTASelectionPriorityRules_Automatic = 1;
}
enum LobbyDotaPauseSetting {
	LobbyDotaPauseSetting_Unlimited = 0;
	LobbyDotaPauseSetting_Limited = 1;
	LobbyDotaPauseSetting_Disabled = 2;
}
enum DOTALobbyVisibility {
	DOTALobbyVisibility_Public = 0;
	DOTALobbyVisibility_Friends = 1;
	DOTALobbyVisibility_Unlisted = 2;
}
enum EMatchOutcome {
	k_EMatchOutcome_Unknown = 0;
	k_EMatchOutcome_RadVictory = 2;
	k_EMatchOutcome_DireVictory = 3;
	k_EMatchOutcome_NeutralVictory = 4;
	k_EMatchOutcome_NoTeamWinner = 5;
	k_EMatchOutcome_Custom1Victory = 6;
	k_EMatchOutcome_Custom2Victory = 7;
	k_EMatchOutcome_Custom3Victory = 8;
	k_EMatchOutcome_Custom4Victory = 9;
	k_EMatchOutcome_Custom5Victory = 10;
	k_EMatchOutcome_Custom6Victory = 11;
	k_EMatchOutcome_Custom7Victory = 12;
	k_EMatchOutcome_Custom8Victory = 13;
	k_EMatchOutcome_NotScored_PoorNetworkConditions = 64;
	k_EMatchOutcome_NotScored_Leaver = 65;
	k_EMatchOutcome_NotScored_ServerCrash = 66;
	k_EMatchOutcome_NotScored_NeverStarted = 67;
	k_EMatchOutcome_NotScored_Canceled = 68;
	k_EMatchOutcome_NotScored_Suspicious = 69;
}
message CDOTASaveGame {
	message Player {
		optional .DOTA_GC_TEAM team = 1 [default = DOTA_GC_TEAM_GOOD_GUYS];
		optional string name = 2;
		optional string hero = 3;
	}

	message SaveInstance {
		message PlayerPositions {
			optional float x = 1;
			optional float y = 2;
		}

		optional uint32 game_time = 2;
		optional uint32 team1_score = 3;
		optional uint32 team2_score = 4;
		repeated .CDOTASaveGame.SaveInstance.PlayerPositions player_positions = 5;
		optional uint32 save_id = 6;
		optional uint32 save_time = 7;
	}

	optional uint64 match_id = 5;
	optional uint32 save_time = 2;
	repeated .CDOTASaveGame.Player players = 3;
	repeated .CDOTASaveGame.SaveInstance save_instances = 4;
}
enum EDOTAMMRBoostType {
	k_EDOTAMMRBoostType_None = 0;
	k_EDOTAMMRBoostType_Leader = 1;
	k_EDOTAMMRBoostType_Follower = 2;
}
enum EEventActionScoreMode {
	k_eEventActionScoreMode_Add = 0;
	k_eEventActionScoreMode_Min = 1;
}
message CMsgPendingEventAward {
	optional .EEvent event_id = 1 [default = EVENT_ID_NONE];
	optional uint32 action_id = 2;
	optional uint32 num_to_grant = 3;
	optional .EEventActionScoreMode score_mode = 4 [default = k_eEventActionScoreMode_Add];
	optional uint32 audit_action = 5;
	optional uint64 audit_data = 6;
}
enum DOTALeaverStatus_t {
	DOTA_LEAVER_NONE = 0;
	DOTA_LEAVER_DISCONNECTED = 1;
	DOTA_LEAVER_DISCONNECTED_TOO_LONG = 2;
	DOTA_LEAVER_ABANDONED = 3;
	DOTA_LEAVER_AFK = 4;
	DOTA_LEAVER_NEVER_CONNECTED = 5;
	DOTA_LEAVER_NEVER_CONNECTED_TOO_LONG = 6;
	DOTA_LEAVER_FAILED_TO_READY_UP = 7;
	DOTA_LEAVER_DECLINED = 8;
}
message CSODOTALobbyMember {
	optional fixed64 id = 1 [(key_field) = true];
	optional uint32 hero_id = 2;
	optional .DOTA_GC_TEAM team = 3 [default = DOTA_GC_TEAM_GOOD_GUYS];
	optional string name = 6;
	optional uint32 slot = 7;
	optional uint64 party_id = 12;
	optional uint32 meta_level = 13;
	optional uint32 meta_xp = 14;
	optional uint32 meta_xp_awarded = 15;
	optional .DOTALeaverStatus_t leaver_status = 16 [default = DOTA_LEAVER_NONE];
	optional uint32 leaver_actions = 28;
	optional uint32 channel = 17 [default = 6];
	repeated uint32 disabled_hero_id = 20;
	repeated uint32 enabled_hero_id = 22;
	optional .DOTA_GC_TEAM coach_team = 23 [default = DOTA_GC_TEAM_NOTEAM];
	repeated uint32 coached_account_ids = 53;
	optional uint32 coach_rating = 42;
	optional uint32 pwrd_cyber_cafe_id = 24;
	optional string pwrd_cyber_cafe_name = 25;
	repeated fixed32 disabled_random_hero_bits = 41;
	optional sint32 rank_change = 29;
	optional bool cameraman = 30;
	repeated uint32 custom_game_product_ids = 31;
	optional .MatchType search_match_type = 33 [default = MATCH_TYPE_CASUAL];
	optional uint64 favorite_team_packed = 35;
	optional bool is_plus_subscriber = 36;
	optional uint32 lane_selection_flags = 38;
	optional bool can_earn_rewards = 39;
	optional .DOTA_GC_TEAM live_spectator_team = 40 [default = DOTA_GC_TEAM_NOTEAM];
	optional bool was_mvp_last_game = 43;
	repeated .CMsgPendingEventAward pending_awards = 44;
	repeated .CMsgPendingEventAward pending_awards_on_victory = 45;
	optional .EDOTAMMRBoostType rank_mmr_boost_type = 46 [default = k_EDOTAMMRBoostType_None];
	optional sint32 queue_point_adjustment = 47;
	optional int32 rank_tier = 48;
	optional uint32 title = 50;
	optional uint32 guild_id = 51;
	optional uint32 reports_available = 52;
	optional bool is_steam_china = 54;
	optional uint32 live_spectator_account_id = 55;
	optional uint32 comms_reports_available = 56;
}
message CLobbyTeamDetails {
	optional string team_name = 1;
	optional string team_tag = 3;
	optional uint32 team_id = 4;
	optional uint64 team_logo = 5;
	optional uint64 team_base_logo = 6;
	optional uint64 team_banner_logo = 7;
	optional bool team_complete = 8;
	optional uint32 rank = 15;
	optional sint32 rank_change = 16;
	optional bool is_home_team = 17;
	optional bool is_challenge_match = 18;
	optional uint64 challenge_match_token_account = 19;
	optional string team_logo_url = 20;
	optional string team_abbreviation = 21;
}
enum DOTA_GameState {
	DOTA_GAMERULES_STATE_INIT = 0;
	DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD = 1;
	DOTA_GAMERULES_STATE_HERO_SELECTION = 2;
	DOTA_GAMERULES_STATE_STRATEGY_TIME = 3;
	DOTA_GAMERULES_STATE_PRE_GAME = 4;
	DOTA_GAMERULES_STATE_GAME_IN_PROGRESS = 5;
	DOTA_GAMERULES_STATE_POST_GAME = 6;
	DOTA_GAMERULES_STATE_DISCONNECT = 7;
	DOTA_GAMERULES_STATE_TEAM_SHOWCASE = 8;
	DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP = 9;
	DOTA_GAMERULES_STATE_WAIT_FOR_MAP_TO_LOAD = 10;
	DOTA_GAMERULES_STATE_SCENARIO_SETUP = 11;
	DOTA_GAMERULES_STATE_PLAYER_DRAFT = 12;
	DOTA_GAMERULES_STATE_LAST = 13;
}
enum DOTA_CM_PICK {
	DOTA_CM_RANDOM = 0;
	DOTA_CM_GOOD_GUYS = 1;
	DOTA_CM_BAD_GUYS = 2;
}
message CLobbyTimedRewardDetails {
	optional uint32 item_def_index = 2;
	optional bool is_supply_crate = 3;
	optional bool is_timed_drop = 4;
	optional uint32 account_id = 5;
	optional uint32 origin = 6;
}
enum LobbyDotaTVDelay {
	LobbyDotaTV_10 = 0;
	LobbyDotaTV_120 = 1;
	LobbyDotaTV_300 = 2;
	LobbyDotaTV_900 = 3;
}
message CLobbyBroadcastChannelInfo {
	optional uint32 channel_id = 1;
	optional string country_code = 2;
	optional string description = 3;
	optional string language_code = 4;
}
enum ELobbyMemberCoachRequestState {
	k_eLobbyMemberCoachRequestState_None = 0;
	k_eLobbyMemberCoachRequestState_Accepted = 1;
	k_eLobbyMemberCoachRequestState_Rejected = 2;
}
message CMsgLobbyCoachFriendRequest {
	optional uint32 coach_account_id = 1;
	optional uint32 player_account_id = 2;
	optional .ELobbyMemberCoachRequestState request_state = 3 [default = k_eLobbyMemberCoachRequestState_None];
}
message CSODOTALobby {
	message CExtraMsg {
		optional uint32 id = 1;
		optional bytes contents = 2;
	}

	enum State {
		UI = 0;
		READYUP = 4;
		SERVERSETUP = 1;
		RUN = 2;
		POSTGAME = 3;
		NOTREADY = 5;
		SERVERASSIGN = 6;
	}

	enum LobbyType {
		INVALID = -1;
		CASUAL_MATCH = 0;
		PRACTICE = 1;
		COOP_BOT_MATCH = 4;
		COMPETITIVE_MATCH = 7;
		WEEKEND_TOURNEY = 9;
		LOCAL_BOT_MATCH = 10;
		SPECTATOR = 11;
		EVENT_MATCH = 12;
		NEW_PLAYER_POOL = 14;
		FEATURED_GAMEMODE = 15;
	}

	optional uint64 lobby_id = 1 [(key_field) = true];
	repeated .CSODOTALobbyMember all_members = 120;
	repeated uint32 member_indices = 121;
	repeated uint32 left_member_indices = 122;
	repeated uint32 free_member_indices = 123;
	optional fixed64 leader_id = 11;
	optional fixed64 server_id = 6 [default = 0];
	optional uint32 game_mode = 3;
	repeated fixed64 pending_invites = 10;
	optional .CSODOTALobby.State state = 4 [default = UI];
	optional string connect = 5;
	optional .CSODOTALobby.LobbyType lobby_type = 12 [default = INVALID];
	optional bool allow_cheats = 13;
	optional bool fill_with_bots = 14;
	optional bool intro_mode = 15;
	optional string game_name = 16;
	repeated .CLobbyTeamDetails team_details = 17;
	optional uint32 tutorial_lesson = 18;
	optional uint32 tournament_id = 19;
	optional uint32 tournament_game_id = 20;
	optional uint32 server_region = 21 [default = 0];
	optional .DOTA_GameState game_state = 22 [default = DOTA_GAMERULES_STATE_INIT];
	optional uint32 num_spectators = 23;
	optional uint32 matchgroup = 25;
	optional .DOTA_CM_PICK cm_pick = 28 [default = DOTA_CM_RANDOM];
	optional uint64 match_id = 30;
	optional bool allow_spectating = 31 [default = true];
	optional .DOTABotDifficulty bot_difficulty_radiant = 36 [default = BOT_DIFFICULTY_HARD];
	repeated .CLobbyTimedRewardDetails timed_reward_details = 38;
	optional string pass_key = 39;
	optional uint32 leagueid = 42;
	optional uint32 penalty_level_radiant = 43 [default = 0];
	optional uint32 penalty_level_dire = 44 [default = 0];
	optional uint32 load_game_id = 45;
	optional uint32 series_type = 46;
	optional uint32 radiant_series_wins = 47;
	optional uint32 dire_series_wins = 48;
	optional uint32 loot_generated = 49;
	optional uint32 loot_awarded = 50;
	optional bool allchat = 51 [default = false];
	optional .LobbyDotaTVDelay dota_tv_delay = 53 [default = LobbyDotaTV_10];
	optional string custom_game_mode = 54;
	optional string custom_map_name = 55;
	optional uint32 custom_difficulty = 56;
	optional bool lan = 57;
	repeated .CLobbyBroadcastChannelInfo broadcast_channel_info = 58;
	optional uint32 first_leaver_accountid = 59;
	optional uint32 series_id = 60;
	optional bool low_priority = 61;
	repeated .CSODOTALobby.CExtraMsg extra_messages = 62;
	optional .CDOTASaveGame save_game = 63;
	optional bool first_blood_happened = 65;
	optional .EMatchOutcome match_outcome = 70 [default = k_EMatchOutcome_Unknown];
	optional bool mass_disconnect = 67;
	optional uint64 custom_game_id = 68;
	optional uint32 custom_min_players = 71;
	optional uint32 custom_max_players = 72;
	optional .DOTALobbyVisibility visibility = 75 [default = DOTALobbyVisibility_Public];
	optional fixed64 custom_game_crc = 76;
	optional bool custom_game_auto_created_lobby = 77;
	optional fixed32 custom_game_timestamp = 80;
	repeated uint64 previous_series_matches = 81;
	optional uint64 previous_match_override = 82;
	optional uint32 game_start_time = 87;
	optional .LobbyDotaPauseSetting pause_setting = 88 [default = LobbyDotaPauseSetting_Unlimited];
	optional uint32 weekend_tourney_division_id = 90;
	optional uint32 weekend_tourney_skill_level = 91;
	optional uint32 weekend_tourney_bracket_round = 92;
	optional .DOTABotDifficulty bot_difficulty_dire = 93 [default = BOT_DIFFICULTY_HARD];
	optional uint64 bot_radiant = 94;
	optional uint64 bot_dire = 95;
	repeated .EEvent event_progression_enabled = 96;
	optional .DOTASelectionPriorityRules selection_priority_rules = 97 [default = k_DOTASelectionPriorityRules_Manual];
	optional uint32 series_previous_selection_priority_team_id = 98;
	optional uint32 series_current_selection_priority_team_id = 99;
	optional .DOTASelectionPriorityChoice series_current_priority_team_choice = 100 [default = k_DOTASelectionPriorityChoice_Invalid];
	optional .DOTASelectionPriorityChoice series_current_non_priority_team_choice = 101 [default = k_DOTASelectionPriorityChoice_Invalid];
	optional bool series_current_selection_priority_used_coin_toss = 102;
	optional .EEvent current_primary_event = 103 [default = EVENT_ID_NONE];
	repeated uint32 emergency_disabled_hero_ids = 105;
	optional fixed64 custom_game_private_key = 106;
	optional bool custom_game_penalties = 107;
	optional string lan_host_ping_location = 109;
	optional uint32 league_node_id = 110;
	optional uint32 match_duration = 111;
	optional uint32 league_phase = 113;
	optional bool record_detailed_stats = 114;
	optional bool experimental_gameplay_enabled = 116;
	repeated .CLobbyGuildChallenge guild_challenges = 117;
	repeated .CLobbyGuildDetails guild_details = 118;
	repeated .CMsgLobbyEventPoints lobby_event_points = 119;
	repeated uint32 requested_hero_ids = 124;
	repeated .CMsgLobbyCoachFriendRequest coach_friend_requests = 125;
	optional bool is_in_steam_china = 126;
	optional bool with_scenario_save = 127;
	optional uint32 lobby_creation_time = 128;
	optional string event_game_definition = 129;
	repeated .CSODOTALobby.CExtraMsg extra_startup_messages = 130;
}
message CSODOTAGameHeroFavorites {
	optional uint32 account_id = 1 [(key_field) = true];
	optional uint32 hero_id = 2 [(key_field) = true];
}
message CSODOTAMapLocationState {
	optional uint32 account_id = 1 [(key_field) = true];
	optional int32 location_id = 2 [(key_field) = true];
	optional bool completed = 3;
}
message CSODOTAPlayerChallenge {
	optional uint32 account_id = 1 [(key_field) = true];
	optional uint32 event_id = 2 [(key_field) = true];
	optional uint32 slot_id = 3 [(key_field) = true];
	optional uint32 int_param_0 = 5;
	optional uint32 int_param_1 = 6;
	optional uint32 created_time = 7;
	optional uint32 completed = 8;
	optional uint32 sequence_id = 9;
	optional uint32 challenge_tier = 10;
	optional uint32 flags = 11;
	optional uint32 attempts = 12;
	optional uint32 complete_limit = 13;
	optional uint32 quest_rank = 14;
	optional uint32 max_quest_rank = 15;
	optional uint32 instance_id = 16;
	optional uint32 hero_id = 17;
	optional uint32 template_id = 18;
}
message CSODOTALobbyInvite {
	message LobbyMember {
		optional string name = 1;
		optional fixed64 steam_id = 2;
	}

	optional uint64 group_id = 1 [(key_field) = true];
	optional fixed64 sender_id = 2;
	optional string sender_name = 3;
	repeated .CSODOTALobbyInvite.LobbyMember members = 4;
	optional uint64 custom_game_id = 5;
	optional fixed64 invite_gid = 6;
	optional fixed64 custom_game_crc = 7;
	optional fixed32 custom_game_timestamp = 8;
}
message CSOEconGameAccountClient {
	optional uint32 additional_backpack_slots = 1 [default = 0];
	optional bool trial_account = 2 [default = false];
	optional bool eligible_for_online_play = 3 [default = true];
	optional bool need_to_choose_most_helpful_friend = 4;
	optional bool in_coaches_list = 5;
	optional fixed32 trade_ban_expiration = 6;
	optional fixed32 duel_ban_expiration = 7;
	optional bool made_first_purchase = 9 [default = false];
}
`)
Events.on("SharedObjectChanged", (typeID, reason, data) => {
	let name: string
	switch (typeID) {
		// case SOType.EconItem:
		// 	name = "CSOEconItem"
		// 	break
		case SOType.EconGameAccountClient:
			name = "CSOEconGameAccountClient"
			break
		case SOType.DropRateBonus:
			name = "CSOEconItemDropRateBonus"
			break
		case SOType.ItemTournamentPassport:
			name = "CSOEconItemTournamentPassport"
			break
		case SOType.GameAccountClient:
			name = "CSODOTAGameAccountClient"
			break
		case SOType.Party:
			name = "CSODOTAParty"
			break
		case SOType.Lobby:
			name = "CSODOTALobby"
			break
		case SOType.PartyInvite:
			name = "CSODOTAPartyInvite"
			break
		case SOType.GameHeroFavorites:
			name = "CSODOTAGameHeroFavorites"
			break
		case SOType.MapLocationState:
			name = "CSODOTAMapLocationState"
			break
		case SOType.PlayerChallenge:
			name = "CSODOTAPlayerChallenge"
			break
		case SOType.LobbyInvite:
			name = "CSODOTALobbyInvite"
			break
		default:
			return
	}
	EventsSDK.emit(
		"SharedObjectChanged",
		false,
		typeID,
		reason,
		ParseProtobufNamed(new Uint8Array(data), name)
	)
})
