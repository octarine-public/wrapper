import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { Sleeper } from "../Helpers/Sleeper"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, InputManager, VKeys } from "../Managers/InputManager"
import { RendererSDK } from "../Native/RendererSDK"
import { AbilityData } from "../Objects/DataBook/AbilityData"
import { orderBy } from "../Utils/ArrayExtensions"
import { Base, IMenu } from "./Base"

type IDefaultValues = Map<
	string,
	[
		boolean /** default state */,
		boolean /** default static show */,
		boolean /** show */,
		number /** priority */
	]
>

// every icon: 32x32, 1x1 border
export class DynamicImageSelector extends Base {
	public static ServicePriorityToggle = false

	public static OnWindowSizeChanged(): void {
		DynamicImageSelector.imageBorderWidth = GUIInfo.ScaleWidth(2)
		DynamicImageSelector.imageGap = GUIInfo.ScaleWidth(2)
		DynamicImageSelector.baseImageHeight = GUIInfo.ScaleHeight(32)
		DynamicImageSelector.randomHeightValue = GUIInfo.ScaleHeight(40)
	}

	private static imageBorderWidth = 0
	private static imageGap = 0
	private static baseImageHeight = 0
	private static randomHeightValue = 0
	private static readonly elementsPerRow = 5
	private static readonly imageActivatedBorderColor = new Color(104, 4, 255)

	public enabledValues: IDefaultValues

	protected readonly itemDrop = new Map<string, number>()
	protected readonly imageSize = new Vector2()
	protected renderedPaths = new Map<string, string>()
	protected QueueSleeper = new Sleeper()
	protected QueueImages = new Map<string, [boolean, boolean]>()

	private autoPriority = 0

	constructor(
		parent: IMenu,
		name: string,
		public values: string[],
		defaultValues: IDefaultValues = new Map(),
		public createdDefaultState = false,
		tooltip = ""
	) {
		super(parent, name, tooltip)
		this.enabledValues = defaultValues
	}

	public get IsZeroSelected(): boolean {
		for (const [value] of this.enabledValues.values()) if (value) return false
		return true
	}

	public get IconsRect() {
		const basePos = this.Position.Add(this.textOffset).AddScalarY(
			this.nameSize.y + 3
		)
		return new Rectangle(
			basePos,
			basePos
				.Add(
					this.imageSize
						.AddScalar(
							DynamicImageSelector.imageBorderWidth * 2 +
								DynamicImageSelector.imageGap
						)
						.MultiplyScalarX(
							Math.min(this.values.length, DynamicImageSelector.elementsPerRow)
						)
						.MultiplyScalarY(
							Math.ceil(
								this.values.length / DynamicImageSelector.elementsPerRow
							)
						)
				)
				.SubtractScalar(
					(DynamicImageSelector.elementsPerRow - 1) *
						DynamicImageSelector.imageGap
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
		)
			return

		this.enabledValues = new Map(value)

		for (const [] of this.enabledValues) this.autoPriority++

		this.values = [
			...orderBy(
				this.values.filter(name => this.GetPriority(name) >= 0),
				x => this.GetPriority(x)
			),
		]

		this.values.forEach(value_ => {
			if (!this.enabledValues.has(value_))
				this.enabledValues.set(value_, [
					this.createdDefaultState,
					false,
					false,
					this.autoPriority,
				])
		})
	}

	public get ClassPriority(): number {
		return 6
	}

	public Update(): boolean {
		if (!super.Update()) return false

		this.values = [
			...orderBy(
				this.values.filter(name => this.GetPriority(name) >= 0),
				x => this.GetPriority(x)
			),
		]

		this.values.forEach(value => {
			if (!this.enabledValues.has(value))
				this.enabledValues.set(value, [
					this.createdDefaultState,
					false,
					false,
					this.autoPriority,
				])
		})

		this.renderedPaths.clear()
		this.imageSize.x = this.imageSize.y = DynamicImageSelector.baseImageHeight

		for (const name of this.values) {
			if (!this.IsVisibleImage(name)) continue
			let path = name
			if (path.startsWith("rune_"))
				path = `panorama/images/spellicons/${path}_png.vtex_c`
			else if (path.startsWith("item_bottle_"))
				path = `panorama/images/items/${path.substring(5)}_png.vtex_c`
			else if (!path.startsWith("npc_dota_hero_")) {
				const abil = AbilityData.GetAbilityByName(path)
				if (abil !== undefined) path = abil.TexturePath
			} else path = `panorama/images/heroes/${path}_png.vtex_c`
			const pathIamgeSize = RendererSDK.GetImageSize(path)
			this.imageSize.x = Math.max(
				this.imageSize.x,
				DynamicImageSelector.baseImageHeight *
					(pathIamgeSize.x / pathIamgeSize.y)
			)
			this.renderedPaths.set(name, path)
		}

		this.Size.x =
			Math.max(
				this.nameSize.x,
				Math.min(this.renderedPaths.size, DynamicImageSelector.elementsPerRow) *
					(this.imageSize.x +
						DynamicImageSelector.imageBorderWidth * 2 +
						DynamicImageSelector.imageGap)
			) +
			this.textOffset.x * 2

		this.Size.y =
			Math.ceil(this.renderedPaths.size / DynamicImageSelector.elementsPerRow) *
				(this.imageSize.y +
					DynamicImageSelector.imageBorderWidth * 2 +
					DynamicImageSelector.imageGap) +
			DynamicImageSelector.randomHeightValue

		return true
	}

	public GetPriority(value: string): number {
		const state = this.enabledValues.get(value)
		if (state === undefined) return Number.MAX_SAFE_INTEGER
		return state[3]
	}

	public IsVisibleImage(value: string): boolean {
		const state = this.enabledValues.get(value)
		if (state === undefined) return false
		return state[1] || state[2]
	}

	public IsEnabled(value: string): boolean {
		const state = this.enabledValues.get(value)

		if (this.QueuedUpdate) {
			const queuedState = this.QueueImages.get(value)
			if (queuedState === undefined) return false
			return queuedState[0]
		}

		if (!this.QueuedUpdate && !this.QueueSleeper.Sleeping(value))
			this.QueueImages.delete(value)

		if (state === undefined) return false
		return state[0]
	}

	public IsEnabledID(id: number): boolean {
		return this.IsEnabled(this.values[id])
	}

	public OnAddNewImage(name: string, defaultState = true, defaultShow = false) {
		if (this.QueuedUpdate && !this.values.includes(name)) {
			this.QueueSleeper.Sleep(300, name)
			this.QueueImages.set(name, [defaultState, defaultShow])
			return
		}

		// boolean, /** default state */
		// boolean, /** default static show */
		// boolean, /** show */
		// number /** priority */

		if (!this.values.includes(name)) this.values.push(name)

		const enabledValues = this.enabledValues.get(name)
		if (enabledValues === undefined || !Array.isArray(enabledValues)) {
			this.enabledValues.set(name, [
				defaultState,
				defaultShow,
				true,
				this.autoPriority++,
			])
			this.Update()
			return
		}

		enabledValues[2] = true
		this.Update()
	}

	public OnHideImages(names?: string[]) {
		// boolean, /** default state */
		// boolean, /** default static show */
		// boolean, /** show */
		// number /** priority */

		if (names === undefined) {
			for (const name of this.values) {
				const enabledValues = this.enabledValues.get(name)
				if (enabledValues === undefined || enabledValues[1]) continue
				enabledValues[2] = false
				this.Update()
			}
			return
		}

		for (const name of names) {
			const enabledValues = this.enabledValues.get(name)
			if (enabledValues !== undefined && !enabledValues[1]) {
				enabledValues[2] = false
				this.Update()
			}
		}

		this.QueueImages.clear()
	}

	public Render(): void {
		super.Render()
		this.RenderTextDefault(this.Name, this.Position.Add(this.textOffset))

		for (const [value, [defaultState, defaultShow]] of this.QueueImages) {
			const time = this.QueueSleeper.RemainingSleepTime(value)
			if (time > 50) continue
			this.OnAddNewImage(value, defaultState, defaultShow)
			this.QueueImages.delete(value)
			this.QueueSleeper.ResetKey(value)
		}

		const basePos = this.IconsRect.pos1
		for (let i = 0; i < this.values.length; i++) {
			const value = this.values[i]
			if (!this.IsVisibleImage(value)) continue
			const imagePath = this.renderedPaths.get(value)
			if (imagePath === undefined) continue

			const size = this.imageSize,
				pos = new Vector2(
					i % DynamicImageSelector.elementsPerRow,
					Math.floor(i / DynamicImageSelector.elementsPerRow)
				)
					.Multiply(
						this.imageSize.AddScalar(
							DynamicImageSelector.imageBorderWidth * 2 +
								DynamicImageSelector.imageGap
						)
					)
					.Add(basePos)

			const position = this.itemDrop.has(value) ? this.MousePosition : pos

			RendererSDK.Image(
				imagePath,
				position,
				-1,
				size,
				Color.White,
				0,
				undefined,
				!this.IsEnabled(value)
			)

			if (
				InputManager.IsKeyDown(VKeys.CONTROL) ||
				DynamicImageSelector.ServicePriorityToggle
			)
				RendererSDK.FilledRect(position, size, Color.Black.SetA(180))

			if (this.IsEnabled(value))
				RendererSDK.FilledRect(
					position.Add(new Vector2(0, size.y / 1.75)),
					size.Subtract(new Vector2(0, size.y / 1.75)),
					Color.Black.SetA(233)
				)

			this.DrawTextPriority(i + 1, position, size)

			if (this.IsEnabled(value))
				RendererSDK.OutlinedRect(
					position,
					size,
					DynamicImageSelector.imageBorderWidth,
					DynamicImageSelector.imageActivatedBorderColor
				)

			if (DynamicImageSelector.ServicePriorityToggle)
				this.DrawTextRealPriority(this.enabledValues.get(value), position, size)
		}
	}

	public OnMouseLeftDown(): boolean {
		const rect = this.IconsRect,
			off = rect.GetOffset(this.MousePosition)

		if (InputManager.IsKeyDown(VKeys.CONTROL))
			this.ImageValueChanged(off, value => {
				const enabledValues = this.enabledValues.get(value)
				if (enabledValues === undefined || !this.IsVisibleImage(value)) return
				this.itemDrop.set(value, enabledValues[3])
			})

		return !rect.Contains(this.MousePosition)
	}

	public OnMouseLeftUp(): boolean {
		const rect = this.IconsRect,
			off = rect.GetOffset(this.MousePosition)

		for (const [dragName, dragPriority] of this.itemDrop) {
			this.ImageValueChanged(off, (currName, _, currPriority) => {
				const dragNameValue = this.enabledValues.get(dragName)
				const currNameValue = this.enabledValues.get(currName)

				if (
					dragNameValue === undefined ||
					currNameValue === undefined ||
					dragPriority === currPriority
				)
					return

				// todo need improved
				if (dragPriority > currPriority) {
					dragNameValue[3] = currPriority
					currNameValue[3] = currNameValue[3] + 1
					this.InsertIncrease(currName, dragName, currPriority)
				} else if (dragPriority < currPriority) {
					dragNameValue[3] = currPriority
					currNameValue[3] = currNameValue[3] - 1
					this.InsertDecrease(currName, dragName, currPriority)
				}

				this.Update()
			})

			this.itemDrop.delete(dragName)
		}

		if (
			!rect.Contains(this.MousePosition) ||
			InputManager.IsKeyDown(VKeys.CONTROL)
		)
			return false

		this.ImageValueChanged(off, value => {
			const enabledValues = this.enabledValues.get(value)
			if (enabledValues === undefined || !this.IsVisibleImage(value)) return
			enabledValues[0] = !this.IsEnabled(value)
			this.TriggerOnValueChangedCBs()
		})

		return false
	}

	private ImageValueChanged(
		off: Vector2,
		callback: (value: string, state: boolean, priority: number) => void
	) {
		for (let i = 0; i < this.values.length; i++) {
			const value = this.values[i]
			const enabledValues = this.enabledValues.get(value)
			if (enabledValues === undefined || !this.IsVisibleImage(value)) return
			const basePos = new Vector2(
				i % DynamicImageSelector.elementsPerRow,
				Math.floor(i / DynamicImageSelector.elementsPerRow)
			).Multiply(
				this.imageSize.AddScalar(
					DynamicImageSelector.imageBorderWidth * 2 +
						DynamicImageSelector.imageGap
				)
			)
			if (!new Rectangle(basePos, basePos.Add(this.imageSize)).Contains(off))
				continue
			callback(value, enabledValues[0], enabledValues[3])
			break
		}
	}

	private InsertDecrease(
		currName: string,
		dragName: string,
		currPriority: number
	) {
		const entriesEnables = [...this.enabledValues.entries()]
		const decrease = entriesEnables.filter(([name, [, , , priority]]) =>
			this.FilterDecrease(name, currName, dragName, currPriority, priority)
		)
		for (const [insertName] of decrease) {
			const insert = this.enabledValues.get(insertName)
			if (insert === undefined) continue
			insert[3] = insert[3] - 1
		}
	}

	private InsertIncrease(
		currName: string,
		dragName: string,
		currPriority: number
	) {
		const entriesEnables = [...this.enabledValues.entries()]

		const increase = entriesEnables.filter(([name, [, , , priority]]) =>
			this.FilterIncrease(
				name,
				currName,
				dragName,
				currPriority,
				priority,
				entriesEnables.length
			)
		)

		for (const [insertName] of increase) {
			const insert = this.enabledValues.get(insertName)
			if (insert === undefined) continue
			insert[3] = insert[3] + 1
		}
	}

	private FilterDecrease(
		name: string,
		currName: string,
		dragName: string,
		currPriority: number,
		priority: number
	) {
		return (
			name !== currName &&
			name !== dragName &&
			currPriority > priority &&
			priority > 0
		)
	}

	private FilterIncrease(
		name: string,
		currName: string,
		dragName: string,
		currPriority: number,
		priority: number,
		maxPriority: number
	) {
		return (
			name !== currName &&
			name !== dragName &&
			currPriority <= priority &&
			priority < maxPriority - 1
		)
	}

	private DrawTextPriority(id: number, position: Vector2, size: Vector2) {
		const text = `${id}`
		const textSize = size.y / 2
		const textName = RendererSDK.DefaultFontName

		const textSizePosition = Vector2.FromVector3(
			RendererSDK.GetTextSize(text, textName, textSize)
		)
			.MultiplyScalarForThis(-1)
			.AddScalarX(size.x)
			.AddScalarY(size.y)

		const textPosition = textSizePosition
			.DivideScalarForThis(2)
			.AddScalarX(position.x + textSizePosition.x)
			.AddScalarY(position.y + textSizePosition.y)
			.RoundForThis()

		RendererSDK.Text(text, textPosition, Color.White, textName, textSize)
	}

	/** service */
	private DrawTextRealPriority(
		enabled: Nullable<
			[
				boolean,
				/** default state */ boolean,
				/** default show */ boolean,
				/** show */ number /** priority */
			]
		>,
		position: Vector2,
		size: Vector2
	) {
		if (enabled === undefined) return

		const text = `${enabled[3]}`
		const textSize = size.y / 1.3
		const textName = RendererSDK.DefaultFontName

		const textSizePosition = Vector2.FromVector3(
			RendererSDK.GetTextSize(text, textName, textSize)
		)
			.MultiplyScalarForThis(-1)
			.AddScalarX(size.x)
			.AddScalarY(size.y)

		const textPosition = textSizePosition
			.DivideScalarForThis(2)
			.AddScalarX(position.x)
			.AddScalarY(position.y)
			.RoundForThis()

		RendererSDK.Text(text, textPosition, Color.White, textName, textSize)
	}
}

EventsSDK.on("WindowSizeChanged", () =>
	DynamicImageSelector.OnWindowSizeChanged()
)

InputEventSDK.on("KeyDown", key => {
	if (
		(key !== VKeys.MENU && key !== VKeys.KEY_K) ||
		!(InputManager.IsKeyDown(VKeys.MENU) && InputManager.IsKeyDown(VKeys.KEY_K))
	)
		return true
	DynamicImageSelector.ServicePriorityToggle =
		!DynamicImageSelector.ServicePriorityToggle
	return !(
		InputManager.IsKeyDown(VKeys.MENU) && InputManager.IsKeyDown(VKeys.KEY_K)
	)
})
