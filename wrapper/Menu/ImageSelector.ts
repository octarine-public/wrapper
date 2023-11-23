import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import { Base, IMenu } from "./Base"

// every icon: 32x32, 1x1 border
export class ImageSelector extends Base {
	public static OnWindowSizeChanged(): void {
		ImageSelector.imageBorderWidth = GUIInfo.ScaleWidth(2)
		ImageSelector.imageGap = GUIInfo.ScaleWidth(2)
		ImageSelector.baseImageHeight = GUIInfo.ScaleHeight(32)
		ImageSelector.randomHeightValue = GUIInfo.ScaleHeight(40)
	}

	private static imageBorderWidth = 0
	private static imageGap = 0
	private static baseImageHeight = 0
	private static randomHeightValue = 0
	private static readonly elementsPerRow = 5
	private static readonly imageActivatedBorderColor = new Color(104, 4, 255)

	public enabledValues: Map<string, boolean>
	protected readonly imageSize = new Vector2()
	protected renderedPaths: string[] = []

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		defaultValues = new Map<string, boolean>(),
		tooltip = "",
		public createdDefaultState = false
	) {
		super(parent, name, tooltip)
		this.enabledValues = defaultValues
	}

	// TODO: check current state
	public get IsZeroSelected(): boolean {
		let state = false
		this.enabledValues.forEach((_, value) => {
			if (value) {
				return
			}
			state = true
		})
		return state
	}

	public get IconsRect() {
		const basePos = this.Position.Add(this.textOffset).AddScalarY(this.nameSize.y + 3)
		return new Rectangle(
			basePos,
			basePos
				.Add(
					this.imageSize
						.AddScalar(
							ImageSelector.imageBorderWidth * 2 + ImageSelector.imageGap
						)
						.MultiplyScalarX(
							Math.min(this.values.length, ImageSelector.elementsPerRow)
						)
						.MultiplyScalarY(
							Math.ceil(this.values.length / ImageSelector.elementsPerRow)
						)
				)
				.SubtractScalar(
					(ImageSelector.elementsPerRow - 1) * ImageSelector.imageGap
				)
		)
	}

	public get ConfigValue() {
		return Array.from(this.enabledValues.entries())
	}
	public set ConfigValue(value) {
		if (
			this.ShouldIgnoreNewConfigValue ||
			value === undefined ||
			!Array.isArray(value)
		) {
			return
		}
		this.enabledValues = new Map<string, boolean>(value)
		this.values.forEach(value_ => {
			if (!this.enabledValues.has(value_)) {
				this.enabledValues.set(value_, this.createdDefaultState)
			}
		})
	}

	public get ClassPriority(): number {
		return 6
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		this.values.forEach(value => {
			if (!this.enabledValues.has(value)) {
				this.enabledValues.set(value, this.createdDefaultState)
			}
		})
		this.imageSize.x = this.imageSize.y = ImageSelector.baseImageHeight
		this.renderedPaths = []
		for (let path of this.values) {
			if (path.startsWith("rune_")) {
				path = `panorama/images/spellicons/${path}_png.vtex_c`
			} else if (path.startsWith("item_bottle_")) {
				path = `panorama/images/items/${path.substring(5)}_png.vtex_c`
			} else if (!path.startsWith("npc_dota_hero_")) {
				const abil = AbilityData.GetAbilityByName(path)
				if (abil !== undefined) {
					path = abil.TexturePath
				}
			} else {
				path = `panorama/images/heroes/${path}_png.vtex_c`
			}
			const pathIamgeSize = RendererSDK.GetImageSize(path)
			this.imageSize.x = Math.max(
				this.imageSize.x,
				ImageSelector.baseImageHeight * (pathIamgeSize.x / pathIamgeSize.y)
			)
			this.renderedPaths.push(path)
		}
		this.Size.x =
			Math.max(
				this.nameSize.x,
				Math.min(this.values.length, ImageSelector.elementsPerRow) *
					(this.imageSize.x +
						ImageSelector.imageBorderWidth * 2 +
						ImageSelector.imageGap)
			) +
			this.textOffset.x * 2
		this.Size.y =
			Math.ceil(this.values.length / ImageSelector.elementsPerRow) *
				(this.imageSize.y +
					ImageSelector.imageBorderWidth * 2 +
					ImageSelector.imageGap) +
			ImageSelector.randomHeightValue
		return true
	}

	public IsEnabled(value: string): boolean {
		return this.enabledValues.get(value) ?? false
	}

	public IsEnabledID(id: number): boolean {
		return this.IsEnabled(this.values[id])
	}

	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))
		const basePos = this.IconsRect.pos1
		for (let index = this.values.length - 1; index > -1; index--) {
			const imagePath = this.renderedPaths[index]
			if (imagePath === undefined) {
				continue
			}
			const size = this.imageSize,
				pos = new Vector2(
					index % ImageSelector.elementsPerRow,
					Math.floor(index / ImageSelector.elementsPerRow)
				)
					.Multiply(
						this.imageSize.AddScalar(
							ImageSelector.imageBorderWidth * 2 + ImageSelector.imageGap
						)
					)
					.Add(basePos)

			RendererSDK.Image(
				imagePath,
				pos,
				-1,
				size,
				Color.White,
				0,
				undefined,
				!this.IsEnabled(this.values[index])
			)

			if (this.IsEnabled(this.values[index])) {
				RendererSDK.OutlinedRect(
					pos,
					size,
					ImageSelector.imageBorderWidth,
					ImageSelector.imageActivatedBorderColor
				)
			}
		}
	}

	public OnMouseLeftDown(): boolean {
		return !this.IconsRect.Contains(this.MousePosition)
	}

	public OnMouseLeftUp(): boolean {
		const rect = this.IconsRect
		if (!rect.Contains(this.MousePosition)) {
			return false
		}
		const off = rect.GetOffset(this.MousePosition)
		for (let i = 0; i < this.values.length; i++) {
			const basePos = new Vector2(
				i % ImageSelector.elementsPerRow,
				Math.floor(i / ImageSelector.elementsPerRow)
			).Multiply(
				this.imageSize.AddScalar(
					ImageSelector.imageBorderWidth * 2 + ImageSelector.imageGap
				)
			)
			if (!new Rectangle(basePos, basePos.Add(this.imageSize)).Contains(off)) {
				continue
			}
			const value = this.values[i]
			this.enabledValues.set(value, !this.IsEnabled(value))
			this.TriggerOnValueChangedCBs()
			break
		}
		return false
	}
}

EventsSDK.on("WindowSizeChanged", () => ImageSelector.OnWindowSizeChanged())
