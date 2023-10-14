import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { GUIInfo } from "../GUI/GUIInfo"
import { EventsSDK } from "../Managers/EventsSDK"
import { RendererSDK } from "../Native/RendererSDK"
import { Base, IMenu } from "./Base"

export class Toggle extends Base {
	public static OnWindowSizeChanged(): void {
		Toggle.toggleBackgroundSize.x = GUIInfo.ScaleWidth(
			Toggle.origToggleBackgroundSize.x
		)
		Toggle.toggleBackgroundSize.y = GUIInfo.ScaleHeight(
			Toggle.origToggleBackgroundSize.y
		)
		Toggle.toggleSize.x = GUIInfo.ScaleWidth(Toggle.origToggleSize.x)
		Toggle.toggleSize.y = GUIInfo.ScaleHeight(Toggle.origToggleSize.y)
		Toggle.toggleBackgroundOffset.x = GUIInfo.ScaleWidth(12)
		Toggle.toggleBackgroundOffset.y = GUIInfo.ScaleHeight(12)
		Toggle.toggleOffset.x = GUIInfo.ScaleWidth(3)
		Toggle.toggleOffset.y = GUIInfo.ScaleHeight(3)

		Toggle.iconSize.x = GUIInfo.ScaleWidth(24)
		Toggle.iconSize.y = GUIInfo.ScaleHeight(24)
		Toggle.iconOffset.x = GUIInfo.ScaleWidth(12)
		Toggle.iconOffset.y = GUIInfo.ScaleHeight(8)

		Toggle.textOffsetNode.x = GUIInfo.ScaleWidth(15)
		Toggle.textOffsetNode.y = GUIInfo.ScaleHeight(13)

		Toggle.textOffsetWithIcon.x = GUIInfo.ScaleWidth(48)
		Toggle.textOffsetWithIcon.y = Toggle.textOffsetNode.y
	}

	private static readonly toggleBackgroundPath = "menu/toggle_background.svg"
	private static readonly togglePath = "menu/toggle.svg"
	private static readonly origToggleBackgroundSize = RendererSDK.GetImageSize(
		Toggle.toggleBackgroundPath
	)
	private static readonly toggleBackgroundSize = new Vector2()
	private static readonly origToggleSize = RendererSDK.GetImageSize(Toggle.togglePath)
	private static readonly toggleSize = new Vector2()
	private static readonly toggleBackgroundOffset = new Vector2()
	private static readonly toggleOffset = new Vector2()
	private static readonly toggleBackgroundColorActive = new Color(104, 4, 255)
	private static readonly toggleBackgroundColorInactive = new Color(31, 30, 53)
	private static readonly iconActive = Color.Green
	private static readonly iconInactive = Color.Red

	private static readonly textToggleGap = 10
	private static readonly animationTime = 150

	private static readonly iconSize = new Vector2()
	private static readonly iconOffset = new Vector2()
	private static readonly textOffsetNode = new Vector2(15, 14)

	private static readonly textOffsetWithIcon = new Vector2()

	public value = true
	private animationStartTime = 0
	private readonly currentColor = new Color()

	constructor(
		parent: IMenu,
		name: string,
		defaultValue: boolean,
		tooltip = "",
		private iconPath_ = "",
		private iconRound_ = -1
	) {
		super(parent, name, tooltip)
		this.value = defaultValue
	}

	public get IconPath(): string {
		return this.iconPath_
	}
	public set IconPath(val: string) {
		this.iconPath_ = val
		this.Update()
	}
	public get IconRound(): number {
		return this.iconRound_
	}
	public set IconRound(val: number) {
		this.iconRound_ = val
		this.Update()
	}
	public get ConfigValue() {
		return this.value
	}
	public set ConfigValue(value) {
		if (this.ShouldIgnoreNewConfigValue || typeof value !== "boolean") {
			return
		}
		this.value = value ?? this.value
	}
	public get ClassPriority(): number {
		return 1
	}

	private get ToggleRect() {
		const basePos = this.Position.Clone()
			.AddScalarX(this.parent.EntriesSizeX)
			.AddScalarY(this.Size.y)
			.SubtractForThis(Toggle.toggleBackgroundOffset)
		return new Rectangle(basePos.Subtract(Toggle.toggleBackgroundSize), basePos)
	}

	public Update(): boolean {
		if (!super.Update()) {
			return false
		}
		this.Size.x =
			this.textOffset.x +
			this.nameSize.x +
			Toggle.textToggleGap +
			Toggle.toggleBackgroundSize.x +
			Toggle.toggleBackgroundOffset.x
		if (this.IconPath !== "") {
			this.Size.AddScalarX(Toggle.textOffsetWithIcon.x)
		} else {
			this.Size.AddScalarX(this.textOffset.x)
		}
		return true
	}

	public OnActivate(func: (caller: this) => any) {
		return this.OnValue(caller => {
			if (caller.value) {
				func(caller)
			}
		})
	}
	public OnDeactivate(func: (caller: this) => any) {
		return this.OnValue(caller => {
			if (!caller.value) {
				func(caller)
			}
		})
	}
	public Render(): void {
		super.Render()
		const textPos = this.Position.Clone()
		if (this.IconPath !== "") {
			textPos.AddForThis(Toggle.textOffsetWithIcon)
			const color = this.IconPath.includes("icon_magic_resist_psd")
				? this.value
					? Toggle.iconActive
					: Toggle.iconInactive
				: Color.White
			RendererSDK.Image(
				this.IconPath,
				this.Position.Add(Toggle.iconOffset),
				this.IconRound,
				Toggle.iconSize,
				color
			)
		} else {
			textPos.AddForThis(this.textOffset)
		}
		this.RenderTextDefault(this.Name, textPos)
		const animationState = Math.min(
			1,
			(hrtime() - this.animationStartTime) / Toggle.animationTime
		)
		const primaryColor = this.value
				? Toggle.toggleBackgroundColorActive
				: Toggle.toggleBackgroundColorInactive,
			secondaryColor = this.value
				? Toggle.toggleBackgroundColorInactive
				: Toggle.toggleBackgroundColorActive
		const toggleRect = this.ToggleRect
		this.currentColor.r =
			primaryColor.r * animationState + secondaryColor.r * (1 - animationState)
		this.currentColor.g =
			primaryColor.g * animationState + secondaryColor.g * (1 - animationState)
		this.currentColor.b =
			primaryColor.b * animationState + secondaryColor.b * (1 - animationState)
		RendererSDK.Image(
			Toggle.toggleBackgroundPath,
			toggleRect.pos1,
			-1,
			Toggle.toggleBackgroundSize,
			this.currentColor
		)
		const togglePos = this.value ? animationState : 1 - animationState
		RendererSDK.Image(
			Toggle.togglePath,
			toggleRect.pos1
				.Add(Toggle.toggleOffset)
				.AddScalarX(
					(toggleRect.Size.x -
						Toggle.toggleSize.x -
						Toggle.toggleOffset.x * 2) *
						togglePos
				),
			-1,
			Toggle.toggleSize
		)
	}

	public OnMouseLeftDown(): boolean {
		return !this.IsHovered
	}
	public OnMouseLeftUp(): boolean {
		this.value = !this.value
		this.animationStartTime = hrtime()
		this.TriggerOnValueChangedCBs()
		return false
	}
}

EventsSDK.on("WindowSizeChanged", () => Toggle.OnWindowSizeChanged())
