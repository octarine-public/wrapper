import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import {
	GetHeroTexture,
	GetItemTexture,
	GetRuneTexture,
	GetSpellTexture
} from "../Data/ImageData"
import { EventPriority } from "../Enums/EventPriority"
import { ScaleHeight, ScaleWidth } from "../GUI/Helpers"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

// every icon: 32x32, 1x1 border
export class ImageSelectorArray extends Base {
	public static OnWindowSizeChanged(): void {
		ImageSelectorArray.imageBorderWidth = ScaleWidth(2)
		ImageSelectorArray.imageGap = ScaleWidth(2)
		ImageSelectorArray.baseImageHeight = ScaleHeight(32)
		ImageSelectorArray.randomHeightValue = ScaleHeight(40)
	}

	private static imageBorderWidth = 0
	private static imageGap = 0
	private static baseImageHeight = 0
	private static randomHeightValue = 0
	private static readonly elementsPerRow = 5
	private static readonly imageActivatedBorderColor = new Color(104, 4, 255)
	private static readonly imageHoveredOverlayColor = new Color(255, 255, 255, 30)
	// ms time-constant of the hover fade; larger = smoother/slower
	private static readonly hoverFadeTau = 55

	public enabledValues!: [string, boolean][]
	protected readonly imageSize = new Vector2()
	protected renderedPaths: string[] = []
	// per-icon eased hover amount [0..1] driving the smooth fade in/out
	private readonly hoverAnim: number[] = []
	private hoverAnimTime = 0

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		public readonly defaultValues: [string, boolean][] = [],
		tooltip = "",
		private readonly defaultValuesString = JSON.stringify(defaultValues)
	) {
		super(parent, name, tooltip)
		this.ResetToDefault()
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
	public ResetToDefault(): void {
		this.enabledValues = JSON.parse(this.defaultValuesString)
		super.ResetToDefault()
	}
	public IsDefault(): boolean {
		return JSON.stringify(this.enabledValues) === this.defaultValuesString
	}
	public get ConfigValue() {
		return this.enabledValues
	}
	public set ConfigValue(value) {
		if (!Array.isArray(value) || this.ShouldIgnoreNewConfigValue) {
			return
		}
		this.enabledValues = value
		this.UpdateEnabledValues()
		this.UpdateIsDefault()
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
			if (path.startsWith("npc_dota_hero_")) {
				path = GetHeroTexture(path)
			} else if (path.startsWith("rune_")) {
				path = GetRuneTexture(path.substring(5))
			} else if (path.startsWith("item_bottle_")) {
				path = `panorama/images/items/${path.substring(5)}_png.vtex_c`
			} else {
				path = path.startsWith("item_")
					? GetItemTexture(path)
					: GetSpellTexture(path)
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
	// index of the icon currently under the cursor, or -1 if none
	public GetHoveredIconID(): number {
		const rect = this.IconsRect
		if (!rect.Contains(this.MousePosition)) {
			return -1
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
			if (new Rectangle(basePos, basePos.Add(this.imageSize)).Contains(off)) {
				return i
			}
		}
		return -1
	}
	// Eases each icon's hover amount toward 1 (hovered) or 0, frame-rate independent.
	private UpdateHoverAnim(hoveredID: number): void {
		const now = hrtime()
		const dt =
			this.hoverAnimTime === 0
				? 16
				: Math.min(Math.max(now - this.hoverAnimTime, 0), 100)
		this.hoverAnimTime = now
		const rate = Base.HoverAnimation
			? 1 - Math.exp(-dt / ImageSelectorArray.hoverFadeTau)
			: 1
		for (let i = 0, end = this.values.length; i < end; i++) {
			const target = i === hoveredID ? 1 : 0
			const prev = this.hoverAnim[i] ?? 0
			let cur = prev + (target - prev) * rate
			if (Math.abs(cur - target) < 0.01) {
				cur = target
			}
			this.hoverAnim[i] = cur
		}
	}
	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))
		const basePos = this.IconsRect.pos1
		this.UpdateHoverAnim(this.GetHoveredIconID())
		const prevOpacity = RendererSDK.OpacityMultiplier
		for (let index = 0, end = this.values.length; index < end; index++) {
			const imagePath = this.renderedPaths[index]
			if (imagePath === undefined) {
				continue
			}
			const isEnabled = this.IsEnabled(this.values[index]),
				hover = this.hoverAnim[index] ?? 0,
				size = this.imageSize,
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
				!isEnabled
			)

			if (isEnabled) {
				RendererSDK.OutlinedRect(
					pos,
					size,
					ImageSelectorArray.imageBorderWidth,
					ImageSelectorArray.imageActivatedBorderColor
				)
			}

			// hover: fade the colored icon in over the greyed one + a soft overlay (no border)
			if (hover > 0) {
				RendererSDK.OpacityMultiplier = prevOpacity * hover
				if (!isEnabled) {
					RendererSDK.Image(imagePath, pos, -1, size)
				}
				RendererSDK.FilledRect(
					pos,
					size,
					ImageSelectorArray.imageHoveredOverlayColor
				)
				RendererSDK.OpacityMultiplier = prevOpacity
			}
		}
	}
	public OnMouseLeftDown(): boolean {
		return !this.IconsRect.Contains(this.MousePosition)
	}
	public OnMouseLeftUp(): boolean {
		if (!this.IconsRect.Contains(this.MousePosition)) {
			return false
		}
		const id = this.GetHoveredIconID()
		if (id !== -1) {
			this.enabledValues[id][1] = !this.IsEnabled(this.values[id])
			this.TriggerOnValueChangedCBs()
		}
		return false
	}
	// public OnConfigLoaded(): void {
	// 	super.OnConfigLoaded()
	// 	console.log(this.ConfigValue)
	// }
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

EventsSDK.on(
	"WindowSizeChanged",
	() => ImageSelectorArray.OnWindowSizeChanged(),
	EventPriority.IMMEDIATE
)
