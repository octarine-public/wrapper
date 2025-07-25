import { Color } from "../Base/Color"
import { NetworkedParticle } from "../Base/NetworkedParticle"
import { Vector3 } from "../Base/Vector3"
import { DOTA_CHAT_MESSAGE } from "../Enums/DOTA_CHAT_MESSAGE"
import { DOTAGameState } from "../Enums/DOTAGameState"
import { DOTAGameUIState } from "../Enums/DOTAGameUIState"
import { Team } from "../Enums/Team"
import { ScaleHeight } from "../GUI/Helpers"
import { Localization } from "../Menu/Localization"
import { ConVarsSDK } from "../Native/ConVarsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import * as WASM from "../Native/WASM"
import { Entity, GameRules, LocalPlayer, UpdateGameTime } from "../Objects/Base/Entity"
import { FakeUnit, GetPredictionTarget } from "../Objects/Base/FakeUnit"
import { PlayerResource } from "../Objects/Base/PlayerResource"
import { Unit } from "../Objects/Base/Unit"
import { AbilityData, ReloadGlobalAbilityStorage } from "../Objects/DataBook/AbilityData"
import { ReloadGlobalUnitStorage, UnitData } from "../Objects/DataBook/UnitData"
import { ParseEntityLump, ResetEntityLump } from "../Resources/ParseEntityLump"
import { ParseGNV, ResetGNV } from "../Resources/ParseGNV"
import { GameState } from "../Utils/GameState"
import {
	CMsgQuaternionToVector4,
	CMsgVectorToVector3,
	ParseProtobufDesc,
	ParseProtobufNamed,
	RecursiveProtobuf
} from "../Utils/Protobuf"
import { QuantizePlaybackRate } from "../Utils/QuantizeUtils"
import { createMapFromMergedIterators } from "../Utils/Utils"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"
import { EntityManager } from "./EntityManager"
import { Events } from "./Events"
import { QueueEvent } from "./EventsQueue"
import { EventsSDK } from "./EventsSDK"
import { InputManager } from "./InputManager"
import { StringTables } from "./StringTables"

enum PARTICLE_MESSAGE {
	GAME_PARTICLE_MANAGER_EVENT_CREATE = 0,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE = 1,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_FORWARD = 2,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_ORIENTATION = 3,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_FALLBACK = 4,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENT = 5,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_OFFSET = 6,
	GAME_PARTICLE_MANAGER_EVENT_DESTROY = 7,
	GAME_PARTICLE_MANAGER_EVENT_DESTROY_INVOLVING = 8,
	GAME_PARTICLE_MANAGER_EVENT_RELEASE = 9,
	GAME_PARTICLE_MANAGER_EVENT_LATENCY = 10,
	GAME_PARTICLE_MANAGER_EVENT_SHOULD_DRAW = 11,
	GAME_PARTICLE_MANAGER_EVENT_FROZEN = 12,
	GAME_PARTICLE_MANAGER_EVENT_CHANGE_CONTROL_POINT_ATTACHMENT = 13,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENTITY_POSITION = 14,
	GAME_PARTICLE_MANAGER_EVENT_SET_FOW_PROPERTIES = 15,
	GAME_PARTICLE_MANAGER_EVENT_SET_TEXT = 16,
	GAME_PARTICLE_MANAGER_EVENT_SET_SHOULD_CHECK_FOW = 17,
	GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_MODEL = 18,
	GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_SNAPSHOT = 19,
	GAME_PARTICLE_MANAGER_EVENT_SET_TEXTURE_ATTRIBUTE = 20,
	GAME_PARTICLE_MANAGER_EVENT_SET_SCENE_OBJECT_GENERIC_FLAG = 21,
	GAME_PARTICLE_MANAGER_EVENT_SET_SCENE_OBJECT_TINT_AND_DESAT = 22,
	GAME_PARTICLE_MANAGER_EVENT_DESTROY_NAMED = 23,
	GAME_PARTICLE_MANAGER_EVENT_SKIP_TO_TIME = 24,
	GAME_PARTICLE_MANAGER_EVENT_CAN_FREEZE = 25,
	GAME_PARTICLE_MANAGER_EVENT_SET_NAMED_VALUE_CONTEXT = 26,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_TRANSFORM = 27,
	GAME_PARTICLE_MANAGER_EVENT_FREEZE_TRANSITION_OVERRIDE = 28,
	GAME_PARTICLE_MANAGER_EVENT_FREEZE_INVOLVING = 29,
	GAME_PARTICLE_MANAGER_EVENT_ADD_MODELLIST_OVERRIDE_ELEMENT = 30,
	GAME_PARTICLE_MANAGER_EVENT_CLEAR_MODELLIST_OVERRIDE = 31,
	GAME_PARTICLE_MANAGER_EVENT_CREATE_PHYSICS_SIM = 32,
	GAME_PARTICLE_MANAGER_EVENT_DESTROY_PHYSICS_SIM = 33,
	GAME_PARTICLE_MANAGER_EVENT_SET_VDATA = 34,
	GAME_PARTICLE_MANAGER_EVENT_SET_MATERIAL_OVERRIDE = 35,
	GAME_PARTICLE_MANAGER_EVENT_ADD_FAN = 36,
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_FAN = 37,
	GAME_PARTICLE_MANAGER_EVENT_SET_CLUSTER_GROWTH = 38
}
enum EDotaEntityMessages {
	DOTA_UNIT_SPEECH = 0,
	DOTA_UNIT_SPEECH_MUTE = 1,
	DOTA_UNIT_ADD_GESTURE = 2,
	DOTA_UNIT_REMOVE_GESTURE = 3,
	DOTA_UNIT_REMOVE_ALL_GESTURES = 4,
	DOTA_UNIT_FADE_GESTURE = 6,
	DOTA_UNIT_SPEECH_CLIENTSIDE_RULES = 7
}
ParseProtobufDesc(`
message CNETMsg_Tick {
	optional uint32 tick = 1;
	optional uint32 host_computationtime = 4;
	optional uint32 host_computationtime_std_deviation = 5;
	optional uint32 legacy_host_loss = 7;
	optional uint32 host_unfiltered_frametime = 8;
	optional uint32 hltv_replay_flags = 9;
	optional uint32 expected_long_tick = 10;
	optional string expected_long_tick_reason = 11;
	optional uint32 host_frame_dropped_pct_x10 = 12;
	optional uint32 host_frame_irregular_arrival_pct_x10 = 13;
}

message CSVCMsg_GameSessionConfiguration {
	optional bool is_multiplayer = 1;
	optional bool is_loadsavegame = 2;
	optional bool is_background_map = 3;
	optional bool is_headless = 4;
	optional uint32 min_client_limit = 5;
	optional uint32 max_client_limit = 6;
	optional uint32 max_clients = 7;
	optional fixed32 tick_interval = 8;
	optional string hostname = 9;
	optional string savegamename = 10;
	optional string s1_mapname = 11;
	optional string gamemode = 12;
	optional string server_ip_address = 13;
	optional bytes data = 14;
	optional bool is_localonly = 15;
	optional bool no_steam_server = 19;
	optional bool is_transition = 16;
	optional string previouslevel = 17;
	optional string landmarkname = 18;
}

message CSVCMsg_ServerInfo {
	optional int32 protocol = 1;
	optional int32 server_count = 2;
	optional bool is_dedicated = 3;
	optional bool is_hltv = 4;
	optional int32 c_os = 6;
	optional int32 max_clients = 10;
	optional int32 max_classes = 11;
	optional int32 player_slot = 12 [default = -1];
	optional float tick_interval = 13;
	optional string game_dir = 14;
	optional string map_name = 15;
	optional string sky_name = 16;
	optional string host_name = 17;
	optional string addon_name = 18;
	optional .CSVCMsg_GameSessionConfiguration game_session_config = 19;
	optional bytes game_session_manifest = 20;
}

enum PARTICLE_MESSAGE {
	GAME_PARTICLE_MANAGER_EVENT_CREATE = 0;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE = 1;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_FORWARD = 2;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_ORIENTATION = 3;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_FALLBACK = 4;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENT = 5;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_OFFSET = 6;
	GAME_PARTICLE_MANAGER_EVENT_DESTROY = 7;
	GAME_PARTICLE_MANAGER_EVENT_DESTROY_INVOLVING = 8;
	GAME_PARTICLE_MANAGER_EVENT_RELEASE = 9;
	GAME_PARTICLE_MANAGER_EVENT_LATENCY = 10;
	GAME_PARTICLE_MANAGER_EVENT_SHOULD_DRAW = 11;
	GAME_PARTICLE_MANAGER_EVENT_FROZEN = 12;
	GAME_PARTICLE_MANAGER_EVENT_CHANGE_CONTROL_POINT_ATTACHMENT = 13;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENTITY_POSITION = 14;
	GAME_PARTICLE_MANAGER_EVENT_SET_FOW_PROPERTIES = 15;
	GAME_PARTICLE_MANAGER_EVENT_SET_TEXT = 16;
	GAME_PARTICLE_MANAGER_EVENT_SET_SHOULD_CHECK_FOW = 17;
	GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_MODEL = 18;
	GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_SNAPSHOT = 19;
	GAME_PARTICLE_MANAGER_EVENT_SET_TEXTURE_ATTRIBUTE = 20;
	GAME_PARTICLE_MANAGER_EVENT_SET_SCENE_OBJECT_GENERIC_FLAG = 21;
	GAME_PARTICLE_MANAGER_EVENT_SET_SCENE_OBJECT_TINT_AND_DESAT = 22;
	GAME_PARTICLE_MANAGER_EVENT_DESTROY_NAMED = 23;
	GAME_PARTICLE_MANAGER_EVENT_SKIP_TO_TIME = 24;
	GAME_PARTICLE_MANAGER_EVENT_CAN_FREEZE = 25;
	GAME_PARTICLE_MANAGER_EVENT_SET_NAMED_VALUE_CONTEXT = 26;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_TRANSFORM = 27;
	GAME_PARTICLE_MANAGER_EVENT_FREEZE_TRANSITION_OVERRIDE = 28;
	GAME_PARTICLE_MANAGER_EVENT_FREEZE_INVOLVING = 29;
	GAME_PARTICLE_MANAGER_EVENT_ADD_MODELLIST_OVERRIDE_ELEMENT = 30;
	GAME_PARTICLE_MANAGER_EVENT_CLEAR_MODELLIST_OVERRIDE = 31;
	GAME_PARTICLE_MANAGER_EVENT_CREATE_PHYSICS_SIM = 32;
	GAME_PARTICLE_MANAGER_EVENT_DESTROY_PHYSICS_SIM = 33;
	GAME_PARTICLE_MANAGER_EVENT_SET_VDATA = 34;
	GAME_PARTICLE_MANAGER_EVENT_SET_MATERIAL_OVERRIDE = 35;
	GAME_PARTICLE_MANAGER_EVENT_ADD_FAN = 36;
	GAME_PARTICLE_MANAGER_EVENT_UPDATE_FAN = 37;
	GAME_PARTICLE_MANAGER_EVENT_SET_CLUSTER_GROWTH = 38;
}

enum DOTA_CHAT_MESSAGE {
	CHAT_MESSAGE_INVALID = -1;
	CHAT_MESSAGE_HERO_KILL = 0;
	CHAT_MESSAGE_HERO_DENY = 1;
	CHAT_MESSAGE_BARRACKS_KILL = 2;
	CHAT_MESSAGE_TOWER_KILL = 3;
	CHAT_MESSAGE_TOWER_DENY = 4;
	CHAT_MESSAGE_FIRSTBLOOD = 5;
	CHAT_MESSAGE_STREAK_KILL = 6;
	CHAT_MESSAGE_BUYBACK = 7;
	CHAT_MESSAGE_AEGIS = 8;
	CHAT_MESSAGE_ROSHAN_KILL = 9;
	CHAT_MESSAGE_COURIER_LOST = 10;
	CHAT_MESSAGE_COURIER_RESPAWNED = 11;
	CHAT_MESSAGE_GLYPH_USED = 12;
	CHAT_MESSAGE_ITEM_PURCHASE = 13;
	CHAT_MESSAGE_CONNECT = 14;
	CHAT_MESSAGE_DISCONNECT = 15;
	CHAT_MESSAGE_DISCONNECT_WAIT_FOR_RECONNECT = 16;
	CHAT_MESSAGE_DISCONNECT_TIME_REMAINING = 17;
	CHAT_MESSAGE_DISCONNECT_TIME_REMAINING_PLURAL = 18;
	CHAT_MESSAGE_RECONNECT = 19;
	CHAT_MESSAGE_PLAYER_LEFT = 20;
	CHAT_MESSAGE_SAFE_TO_LEAVE = 21;
	CHAT_MESSAGE_RUNE_PICKUP = 22;
	CHAT_MESSAGE_RUNE_BOTTLE = 23;
	CHAT_MESSAGE_RUNE_DENY = 114;
	CHAT_MESSAGE_INTHEBAG = 24;
	CHAT_MESSAGE_SECRETSHOP = 25;
	CHAT_MESSAGE_ITEM_AUTOPURCHASED = 26;
	CHAT_MESSAGE_ITEMS_COMBINED = 27;
	CHAT_MESSAGE_SUPER_CREEPS = 28;
	CHAT_MESSAGE_CANT_USE_ACTION_ITEM = 29;
	CHAT_MESSAGE_CANTPAUSE = 31;
	CHAT_MESSAGE_NOPAUSESLEFT = 32;
	CHAT_MESSAGE_CANTPAUSEYET = 33;
	CHAT_MESSAGE_PAUSED = 34;
	CHAT_MESSAGE_UNPAUSE_COUNTDOWN = 35;
	CHAT_MESSAGE_UNPAUSED = 36;
	CHAT_MESSAGE_AUTO_UNPAUSED = 37;
	CHAT_MESSAGE_YOUPAUSED = 38;
	CHAT_MESSAGE_CANTUNPAUSETEAM = 39;
	CHAT_MESSAGE_VOICE_TEXT_BANNED = 41;
	CHAT_MESSAGE_SPECTATORS_WATCHING_THIS_GAME = 42;
	CHAT_MESSAGE_REPORT_REMINDER = 43;
	CHAT_MESSAGE_ECON_ITEM = 44;
	CHAT_MESSAGE_TAUNT = 45;
	CHAT_MESSAGE_RANDOM = 46;
	CHAT_MESSAGE_RD_TURN = 47;
	CHAT_MESSAGE_DROP_RATE_BONUS = 49;
	CHAT_MESSAGE_NO_BATTLE_POINTS = 50;
	CHAT_MESSAGE_DENIED_AEGIS = 51;
	CHAT_MESSAGE_INFORMATIONAL = 52;
	CHAT_MESSAGE_AEGIS_STOLEN = 53;
	CHAT_MESSAGE_ROSHAN_CANDY = 54;
	CHAT_MESSAGE_ITEM_GIFTED = 55;
	CHAT_MESSAGE_HERO_KILL_WITH_GREEVIL = 56;
	CHAT_MESSAGE_HOLDOUT_TOWER_DESTROYED = 57;
	CHAT_MESSAGE_HOLDOUT_WALL_DESTROYED = 58;
	CHAT_MESSAGE_HOLDOUT_WALL_FINISHED = 59;
	CHAT_MESSAGE_PLAYER_LEFT_LIMITED_HERO = 62;
	CHAT_MESSAGE_ABANDON_LIMITED_HERO_EXPLANATION = 63;
	CHAT_MESSAGE_DISCONNECT_LIMITED_HERO = 64;
	CHAT_MESSAGE_LOW_PRIORITY_COMPLETED_EXPLANATION = 65;
	CHAT_MESSAGE_RECRUITMENT_DROP_RATE_BONUS = 66;
	CHAT_MESSAGE_FROSTIVUS_SHINING_BOOSTER_ACTIVE = 67;
	CHAT_MESSAGE_PLAYER_LEFT_AFK = 73;
	CHAT_MESSAGE_PLAYER_LEFT_DISCONNECTED_TOO_LONG = 74;
	CHAT_MESSAGE_PLAYER_ABANDONED = 75;
	CHAT_MESSAGE_PLAYER_ABANDONED_AFK = 76;
	CHAT_MESSAGE_PLAYER_ABANDONED_DISCONNECTED_TOO_LONG = 77;
	CHAT_MESSAGE_WILL_NOT_BE_SCORED = 78;
	CHAT_MESSAGE_WILL_NOT_BE_SCORED_RANKED = 79;
	CHAT_MESSAGE_WILL_NOT_BE_SCORED_NETWORK = 80;
	CHAT_MESSAGE_WILL_NOT_BE_SCORED_NETWORK_RANKED = 81;
	CHAT_MESSAGE_CAN_QUIT_WITHOUT_ABANDON = 82;
	CHAT_MESSAGE_RANKED_GAME_STILL_SCORED_LEAVERS_GET_LOSS = 83;
	CHAT_MESSAGE_ABANDON_RANKED_BEFORE_FIRST_BLOOD_PARTY = 84;
	CHAT_MESSAGE_COMPENDIUM_LEVEL = 85;
	CHAT_MESSAGE_VICTORY_PREDICTION_STREAK = 86;
	CHAT_MESSAGE_ASSASSIN_ANNOUNCE = 87;
	CHAT_MESSAGE_ASSASSIN_SUCCESS = 88;
	CHAT_MESSAGE_ASSASSIN_DENIED = 89;
	CHAT_MESSAGE_VICTORY_PREDICTION_SINGLE_USER_CONFIRM = 90;
	CHAT_MESSAGE_EFFIGY_KILL = 91;
	CHAT_MESSAGE_VOICE_TEXT_BANNED_OVERFLOW = 92;
	CHAT_MESSAGE_YEAR_BEAST_KILLED = 93;
	CHAT_MESSAGE_PAUSE_COUNTDOWN = 94;
	CHAT_MESSAGE_COINS_WAGERED = 95;
	CHAT_MESSAGE_HERO_NOMINATED_BAN = 96;
	CHAT_MESSAGE_HERO_BANNED = 97;
	CHAT_MESSAGE_HERO_BAN_COUNT = 98;
	CHAT_MESSAGE_RIVER_PAINTED = 99;
	CHAT_MESSAGE_SCAN_USED = 100;
	CHAT_MESSAGE_SHRINE_KILLED = 101;
	CHAT_MESSAGE_WAGER_TOKEN_SPENT = 102;
	CHAT_MESSAGE_RANK_WAGER = 103;
	CHAT_MESSAGE_NEW_PLAYER_REMINDER = 104;
	CHAT_MESSAGE_OBSERVER_WARD_KILLED = 105;
	CHAT_MESSAGE_SENTRY_WARD_KILLED = 106;
	CHAT_MESSAGE_ITEM_PLACED_IN_NEUTRAL_STASH = 107;
	CHAT_MESSAGE_HERO_CHOICE_INVALID = 108;
	CHAT_MESSAGE_BOUNTY = 109;
	CHAT_MESSAGE_ABILITY_DRAFT_START = 110;
	CHAT_MESSAGE_HERO_FOUND_CANDY = 111;
	CHAT_MESSAGE_ABILITY_DRAFT_RANDOMED = 112;
	CHAT_MESSAGE_PRIVATE_COACH_CONNECTED = 113;
	CHAT_MESSAGE_CANT_PAUSE_TOO_EARLY = 115;
	CHAT_MESSAGE_HERO_KILL_WITH_PENGUIN = 116;
	CHAT_MESSAGE_MINIBOSS_KILL = 117;
	CHAT_MESSAGE_PLAYER_IN_GAME_BAN_TEXT = 118;
	CHAT_MESSAGE_BANNER_PLANTED = 119;
	CHAT_MESSAGE_ALCHEMIST_GRANTED_SCEPTER = 120;
	CHAT_MESSAGE_PROTECTOR_SPAWNED = 121;
	CHAT_MESSAGE_CRAFTING_XP = 122;
	CHAT_MESSAGE_ROSHAN_ROAR = 123;
}

message CUserMsg_ParticleManager {
	message ReleaseParticleIndex {
	}

	message CreateParticle {
		optional fixed64 particle_name_index = 1;
		optional int32 attach_type = 2;
		optional uint32 entity_handle = 3 [default = 16777215];
		optional uint32 entity_handle_for_modifiers = 4 [default = 16777215];
		optional bool apply_voice_ban_rules = 5;
		optional int32 team_behavior = 6;
		optional string control_point_configuration = 7;
		optional bool cluster = 8;
		optional float endcap_time = 9;
		optional .CMsgVector aggregation_position = 10;
	}

	message DestroyParticle {
		optional bool destroy_immediately = 1;
	}

	message DestroyParticleInvolving {
		optional bool destroy_immediately = 1;
		optional uint32 entity_handle = 3 [default = 16777215];
	}

	message DestroyParticleNamed {
		optional fixed64 particle_name_index = 1;
		optional uint32 entity_handle = 2 [default = 16777215];
		optional bool destroy_immediately = 3;
		optional bool play_endcap = 4;
	}

	message UpdateParticle_OBSOLETE {
		optional int32 control_point = 1;
		optional .CMsgVector position = 2;
	}

	message UpdateParticleFwd_OBSOLETE {
		optional int32 control_point = 1;
		optional .CMsgVector forward = 2;
	}

	message UpdateParticleOrient_OBSOLETE {
		optional int32 control_point = 1;
		optional .CMsgVector forward = 2;
		optional .CMsgVector deprecated_right = 3;
		optional .CMsgVector up = 4;
		optional .CMsgVector left = 5;
	}

	message UpdateParticleTransform {
		optional int32 control_point = 1;
		optional .CMsgVector position = 2;
		optional .CMsgQuaternion orientation = 3;
		optional float interpolation_interval = 4;
	}

	message UpdateParticleFallback {
		optional int32 control_point = 1;
		optional .CMsgVector position = 2;
	}

	message UpdateParticleOffset {
		optional int32 control_point = 1;
		optional .CMsgVector origin_offset = 2;
		optional .CMsgQAngle angle_offset = 3;
	}

	message UpdateParticleEnt {
		optional int32 control_point = 1;
		optional uint32 entity_handle = 2 [default = 16777215];
		optional int32 attach_type = 3;
		optional int32 attachment = 4;
		optional .CMsgVector fallback_position = 5;
		optional bool include_wearables = 6;
		optional .CMsgVector offset_position = 7;
		optional .CMsgQAngle offset_angles = 8;
	}

	message UpdateParticleSetFrozen {
		optional bool set_frozen = 1;
		optional float transition_duration = 2;
	}

	message UpdateParticleShouldDraw {
		optional bool should_draw = 1;
	}

	message ChangeControlPointAttachment {
		optional int32 attachment_old = 1;
		optional int32 attachment_new = 2;
		optional uint32 entity_handle = 3 [default = 16777215];
	}

	message UpdateEntityPosition {
		optional uint32 entity_handle = 1 [default = 16777215];
		optional .CMsgVector position = 2;
	}

	message SetParticleFoWProperties {
		optional int32 fow_control_point = 1;
		optional int32 fow_control_point2 = 2;
		optional float fow_radius = 3;
	}

	message SetParticleShouldCheckFoW {
		optional bool check_fow = 1;
	}

	message SetControlPointModel {
		optional int32 control_point = 1;
		optional string model_name = 2;
	}

	message SetControlPointSnapshot {
		optional int32 control_point = 1;
		optional string snapshot_name = 2;
	}

	message SetParticleText {
		optional string text = 1;
	}

	message SetTextureAttribute {
		optional string attribute_name = 1;
		optional string texture_name = 2;
	}

	message SetSceneObjectGenericFlag {
		optional bool flag_value = 1;
	}

	message SetSceneObjectTintAndDesat {
		optional fixed32 tint = 1;
		optional float desat = 2;
	}

	message ParticleSkipToTime {
		optional float skip_to_time = 1;
	}

	message ParticleCanFreeze {
		optional bool can_freeze = 1;
	}

	message ParticleFreezeTransitionOverride {
		optional float freeze_transition_override = 1;
	}

	message FreezeParticleInvolving {
		optional bool set_frozen = 1;
		optional float transition_duration = 2;
		optional uint32 entity_handle = 3 [default = 16777215];
	}

	message AddModellistOverrideElement {
		optional string model_name = 1;
		optional float spawn_probability = 2;
		optional uint32 groupid = 3;
	}

	message ClearModellistOverride {
		optional uint32 groupid = 1;
	}

	message SetParticleNamedValueContext {
		message FloatContextValue {
			optional uint32 value_name_hash = 1;
			optional float value = 2;
		}

		message VectorContextValue {
			optional uint32 value_name_hash = 1;
			optional .CMsgVector value = 2;
		}

		message TransformContextValue {
			optional uint32 value_name_hash = 1;
			optional .CMsgQAngle angles = 2;
			optional .CMsgVector translation = 3;
		}

		message EHandleContext {
			optional uint32 value_name_hash = 1;
			optional uint32 ent_index = 2 [default = 16777215];
		}

		repeated .CUserMsg_ParticleManager.SetParticleNamedValueContext.FloatContextValue float_values = 1;
		repeated .CUserMsg_ParticleManager.SetParticleNamedValueContext.VectorContextValue vector_values = 2;
		repeated .CUserMsg_ParticleManager.SetParticleNamedValueContext.TransformContextValue transform_values = 3;
		repeated .CUserMsg_ParticleManager.SetParticleNamedValueContext.EHandleContext ehandle_values = 4;
	}

	message CreatePhysicsSim {
		optional string prop_group_name = 1;
		optional bool use_high_quality_simulation = 2;
		optional uint32 max_particle_count = 3;
	}

	message DestroyPhysicsSim {
	}

	message SetVData {
		optional string vdata_name = 1;
	}

	message SetMaterialOverride {
		optional string material_name = 1;
		optional bool include_children = 2;
	}

	message AddFan {
		optional bool active = 1;
		optional .CMsgVector bounds_mins = 2;
		optional .CMsgVector bounds_maxs = 3;
		optional .CMsgVector fan_origin = 4;
		optional .CMsgVector fan_origin_offset = 5;
		optional .CMsgVector fan_direction = 6;
		optional float force = 7;
		optional string fan_force_curve = 8;
		optional bool falloff = 9;
		optional bool pull_towards_point = 10;
		optional float curve_min_dist = 11;
		optional float curve_max_dist = 12;
	}

	message UpdateFan {
		optional bool active = 1;
		optional .CMsgVector fan_origin = 2;
		optional .CMsgVector fan_origin_offset = 3;
		optional .CMsgVector fan_direction = 4;
		optional float fan_ramp_ratio = 7;
		optional .CMsgVector bounds_mins = 5;
		optional .CMsgVector bounds_maxs = 6;
	}

	message SetParticleClusterGrowth {
		optional float duration = 1;
		optional .CMsgVector origin = 2;
	}

	required .PARTICLE_MESSAGE type = 1 [default = GAME_PARTICLE_MANAGER_EVENT_CREATE];
	required uint32 index = 2;
	optional .CUserMsg_ParticleManager.ReleaseParticleIndex release_particle_index = 3;
	optional .CUserMsg_ParticleManager.CreateParticle create_particle = 4;
	optional .CUserMsg_ParticleManager.DestroyParticle destroy_particle = 5;
	optional .CUserMsg_ParticleManager.DestroyParticleInvolving destroy_particle_involving = 6;
	optional .CUserMsg_ParticleManager.UpdateParticle_OBSOLETE update_particle = 7;
	optional .CUserMsg_ParticleManager.UpdateParticleFwd_OBSOLETE update_particle_fwd = 8;
	optional .CUserMsg_ParticleManager.UpdateParticleOrient_OBSOLETE update_particle_orient = 9;
	optional .CUserMsg_ParticleManager.UpdateParticleFallback update_particle_fallback = 10;
	optional .CUserMsg_ParticleManager.UpdateParticleOffset update_particle_offset = 11;
	optional .CUserMsg_ParticleManager.UpdateParticleEnt update_particle_ent = 12;
	optional .CUserMsg_ParticleManager.UpdateParticleShouldDraw update_particle_should_draw = 14;
	optional .CUserMsg_ParticleManager.UpdateParticleSetFrozen update_particle_set_frozen = 15;
	optional .CUserMsg_ParticleManager.ChangeControlPointAttachment change_control_point_attachment = 16;
	optional .CUserMsg_ParticleManager.UpdateEntityPosition update_entity_position = 17;
	optional .CUserMsg_ParticleManager.SetParticleFoWProperties set_particle_fow_properties = 18;
	optional .CUserMsg_ParticleManager.SetParticleText set_particle_text = 19;
	optional .CUserMsg_ParticleManager.SetParticleShouldCheckFoW set_particle_should_check_fow = 20;
	optional .CUserMsg_ParticleManager.SetControlPointModel set_control_point_model = 21;
	optional .CUserMsg_ParticleManager.SetControlPointSnapshot set_control_point_snapshot = 22;
	optional .CUserMsg_ParticleManager.SetTextureAttribute set_texture_attribute = 23;
	optional .CUserMsg_ParticleManager.SetSceneObjectGenericFlag set_scene_object_generic_flag = 24;
	optional .CUserMsg_ParticleManager.SetSceneObjectTintAndDesat set_scene_object_tint_and_desat = 25;
	optional .CUserMsg_ParticleManager.DestroyParticleNamed destroy_particle_named = 26;
	optional .CUserMsg_ParticleManager.ParticleSkipToTime particle_skip_to_time = 27;
	optional .CUserMsg_ParticleManager.ParticleCanFreeze particle_can_freeze = 28;
	optional .CUserMsg_ParticleManager.SetParticleNamedValueContext set_named_value_context = 29;
	optional .CUserMsg_ParticleManager.UpdateParticleTransform update_particle_transform = 30;
	optional .CUserMsg_ParticleManager.ParticleFreezeTransitionOverride particle_freeze_transition_override = 31;
	optional .CUserMsg_ParticleManager.FreezeParticleInvolving freeze_particle_involving = 32;
	optional .CUserMsg_ParticleManager.AddModellistOverrideElement add_modellist_override_element = 33;
	optional .CUserMsg_ParticleManager.ClearModellistOverride clear_modellist_override = 34;
	optional .CUserMsg_ParticleManager.CreatePhysicsSim create_physics_sim = 35;
	optional .CUserMsg_ParticleManager.DestroyPhysicsSim destroy_physics_sim = 36;
	optional .CUserMsg_ParticleManager.SetVData set_vdata = 37;
	optional .CUserMsg_ParticleManager.SetMaterialOverride set_material_override = 38;
	optional .CUserMsg_ParticleManager.AddFan add_fan = 39;
	optional .CUserMsg_ParticleManager.UpdateFan update_fan = 40;
	optional .CUserMsg_ParticleManager.SetParticleClusterGrowth set_particle_cluster_growth = 41;
}

enum EDotaEntityMessages {
	DOTA_UNIT_SPEECH = 0;
	DOTA_UNIT_SPEECH_MUTE = 1;
	DOTA_UNIT_ADD_GESTURE = 2;
	DOTA_UNIT_REMOVE_GESTURE = 3;
	DOTA_UNIT_REMOVE_ALL_GESTURES = 4;
	DOTA_UNIT_FADE_GESTURE = 6;
	DOTA_UNIT_SPEECH_CLIENTSIDE_RULES = 7;
}

message CDOTAResponseQuerySerialized {
	message Fact {
		enum ValueType {
			NUMERIC = 1;
			STRING = 2;
			STRINGTABLE_INDEX = 3;
			INT_NUMERIC = 4;
		}

		required int32 key = 1;
		required .CDOTAResponseQuerySerialized.Fact.ValueType valtype = 2 [default = NUMERIC];
		optional float val_numeric = 3;
		optional string val_string = 4;
		optional int32 val_stringtable_index = 5;
		optional sint32 val_int_numeric = 6;
	}

	repeated .CDOTAResponseQuerySerialized.Fact facts = 1;
}

message CDOTASpeechMatchOnClient {
	optional int32 speech_concept = 1;
	optional int32 recipient_type = 2;
	optional .CDOTAResponseQuerySerialized responsequery = 3;
	optional sfixed32 randomseed = 4 [default = 0];
}

message CDOTAUserMsg_UnitEvent {
	message Interval {
		optional float start = 1;
		optional float range = 2;
	}

	message Speech {
		optional int32 speech_concept = 1;
		optional string response = 2;
		optional int32 recipient_type = 3;
		optional bool muteable = 5 [default = false];
		optional .CDOTAUserMsg_UnitEvent.Interval predelay = 6;
		optional uint32 flags = 7;
		optional int32 response_type = 8;
	}

	message SpeechMute {
		optional float delay = 1 [default = 0.5];
	}

	message AddGesture {
		optional int32 activity = 1;
		optional int32 slot = 2;
		optional float fade_in = 3 [default = 0];
		optional float fade_out = 4 [default = 0.1];
		optional float playback_rate = 5 [default = 1];
		optional int32 sequence_variant = 6;
	}

	message RemoveGesture {
		optional int32 activity = 1;
	}

	message BloodImpact {
		optional int32 scale = 1;
		optional int32 x_normal = 2;
		optional int32 y_normal = 3;
	}

	message FadeGesture {
		optional int32 activity = 1;
	}

	required .EDotaEntityMessages msg_type = 1 [default = DOTA_UNIT_SPEECH];
	required int32 entity_index = 2;
	optional .CDOTAUserMsg_UnitEvent.Speech speech = 3;
	optional .CDOTAUserMsg_UnitEvent.SpeechMute speech_mute = 4;
	optional .CDOTAUserMsg_UnitEvent.AddGesture add_gesture = 5;
	optional .CDOTAUserMsg_UnitEvent.RemoveGesture remove_gesture = 6;
	optional .CDOTAUserMsg_UnitEvent.BloodImpact blood_impact = 7;
	optional .CDOTAUserMsg_UnitEvent.FadeGesture fade_gesture = 8;
	optional .CDOTASpeechMatchOnClient speech_match_on_client = 9;
}

message CDOTAUserMsg_ChatEvent {
	required .DOTA_CHAT_MESSAGE type = 1 [default = CHAT_MESSAGE_INVALID];
	optional uint32 value = 2;
	optional sint32 playerid_1 = 3 [default = -1];
	optional sint32 playerid_2 = 4 [default = -1];
	optional sint32 playerid_3 = 5 [default = -1];
	optional sint32 playerid_4 = 6 [default = -1];
	optional sint32 playerid_5 = 7 [default = -1];
	optional sint32 playerid_6 = 8 [default = -1];
	optional uint32 value2 = 9;
	optional uint32 value3 = 10;
	optional float time = 11;
}

message CDOTAUserMsg_TE_UnitAnimation {
	optional uint32 entity = 1 [default = 16777215];
	optional int32 sequence_variant = 2;
	optional float playbackrate = 3;
	optional float castpoint = 4;
	optional int32 type = 5;
	optional int32 activity = 6;
	optional float lag_compensation_time = 7;
}

message CDOTAUserMsg_TE_UnitAnimationEnd {
	optional uint32 entity = 1 [default = 16777215];
	optional bool snap = 2;
}

message CMsgSosStartSoundEvent {
	optional int32 soundevent_guid = 1;
	optional fixed32 soundevent_hash = 2;
	optional int32 source_entity_index = 3 [default = -1];
	optional int32 seed = 4;
	optional bytes packed_params = 5;
	optional float start_time = 6;
}

message CMsgSosStopSoundEvent {
	optional int32 soundevent_guid = 1;
}

message CMsgSosStopSoundEventHash {
	optional fixed32 soundevent_hash = 1;
	optional int32 source_entity_index = 2 [default = -1];
}

message CMsgSosSetSoundEventParams {
	optional int32 soundevent_guid = 1;
	optional bytes packed_params = 5;
}

message CMsgSosSetLibraryStackFields {
	optional fixed32 stack_hash = 1;
	optional bytes packed_fields = 5;
}
`)

function HandleParticleMsg(msg: RecursiveProtobuf): void {
	const index = msg.get("index") as number
	const par = NetworkedParticle.Instances.get(index)
	const msgType = msg.get("type") as PARTICLE_MESSAGE
	let changedEntPos = false
	let changedEnt: Nullable<FakeUnit | Unit>
	switch (msgType) {
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENTITY_POSITION: {
			const submsg = msg.get("update_entity_position") as RecursiveProtobuf
			const position = CMsgVectorToVector3(
					submsg.get("position") as RecursiveProtobuf
				),
				entID = submsg.get("entity_handle") as number
			const ent = GetPredictionTarget(entID, false, par?.PathNoEcon ?? "")
			if (ent !== undefined) {
				ent.LastRealPredictedPositionUpdate = GameState.RawGameTime
				ent.LastPredictedPositionUpdate = GameState.RawGameTime
				ent.PredictedPosition.CopyFrom(position)
				changedEntPos = true
				changedEnt = ent
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENT: {
			const submsg = msg.get("update_particle_ent") as RecursiveProtobuf
			const entID = submsg.get("entity_handle") as number,
				position = CMsgVectorToVector3(
					submsg.get("fallback_position") as RecursiveProtobuf
				)
			const ent = GetPredictionTarget(entID, false, par?.PathNoEcon ?? "")
			if (ent !== undefined) {
				ent.LastRealPredictedPositionUpdate = GameState.RawGameTime
				ent.LastPredictedPositionUpdate = GameState.RawGameTime
				ent.PredictedPosition.CopyFrom(position)
				changedEntPos = true
				changedEnt = ent
			}
			break
		}
		default:
			break
	}

	if (
		par === undefined &&
		msgType === PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CREATE
	) {
		const submsg = msg.get("create_particle") as RecursiveProtobuf
		const particleSystemHandle = submsg.get("particle_name_index") as bigint,
			entID = submsg.get("entity_handle") as number,
			modifiersEntID = submsg.get("entity_handle_for_modifiers") as number
		const path =
			particleSystemHandle !== undefined
				? GetPathByHash(particleSystemHandle)
				: undefined
		if (path !== undefined) {
			const newClass = new NetworkedParticle(
				index,
				path,
				particleSystemHandle,
				submsg.get("attach_type") as number,
				GetPredictionTarget(entID, false, path),
				GetPredictionTarget(modifiersEntID, false, path)
			)
			EventsSDK.emit("ParticleCreated", false, newClass)
		} else {
			console.log(
				GameState.RawGameTime,
				`Received unknown particleSystemHandle ${particleSystemHandle} for particle ${index}`
			)
		}
	}

	if (par === undefined) {
		if (changedEnt !== undefined) {
			EventsSDK.emit("ParticleUnitPositionUpdated", false, changedEnt, undefined)
		}
		return
	}

	switch (msgType) {
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_DESTROY: {
			const submsg = msg.get("destroy_particle") as RecursiveProtobuf
			const destroyImmediately = submsg.get("destroy_immediately") as boolean
			if (!destroyImmediately && par.EndTime !== -1) {
				par.Released = true
				EventsSDK.emit("ParticleReleased", false, par)
			} else {
				par.Destroy()
			}
			return
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_DESTROY_INVOLVING: {
			const submsg = msg.get("destroy_particle_involving") as RecursiveProtobuf
			const destroyImmediately = submsg.get("destroy_immediately") as boolean
			// TODO: entity_handle?
			if (!destroyImmediately && par.EndTime !== -1) {
				par.Released = true
				EventsSDK.emit("ParticleReleased", false, par)
			} else {
				par.Destroy()
			}
			return
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_RELEASE: {
			if (par.EndTime !== -1) {
				par.Released = true
				EventsSDK.emit("ParticleReleased", false, par)
			} else {
				par.Destroy()
			}
			return
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE: {
			const submsg = msg.get("update_particle") as RecursiveProtobuf
			par.ControlPoints.set(
				submsg.get("control_point") as number,
				CMsgVectorToVector3(submsg.get("position") as RecursiveProtobuf)
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_FORWARD: {
			const submsg = msg.get("update_particle_fwd") as RecursiveProtobuf
			par.ControlPointsForward.set(
				submsg.get("control_point") as number,
				CMsgVectorToVector3(submsg.get("forward") as RecursiveProtobuf)
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ORIENTATION: {
			const submsg = msg.get("update_particle_orient") as RecursiveProtobuf
			par.ControlPointsOrient.set(submsg.get("control_point") as number, [
				CMsgVectorToVector3(submsg.get("forward") as RecursiveProtobuf),
				CMsgVectorToVector3(submsg.get("up") as RecursiveProtobuf),
				CMsgVectorToVector3(submsg.get("left") as RecursiveProtobuf)
			])
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_FALLBACK: {
			const submsg = msg.get("update_particle_fallback") as RecursiveProtobuf,
				cp = submsg.get("control_point") as number,
				position = CMsgVectorToVector3(
					submsg.get("position") as RecursiveProtobuf
				)
			par.ControlPointsFallback.set(cp, position)
			const cpEnt = par.ControlPointsEnt.get(cp)
			if (cpEnt !== undefined) {
				cpEnt[0].LastRealPredictedPositionUpdate = GameState.RawGameTime
				cpEnt[0].LastPredictedPositionUpdate = GameState.RawGameTime
				cpEnt[0].PredictedPosition.CopyFrom(position)
				changedEntPos = true
				changedEnt = cpEnt[0]
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENT: {
			const submsg = msg.get("update_particle_ent") as RecursiveProtobuf
			const entID = submsg.get("entity_handle") as number,
				cp = submsg.get("control_point") as number,
				position = CMsgVectorToVector3(
					submsg.get("fallback_position") as RecursiveProtobuf
				)
			const ent = GetPredictionTarget(entID, false, par.PathNoEcon)
			if (ent !== undefined) {
				par.ControlPointsEnt.set(cp, [
					ent,
					submsg.get("attach_type") as number,
					submsg.get("attachment") as number,
					submsg.get("include_wearables") as boolean
				])
			}
			par.ControlPointsFallback.set(cp, position)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_OFFSET: {
			const submsg = msg.get("update_particle_offset") as RecursiveProtobuf
			par.ControlPointsOffset.set((submsg.get("control_point") as number) ?? 0, [
				CMsgVectorToVector3(submsg.get("origin_offset") as RecursiveProtobuf),
				CMsgVectorToVector3(submsg.get("angle_offset") as RecursiveProtobuf)
			])
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SHOULD_DRAW: {
			const submsg = msg.get("update_particle_should_draw") as RecursiveProtobuf
			par.ShouldDraw = submsg.get("should_draw") as boolean
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_FROZEN: {
			const submsg = msg.get("update_particle_set_frozen") as RecursiveProtobuf
			if (submsg.get("set_frozen") as boolean) {
				if (par.FrozenAt === -1) {
					par.FrozenAt = GameState.RawGameTime
				}
			} else {
				par.FrozenAt = -1
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CHANGE_CONTROL_POINT_ATTACHMENT: {
			const submsg = msg.get("change_control_point_attachment") as RecursiveProtobuf
			const attachmentOld = (submsg.get("attachment_old") as number) ?? 0,
				attachmentNew = (submsg.get("attachment_new") as number) ?? 0,
				entID = submsg.get("entity_handle") as number
			const ent = EntityManager.EntityByIndex(entID) ?? entID
			let changedAnything = false
			par.ControlPointsEnt.forEach(data => {
				if (data[2] === attachmentOld && data[0] === ent) {
					data[2] = attachmentNew
					changedAnything = true
				}
			})
			if (!changedAnything) {
				return
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENTITY_POSITION: {
			const submsg = msg.get("update_entity_position") as RecursiveProtobuf
			const position = CMsgVectorToVector3(
					submsg.get("position") as RecursiveProtobuf
				),
				entID = submsg.get("entity_handle") as number
			const ent = EntityManager.EntityByIndex(entID) ?? entID
			let changedAnything = false
			par.ControlPointsEnt.forEach((data, cp) => {
				if (data[0] === ent) {
					par.ControlPointsFallback.set(cp, position)
					changedAnything = true
				}
			})
			if (!changedAnything) {
				return
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_FOW_PROPERTIES: {
			// const submsg = msg.get("set_particle_fow_properties") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_TEXT: {
			const submsg = msg.get("set_particle_text") as RecursiveProtobuf
			par.Text = (submsg.get("text") as string) ?? ""
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_SHOULD_CHECK_FOW: {
			// const submsg = msg.get("set_particle_should_check_fow") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_MODEL: {
			const submsg = msg.get("set_control_point_model") as RecursiveProtobuf
			par.ControlPointsModel.set(
				(submsg.get("control_point") as number) ?? 0,
				(submsg.get("model_name") as string) ?? ""
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_SNAPSHOT: {
			const submsg = msg.get("set_control_point_snapshot") as RecursiveProtobuf
			par.ControlPointsSnapshot.set(
				(submsg.get("control_point") as number) ?? 0,
				(submsg.get("snapshot_name") as string) ?? ""
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_TEXTURE_ATTRIBUTE: {
			const submsg = msg.get("set_texture_attribute") as RecursiveProtobuf
			par.TextureAttributes.set(
				(submsg.get("attribute_name") as string) ?? "",
				(submsg.get("texture_name") as string) ?? ""
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_SCENE_OBJECT_GENERIC_FLAG: {
			// const submsg = msg.get("set_scene_object_generic_flag") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_SCENE_OBJECT_TINT_AND_DESAT: {
			// const submsg = msg.get("set_scene_object_tint_and_desat") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_DESTROY_NAMED: {
			// const submsg = msg.get("destroy_particle_named") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SKIP_TO_TIME: {
			// const submsg = msg.get("particle_skip_to_time") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CAN_FREEZE: {
			// const submsg = msg.get("particle_can_freeze") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_NAMED_VALUE_CONTEXT: {
			// const submsg = msg.get("set_named_value_context") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_TRANSFORM: {
			const submsg = msg.get("update_particle_transform") as RecursiveProtobuf,
				cp = submsg.get("control_point") as number,
				orientation = submsg.get("orientation") as Nullable<RecursiveProtobuf>

			par.ControlPoints.set(
				cp,
				CMsgVectorToVector3(submsg.get("position") as RecursiveProtobuf)
			)

			if (orientation !== undefined && orientation.size !== 0) {
				par.ControlPointsQuaternion.set(cp, CMsgQuaternionToVector4(orientation))
			}

			// par.ControlPointsForward.set(
			// 	cp,
			// 	CMsgVectorToVector3(submsg.get("orientation") as RecursiveProtobuf)
			// )
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_FREEZE_TRANSITION_OVERRIDE: {
			// const submsg = msg.get("particle_freeze_transition_override") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_FREEZE_INVOLVING: {
			// const submsg = msg.get("freeze_particle_involving") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_ADD_MODELLIST_OVERRIDE_ELEMENT: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CLEAR_MODELLIST_OVERRIDE: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CREATE_PHYSICS_SIM: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_DESTROY_PHYSICS_SIM: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_VDATA: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_MATERIAL_OVERRIDE: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_ADD_FAN: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_FAN: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_CLUSTER_GROWTH: {
			// const submsg = msg.get("") as RecursiveProtobuf
			break
		}
		default:
			console.log(
				GameState.RawGameTime,
				`Received unknown PARTICLE_MESSAGE ${msgType} for particle ${index}`
			)
			return
	}
	EventsSDK.emit("ParticleUpdated", false, par)
	if (changedEntPos) {
		EventsSDK.emit("ParticleUnitPositionUpdated", false, changedEnt, par)
	}
}

Events.on("ServerMessage", (msgID, buf_) => {
	switch (msgID) {
		case 4: {
			const msg = ParseProtobufNamed(new Uint8Array(buf_), "CNETMsg_Tick")
			EventsSDK.emit(
				"ServerTick",
				false,
				msg.get("tick") as number,
				msg.get("host_computationtime") as number,
				msg.get("host_computationtime_std_deviation") as number,
				msg.get("legacy_host_loss") as number,
				msg.get("host_unfiltered_frametime") as string,
				msg.get("hltv_replay_flags") as number,
				msg.get("expected_long_tick") as number,
				msg.get("expected_long_tick_reason") as string,
				msg.get("host_frame_dropped_pct_x10") as number,
				msg.get("host_frame_irregular_arrival_pct_x10") as number
			)
			break
		}
		case 40:
			EventsSDK.emit(
				"ServerInfo",
				false,
				ParseProtobufNamed(new Uint8Array(buf_), "CSVCMsg_ServerInfo")
			)
			break
		case 45: {
			// we have custom parsing for CSVCMsg_CreateStringTable & CSVCMsg_UpdateStringTable
			const stream = new ViewBinaryStream(new DataView(buf_))
			const tableName = stream.ReadVarString(),
				update = new Map<number, [string, ArrayBufferLike]>()
			while (!stream.Empty()) {
				update.set(stream.ReadVarUintAsNumber(), [
					stream.ReadVarString(),
					stream.ReadSlice(stream.ReadVarUintAsNumber()).buffer
				])
			}
			EventsSDK.emit("UpdateStringTable", false, tableName, update)
			break
		}
		case 51:
			EventsSDK.emit("RemoveAllStringTables", false)
			break
		case 145:
			QueueEvent(() => {
				HandleParticleMsg(
					ParseProtobufNamed(new Uint8Array(buf_), "CUserMsg_ParticleManager")
				)
			})
			break
		case 208: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CMsgSosStartSoundEvent"
				)
				const hash = msg.get("soundevent_hash") as number
				const soundName = LookupSoundNameByHash(hash)
				if (soundName === undefined) {
					// console.log(`Unknown soundname hash: ${hash}`)
					return
				}
				const handle = (msg.get("source_entity_index") as number) ?? 0,
					seed = (msg.get("seed") as number) ?? 0,
					startTime = (msg.get("start_time") as number) ?? -1,
					packedParams = msg.get("packed_params") as Nullable<Uint8Array>

				const ent = GetPredictionTarget(handle),
					position = new Vector3()

				if (packedParams !== undefined && packedParams.byteLength >= 19) {
					const stream = new ViewBinaryStream(
						new DataView(
							packedParams.buffer,
							packedParams.byteOffset,
							packedParams.byteLength
						)
					)
					stream.RelativeSeek(7)
					position.x = stream.ReadFloat32()
					position.y = stream.ReadFloat32()
					position.z = stream.ReadFloat32()
				}
				EventsSDK.emit(
					"StartSound",
					false,
					soundName,
					ent,
					position,
					seed,
					startTime
				)
			})
			break
		}
		case 488: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_UnitEvent"
				)
				const handle = msg.get("entity_index") as number
				const ent = GetPredictionTarget(handle)
				if (ent instanceof Entity && !(ent instanceof Unit)) {
					return
				}
				switch (msg.get("msg_type") as EDotaEntityMessages) {
					case EDotaEntityMessages.DOTA_UNIT_SPEECH: {
						const submsg = msg.get("speech") as RecursiveProtobuf,
							predelay = submsg.get("predelay") as RecursiveProtobuf
						EventsSDK.emit(
							"UnitSpeech",
							false,
							ent,
							submsg.get("speech_concept") as number,
							submsg.get("response") as string,
							submsg.get("recipient_type") as number,
							submsg.get("muteable") as boolean,
							(predelay?.get("start") as number) ?? 0,
							(predelay?.get("range") as number) ?? 0,
							submsg.get("flags") as number,
							submsg.get("response_type") as number
						)
						break
					}
					case EDotaEntityMessages.DOTA_UNIT_SPEECH_MUTE: {
						const submsg = msg.get("speech_mute") as RecursiveProtobuf
						EventsSDK.emit(
							"UnitSpeechMute",
							false,
							ent,
							(submsg?.get("delay") as number) ?? 0
						)
						break
					}
					case EDotaEntityMessages.DOTA_UNIT_ADD_GESTURE: {
						const submsg = msg.get("add_gesture") as RecursiveProtobuf
						EventsSDK.emit(
							"UnitAddGesture",
							false,
							ent,
							submsg.get("activity") as number,
							submsg.get("slot") as number,
							submsg.get("fade_in") as number,
							submsg.get("fade_out") as number,
							submsg.get("playback_rate") as number,
							submsg.get("sequence_variant") as number
						)
						break
					}
					case EDotaEntityMessages.DOTA_UNIT_REMOVE_GESTURE: {
						const submsg = msg.get("remove_gesture") as RecursiveProtobuf
						EventsSDK.emit(
							"UnitRemoveGesture",
							false,
							ent,
							submsg.get("activity") as number
						)
						break
					}
					case EDotaEntityMessages.DOTA_UNIT_REMOVE_ALL_GESTURES:
						EventsSDK.emit("UnitRemoveAllGestures", false, ent)
						break
					case EDotaEntityMessages.DOTA_UNIT_FADE_GESTURE: {
						const submsg = msg.get("fade_gesture") as RecursiveProtobuf
						EventsSDK.emit(
							"UnitFadeGesture",
							false,
							ent,
							submsg.get("activity") as number
						)
						break
					}
				}
			})
			break
		}
		case 466: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_ChatEvent"
				)
				EventsSDK.emit(
					"ChatEvent",
					false,
					msg.get("type") as DOTA_CHAT_MESSAGE,
					msg.get("value") as number,
					msg.get("playerid_1") as number,
					msg.get("playerid_2") as number,
					msg.get("playerid_3") as number,
					msg.get("playerid_4") as number,
					msg.get("playerid_5") as number,
					msg.get("playerid_6") as number,
					msg.get("value2") as number,
					msg.get("value3") as number
				)
			})
			break
		}
		case 521: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_TE_UnitAnimation"
				)
				const ent = GetPredictionTarget(msg.get("entity") as number)
				const type = msg.get("type") as number
				let rawCastPoint = msg.get("castpoint") as number,
					castPoint =
						Math.ceil(rawCastPoint / GameState.TickInterval) *
						GameState.TickInterval
				if (
					type === 0 &&
					ent instanceof Unit &&
					!ConVarsSDK.GetBoolean(
						"dota_disable_add_fractional_attack_time",
						false
					) &&
					ent.AttackTimeAtLastTick !== 0 &&
					GameState.RawServerTime - ent.AttackTimeAtLastTick < ent.AttackRate
				) {
					rawCastPoint -= ent.AttackTimeLostToLastTick
					castPoint =
						Math.ceil(rawCastPoint / GameState.TickInterval) *
						GameState.TickInterval
				}
				EventsSDK.emit(
					"UnitAnimation",
					false,
					ent,
					msg.get("sequence_variant") as number,
					QuantizePlaybackRate(msg.get("playbackrate") as number),
					castPoint,
					type,
					msg.get("activity") as number,
					(msg.get("lag_compensation_time") as Nullable<number>) ?? 0,
					rawCastPoint
				)
			})
			break
		}
		case 522: {
			QueueEvent(() => {
				const msg = ParseProtobufNamed(
					new Uint8Array(buf_),
					"CDOTAUserMsg_TE_UnitAnimationEnd"
				)
				const ent = GetPredictionTarget(msg.get("entity") as number, true)
				if (ent === undefined) {
					return
				}
				EventsSDK.emit("UnitAnimationEnd", false, ent, msg.get("snap") as boolean)
			})
			break
		}
		default:
			break
	}
})

ParseProtobufDesc(`
enum EMatchGroupServerStatus {
	k_EMatchGroupServerStatus_OK = 0;
	k_EMatchGroupServerStatus_LimitedAvailability = 1;
	k_EMatchGroupServerStatus_Offline = 2;
}
message CMsgMatchmakingMatchGroupInfo {
	optional uint32 players_searching = 1;
	optional sint32 auto_region_select_ping_penalty = 2;
	optional sint32 auto_region_select_ping_penalty_custom = 4;
	optional .EMatchGroupServerStatus status = 3 [default = k_EMatchGroupServerStatus_OK];
}
message CMsgDOTAMatchmakingStatsResponse {
	optional uint32 matchgroups_version = 1;
	repeated uint32 legacy_searching_players_by_group_source2 = 7;
	repeated .CMsgMatchmakingMatchGroupInfo match_groups = 8;
}
`)
Events.on("MatchmakingStatsUpdated", data => {
	EventsSDK.emit(
		"MatchmakingStatsUpdated",
		false,
		ParseProtobufNamed(new Uint8Array(data), "CMsgDOTAMatchmakingStatsResponse")
	)
})

Events.on("GameEvent", (name, obj) =>
	QueueEvent(() => EventsSDK.emit("GameEvent", false, name, obj))
)

let inputCaptureDepth = 0
Events.on("InputCaptured", isCaptured => {
	if (isCaptured) {
		inputCaptureDepth++
	} else {
		inputCaptureDepth = Math.max(inputCaptureDepth - 1, 0)
	}
	EventsSDK.emit("InputCaptured", false, inputCaptureDepth !== 0)
})

EventsSDK.on("InputCaptured", isCaptured => (GameState.IsInputCaptured = isCaptured))
EventsSDK.on("ServerTick", tick => {
	GameState.CurrentServerTick = tick
	GameState.RawServerTime = tick * GameState.TickInterval
	UpdateGameTime()
})
Events.on("UIStateChanged", newState => (GameState.UIState = newState))

function TryLoadMapFiles(): void {
	const mapName = GameState.MapName
	if (mapName !== "<empty>") {
		WASM.ParseVHCG()
	} else {
		WASM.ResetVHCG()
	}
	{
		const buf = fread(`maps/${mapName}.gnv`, true)
		if (buf !== undefined) {
			ParseGNV(new ViewBinaryStream(new DataView(buf)))
		} else {
			ResetGNV()
		}
	}
	{
		ResetEntityLump()
		const worldKV = parseKV(`maps/${mapName}/world.vwrld_c`)
		const entityLumps = worldKV.get("m_entityLumps")
		if (entityLumps instanceof Map || Array.isArray(entityLumps)) {
			entityLumps.forEach((path: RecursiveMapValue) => {
				if (typeof path === "string") {
					ParseEntityLump(path)
				}
			})
		}
		EventsSDK.emit("MapDataLoaded", false)
	}
}

EventsSDK.on("ServerInfo", info => {
	let mapName = (info.get("map_name") as string) ?? "<empty>"
	if (mapName === "start") {
		mapName = "dota"
	}
	GameState.MapName = mapName
	const addonName = (info.get("addon_name") as string) ?? ""
	GameState.AddonName = addonName
	GameState.IsDedicatedServer = (info.get("is_dedicated") as boolean) ?? false

	TryLoadMapFiles()
	ReloadGlobalUnitStorage()
	ReloadGlobalAbilityStorage()

	// TODO: load other languages as well
	const arrLanguage = ["russian", "english"]
	for (let i = 0, end = arrLanguage.length; i < end; i++) {
		const language = arrLanguage[i]
		// automatically localize units, abilities and items in menu
		const namesMapping = new Map<string, string>()
		const langTokens = ((
			createMapFromMergedIterators<string, RecursiveMapValue>(
				parseKV(`resource/localization/abilities_${language}.txt`).entries(),
				parseKV(`resource/localization/dota_${language}.txt`).entries(),
				parseKV(`resource/addon_${language}.txt`).entries(),
				parseKV(`panorama/localization/addon_${language}.txt`).entries()
			).get("lang") as RecursiveMap
		)?.get("Tokens") ?? new Map()) as Map<string, string>

		UnitData.globalStorage.forEach((data, name) => {
			const langToken = langTokens.get(name)
			namesMapping.set(name, langToken ?? data.WorkshopName)
		})

		AbilityData.globalStorage.forEach((_, name) => {
			const langToken =
				langTokens.get(`DOTA_Tooltip_ability_${name}`) ??
				langTokens.get(`DOTA_Tooltip_Ability_${name}`)
			if (langToken !== undefined) {
				namesMapping.set(name, langToken)
			}
		})

		langTokens.forEach((val, key) => {
			if (
				key.startsWith("dota_matchgroup_") ||
				key.startsWith("DOTA_TopBar_LaneSelection")
			) {
				namesMapping.set(key, val)
			}
		})

		Localization.AddLocalizationUnit(language, namesMapping)
	}
	EventsSDK.emit("UnitAbilityDataUpdated", false)
})

const text =
	"Currently, the cheat does not work correctly in the local lobby, to configure and test, create a lobby on Valve servers."

EventsSDK.on("Draw", () => {
	if (GameState.IsDedicatedServer || !GameState.IsConnected) {
		return
	}
	if (GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME) {
		return
	}
	if (
		StringTables.Size !== 0 ||
		(GameRules !== undefined &&
			GameRules.GameState <=
				DOTAGameState.DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD)
	) {
		return
	}
	const size = ScaleHeight(24)
	const wSize = RendererSDK.WindowSize.Clone()
	const windowSize = wSize.DivideScalar(2)
	const textSize = RendererSDK.GetTextSize(
		Localization.Localize(text),
		RendererSDK.DefaultFontName,
		size,
		600
	)
	const position = windowSize.SubtractScalarY(wSize.y / 2 - textSize.y / 2)
	position.SubtractScalarX(textSize.x / 2)
	position.AddScalarY(ScaleHeight(100))
	RendererSDK.Text(
		Localization.Localize(text),
		position,
		Color.White,
		RendererSDK.DefaultFontName,
		size,
		600
	)
})

function GetLocalTeam(): Team {
	const player = LocalPlayer
	if (player === undefined) {
		return Team.Observer
	}

	let team = player.Team
	if (team === Team.Observer) {
		const playerid = player.PlayerID
		if (playerid !== -1) {
			const data = PlayerResource?.PlayerData[playerid]
			if (data !== undefined) {
				const coachTeam = data.CoachTeam
				if (coachTeam === Team.Invalid || coachTeam === Team.None) {
					team = data.LiveSpectatorTeam
					if (team === Team.Invalid || team === Team.None) {
						team = Team.Observer
					}
				} else {
					team = coachTeam
				}
			}
		}
	}
	return team
}

function UpdateLocalTeam() {
	const team = GetLocalTeam()
	if (GameState.LocalTeam !== team) {
		GameState.LocalTeam = team
		EventsSDK.emit("LocalTeamChanged", false)
	}
}

EventsSDK.on("EntityTeamChanged", ent => {
	if (ent === LocalPlayer) {
		UpdateLocalTeam()
	}
})

EventsSDK.on("PlayerResourceUpdated", () => UpdateLocalTeam())

EventsSDK.on("PlayerCustomDataUpdated", () => UpdateLocalTeam())

Events.on("Draw", (visualData, w, h, x, y) => {
	InputManager.UpdateCursorOnScreen(x, y)
	RendererSDK.BeforeDraw(w, h)
	const stream = new ViewBinaryStream(new DataView(visualData))
	while (!stream.Empty()) {
		const entID = stream.ReadUint32()
		const ent = EntityManager.EntityByIndex(entID)
		if (ent === undefined) {
			stream.RelativeSeek(2 * 3 * 4)
			continue
		}
		ent.VisualPosition.x = stream.ReadFloat32()
		ent.VisualPosition.y = stream.ReadFloat32()
		ent.VisualPosition.z = stream.ReadFloat32()
		ent.VisualAngles.x = stream.ReadFloat32()
		ent.VisualAngles.y = stream.ReadFloat32()
		ent.VisualAngles.z = stream.ReadFloat32()
	}
	GameState.IsInDraw = true
	EventsSDK.emit("PreDraw")
	EventsSDK.emit("Draw")
	GameState.IsInDraw = false
})
