declare class EntityManager {
	readonly AllEntities: C_BaseEntity[];
	readonly EntitiesIDs: C_BaseEntity[];
	
	GetEntityID(ent: C_BaseEntity): number
	GetEntityByID(id: number): C_BaseEntity
}
declare var Entities: EntityManager;

type Listener = (...args: any) => false | any
declare class EventEmitter {
	public on(name: string, listener: Listener): EventEmitter
	public removeListener(name: string, listener: Listener): EventEmitter
	//public removeAllListeners(): EventEmitter
	public emit(name: string, cancellable?: boolean, ...args: any[]): boolean
	public once(name: string, listener: Listener): EventEmitter
}

declare interface Events extends EventEmitter {
	on(name: "onGameStarted", callback: (pl_ent: C_DOTA_BaseNPC_Hero) => void): EventEmitter
	on(name: "onGameEnded", callback: () => void): EventEmitter
	/**
	 * Also, this event emitted about ALL entities that have already been created before reloading scripts
	 */
	on(name: "onEntityCreated", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	on(name: "onNPCCreated", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	on(name: "onEntityDestroyed", callback: (ent: C_BaseEntity, id: number) => void): EventEmitter
	on(name: "onWndProc", callback: (message_type: number, wParam: bigint, lParam: bigint) => false | any): EventEmitter
	on(name: "onTick", callback: () => void): EventEmitter
	on(name: "onUpdate", callback: (cmd: CUserCmd) => void): EventEmitter
	on(name: "onUnitStateChanged", callback: (npc: C_DOTA_BaseNPC) => void): EventEmitter
	on(name: "onTeamVisibilityChanged", callback: (npc: C_DOTA_BaseNPC, new_m_iTaggedAsVisibleByTeam: number) => void): EventEmitter
	on(name: "onDraw", callback: () => void): EventEmitter
	on(name: "onParticleCreated", callback: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target: C_BaseEntity | number) => void): EventEmitter
	on(name: "onParticleUpdated", callback: (id: number, control_point: number) => void): EventEmitter // position: Vector3 at IOBuffer offset 0
	on(name: "onParticleUpdatedEnt", callback: ( // fallback_position: Vector3 at IOBuffer offset 0
		id: number,
		control_point: number,
		ent: C_BaseEntity | number,
		attach: ParticleAttachment_t,
		attachment: number,
		include_wearables: boolean
	) => void): EventEmitter
	on(name: "onBloodImpact", callback: (target: C_BaseEntity | number, scale: number, xnormal: number, ynormal: number) => void): EventEmitter
	on(name: "onPrepareUnitOrders", callback: (order: CUnitOrder) => false | any): EventEmitter
	on(name: "onLinearProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: LinearProjectile,
		ent: C_BaseEntity | number,
		path: string,
		particleSystemHandle: bigint,
		max_speed: number,
		fow_radius: number,
		sticky_fow_reveal: boolean,
		distance: number
	) => void): EventEmitter
	on(name: "onLinearProjectileDestroyed", callback: (proj: LinearProjectile) => void): EventEmitter
	on(name: "onTrackingProjectileCreated", callback: ( // colorgemcolor: Color at IOBuffer offset 0
		proj: TrackingProjectile,
		sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		maximpacttime: number,
		launch_tick: number
	) => void): EventEmitter
	on(name: "onTrackingProjectileUpdated", callback: ( // vSourceLoc: Vector3 at IOBuffer offset 0, colorgemcolor: Color at IOBuffer offset 3
		proj: TrackingProjectile,
		path: string,
		particleSystemHandle: bigint,
		launch_tick: number
	) => void): EventEmitter
	on(name: "onTrackingProjectileDestroyed", callback: (proj: TrackingProjectile) => void): EventEmitter
	on(name: "onUnitAnimation", callback: (
		npc: C_DOTA_BaseNPC,
		sequenceVariant: number,
		playbackrate: number,
		castpoint: number,
		type: number,
		activity: number
	) => void): EventEmitter
	on(name: "onUnitAnimationEnd", callback: (
		npc: C_DOTA_BaseNPC,
		snap: boolean
	) => void): EventEmitter
	on(name: "onBuffAdded", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	on(name: "onBuffRemoved", listener: (npc: C_DOTA_BaseNPC, buff: CDOTA_Buff) => void): EventEmitter
	on(name: "onBuffStackCountChanged", listener: (buff: CDOTA_Buff) => void): EventEmitter
	on(name: "onCustomGameEvent", listener: (event_name: string, obj: any) => void): EventEmitter
	on(name: "onNetworkFieldChanged", listener: (object: any, name: string) => void): EventEmitter
}
declare var Events: Events
