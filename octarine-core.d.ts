/// GLOBAL TYPES
type WorkerIPCType = (
	{ [key: string]: WorkerIPCType }
	| Map<WorkerIPCType, WorkerIPCType>
	| WorkerIPCType[]
	| WebAssembly.Module
	| WebAssembly.Memory
	| SharedArrayBuffer // is 0-copy
	| Uint8Array // won't maintain byteOffset/buffer (so won't be 0-copy) unless underlying buffer is SharedArrayBuffer
	| ArrayBuffer // is not 0-copy
	| string
	| bigint
	| number
	| boolean
	| undefined
	| void
)
interface WorkerOptions {
	forward_events?: boolean // forward events [except several user-driven ones and /ServerMessages] to worker
	forward_server_messages?: boolean // forward ServerMessage events, only works with forward_events
	display_name?: string // display name in CDT
	/**
	 * if specified and not empty - absolute path of a singular entry point of the worker
	 * i.e. github.com/octarine-public/wrapper/wrapper/Imports
	 */
	entry_point?: string
}

/// GLOBAL OBJECTS
declare var IOBuffer: Float32Array // 128 floats in size
declare var IOBufferView: DataView // IOBuffer DataView
declare var DrawMatrix: Float32Array // 16 floats in size
/**
struct CUnitOrder {
	uint32_t order_type; // 0
	uint32_t issuer; // 4
	Vector position; // 8
	CEntityIndex target; // 20
	CEntityIndex ability; // 24
	bool show_effects; // 28
	bool queue; // 29
	uint32_t issuers_size; // 30
	CEntityIndex issuers[128]; // 34+
};
 */
declare var LatestUnitOrder: Uint8Array
/**
struct CUserCmd {
	int command_number; // 0
	int tick_count; // 4
	QAngle viewangles; // 8
	float forwardmove; // 20
	float sidemove; // 24
	float upmove; // 28
	uint64_t buttons; // 32, 4 bit => up 5 bit => down 10 bit => left 11 bit => right
	int impulse; // 40
	CEntityIndex weaponselect; // 44
	CEntityIndex weaponsubtype; // 48
	float mousex; // 52
	float mousey; // 56
	int16_t cameraposition[2]; // 60
	uint8_t clickbehavior; // 64
	uint8_t statspanel; // 65, dota_spectator_stats_panel
	uint8_t shoppanel; // 66
	uint8_t stats_dropdown; // 67, spectator_stats_category_id
	uint8_t stats_dropdown_sort; // 68, spectator_stats_sort_method
	Vector3 crosshairtrace; // 69
	CHandle pawn; // 81
};
 */
declare var LatestUserCmd: Uint8Array
declare var CursorPosition: Int32Array // 2 ints in size
declare var SchemaClassesInheritance: Map<string, string[]>

declare var ConVars: ConVars
declare var CustomGameEvents: CustomGameEvents
declare var Particles: Particles
declare var Renderer: Renderer
declare var Camera: Camera
declare const IS_MAIN_WORKER: boolean
declare const IS_MINIMAL_CORE: boolean

declare interface ConVars {
	Get(convar_name: string): Nullable<number | boolean | string | number[]>
	Set(convar_name: string, value: number | boolean | string | number[]): void
}

declare interface CustomGameEvents {
	FireEventToClient(name: string, player_ent_id: number, data: Uint8Array): void
	FireEventToAllClients(name: string, data: Uint8Array): void
	FireEventToServer(name: string, data: Uint8Array): void
}

declare interface Particles {
	Create(path: string, attach: number, ent: number): number
	Destroy(particle_id: number, immediate: boolean): void
	SetControlPoint(particle_id: number, control_point: number): void // pass vec: Vector3 at IOBuffer offset 0
	SetControlPointForward(particle_id: number, control_point: number): void // pass vec: Vector3 at IOBuffer offset 0
	DeleteAll(): void
}

// must be called only in onDraw!
declare interface Renderer {
	CreateFont(buf: Uint8Array): number
	/**
	 * @returns size: Vector2 to IOBuffer at offset 0
	 */
	GetTextSize(text: string, font_id: number, size: number): void
	/**
	 * Pass size: Vector2 at IOBuffer offset 0
	 * @returns texture_id
	 */
	CreateTexture(rgba: Uint8Array): number
	/**
	 * Returns size: Vector2 at IOBuffer offset 0
	 * @returns texture_id
	 */
	CreateTextureSVG(svg: Uint8Array): number
	FreeTexture(texture_id: number): void
	ExecuteCommandBuffer(buf: Uint8Array): void
}

declare interface Camera {
	Distance: number
	FoV: number
	Angles: boolean // returns QAngle to IOBuffer offset 0 on get, sets from IOBuffer offset 0 on set
	Position: boolean // returns Vector3 to IOBuffer offset 0 on get, sets from IOBuffer offset 0 on set
}

declare class FileStream {
	read(offset: number, buf: Uint8Array): number
	close(): void

	readonly byteLength: number
}

/// GLOBAL FUNCTIONS

declare function SendToConsole(command: string): void
declare function fopen(path: string): Nullable<FileStream>
declare function fexists(path: string): boolean
declare function requestPlayerData(player_id: number, hero_id: number): Promise<string>
/**
 * @param path pass empty to read from confings/../settings.json
 */
declare function readConfig(path: string): Promise<ArrayBuffer>
declare function writeConfig(path: string, data: Uint8Array): void
declare function PrepareUnitOrders(obj: { // pass Position: Vector3 at IOBuffer offset 0
	OrderType: number,
	Target?: number,
	Ability?: number,
	Issuers?: number[] | number,
	Queue?: boolean,
	ShowEffects?: boolean,
}): void
declare function GetLatency(flow: number): number
declare function GetAvgLatency(flow: number): number
declare function StartFindingMatch(): void
declare function SendGCPingResponse(): void
declare function AcceptMatch(): void
declare function ToggleOBSBypass(state: boolean): void
declare function ToggleRequestUserCmd(state: boolean): void
declare function setFireEvent(
	func: (event_name: string, cancellable: boolean, ...args: any) => boolean,
): void
declare function require(absolute_path: string): any
declare function hrtime(): number
declare function SetTreeModel(model_name: string, scale: number): void
declare function EmitStartSoundEvent( // pass location: Vector2 at IOBuffer offset 0
	soundevent_hash: number,
	source_entity_index: number,
	seed: number,
): void
declare function EmitStartSoundEventNew( // pass location: Vector2 at IOBuffer offset 0
	soundevent_guid: number,
	soundevent_hash: number,
	source_entity_index: number,
	seed: number,
): void
declare function EmitStopSoundEvent( // pass location: Vector2 at IOBuffer offset 0
	soundevent_guid: number,
	soundevent_hash: number,
	source_entity_index: number,
): void
/**
 * @deprecated
 * @returns biguint to IOBuffer offset 0, and return value is true if function succeeded
 */
declare function GetEntityUnitState(entity_id: number): boolean
/**
 * @param custom_entity_id (entity_id << 1) or (binary_id << 1) | 1
 * @param render_mode RenderMode_t
 */
declare function SetEntityColor(custom_entity_id: number, color_u32: number, render_mode: number): void
/**
 * @param custom_entity_id (entity_id << 1) or (binary_id << 1) | 1
 */
declare function SetEntityGlow(custom_entity_id: number, color_u32: number): void
declare function GetPlayerMuteFlags(steamid64: bigint): number
/**
 * pass location: Vector2 at IOBuffer offset 0
 */
declare function SendMinimapPing(type?: number, direct_ping?: boolean, target?: number): void
declare function SpawnWorker(options: WorkerOptions): bigint
/**
 * @throws on wrong/self worker_uid
 */
declare function DespawnWorker(worker_uid: bigint): void
/**
 * @param worker_uid could be 0n for parent or already spawned worker_uid returned from SpawnWorker
 * @throws on wrong/self worker_uid
 */
declare function SendIPCMessage(worker_uid: bigint, name: string, msg: WorkerIPCType): void
declare function WriteUserCmd(): void
declare function IsShopOpen(): boolean
declare function GetQueryUnit(): number
declare function GetSelectedEntities(): number
declare function LoadFont(path: string, is_fallback: boolean, weight?: number): boolean
