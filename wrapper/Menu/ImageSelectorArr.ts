import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import {
	GetHeroTexture,
	GetItemTexture,
	GetRuneTexture,
	GetSpellTexture
} from "../Data/ImageData"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

// every icon: 32x32, 1x1 border
export class ImageSelectorArray extends Base {
	public static OnWindowSizeChanged(): void {
		ImageSelectorArray.imageBorderWidth = GUIInfo.ScaleWidth(2)
		ImageSelectorArray.imageGap = GUIInfo.ScaleWidth(2)
		ImageSelectorArray.baseImageHeight = GUIInfo.ScaleHeight(32)
		ImageSelectorArray.randomHeightValue = GUIInfo.ScaleHeight(40)
	}

	private static imageBorderWidth = 0
	private static imageGap = 0
	private static baseImageHeight = 0
	private static randomHeightValue = 0
	private static readonly elementsPerRow = 5
	private static readonly imageActivatedBorderColor = new Color(104, 4, 255)

	public enabledValues: [string, boolean][]
	protected readonly imageSize = new Vector2()
	protected renderedPaths: string[] = []

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		public readonly defaultValues: [string, boolean][] = [],
		tooltip = ""
	) {
		super(parent, name, tooltip)
		this.enabledValues = defaultValues
	}

	public get IsZeroSelected(): boolean {
		const arr = this.enabledValues
		for (let index = arr.length - 1; index > -1; index--) {
			const [, state] = arr[index]
			if (state) {
				return false
			}
		}
		return true
	}

	public get IconsRect() {
		const basePos = this.Position.Add(this.textOffset).AddScalarY(this.nameSize.y + 3)
		return new Rectangle(
			basePos,
			basePos
				.Add(
					this.imageSize
						.AddScalar(
							ImageSelectorArray.imageBorderWidth * 2 +
								ImageSelectorArray.imageGap
						)
						.MultiplyScalarX(
							Math.min(
								this.values.length,
								ImageSelectorArray.elementsPerRow
							)
						)
						.MultiplyScalarY(
							Math.ceil(
								this.values.length / ImageSelectorArray.elementsPerRow
							)
						)
				)
				.SubtractScalar(
					(ImageSelectorArray.elementsPerRow - 1) * ImageSelectorArray.imageGap
				)
		)
	}

	public get ConfigValue() {
		return this.enabledValues
	}
	public set ConfigValue(value) {
		if (
			this.ShouldIgnoreNewConfigValue ||
			value === undefined ||
			!Array.isArray(value)
		) {
			return
		}
		this.enabledValues = value
		this.UpdateEnabledValues()
	}

	public get ClassPriority(): number {
		return 6
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}

		const values = this.values
		this.imageSize.x = this.imageSize.y = ImageSelectorArray.baseImageHeight
		this.renderedPaths = []

		for (let index = 0, end = values.length; index < end; index++) {
			let path = values[index]
			if (!path.startsWith("npc_dota_hero_")) {
				path = path.startsWith("item_")
					? GetItemTexture(path)
					: GetSpellTexture(path)
			} else if (path.startsWith("rune_")) {
				path = GetRuneTexture(path)
			} else if (path.startsWith("item_bottle_")) {
				path = `panorama/images/items/${path.substring(5)}_png.vtex_c`
			} else {
				path = GetHeroTexture(path)
			}
			const pathIamgeSize = RendererSDK.GetImageSize(path)
			this.imageSize.x = Math.max(
				this.imageSize.x,
				ImageSelectorArray.baseImageHeight * (pathIamgeSize.x / pathIamgeSize.y)
			)
			this.renderedPaths.push(path)
		}
		this.Size.x =
			Math.max(
				this.nameSize.x,
				Math.min(this.values.length, ImageSelectorArray.elementsPerRow) *
					(this.imageSize.x +
						ImageSelectorArray.imageBorderWidth * 2 +
						ImageSelectorArray.imageGap)
			) +
			this.textOffset.x * 2
		this.Size.y =
			Math.ceil(this.values.length / ImageSelectorArray.elementsPerRow) *
				(this.imageSize.y +
					ImageSelectorArray.imageBorderWidth * 2 +
					ImageSelectorArray.imageGap) +
			ImageSelectorArray.randomHeightValue
		return true
	}

	public IsEnabled(value: string): boolean {
		return this.enabledValues.some(([name, state]) => name === value && state)
	}

	public IsEnabledID(id: number): boolean {
		return this.IsEnabled(this.values[id])
	}

	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))
		const basePos = this.IconsRect.pos1
		for (let index = 0, end = this.values.length; index < end; index++) {
			const imagePath = this.renderedPaths[index]
			if (imagePath === undefined) {
				continue
			}
			const size = this.imageSize,
				pos = new Vector2(
					index % ImageSelectorArray.elementsPerRow,
					Math.floor(index / ImageSelectorArray.elementsPerRow)
				)
					.Multiply(
						this.imageSize.AddScalar(
							ImageSelectorArray.imageBorderWidth * 2 +
								ImageSelectorArray.imageGap
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
					ImageSelectorArray.imageBorderWidth,
					ImageSelectorArray.imageActivatedBorderColor
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
		for (let i = 0, end = this.values.length; i < end; i++) {
			const basePos = new Vector2(
				i % ImageSelectorArray.elementsPerRow,
				Math.floor(i / ImageSelectorArray.elementsPerRow)
			).Multiply(
				this.imageSize.AddScalar(
					ImageSelectorArray.imageBorderWidth * 2 + ImageSelectorArray.imageGap
				)
			)
			if (!new Rectangle(basePos, basePos.Add(this.imageSize)).Contains(off)) {
				continue
			}
			this.enabledValues[i][1] = !this.IsEnabled(this.values[i])
			this.TriggerOnValueChangedCBs()
			break
		}
		return false
	}

	protected UpdateEnabledValues() {
		for (let i = 0, end = this.values.length; i < end; i++) {
			const name = this.values[i]
			if (this.enabledValues[i] === undefined) {
				this.enabledValues.push([name, true])
				continue
			}
			this.enabledValues[i][1] = this.IsEnabled(name)
		}
	}
}

EventsSDK.on("WindowSizeChanged", () => ImageSelectorArray.OnWindowSizeChanged())
