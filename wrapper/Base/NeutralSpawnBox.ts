import { GetPositionHeight } from "../Native/WASM"
import { EntityPropertiesNode } from "./EntityProperties"
import { QAngle } from "./QAngle"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

type LoadFileType = Map<string, Map<string, string>>
const cacheTimingData = new Map<string, Map<string, string | Map<string, string>>>()

const loadFile = () =>
	parseKV<LoadFileType>("scripts/creep_pull_timings.txt").get("CREEP_PULL_TIMINGS") ??
	new Map()

function UpdateTimingData(): void {
	loadFile().forEach((map, name) => cacheTimingData.set(name, map))
}

// TODO: TeamData -> m_vecKnownClearCamps
export class NeutralSpawnBox {
	public readonly Angles = new QAngle()
	public readonly StackEnd: number = -1
	public readonly StackStart: number = -1

	constructor(public readonly properties: EntityPropertiesNode) {
		UpdateTimingData()
		this.SetAngleEvil()
		this.SetAngleGood()
		this.StackEnd = parseFloat(this.ParseStackData("stack_end"))
		this.StackStart = parseFloat(this.ParseStackData("stack_start"))
	}

	public get MinBounds(): Vector3 {
		return this.properties.get("m_vMinBounds") as Vector3
	}

	public get MaxBounds(): Vector3 {
		return this.properties.get("m_vMaxBounds") as Vector3
	}

	public get Center(): Vector3 {
		const vec = this.MinBounds.Add(this.MaxBounds).DivideScalarForThis(2)
		vec.SetZ(GetPositionHeight(vec))
		return vec
	}

	public get SpawnBoxOrigin(): Vector3 {
		return this.properties.get("vSpawnBoxOrigin") as Vector3
	}

	public get CampType(): number {
		return this.properties.get("nCampType") as number
	}

	public get CampName(): string {
		return this.properties.get("strCampName") as string
	}

	public Includes(vec: Vector3): boolean {
		const min = this.MinBounds
		const max = this.MaxBounds
		const minX = Math.min(min.x, max.x)
		const minY = Math.min(min.y, max.y)
		const minZ = Math.min(min.z, max.z)
		const maxX = Math.max(min.x, max.x)
		const maxY = Math.max(min.y, max.y)
		const maxZ = Math.max(min.z, max.z)
		return (
			vec.x >= minX &&
			vec.x <= maxX &&
			vec.y >= minY &&
			vec.y <= maxY &&
			vec.z >= minZ &&
			vec.z <= maxZ
		)
	}

	public Includes2D(vec: Vector2): boolean {
		const min = this.MinBounds
		const max = this.MaxBounds
		const minX = Math.min(min.x, max.x)
		const minY = Math.min(min.y, max.y)
		const maxX = Math.max(min.x, max.x)
		const maxY = Math.max(min.y, max.y)
		return vec.x >= minX && vec.x <= maxX && vec.y >= minY && vec.y <= maxY
	}

	public toJSON(): any {
		return {
			MinBounds: this.MinBounds,
			MaxBounds: this.MaxBounds,
			SpawnBoxOrigin: this.SpawnBoxOrigin,
			CampName: this.CampName
		}
	}

	protected ParseStackData(stackName: string) {
		const stack = cacheTimingData.get(this.CampName)?.get(stackName)
		if (stack === undefined || stack instanceof Map) {
			console.error(
				"Error parsing stack data",
				"stack",
				stack,
				"CampName",
				this.CampName,
				"stackName",
				stackName
			)
			return "-1"
		}
		return stack
	}

	protected SetAngleEvil() {
		switch (this.CampName) {
			case "neutralcamp_evil_1":
				this.Angles.SetY(70)
				break
			case "neutralcamp_evil_2":
				this.Angles.SetY(-225)
				break
			case "neutralcamp_evil_3":
				this.Angles.SetY(410)
				break
			case "neutralcamp_evil_4":
				this.Angles.SetY(-80)
				break
			case "neutralcamp_evil_5":
				this.Angles.SetY(63)
				break
			case "neutralcamp_evil_6":
				this.Angles.SetY(-80)
				break
			case "neutralcamp_evil_7":
				this.Angles.SetY(-62)
				break
			case "neutralcamp_evil_8":
				this.Angles.SetY(180)
				break
			case "neutralcamp_evil_9":
				this.Angles.SetY(116)
				break
			case "neutralcamp_evil_10":
				this.Angles.SetY(-132)
				break
			case "neutralcamp_evil_11":
				this.Angles.SetY(170)
				break
			case "neutralcamp_evil_12":
				this.Angles.SetY(180)
				break
			case "neutralcamp_evil_13":
				this.Angles.SetY(-147)
				break
			case "neutralcamp_evil_14":
				this.Angles.SetY(-105)
				break
			case "neutralcamp_evil_15":
				this.Angles.SetY(90)
				break
		}
	}

	protected SetAngleGood() {
		switch (this.CampName) {
			case "neutralcamp_good_1":
				this.Angles.SetY(90)
				break
			case "neutralcamp_good_2":
				this.Angles.SetY(-145)
				break
			case "neutralcamp_good_3":
				this.Angles.SetY(260)
				break
			case "neutralcamp_good_4":
				this.Angles.SetY(80)
				break
			case "neutralcamp_good_5":
				this.Angles.SetY(265)
				break
			case "neutralcamp_good_7":
				this.Angles.SetY(267)
				break
			case "neutralcamp_good_8":
				this.Angles.SetY(325)
				break
			case "neutralcamp_good_9":
				this.Angles.SetY(361)
				break
			case "neutralcamp_good_10":
				this.Angles.SetY(110)
				break
			case "neutralcamp_good_11":
				this.Angles.SetY(-55)
				break
			case "neutralcamp_good_12":
				this.Angles.SetY(105)
				break
			case "neutralcamp_good_13":
				this.Angles.SetY(36)
				break
			case "neutralcamp_good_14":
				this.Angles.SetY(20)
				break
			case "neutralcamp_good_15":
				this.Angles.SetY(275)
				break
			case "neutralcamp_good_16":
				this.Angles.SetY(35)
				break
		}
	}
}
