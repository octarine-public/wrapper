import { ParticleAttachment } from "../Enums/ParticleAttachment"
import { EntityManager } from "../Managers/EntityManager"
import { EventsSDK } from "../Managers/EventsSDK"
import { Ability } from "../Objects/Base/Ability"
import { FakeUnit } from "../Objects/Base/FakeUnit"
import { Item } from "../Objects/Base/Item"
import { Unit } from "../Objects/Base/Unit"
import { GetMapNumberProperty, GetMapStringProperty } from "../Resources/ParseUtils"
import { GameState } from "../Utils/GameState"
import { readJSON } from "../Utils/Utils"
import { QAngle } from "./QAngle"
import { Vector3 } from "./Vector3"
import { Vector4 } from "./Vector4"

interface ISourceData {
	controlPointEnt?: number
	isTeamReverted?: boolean
	findCaster?: boolean
	isAttachedTo?: boolean
	isModifiersAttachedTo?: boolean
}

interface ITargetData {
	controlPointEnt?: number
	isAttachedTo?: boolean
	isModifiersAttachedTo?: boolean
}

interface INetworkedParticleData {
	attach: number
	abilityName: string | string[]
	source: ISourceData
	target?: ITargetData
	secondTarget?: ITargetData
}

const networkedParticleData = new Map<string, INetworkedParticleData>(
	Object.entries(readJSON("network_particles.json"))
)

function ApproximateParticleLifetimeInternal(path: string): number {
	if (!path.endsWith("_c")) {
		path += "_c"
	}
	const kv = parseKV(path)
	if (kv.size === 0) {
		console.log(`Failed parsing particle KV at ${path}`)
		return 0
	}

	let res = 0
	const initializers = kv.get("m_Initializers")
	if (Array.isArray(initializers) || initializers instanceof Map) {
		initializers.forEach((initializer: RecursiveMapValue) => {
			if (!(initializer instanceof Map)) {
				return
			}
			switch (initializer.get("_class")) {
				case "C_INIT_RandomLifeTime": {
					let min = GetMapNumberProperty(initializer, "m_fLifetimeMin"),
						max = GetMapNumberProperty(initializer, "m_fLifetimeMax")
					const oldMin = min
					if (min > max) {
						min = max
						max = oldMin
					}
					res += min + Math.random() * (max - min)
					break
				}
				default:
					break
			}
		})
	}

	let hasDecay = false
	const operators = kv.get("m_Operators")
	if (Array.isArray(operators) || operators instanceof Map) {
		operators.forEach((operator: RecursiveMapValue) => {
			if (!(operator instanceof Map)) {
				return
			}
			switch (operator.get("_class")) {
				case "C_OP_Decay":
					res += GetMapNumberProperty(operator, "m_flOpStartFadeInTime")
					hasDecay = true
					break
				case "C_OP_FadeAndKill":
					hasDecay = true
					break
				default:
					break
			}
		})
	}

	if (!hasDecay) {
		return -1
	}

	let maxChildRes = 0
	const children = kv.get("m_Children")
	if (Array.isArray(children) || children instanceof Map) {
		children.forEach((child: RecursiveMapValue) => {
			if (!(child instanceof Map) || child.get("m_bDisableChild")) {
				return
			}
			const childRes = ApproximateParticleLifetime(
				GetMapStringProperty(child, "m_ChildRef")
			)
			if (childRes === -1) {
				return -1
			}
			maxChildRes = Math.max(maxChildRes, childRes)
		})
	}
	return res + maxChildRes
}

const ParticlesLifetimeCache = new Map<string, number>()
function ApproximateParticleLifetime(path: string): number {
	if (ParticlesLifetimeCache.has(path)) {
		return ParticlesLifetimeCache.get(path)!
	}
	const res = ApproximateParticleLifetimeInternal(path)
	ParticlesLifetimeCache.set(path, res)
	return res
}

export class NetworkedParticle {
	public static readonly Instances = new Map<number, NetworkedParticle>()
	public readonly ControlPoints = new Map<number, Vector3>()
	public readonly ControlPointsSnapshot = new Map<number, string>()
	public readonly ControlPointsModel = new Map<number, string>()
	public readonly ControlPointsForward = new Map<number, Vector3>()
	public readonly ControlPointsQuaternion = new Map<number, Vector4>()
	public readonly ControlPointsFallback = new Map<number, Vector3>()
	public readonly ControlPointsOrient = new Map<number, [Vector3, Vector3, Vector3]>()
	public readonly ControlPointsOffset = new Map<number, [Vector3, QAngle]>()
	public readonly ControlPointsEnt = new Map<
		number,
		[Unit | FakeUnit, ParticleAttachment, number, boolean]
	>()
	public readonly TextureAttributes = new Map<string, string>()
	public readonly EndTime: number
	public readonly PathNoEcon: string
	public AbilityIndex: Nullable<number> = undefined
	public SourceIndex: Nullable<number> = undefined
	public TargetIndex: Nullable<number> = undefined
	public SecondTargetIndex: Nullable<number> = undefined

	public Released = false
	public ShouldDraw = true
	public FrozenAt = -1
	public Text = ""

	constructor(
		public readonly Index: number,
		public readonly Path: string,
		public readonly ParticleSystemHandle: bigint,
		public readonly Attach: ParticleAttachment,
		public AttachedTo: Nullable<Unit | FakeUnit>,
		public ModifiersAttachedTo: Nullable<Unit | FakeUnit>
	) {
		this.PathNoEcon = GetOriginalParticlePath(this.Path)
		this.UpdateData(this.PathNoEcon)
		NetworkedParticle.Instances.set(this.Index, this)
		this.EndTime = ApproximateParticleLifetime(this.Path)
		if (this.EndTime !== -1) {
			this.EndTime += GameState.RawGameTime
		}
	}
	public get Ability(): Nullable<Ability> {
		return EntityManager.EntityByIndex<Ability>(this.AbilityIndex)
	}
	public get Source(): Nullable<Unit> {
		return EntityManager.EntityByIndex<Unit>(this.SourceIndex)
	}
	public get Target(): Nullable<Unit> {
		return EntityManager.EntityByIndex<Unit>(this.TargetIndex)
	}
	public get SecondTarget(): Nullable<Unit> {
		return EntityManager.EntityByIndex<Unit>(this.SecondTargetIndex)
	}
	public Destroy(): void {
		NetworkedParticle.Instances.delete(this.Index)
		EventsSDK.emit("ParticleDestroyed", false, this)
	}
	public UpdateData(pathNoEcon: string) {
		this.setParticleData(pathNoEcon)
	}
	private setParticleData(pathNoEcon: string): void {
		const obj = networkedParticleData.get(pathNoEcon)
		if (obj === undefined) {
			return
		}
		const { target, secondTarget, source, abilityName, attach } = obj
		if (attach !== this.Attach) {
			return
		}
		if (target !== undefined) {
			this.TargetIndex = this.getTarget(target)?.Index
		}
		if (secondTarget !== undefined) {
			this.SecondTargetIndex = this.getTarget(secondTarget)?.Index
		}
		let caster = this.getCaster(source)
		const ability = this.getAbility(
			abilityName,
			caster,
			this.Target ?? this.SecondTarget,
			source
		)
		if (caster === undefined) {
			caster = ability?.Owner
		}

		this.SourceIndex = caster?.Index
		this.AbilityIndex = ability?.Index

		// TODO
		// unit.LastRealPredictedPositionUpdate = GameState.RawGameTime
		// unit.LastPredictedPositionUpdate = GameState.RawGameTime
		// if (this.Target !== undefined) {
		// 	this.Target.IsFogVisible = !this.Target.IsVisible
		// }
		// if (this.Source !== undefined) {
		// 	this.Source.IsFogVisible = !this.Source.IsVisible
		// }
	}
	private getCaster({
		controlPointEnt,
		isAttachedTo,
		isModifiersAttachedTo
	}: ISourceData): Nullable<Unit> {
		if (controlPointEnt !== undefined) {
			const ent = this.ControlPointsEnt.get(controlPointEnt)?.[0]
			return ent instanceof Unit ? ent : undefined
		}
		if (isAttachedTo && isModifiersAttachedTo) {
			if (this.ModifiersAttachedTo === undefined) {
				return this.AttachedTo instanceof Unit ? this.AttachedTo : undefined
			}
			const ent = this.ModifiersAttachedTo ?? this.AttachedTo
			return ent instanceof Unit ? ent : undefined
		}
		if (isAttachedTo && this.AttachedTo instanceof Unit) {
			return this.AttachedTo
		}
		if (isModifiersAttachedTo && this.ModifiersAttachedTo instanceof Unit) {
			return this.ModifiersAttachedTo
		}
		return undefined
	}
	private getTarget({
		controlPointEnt,
		isAttachedTo,
		isModifiersAttachedTo
	}: ITargetData): Nullable<Unit> {
		if (isAttachedTo && this.AttachedTo instanceof Unit) {
			return this.AttachedTo
		}
		if (isModifiersAttachedTo && this.ModifiersAttachedTo instanceof Unit) {
			return this.ModifiersAttachedTo
		}
		const ent = this.ControlPointsEnt.get(
			controlPointEnt ?? EntityManager.INVALID_INDEX
		)?.[0]
		return ent instanceof Unit ? ent : undefined
	}
	private getAbility(
		name: string | string[],
		caster: Nullable<Unit>,
		target: Nullable<Unit>,
		{ isTeamReverted, findCaster }: ISourceData
	): Nullable<Ability> {
		if (Array.isArray(name)) {
			for (let i = name.length - 1; i > -1; i--) {
				const ability = this.getAbility(name[i], caster, target, {
					isTeamReverted,
					findCaster
				})
				if (ability !== undefined) {
					return ability
				}
			}
			return undefined
		}
		const constructor = EntityManager.GetConstructorByName<Ability>(name)
		if (constructor === undefined) {
			return undefined
		}
		if (
			!(constructor.prototype instanceof Ability) &&
			!(constructor.prototype instanceof Item)
		) {
			return undefined
		}
		if (caster !== undefined || findCaster === undefined) {
			return EntityManager.GetEntitiesByClass(constructor).find(
				x => x.Owner === caster && x.Level !== 0
			)
		}
		const abilities = EntityManager.GetEntitiesByClass(constructor).orderBy(
			x => x.Cooldown
		)
		return isTeamReverted
			? abilities.find(x => x.Level !== 0 && x.IsEnemy())
			: abilities.find(x => x.Level !== 0 && !x.IsEnemy(target))
	}
}
