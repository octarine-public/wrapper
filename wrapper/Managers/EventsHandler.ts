import Matrix4x4 from "../Base/Matrix4x4"
import NetworkedParticle from "../Base/NetworkedParticle"
import Vector3 from "../Base/Vector3"
import { DOTA_CHAT_MESSAGE } from "../Enums/DOTA_CHAT_MESSAGE"
import { Team } from "../Enums/Team"
import { Localization } from "../Menu/Imports"
import * as WASM from "../Native/WASM"
import Workers from "../Native/Workers"
import Entity, { LocalPlayer } from "../Objects/Base/Entity"
import FakeUnit, { GetPredictionTarget } from "../Objects/Base/FakeUnit"
import { PlayerResource } from "../Objects/Base/PlayerResource"
import Unit from "../Objects/Base/Unit"
import AbilityData, { ReloadGlobalAbilityStorage } from "../Objects/DataBook/AbilityData"
import UnitData, { ReloadGlobalUnitStorage } from "../Objects/DataBook/UnitData"
import { DefaultWorldLayers, ParseEntityLump, ResetEntityLump } from "../Resources/ParseEntityLump"
import { ParseGNV, ResetGNV } from "../Resources/ParseGNV"
import { parseKVFile } from "../Resources/ParseKV"
import { GetMapNumberProperty, GetMapStringProperty, MapToMatrix4x4, MapToNumberArray, MapToStringArray } from "../Resources/ParseUtils"
import BinaryStream from "../Utils/BinaryStream"
import { HasBit } from "../Utils/BitsExtensions"
import GameState from "../Utils/GameState"
import { CMsgVectorToVector3, ParseProtobufDesc, ParseProtobufNamed, RecursiveProtobuf } from "../Utils/Protobuf"
import { createMapFromMergedIterators } from "../Utils/Utils"
import * as VBKV from "../Utils/VBKV"
import { LoadEconData } from "./EconHelper"
import EntityManager from "./EntityManager"
import Events from "./Events"
import EventsSDK from "./EventsSDK"
import Manifest, { LoadManifest } from "./Manifest"

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
}
enum EDotaEntityMessages {
	DOTA_UNIT_SPEECH = 0,
	DOTA_UNIT_SPEECH_MUTE = 1,
	DOTA_UNIT_ADD_GESTURE = 2,
	DOTA_UNIT_REMOVE_GESTURE = 3,
	DOTA_UNIT_REMOVE_ALL_GESTURES = 4,
	DOTA_UNIT_FADE_GESTURE = 6,
	DOTA_UNIT_SPEECH_CLIENTSIDE_RULES = 7,
}
ParseProtobufDesc(`
message CNETMsg_Tick {
	optional uint32 tick = 1;
	optional uint32 host_frametime = 2;
	optional uint32 host_frametime_std_deviation = 3;
	optional uint32 host_computationtime = 4;
	optional uint32 host_computationtime_std_deviation = 5;
	optional uint32 host_framestarttime_std_deviation = 6;
	optional uint32 host_loss = 7;
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
	optional int32 player_slot = 12;
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
	CHAT_MESSAGE_RUNE_DENY = 124;
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
}

message CUserMsg_ParticleManager {
	message ReleaseParticleIndex {
	}

	message CreateParticle {
		optional fixed64 particle_name_index = 1;
		optional int32 attach_type = 2;
		optional int32 entity_handle = 3;
		optional int32 entity_handle_for_modifiers = 4;
		optional bool apply_voice_ban_rules = 5;
		optional int32 team_behavior = 6;
		optional string control_point_configuration = 7;
	}

	message DestroyParticle {
		optional bool destroy_immediately = 1;
	}

	message DestroyParticleInvolving {
		optional bool destroy_immediately = 1;
		optional int32 entity_handle = 3;
	}

	message DestroyParticleNamed {
		optional fixed64 particle_name_index = 1;
		optional int32 entity_handle = 2;
		optional bool destroy_immediately = 3;
		optional bool play_endcap = 4;
	}

	message UpdateParticle {
		optional int32 control_point = 1;
		optional .CMsgVector position = 2;
	}

	message UpdateParticleFwd {
		optional int32 control_point = 1;
		optional .CMsgVector forward = 2;
	}

	message UpdateParticleOrient {
		optional int32 control_point = 1;
		optional .CMsgVector forward = 2;
		optional .CMsgVector deprecated_right = 3;
		optional .CMsgVector up = 4;
		optional .CMsgVector left = 5;
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
		optional int32 entity_handle = 2;
		optional int32 attach_type = 3;
		optional int32 attachment = 4;
		optional .CMsgVector fallback_position = 5;
		optional bool include_wearables = 6;
	}

	message UpdateParticleSetFrozen {
		optional bool set_frozen = 1;
	}

	message UpdateParticleShouldDraw {
		optional bool should_draw = 1;
	}

	message ChangeControlPointAttachment {
		optional int32 attachment_old = 1;
		optional int32 attachment_new = 2;
		optional int32 entity_handle = 3;
	}

	message UpdateEntityPosition {
		optional int32 entity_handle = 1;
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

	required .PARTICLE_MESSAGE type = 1 [default = GAME_PARTICLE_MANAGER_EVENT_CREATE];
	required uint32 index = 2;
	optional .CUserMsg_ParticleManager.ReleaseParticleIndex release_particle_index = 3;
	optional .CUserMsg_ParticleManager.CreateParticle create_particle = 4;
	optional .CUserMsg_ParticleManager.DestroyParticle destroy_particle = 5;
	optional .CUserMsg_ParticleManager.DestroyParticleInvolving destroy_particle_involving = 6;
	optional .CUserMsg_ParticleManager.UpdateParticle update_particle = 7;
	optional .CUserMsg_ParticleManager.UpdateParticleFwd update_particle_fwd = 8;
	optional .CUserMsg_ParticleManager.UpdateParticleOrient update_particle_orient = 9;
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
		}

		required int32 key = 1;
		required .CDOTAResponseQuerySerialized.Fact.ValueType valtype = 2 [default = NUMERIC];
		optional float val_numeric = 3;
		optional string val_string = 4;
	}

	repeated .CDOTAResponseQuerySerialized.Fact facts = 1;
}

message CDOTASpeechMatchOnClient {
	optional int32 concept = 1;
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
		optional int32 concept = 1;
		optional string response = 2;
		optional int32 recipient_type = 3;
		optional int32 level = 4;
		optional bool muteable = 5 [default = false];
		optional .CDOTAUserMsg_UnitEvent.Interval predelay = 6;
		optional uint32 flags = 7;
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
}

message CDOTAUserMsg_TE_DotaBloodImpact {
	optional int32 entity = 1;
	optional float scale = 2;
	optional float xnormal = 3;
	optional float ynormal = 4;
}

message CDOTAUserMsg_TE_UnitAnimation {
	optional int32 entity = 1;
	optional int32 sequenceVariant = 2;
	optional float playbackrate = 3;
	optional float castpoint = 4;
	optional int32 type = 5;
	optional int32 activity = 6;
	optional float lag_compensation_time = 7;
}

message CDOTAUserMsg_TE_UnitAnimationEnd {
	optional int32 entity = 1;
	optional bool snap = 2;
}

message CMsgSosStartSoundEvent {
	optional int32 soundevent_guid = 1;
	optional fixed32 soundevent_hash = 2;
	optional int32 source_entity_index = 3;
	optional int32 seed = 4;
	optional bytes packed_params = 5;
	optional float start_time = 6;
}

message CMsgSosStopSoundEvent {
	optional int32 soundevent_guid = 1;
}

message CMsgSosStopSoundEventHash {
	optional fixed32 soundevent_hash = 1;
	optional int32 source_entity_index = 2;
}

message CMsgSosSetSoundEventParams {
	optional int32 soundevent_guid = 1;
	optional bytes packed_params = 5;
}

message CMsgSosSetLibraryStackFields {
	optional fixed32 stack_hash = 1;
	optional bytes packed_fields = 5;
}

message CUserMsg_CustomGameEvent {
	optional string event_name = 1;
	optional bytes data = 2;
}
`)

async function HandleParticleMsg(msg: RecursiveProtobuf): Promise<void> {
	const index = msg.get("index") as number
	const par = NetworkedParticle.Instances.get(index)
	const msg_type = msg.get("type") as PARTICLE_MESSAGE
	let changed_ent_pos = false,
		changed_ent: Nullable<FakeUnit | Unit>
	switch (msg_type) {
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENTITY_POSITION: {
			const submsg = msg.get("update_entity_position") as RecursiveProtobuf
			const position = CMsgVectorToVector3(submsg.get("position") as RecursiveProtobuf),
				entID = submsg.get("entity_handle") as number
			const ent = await GetPredictionTarget(entID)
			if (ent !== undefined) {
				ent.LastRealPredictedPositionUpdate = GameState.RawGameTime
				ent.LastPredictedPositionUpdate = GameState.RawGameTime
				ent.PredictedPosition.CopyFrom(position)
				changed_ent_pos = true
				changed_ent = ent
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENT: {
			const submsg = msg.get("update_particle_ent") as RecursiveProtobuf
			const entID = submsg.get("entity_handle") as number,
				position = CMsgVectorToVector3(submsg.get("fallback_position") as RecursiveProtobuf)
			const ent = await GetPredictionTarget(entID)
			if (ent !== undefined) {
				ent.LastRealPredictedPositionUpdate = GameState.RawGameTime
				ent.LastPredictedPositionUpdate = GameState.RawGameTime
				ent.PredictedPosition.CopyFrom(position)
				changed_ent_pos = true
				changed_ent = ent
			}
			break
		}
		default:
			break
	}
	if (par === undefined && msg_type === PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CREATE) {
		const submsg = msg.get("create_particle") as RecursiveProtobuf
		const particleSystemHandle = submsg.get("particle_name_index") as bigint,
			entID = submsg.get("entity_handle") as number
		const path = Manifest.GetPathByHash(particleSystemHandle ?? 0n)
		if (path !== undefined)
			await EventsSDK.emit(
				"ParticleCreated",
				false,
				new NetworkedParticle(
					index,
					path,
					particleSystemHandle,
					submsg.get("attach_type") as number,
					await GetPredictionTarget(entID),
				),
			)
		else
			console.log(
				GameState.RawGameTime,
				`Received unknown particleSystemHandle ${particleSystemHandle} for particle ${index}`,
			)
	}
	if (par === undefined) {
		if (changed_ent !== undefined)
			await EventsSDK.emit(
				"ParticleUnitPositionUpdated",
				false,
				changed_ent,
				undefined,
			)
		return
	}
	switch (msg_type) {
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_DESTROY: {
			const submsg = msg.get("destroy_particle") as RecursiveProtobuf
			const destroy_immediately = submsg.get("destroy_immediately") as boolean
			if (!destroy_immediately && par.EndTime !== -1) {
				par.Released = true
				await EventsSDK.emit(
					"ParticleReleased",
					false,
					par,
				)
			} else
				await par.Destroy()
			return
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_DESTROY_INVOLVING: {
			const submsg = msg.get("destroy_particle_involving") as RecursiveProtobuf
			const destroy_immediately = submsg.get("destroy_immediately") as boolean
			// TODO: entity_handle?
			if (!destroy_immediately && par.EndTime !== -1) {
				par.Released = true
				await EventsSDK.emit(
					"ParticleReleased",
					false,
					par,
				)
			} else
				await par.Destroy()
			return
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_RELEASE: {
			if (par.EndTime !== -1) {
				par.Released = true
				await EventsSDK.emit(
					"ParticleReleased",
					false,
					par,
				)
			} else
				await par.Destroy()
			return
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE: {
			const submsg = msg.get("update_particle") as RecursiveProtobuf
			par.ControlPoints.set(
				submsg.get("control_point") as number,
				CMsgVectorToVector3(submsg.get("position") as RecursiveProtobuf),
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_FORWARD: {
			const submsg = msg.get("update_particle_fwd") as RecursiveProtobuf
			par.ControlPointsForward.set(
				submsg.get("control_point") as number,
				CMsgVectorToVector3(submsg.get("forward") as RecursiveProtobuf),
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ORIENTATION: {
			const submsg = msg.get("update_particle_orient") as RecursiveProtobuf
			par.ControlPointsOrient.set(
				submsg.get("control_point") as number,
				[
					CMsgVectorToVector3(submsg.get("forward") as RecursiveProtobuf),
					CMsgVectorToVector3(submsg.get("up") as RecursiveProtobuf),
					CMsgVectorToVector3(submsg.get("left") as RecursiveProtobuf),
				],
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_FALLBACK: {
			const submsg = msg.get("update_particle_fallback") as RecursiveProtobuf,
				cp = submsg.get("control_point") as number,
				position = CMsgVectorToVector3(submsg.get("position") as RecursiveProtobuf)
			par.ControlPointsFallback.set(cp, position)
			const cpEnt = par.ControlPointsEnt.get(cp)
			if (cpEnt !== undefined) {
				cpEnt[0].LastRealPredictedPositionUpdate = GameState.RawGameTime
				cpEnt[0].LastPredictedPositionUpdate = GameState.RawGameTime
				cpEnt[0].PredictedPosition.CopyFrom(position)
				changed_ent_pos = true
				changed_ent = cpEnt[0]
			}
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENT: {
			const submsg = msg.get("update_particle_ent") as RecursiveProtobuf
			const entID = submsg.get("entity_handle") as number,
				cp = submsg.get("control_point") as number,
				position = CMsgVectorToVector3(submsg.get("fallback_position") as RecursiveProtobuf)
			const ent = await GetPredictionTarget(entID)
			if (ent !== undefined)
				par.ControlPointsEnt.set(
					cp,
					[
						ent,
						submsg.get("attach_type") as number,
						submsg.get("attachment") as number,
						submsg.get("include_wearables") as boolean,
					],
				)
			par.ControlPointsFallback.set(cp, position)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_OFFSET: {
			const submsg = msg.get("update_particle_offset") as RecursiveProtobuf
			par.ControlPointsOffset.set(
				(submsg.get("control_point") as number) ?? 0,
				[
					CMsgVectorToVector3(submsg.get("origin_offset") as RecursiveProtobuf),
					CMsgVectorToVector3(submsg.get("angle_offset") as RecursiveProtobuf),
				],
			)
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
				if (par.FrozenAt === -1)
					par.FrozenAt = GameState.RawGameTime
			} else
				par.FrozenAt = -1
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_CHANGE_CONTROL_POINT_ATTACHMENT: {
			const submsg = msg.get("change_control_point_attachment") as RecursiveProtobuf
			const attachmentOld = (submsg.get("attachment_old") as number) ?? 0,
				attachmentNew = (submsg.get("attachment_new") as number) ?? 0,
				entID = submsg.get("entity_handle") as number
			const ent = EntityManager.EntityByIndex(entID) ?? entID
			let changed_anything = false
			for (const data of par.ControlPointsEnt.values())
				if (data[2] === attachmentOld && data[0] === ent) {
					data[2] = attachmentNew
					changed_anything = true
				}
			if (!changed_anything)
				return
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_UPDATE_ENTITY_POSITION: {
			const submsg = msg.get("update_entity_position") as RecursiveProtobuf
			const position = CMsgVectorToVector3(submsg.get("position") as RecursiveProtobuf),
				entID = submsg.get("entity_handle") as number
			const ent = EntityManager.EntityByIndex(entID) ?? entID
			let changed_anything = false
			for (const [cp, data] of par.ControlPointsEnt)
				if (data[0] === ent) {
					par.ControlPointsFallback.set(cp, position)
					changed_anything = true
				}
			if (!changed_anything)
				return
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
				(submsg.get("model_name") as string) ?? "",
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_CONTROL_POINT_SNAPSHOT: {
			const submsg = msg.get("set_control_point_snapshot") as RecursiveProtobuf
			par.ControlPointsSnapshot.set(
				(submsg.get("control_point") as number) ?? 0,
				(submsg.get("snapshot_name") as string) ?? "",
			)
			break
		}
		case PARTICLE_MESSAGE.GAME_PARTICLE_MANAGER_EVENT_SET_TEXTURE_ATTRIBUTE: {
			const submsg = msg.get("set_texture_attribute") as RecursiveProtobuf
			par.TextureAttributes.set(
				(submsg.get("attribute_name") as string) ?? "",
				(submsg.get("texture_name") as string) ?? "",
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
		default:
			console.log(
				GameState.RawGameTime,
				`Received unknown PARTICLE_MESSAGE ${msg_type} for particle ${index}`,
			)
			return
	}
	await EventsSDK.emit(
		"ParticleUpdated",
		false,
		par,
	)
	if (changed_ent_pos)
		await EventsSDK.emit(
			"ParticleUnitPositionUpdated",
			false,
			changed_ent,
			par,
		)
}

Events.on("ServerMessage", async (msg_id, buf_) => {
	const buf = new Uint8Array(buf_)
	switch (msg_id) {
		case 4: {
			const msg = ParseProtobufNamed(buf, "CNETMsg_Tick")
			await EventsSDK.emit(
				"ServerTick", false,
				msg.get("tick") as number,
				msg.get("host_frametime") as number,
				msg.get("host_frametime_std_deviation") as number,
				msg.get("host_computationtime") as number,
				msg.get("host_computationtime_std_deviation") as number,
				msg.get("host_framestarttime_std_deviation") as number,
				msg.get("host_loss") as number,
			)
			break
		}
		case 40:
			await EventsSDK.emit("ServerInfo", false, ParseProtobufNamed(buf, "CSVCMsg_ServerInfo"))
			break
		case 45: { // we have custom parsing for CSVCMsg_CreateStringTable & CSVCMsg_UpdateStringTable
			const stream = new BinaryStream(new DataView(buf.buffer, buf.byteOffset, buf.byteLength))
			const table_name = stream.ReadVarString(),
				update = new Map<number, [string, ArrayBuffer]>()
			while (!stream.Empty())
				update.set(stream.ReadVarUintAsNumber(), [stream.ReadVarString(), stream.ReadVarSlice()])
			await EventsSDK.emit("UpdateStringTable", false, table_name, update)
			break
		}
		case 51:
			await EventsSDK.emit("RemoveAllStringTables", false)
			break
		case 145:
			await HandleParticleMsg(ParseProtobufNamed(buf, "CUserMsg_ParticleManager"))
			break
		case 148: {
			const msg = ParseProtobufNamed(buf, "CUserMsg_CustomGameEvent")
			const event_name = (msg.get("event_name") as Nullable<string>) ?? ""
			const data = (msg.get("data") as Nullable<Uint8Array>) ?? new Uint8Array()
			let parsed_data: Map<string, VBKV.BinaryKV>
			try {
				parsed_data = VBKV.parseVBKV(data)
			} catch {
				parsed_data = new Map()
			}
			await EventsSDK.emit("CustomGameEvent", false, event_name, parsed_data)
			break
		}
		case 208: {
			const msg = ParseProtobufNamed(buf, "CMsgSosStartSoundEvent")
			const hash = msg.get("soundevent_hash") as number
			const sound_name = Manifest.LookupSoundNameByHash(hash)
			if (sound_name === undefined) {
				// console.log(`Unknown soundname hash: ${hash}`)
				break
			}
			const handle = (msg.get("source_entity_index") as number) ?? 0,
				seed = (msg.get("seed") as number) ?? 0,
				start_time = (msg.get("start_time") as number) ?? -1,
				packed_params = msg.get("packed_params") as Nullable<Uint8Array>
			const ent = await GetPredictionTarget(handle),
				position = new Vector3()
			if (packed_params !== undefined && packed_params.byteLength >= 19) {
				const stream = new BinaryStream(new DataView(
					packed_params.buffer,
					packed_params.byteOffset,
					packed_params.byteLength,
				))
				stream.RelativeSeek(7)
				position.x = stream.ReadFloat32()
				position.y = stream.ReadFloat32()
				position.z = stream.ReadFloat32()
			}
			await EventsSDK.emit(
				"StartSound", false,
				sound_name,
				ent,
				position,
				seed,
				start_time,
			)
			break
		}
		case 488: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_UnitEvent")
			const handle = msg.get("entity_index") as number
			const ent = await GetPredictionTarget(handle)
			if (ent instanceof Entity && !(ent instanceof Unit))
				break
			switch (msg.get("msg_type") as EDotaEntityMessages) {
				case EDotaEntityMessages.DOTA_UNIT_SPEECH: {
					const submsg = msg.get("speech") as RecursiveProtobuf,
						predelay = submsg.get("predelay") as RecursiveProtobuf
					await EventsSDK.emit(
						"UnitSpeech", false,
						ent,
						submsg.get("concept") as number,
						submsg.get("response") as string,
						submsg.get("recipient_type") as number,
						submsg.get("level") as number,
						submsg.get("muteable") as boolean,
						predelay.get("start") as number,
						predelay.get("range") as number,
						submsg.get("flags") as number,
					)
					break
				}
				case EDotaEntityMessages.DOTA_UNIT_SPEECH_MUTE: {
					const submsg = msg.get("speech_mute") as RecursiveProtobuf
					await EventsSDK.emit(
						"UnitSpeechMute", false,
						ent,
						submsg.get("delay") as number,
					)
					break
				}
				case EDotaEntityMessages.DOTA_UNIT_ADD_GESTURE: {
					const submsg = msg.get("add_gesture") as RecursiveProtobuf
					await EventsSDK.emit(
						"UnitAddGesture", false,
						ent,
						submsg.get("activity") as number,
						submsg.get("slot") as number,
						submsg.get("fade_in") as number,
						submsg.get("fade_out") as number,
						submsg.get("playback_rate") as number,
						submsg.get("sequence_variant") as number,
					)
					break
				}
				case EDotaEntityMessages.DOTA_UNIT_REMOVE_GESTURE: {
					const submsg = msg.get("remove_gesture") as RecursiveProtobuf
					await EventsSDK.emit(
						"UnitRemoveGesture", false,
						ent,
						submsg.get("activity") as number,
					)
					break
				}
				case EDotaEntityMessages.DOTA_UNIT_FADE_GESTURE: {
					const submsg = msg.get("fade_gesture") as RecursiveProtobuf
					await EventsSDK.emit(
						"UnitFadeGesture", false,
						ent,
						submsg.get("activity") as number,
					)
					break
				}
			}
			break
		}
		case 466: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_ChatEvent")
			await EventsSDK.emit(
				"ChatEvent", false,
				msg.get("type") as DOTA_CHAT_MESSAGE,
				msg.get("value") as number,
				msg.get("playerid_1") as number,
				msg.get("playerid_2") as number,
				msg.get("playerid_3") as number,
				msg.get("playerid_4") as number,
				msg.get("playerid_5") as number,
				msg.get("playerid_6") as number,
				msg.get("value2") as number,
				msg.get("value3") as number,
			)
			break
		}
		case 520: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_DotaBloodImpact")
			const ent = EntityManager.EntityByIndex(msg.get("entity") as number)
			if (ent === undefined)
				break
			await EventsSDK.emit(
				"BloodImpact", false,
				ent,
				msg.get("scale") as number,
				msg.get("xnormal") as number,
				msg.get("ynormal") as number,
			)
			break
		}
		case 521: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_UnitAnimation")
			const ent = EntityManager.EntityByIndex(msg.get("entity") as number)
			if (!(ent instanceof Unit))
				break
			await EventsSDK.emit(
				"UnitAnimation", false,
				ent,
				msg.get("sequenceVariant") as number,
				msg.get("playbackrate") as number,
				msg.get("castpoint") as number,
				msg.get("type") as number,
				msg.get("activity") as number,
				msg.get("lag_compensation_time") as number,
			)
			break
		}
		case 522: {
			const msg = ParseProtobufNamed(buf, "CDOTAUserMsg_TE_UnitAnimationEnd")
			const ent = EntityManager.EntityByIndex(msg.get("entity") as number)
			if (!(ent instanceof Unit))
				break
			await EventsSDK.emit("UnitAnimationEnd", false, ent, msg.get("snap") as boolean)
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
Events.on("MatchmakingStatsUpdated", async data => {
	await EventsSDK.emit(
		"MatchmakingStatsUpdated",
		false,
		ParseProtobufNamed(new Uint8Array(data), "CMsgDOTAMatchmakingStatsResponse"),
	)
})

Events.on("GameEvent", async (name, obj) => EventsSDK.emit("GameEvent", false, name, obj))

let input_capture_depth = 0
Events.on("InputCaptured", async is_captured => {
	if (is_captured)
		input_capture_depth++
	else
		input_capture_depth = Math.max(input_capture_depth - 1, 0)
	await EventsSDK.emit("InputCaptured", false, input_capture_depth !== 0)
})

EventsSDK.on("InputCaptured", is_captured => GameState.IsInputCaptured = is_captured)
EventsSDK.on("ServerTick", tick => GameState.CurrentServerTick = tick)
Events.on("UIStateChanged", new_state => GameState.UIState = new_state)

let current_world_promise: Nullable<Promise<WorkerIPCType>>
function TryLoadWorld(world_kv: RecursiveMap): void {
	const worldNodes = world_kv.get("m_worldNodes")
	if (!(worldNodes instanceof Map || Array.isArray(worldNodes)))
		return
	const objects: [string, number[]][] = []
	worldNodes.forEach((node: RecursiveMapValue) => {
		if (!(node instanceof Map))
			return
		const path = GetMapStringProperty(node, "m_worldNodePrefix")
		const node_kv = parseKVFile(`${path}.vwnod_c`)

		const layerNames: string[] = []
		const layerNamesMap = node_kv.get("m_layerNames")
		if (layerNamesMap instanceof Map || Array.isArray(layerNamesMap))
			layerNames.push(...MapToStringArray(layerNamesMap))

		const sceneObjectLayers: string[] = []
		const sceneObjectLayerIndicesMap = node_kv.get("m_sceneObjectLayerIndices")
		if (sceneObjectLayerIndicesMap instanceof Map || Array.isArray(sceneObjectLayerIndicesMap))
			sceneObjectLayers.push(
				...MapToNumberArray(sceneObjectLayerIndicesMap)
					.map(index => layerNames[index]),
			)

		const sceneObjects = node_kv.get("m_sceneObjects")
		if (!(sceneObjects instanceof Map || Array.isArray(sceneObjects)))
			return
		let i = 0
		sceneObjects.forEach((sceneObject: RecursiveMapValue) => {
			if (!(sceneObject instanceof Map))
				return
			const layerName = sceneObjectLayers[i++] ?? "world_layer_base"
			if (!DefaultWorldLayers.includes(layerName))
				return
			const transformMap = sceneObject.get("m_vTransform")
			const transform = transformMap instanceof Map || Array.isArray(transformMap)
				? [...MapToMatrix4x4(transformMap).values]
				: [...Matrix4x4.Identity.values]
			const model_path = GetMapStringProperty(sceneObject, "m_renderableModel"),
				mesh_path = GetMapStringProperty(sceneObject, "m_renderable"),
				objectTypeFlags = GetMapNumberProperty(sceneObject, "m_nObjectTypeFlags")
			// visual only, doesn't affect height calculations/etc
			if (HasBit(objectTypeFlags, 7))
				return
			if (model_path !== "")
				objects.push([model_path, transform])
			if (mesh_path !== "")
				objects.push([mesh_path, transform])
		})
	})
	const world_promise = current_world_promise = Workers.CallRPCEndPoint(
		"LoadAndOptimizeWorld",
		objects,
		false,
		{
			forward_events: false,
			forward_server_messages: false,
			display_name: "LoadAndOptimizeWorld",
		},
	)
	world_promise.then(data => {
		if (
			world_promise !== current_world_promise
			|| !Array.isArray(data)
			|| !Array.isArray(data[0])
			|| !Array.isArray(data[1])
			|| !Array.isArray(data[2])
		)
			return
		current_world_promise = undefined
		const world_bvh = data[0] as [Uint8Array, Uint8Array],
			paths_data = data[1] as [string, [number, Uint8Array, Uint8Array, Uint8Array, number, number][]][],
			// paths = data[2] as string[],
			path2meshes = new Map<string, number[]>()
		paths_data.forEach(([path, meshes_data]) => {
			const meshes: number[] = []
			for (const mesh_data of meshes_data) {
				WASM.LoadWorldMeshCached(
					mesh_data[0],
					mesh_data[1],
					mesh_data[2],
					mesh_data[3],
					mesh_data[4],
					mesh_data[5],
				)
				meshes.push(mesh_data[0])
			}
			path2meshes.set(path, meshes)
		})
		objects.forEach(([path, transform]) => {
			const meshes = path2meshes.get(path)
			if (meshes !== undefined)
				for (const mesh of meshes)
					WASM.SpawnWorldMesh(mesh, transform)
		})
		const plate_mesh_id = path2meshes.get("")
		if (plate_mesh_id !== undefined && plate_mesh_id.length !== 0)
			WASM.SpawnWorldMesh(plate_mesh_id[0], Matrix4x4.Identity.values)
		WASM.FinishWorld(world_bvh)
	}, console.error)
}
async function TryLoadMapFiles(): Promise<void> {
	const map_name = GameState.MapName
	{
		const buf = fread(`maps/${map_name}.vhcg`)
		if (buf !== undefined)
			WASM.ParseVHCG(buf)
		else
			WASM.ResetVHCG()
	}
	{
		const buf = fread(`maps/${map_name}.gnv`)
		if (buf !== undefined)
			ParseGNV(buf)
		else
			ResetGNV()
	}
	{
		LoadEconData()
		await EventsSDK.emit("EconDataLoaded", false)
	}
	{
		ResetEntityLump()
		WASM.ResetWorld()
		const world_kv = parseKVFile(`maps/${map_name}/world.vwrld_c`)
		const m_entityLumps = world_kv.get("m_entityLumps")
		if (m_entityLumps instanceof Map || Array.isArray(m_entityLumps))
			m_entityLumps.forEach((path: RecursiveMapValue) => {
				if (typeof path !== "string")
					return
				const buf = fread(`${path}_c`)
				if (buf === undefined)
					return
				ParseEntityLump(buf)
			})
		if (IS_MAIN_WORKER)
			TryLoadWorld(world_kv)
		await EventsSDK.emit("MapDataLoaded", false)
	}
}

const last_search_paths_worker: (string | bigint)[] = []
Workers.RegisterRPCEndPoint("SetSearchPaths", paths => {
	if (!Array.isArray(paths))
		throw "!Array.isArray(paths)"
	last_search_paths_worker.forEach(path => RemoveSearchPath(path))
	last_search_paths_worker.splice(0)
	for (const path of paths)
		if (typeof path === "string" || typeof path === "bigint") {
			last_search_paths_worker.push(path)
			AddSearchPath(path)
		}
})

const last_search_paths: (string | bigint)[] = []
EventsSDK.on("ServerInfo", async info => {
	let map_name = (info.get("map_name") as string) ?? "<empty>"
	if (map_name === "start")
		map_name = "dota"
	GameState.MapName = map_name
	const addon_name = (info.get("addon_name") as string) ?? ""
	GameState.AddonName = addon_name
	last_search_paths.forEach(path => RemoveSearchPath(path))
	last_search_paths.splice(0)
	last_search_paths.push("content/core")
	last_search_paths.push("game/dota")
	last_search_paths.push("content/dota")
	last_search_paths.push("game/dota_addons")
	last_search_paths.push("content/dota_addons")
	if (addon_name !== "")
		try {
			const addon_id = BigInt(addon_name) // throws if addon_name is not a number
			if (addon_id !== 0n) {
				if (addon_id < 0n)
					throw "Addon ID should be unsigned"
				last_search_paths.push(addon_id)
			}
		} catch {
			last_search_paths.push(`game/dota_addons/${addon_name}`)
			last_search_paths.push(`content/dota_addons/${addon_name}`)
		}
	last_search_paths.push(`maps/${map_name}.vpk`)
	Workers.Propagate("SetSearchPaths", last_search_paths)
	last_search_paths.forEach(path => AddSearchPath(path))
	LoadManifest()
	await TryLoadMapFiles()

	await ReloadGlobalUnitStorage()
	await ReloadGlobalAbilityStorage()
	UnitData.global_storage.then(unit_data_global_storage => {
		AbilityData.global_storage.then(ability_data_global_storage => {
			// automatically localize units, abilities and items in menu
			const namesMapping = new Map<string, string>()
			const lang_tokens = ((createMapFromMergedIterators<string, RecursiveMapValue>(
				parseKVFile("resource/localization/abilities_english.txt").entries(),
				parseKVFile("resource/localization/dota_english.txt").entries(),
				parseKVFile("resource/addon_english.txt").entries(),
				parseKVFile("panorama/localization/addon_english.txt").entries(),
			).get("lang") as RecursiveMap)?.get("Tokens") ?? new Map()) as Map<string, string>
			unit_data_global_storage.forEach((data, name) => {
				const lang_token = lang_tokens.get(name)
				namesMapping.set(name, lang_token ?? data.WorkshopName)
			})
			ability_data_global_storage.forEach((_, name) => {
				const lang_token = (
					lang_tokens.get(`DOTA_Tooltip_ability_${name}`)
					?? lang_tokens.get(`DOTA_Tooltip_Ability_${name}`)
				)
				if (lang_token !== undefined)
					namesMapping.set(name, lang_token)
			})
			for (const [k, v] of lang_tokens)
				if (k.startsWith("dota_matchgroup_"))
					namesMapping.set(k, v)
			Localization.AddLocalizationUnit("english", namesMapping)
			EventsSDK.emit("UnitAbilityDataUpdated", false)
		})
	})
})

function GetLocalTeam(): Team {
	const player = LocalPlayer
	if (player === undefined)
		return Team.Observer

	let team = player.Team
	if (team === Team.Observer) {
		const playerid = player.PlayerID
		if (playerid !== -1) {
			const data = PlayerResource?.PlayerData[playerid]
			if (data !== undefined) {
				const coach_team = data.CoachTeam
				if (coach_team === Team.Invalid || coach_team === Team.None) {
					team = data.LiveSpectatorTeam
					if (team === Team.Invalid || team === Team.None)
						team = Team.Observer
				} else
					team = coach_team
			}
		}
	}
	return team
}

EventsSDK.on("MidDataUpdate", () => {
	const team = GetLocalTeam()
	if (GameState.LocalTeam === team)
		return
	GameState.LocalTeam = team
	EventsSDK.emit("LocalTeamChanged", false)
})
