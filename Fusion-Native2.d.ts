/// GLOBAL OBJECTS
declare var IOBuffer: Float32Array // 128 floats in size
declare var EntityVisualPositions: Float32Array
declare var EntityVisualRotations: Float32Array
declare var ServerMessageBuffer: Uint8Array
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
};
 */
declare var LatestUserCmd: Uint8Array
declare var CursorPosition: Int32Array // 2 ints in size
declare var SchemaClassesInheritance: Map<string, string[]>

declare var console: Console
declare var ConVars: ConVars
declare var CustomGameEvents: CustomGameEvents
declare var Minimap: Minimap
declare var Particles: Particles
declare var Renderer: Renderer
declare var Camera: Camera

interface Console {
	memory: any
	assert(condition?: boolean, ...data: any[]): void
	clear(): void
	count(label?: string): void
	countReset(label?: string): void
	debug(...data: any[]): void
	dir(item?: any, options?: any): void
	dirxml(...data: any[]): void
	error(...data: any[]): void
	exception(message?: string, ...optionalParams: any[]): void
	group(...data: any[]): void
	groupCollapsed(...data: any[]): void
	groupEnd(): void
	info(...data: any[]): void
	log(...data: any[]): void
	table(tabularData?: any, properties?: string[]): void
	time(label?: string): void
	timeEnd(label?: string): void
	timeLog(label?: string, ...data: any[]): void
	timeStamp(label?: string): void
	trace(...data: any[]): void
	warn(...data: any[]): void
}

type BufferSource = ArrayBufferView | ArrayBuffer
declare namespace WebAssembly {
	interface CompileError {
	}

	var CompileError: {
		prototype: CompileError
		new(): CompileError
	}

	interface Global {
		value: any
		valueOf(): any
	}

	var Global: {
		prototype: Global
		new(descriptor: GlobalDescriptor, v?: any): Global
	}

	interface Instance {
		readonly exports: Exports
	}

	var Instance: {
		prototype: Instance
		new(module: Module, importObject?: Imports): Instance
	}

	interface LinkError {
	}

	var LinkError: {
		prototype: LinkError
		new(): LinkError
	}

	interface Memory {
		readonly buffer: ArrayBuffer
		grow(delta: number): number
	}

	var Memory: {
		prototype: Memory
		new(descriptor: MemoryDescriptor): Memory
	}

	interface Module {
	}

	var Module: {
		prototype: Module
		new(bytes: BufferSource): Module
		customSections(moduleObject: Module, sectionName: string): ArrayBuffer[]
		exports(moduleObject: Module): ModuleExportDescriptor[]
		imports(moduleObject: Module): ModuleImportDescriptor[]
	}

	interface RuntimeError {
	}

	var RuntimeError: {
		prototype: RuntimeError
		new(): RuntimeError
	}

	interface Table {
		readonly length: number
		get(index: number): Function | null
		grow(delta: number): number
		set(index: number, value: Function | null): void
	}

	var Table: {
		prototype: Table
		new(descriptor: TableDescriptor): Table
	}

	interface GlobalDescriptor {
		mutable?: boolean
		value: ValueType
	}

	interface MemoryDescriptor {
		initial: number
		maximum?: number
	}

	interface ModuleExportDescriptor {
		kind: ImportExportKind
		name: string
	}

	interface ModuleImportDescriptor {
		kind: ImportExportKind
		module: string
		name: string
	}

	interface TableDescriptor {
		element: TableKind
		initial: number
		maximum?: number
	}

	interface WebAssemblyInstantiatedSource {
		instance: Instance
		module: Module
	}

	type ImportExportKind = "function" | "global" | "memory" | "table"
	type TableKind = "anyfunc"
	type ValueType = "f32" | "f64" | "i32" | "i64"
	type ExportValue = Function | Global | Memory | Table
	type Exports = Record<string, ExportValue>
	type ImportValue = ExportValue | number
	type ModuleImports = Record<string, ImportValue>
	type Imports = Record<string, ModuleImports>
	function compile(bytes: BufferSource): Promise<Module>
	function instantiate(bytes: BufferSource, importObject?: Imports): Promise<WebAssemblyInstantiatedSource>
	function instantiate(moduleObject: Module, importObject?: Imports): Promise<Instance>
	function validate(bytes: BufferSource): boolean
}

declare interface ConVars {
	GetInt(convar_name: string): number
	GetString(convar_name: string): string
	Set(convar_name: string, value: number | boolean): void
}

declare interface CustomGameEvents {
	FireEventToClient(name: string, player_ent_id: number, data: Uint8Array): void
	FireEventToAllClients(name: string, data: Uint8Array): void
	FireEventToServer(name: string, data: Uint8Array): void
}

declare interface Minimap {
	SendPing(type?: number, direct_ping?: boolean, target?: number): void // pass location: Vector2 at IOBuffer offset 0
	SendLine(x: number, y: number, initial: boolean): void
	/**
	 * Draws icon at minimap
	 * @param icon_name can be found at https://github.com/SteamDatabase/GameTracking-Dota2/blob/master/game/dota/pak01_dir/scripts/mod_textures.txt
	 * @param size you can get that value for heroes from ConVars.GetInt("dota_minimap_hero_size")
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide icon from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color/icon, or specify 0x80000000 to make it unique
	 */
	DrawIcon(icon_name: string, size: number, end_time: number, uid: number): void // pass pos: Vector3 at IOBuffer offset 0, color: Color at IOBuffer offset 3
	/**
	 * Draws ping at minimap
	 * @param end_time Must be for ex. Game.RawGameTime + ConVars.GetInt("dota_minimap_ping_duration").
	 * @param end_time Changing it to 1 will hide ping from minimap if you're not calling it repeatedly in Draw event.
	 * @param end_time If it's <= 0 it'll be infinity for DotA.
	 * @param uid you can use this value to edit existing uid's location/color, or specify 0x80000000 to make it unique
	 */
	DrawPing(end_time: number, uid: number): void // pass pos: Vector3 at IOBuffer offset 0, color: Color at IOBuffer offset 3
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
	CreateFont(name: string, weight: number, width: number, italic: boolean): number
	CreateFontFromData(buf: ArrayBuffer): number
	FreeFont(font_id: number): void
	/**
	 * Pass size: number at IOBuffer offset 0, scaleX: number at IOBuffer offset 1, skewX: number at IOBuffer offset 2
	 * @returns size: Vector2 to IOBuffer at offset 0
	 */
	GetTextSize(text: string, font_id: number): void
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
	GetTextSize(text: string, font_id: number): boolean // returns Vector2 to IOBuffer offset 0
	ExecuteCommandBuffer(buf: Uint8Array): void
}

declare interface Camera {
	Distance: number
	Angles: boolean // returns QAngle to IOBuffer offset 0 on get, sets from IOBuffer offset 0 on set
	Position: boolean // returns Vector3 to IOBuffer offset 0 on get, sets from IOBuffer offset 0 on set
}

/// GLOBAL FUNCTIONS

declare function SendToConsole(command: string): void
declare function fread(path: string): ArrayBuffer | undefined
declare function fexists(path: string): boolean
declare function requestPlayerData(player_id: number): Promise<string>
/**
 * @param path pass empty to read from confings/../settings.json
 */
declare function readConfig(path: string): Promise<ArrayBuffer>
declare function writeConfig(path: string, data: ArrayBuffer): void
declare function GetLevelName(): string
declare function GetLevelNameShort(): string
declare function PrepareUnitOrders(obj: { // pass Position: Vector3 at IOBuffer offset 0
	OrderType: number,
	Target?: number,
	Ability?: number,
	OrderIssuer?: number,
	Issuers?: number[] | number,
	Queue?: boolean,
	ShowEffects?: boolean
}): void
declare function SelectUnit(ent: number, bAddToGroup: boolean): boolean
declare function GetLatency(flow: number): number
declare function GetAvgLatency(flow: number): number
declare function GetUIState(): number
declare function ChatWheelAbuse(str: string): void
declare function StartFindingMatch(): void
declare function SendGCPingResponse(): void
declare function AcceptMatch(): void
declare function ToggleFakeChat(state: boolean): void
declare function ToggleOBSBypass(state: boolean): void
declare function setFireEvent(func: (event_name: string, cancellable: boolean, ...args: any) => boolean): void
declare function require(absolute_path: string): any
declare function GetHeapStatistics(): {
	total_heap_size: bigint
	total_heap_size_executable: bigint
	total_physical_size: bigint
	total_available_size: bigint
	used_heap_size: bigint
	heap_size_limit: bigint
	malloced_memory: bigint
	external_memory: bigint
	peak_malloced_memory: bigint
	number_of_native_contexts: bigint
	number_of_detached_contexts: bigint
	does_zap_garbage: bigint
}
declare function hrtime(): number
declare function AddSearchPath(path: string): boolean
declare function RemoveSearchPath(path: string): boolean
declare function SetTreeModel(model_name: string, scale: number): void
declare function EmitChatEvent(
	type: number, // DOTA_CHAT_MESSAGE
	value: number,
	playerid_1: number,
	playerid_2: number,
	playerid_3: number,
	playerid_4: number,
	playerid_5: number,
	playerid_6: number,
	value2: number,
	value3: number
): void
declare function EmitStartSoundEvent( // pass location: Vector2 at IOBuffer offset 0
	soundevent_hash: number,
	source_entity_index: number,
	seed: number
): void
declare function EnforceEntityVisibility(
	entity_id: number,
	team_num: number,
	is_visible: boolean
): void
declare function GetEntityCollisionRadius(entity_id: number): number | undefined
/**
 * @returns Vector2 to IOBuffer offset 0
 */
declare function GetEntityAttachment(entity_id: number, attachment_name: string): void
declare function GetEntityUnitState(entity_id: number): bigint | undefined
declare function GetUnitNumberPropertyByName(entity_id: number, name: string): number | undefined
/**
 * treat IOBuffer as DataView for this function
 * every element should consist of [u32, u32, u8] = [(entity_id << 1) or (binary_id << 1) | 1, color_u32, RenderMode_t]
 * @param count count of elements in IOBuffer
 */
declare function BatchSetEntityColor(count: number): void
/**
 * treat IOBuffer as DataView for this function
 * every element should consist of [u32, u32] = [(entity_id << 1) or (binary_id << 1) | 1, color_u32]
 * @param count count of elements in IOBuffer
 */
declare function BatchSetEntityGlow(count: number): void
declare function GetPlayerMuteFlags(steamid64: bigint): number
