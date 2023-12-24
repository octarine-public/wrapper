/// GLOBAL TYPES

/// GLOBAL OBJECTS
declare var IOBuffer: Float32Array // 128 floats in size
declare var IOBufferView: DataView // IOBuffer DataView
/**
struct CUnitOrder {
	uint32_t order_type; // 0
	uint32_t issuer; // 4
	Vector3 position; // 8
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
declare var WorldUtils: WorldUtils
declare var Camera: Camera
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
	SetInFogVisible(particleID: number, value: boolean): void
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

declare interface WorldUtils {
	/**
	 * @returns MinMapCoords: Vector2 to IOBuffer offset 0,
	 *          MapSize: Vector2 to IOBuffer offset 2,
	 *          and return value is true if function succeeded
	 */
	GetHeightMapData(): boolean
	
	GetHeightForLocation(x: number, y: number): number
	IsPointUnderWater(x: number, y: number): boolean
	GetLocationAverageHeight(x: number, y: number, count: number, distance: number): number

	/**
	 * Pass world_vec: Vector3 at IOBuffer offset 0,
	 *      camera_pos: Vector3 at IOBuffer offset 3,
	 *      camera_ang: QAngle at IOBuffer offset 6,
	 *      camera_dist: float at IOBuffer offset 9,
	 *      window_size: Vector2 at IOBuffer offset 10
	 * 
	 * @returns screen: Vector3 at IOBuffer offset 0,
	 *          return value is true if it succeeded
	 */
	WorldToScreen(): boolean
	/**
	 * Pass world_vec: Vector3 at IOBuffer offset 0
	 * 
	 * @returns screen: Vector3 at IOBuffer offset 0,
	 *          return value is true if it succeeded
	 */
	WorldToScreenNew(): boolean
	/**
	 * Pass screen: Vector2 at IOBuffer offset 0,
	 *      camera_pos: Vector3 at IOBuffer offset 2,
	 *      camera_ang: QAngle at IOBuffer offset 5,
	 *      camera_dist: float at IOBuffer offset 8,
	 *      window_size: Vector2 at IOBuffer offset 9
	 * 
	 * @returns world_vec: Vector3 at IOBuffer offset 0
	 */
	ScreenToWorld(): void
	/**
	 * Pass window_size: Vector2 at IOBuffer offset 0,
	 *      camera_angles: Vector3 at IOBuffer offset 2,
	 *      fov: float at IOBuffer offset 5,
	 *      screen: Vector2 at IOBuffer offset 6
	 * 
	 * @returns ray: Vector3 at IOBuffer offset 0
	 */
	GetCursorRay(): void
	/**
	 * Pass window_size: Vector2 at IOBuffer offset 0,
	 *      camera_pos: Vector3 at IOBuffer offset 2,
	 *      camera_ang: QAngle at IOBuffer offset 5,
	 *      camera_dist: float at IOBuffer offset 8,
	 *      fov: float at IOBuffer offset 9,
	 *      screens_count: float at IOBuffer offset 10,
	 *      screens: Vector2[screens_count] at IOBuffer offset 11
	 * 
	 * @returns screens_results: Vector3[screens_count] at IOBuffer offset 0
	 */
	ScreenToWorldFar(): void
	/**
	 * Pass ray_origin: Vector3 at IOBuffer offset 0,
	 *      ray_dir: QAngle at IOBuffer offset 3,
	 *      count: float at IOBuffer offset 6,
	 *      bboxes: Vector2[count * 2] at IOBuffer offset 7, where 0 is min, 1 is max
	 * 
	 * @returns res: bool[count] at IOBuffer offset 0
	 */
	BatchCheckRayBox(): void
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

declare interface AnimationActivityData {
	readonly name: string
	readonly activity: number
	readonly flags: number
	readonly weight: number
}

declare interface AnimationData {
	readonly name: string
	readonly activities: AnimationActivityData[]
	readonly hasMovement: boolean
	readonly frameCount: number
	readonly fps: number
}

declare class ModelData {
	public readonly animations: AnimationData[]
	public readonly attachments: string[]

	/**
	 * @returns min: Vector3 to IOBuffer offset 0, max: Vector3 to IOBuffer offset 3
	 */
	public getBounds(): void

	/**
	 * @param animationID ID in animations array, or -1 for default static skeleton
	 * @param attachmentID ID in attachments array
	 * @param time time of animation, in seconds
	 * @param scale scale of the model
	 * 
	 * Pass Position: Vector3 at IOBuffer offset 0,
	 *      Angle: QAngle at IOBuffer offset 3
	 * 
	 * @returns position: Vector3 to IOBuffer offset 0,
	 *          angle: QAngle at IOBuffer offset 3
	 */
	public getAttachmentData(
		animationID: number,
		attachmentID: number,
		time: number,
		scale: number,
	): void

	/**
	 * @param animationID ID in animations array, or -1 for default static skeleton
	 * @param attachmentID ID in attachments array
	 * @param time time of animation, in seconds
	 * 
	 * Pass mat: Matrix3x4 at IOBuffer offset 0
	 * 
	 * @returns mat: Matrix3x4 to IOBuffer offset 0
	 */
	public getAttachmentMatrix(
		animationID: number,
		attachmentID: number,
		time: number,
	): void
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
	Flags?: number
}): void
declare function GetLatency(flow: number): number
declare function GetAvgLatency(flow: number): number
declare function StartFindingMatch(): void
declare function SendGCPingResponse(): void
declare function AcceptMatch(): void
declare function ToggleRequestUserCmd(state: boolean): void

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
 * Pass location: Vector2 at IOBuffer offset 0
 */
declare function SendMinimapPing(
	type?: number,
	directPing?: boolean,
	target?: number
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

declare function GetModelData(path: string): Promise<ModelData>
