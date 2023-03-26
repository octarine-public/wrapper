/// GLOBAL TYPES
type WorkerIPCType =
	| { [key: string]: WorkerIPCType }
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
interface WorkerOptions {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	forward_events?: boolean // forward events [except several user-driven ones and /ServerMessages] to worker
	// eslint-disable-next-line @typescript-eslint/naming-convention
	forward_server_messages?: boolean // forward ServerMessage events, only works with forward_events
	// eslint-disable-next-line @typescript-eslint/naming-convention
	display_name?: string // display name in CDT
	/**
	 * if specified and not empty - absolute path of a singular entry point of the worker
	 * i.e. github.com/octarine-public/wrapper/wrapper/Imports
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
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
	uint8_t stats_dropdown; // 67, spectator_stats_categoryID
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
	Get(convarName: string): Nullable<number | boolean | string | number[]>
	Set(convarName: string, value: number | boolean | string | number[]): void
}

declare interface CustomGameEvents {
	FireEventToClient(name: string, playerEntID: number, data: RecursiveMap): void
	FireEventToAllClients(name: string, data: RecursiveMap): void
	FireEventToServer(name: string, data: RecursiveMap): void
}

declare interface Particles {
	Create(path: string, attach: number, attachedTo: number): number
	Destroy(particleID: number, immediate: boolean): void
	SetControlPoint(particleID: number, controlPoint: number): void // pass vec: Vector3 at IOBuffer offset 0
	SetControlPointForward(particleID: number, controlPoint: number): void // pass vec: Vector3 at IOBuffer offset 0
	DeleteAll(): void
}

// must be called only in onDraw!
declare interface Renderer {
	CreateFont(buf: Uint8Array): number
	/**
	 * @returns size: Vector2 to IOBuffer at offset 0
	 */
	GetTextSize(text: string, fontID: number, size: number): void
	/**
	 * Returns size: Vector2 at IOBuffer offset 0
	 *
	 * @returns textureID
	 */
	CreateTexture(path: string): number
	FreeTexture(textureID: number): void
	ExecuteCommandBuffer(buf: Uint8Array): void
}

declare interface Camera {
	Distance: number
	FoV: number
	Angles: boolean // returns QAngle to IOBuffer offset 0 on get, sets from IOBuffer offset 0 on set
	Position: boolean // returns Vector3 to IOBuffer offset 0 on get, sets from IOBuffer offset 0 on set
}

declare class FileStream {
	public read(offset: number, buf: Uint8Array): number
	public close(): void

	public readonly byteLength: number
}

/// GLOBAL FUNCTIONS

declare function SendToConsole(command: string): void
declare function fopen(path: string): Nullable<FileStream>
declare function fexists(path: string): boolean
declare function requestPlayerData(
	playerID: number,
	heroID: number
): Promise<string>
/**
 * @param path pass empty to read from confings/../settings.json
 */
declare function readConfig(): Promise<string>
declare function writeConfig(data: string): void
declare function PrepareUnitOrders(obj: {
	// pass Position: Vector3 at IOBuffer offset 0
	OrderType: number
	Target?: number
	Ability?: number
	Issuers?: number[] | number
	Queue?: boolean
	ShowEffects?: boolean
}): void
declare function GetLatency(flow: number): number
declare function GetAvgLatency(flow: number): number
declare function StartFindingMatch(): void
declare function SendGCPingResponse(): void
declare function AcceptMatch(): void
declare function ToggleOBSBypass(state: boolean): void
declare function ToggleRequestUserCmd(state: boolean): void
declare function ToggleParticleRendering(state: boolean): void

declare function setFireEvent(
	cb: (eventName: string, cancellable: boolean, ...args: any) => boolean
): void
declare function require(absolutePath: string): any
declare function hrtime(): number
declare function SetTreeModel(modelName: string, scale: number): void
declare function EmitStartSoundEvent( // pass location: Vector2 at IOBuffer offset 0
	soundeventGUID: number,
	soundeventName: string,
	sourceEntityID: number,
	seed: number
): void
declare function EmitStopSoundEvent( // pass location: Vector2 at IOBuffer offset 0
	soundeventGUID: number,
	soundeventName: Nullable<string>,
	sourceEntityID: number
): void
/**
 * @deprecated
 * @returns biguint to IOBuffer offset 0, and return value is true if function succeeded
 */
declare function GetEntityUnitState(entityID: number): boolean
/**
 * @param customEntityID (entityID << 1) or (binaryID << 1) | 1
 * @param renderMode RenderMode
 */
declare function SetEntityColor(
	customEntityID: number,
	colorU32: number,
	renderMode: number
): void
/**
 * @param customEntityID (entityID << 1) or (binaryID << 1) | 1
 */
declare function SetEntityGlow(customEntityID: number, colorU32: number): void
declare function GetPlayerMuteFlags(steamid64: bigint): number
/**
 * pass location: Vector2 at IOBuffer offset 0
 */
declare function SendMinimapPing(
	type?: number,
	directPing?: boolean,
	target?: number
): void
declare function SpawnWorker(options: WorkerOptions): bigint
/**
 * @throws on wrong/self workerUID
 */
declare function DespawnWorker(workerUID: bigint): void
/**
 * @param workerUID could be 0n for parent or already spawned workerUID returned from SpawnWorker
 * @throws on wrong/self workerUID
 */
declare function SendIPCMessage(
	workerUID: bigint,
	name: string,
	msg: WorkerIPCType
): void
declare function WriteUserCmd(): void
declare function IsShopOpen(): boolean
declare function GetQueryUnit(): number
declare function GetSelectedEntities(): number
declare function LoadFont(
	path: string,
	isFallback: boolean,
	weight?: number
): boolean

declare function parseKV(path: string, block?: string | number): RecursiveMap
declare function parseKV(
	data: Uint8Array,
	block?: string | number
): RecursiveMap
declare function parseKV(
	stream: FileStream,
	block: string | number,
	offset: number,
	size: number
): RecursiveMap

declare function parseKVBlock(data: Uint8Array): RecursiveMap
declare function parseKVBlock(
	stream: FileStream,
	offset: number,
	size: number
): RecursiveMap
declare function parseKVBlock(path: string): RecursiveMap

declare function MurmurHash2(str: string, seed: number): number

declare function GetPathByHash(hash: bigint): Nullable<string>

declare function GetSoundPathToName(): Map<string, string>
declare function LookupSoundNameByHash(hash: number): Nullable<string>
