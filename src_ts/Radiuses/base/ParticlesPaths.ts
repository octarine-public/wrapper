const ParticleRangePath = (name: string) => "particles/range_display/range_display_" + name.toLowerCase() + ".vpcf"
const ParticleLinePath = (name: string) => "particles/range_line/" + name.toLowerCase() + ".vpcf"

export enum PARTICLE_RENDER_NAME {
	NORMAL = "Normal",
	ROPE = "Rope",
	ANIMATION = "Animation"
}

export enum PARTICLE_RENDER {
	NORMAL = 0,
	ROPE,
	ANIMATION
}

const RenderPath = (basePath: (name: string) => string, render = PARTICLE_RENDER.NORMAL) => {
	switch (render) {
		default:
		case PARTICLE_RENDER.NORMAL:
			return basePath(PARTICLE_RENDER_NAME.NORMAL.toLowerCase())
		case PARTICLE_RENDER.ROPE:
			return basePath(PARTICLE_RENDER_NAME.ROPE.toLowerCase())
		case PARTICLE_RENDER.ANIMATION:
			return basePath(PARTICLE_RENDER_NAME.ANIMATION.toLowerCase())
	}
}

export const RangeRenderPath = (render = PARTICLE_RENDER.NORMAL) => RenderPath(ParticleRangePath, render)
export const LineRenderPath = (render = PARTICLE_RENDER.NORMAL) => RenderPath(ParticleLinePath, render)