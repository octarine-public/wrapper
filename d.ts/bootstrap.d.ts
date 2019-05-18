declare class EntityManager {
	readonly AllEntities: C_BaseEntity[];
	readonly EntitiesIDs: C_BaseEntity[];
	
	GetEntityID(ent: C_BaseEntity): number
	GetEntityByID(id: number): C_BaseEntity
}
declare var Entities: EntityManager;

type Listener = (...args: any) => false | any
declare class EventEmitter {
	public on(name: "onGameStarted", callback: (pl_ent: C_DOTA_BaseNPC_Hero) => void): EventEmitter
	public on(name: "onGameEnded", callback: () => void): EventEmitter
	/**
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 */
	public on(name: "onEntityCreated", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	public on(name: "onNPCCreated", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	public on(name: "onEntityDestroyed", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	public on(name: "onWndProc", callback: (message_type: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	public on(name: "onTick", callback: () => void): EventEmitter
	public on(name: "onUpdate", callback: (cmd: CUserCmd) => void): EventEmitter
	public on(name: "onUnitStateChanged", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	public on(name: "onTeamVisibilityChanged", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	public on(name: "onDraw", callback: () => void): EventEmitter
	public on(name: "onParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: C_BaseEntity) => void): EventEmitter
	public on(name: "onParticleUpdated", callback: (id: number, control_point: number) => void): EventEmitter // position: Vector3 at IOBuffer offset 0
	public on(name: "onParticleUpdatedEnt", callback: ( // fallback_position: Vector3 at IOBuffer offset 0
		id: number,
		control_point: number,
		ent: C_BaseEntity,
		attach: ParticleAttachment_t,
		attachment: number,
		include_wearables: boolean
	) => void): EventEmitter
	public on(name: "onBloodImpact", callback: (target: C_BaseEntity, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	public on(name: "onPrepareUnitOrders", callback: (order: CUnitOrder) => false | any): EventEmitter
	public on(name: "onLinearProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: LinearProjectile,
		ent: C_BaseEntity,
		path: string,
		particleSystemHandle: bigint,
		max_speed: number,
		fow_radius: number,
		sticky_fow_reveal: boolean,
		distance: number
	) => void): EventEmitter
	public on(name: "onLinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	public on(name: "onTrackingProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		launch_tick: number
	) => void): EventEmitter
	public on(name: "onTrackingProjectileUpdated", callback: ( // vSourceLoc: Vector3 at IOBuffer offset 0, colorgemcolor: Color at IOBuffer offset 3
		proj: TrackingProjectile,
		path: string,
		particleSystemHandle: bigint,
		launch_tick: number
	) => void): EventEmitter
	public on(name: "onTrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	public on(name: "onUnitAnimation", callback: (
		npc: C_DOTA_BaseNPC,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): EventEmitter
	public on(name: "onUnitAnimationEnd", callback: (
		npc: C_DOTA_BaseNPC,
		snap: boolean
	) => void): EventEmitter
	public on(name: "onBuffAdded", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	public on(name: "onBuffRemoved", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	public on(name: "onBuffStackCountChanged", listener: (buff: CDOTA_Buff) => void): EventEmitter
	public on(name: "onCustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	public on(name: "onNetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
	public on(name: string, listener: Listener): EventEmitter
	public removeListener(name: string, listener: Listener): EventEmitter
	//public removeAllListeners(): EventEmitter
	public emit(name: string, cancellable?: boolean, ...args: any[]): boolean
	public once(name: string, listener: Listener): EventEmitter
}
declare var Events: EventEmitter
