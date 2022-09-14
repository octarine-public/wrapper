import { Vector2 } from "../Base/Vector2"
import * as WASM from "../Native/WASM"
import { ParseRED2, ParseREDI } from "./ParseREDI"
import { ParseResourceLayout } from "./ParseResource"

export function ParseImage(stream: ReadableBinaryStream): [Uint8Array, Vector2] {
	const starting_pos = stream.pos,
		is_png = stream.Size > 8 && stream.ReadUint64() === 0x0A1A0A0D474E5089n
	stream.pos = starting_pos
	if (is_png)
		return WASM.ParsePNG(stream)

	const layout = ParseResourceLayout(stream)
	if (layout === undefined)
		throw "Image conversion failed"

	const data_block = layout[0].get("DATA")
	if (data_block === undefined)
		throw "Image conversion failed: missing DATA block"
	if (data_block.Size < 40)
		throw "Image conversion failed: too small file"
	// TODO: add check that's real VTEX file (lookup https://github.com/SteamDatabase/ValveResourceFormat/blob/master/ValveResourceFormat/Resource/Resource.cs)
	if (data_block.ReadUint16() !== 1)
		throw `Image conversion failed: unknown VTex version`
	data_block.pos -= 2
	let is_YCoCg = false,
		normalize = false,
		is_inverted = false,
		hemi_oct = false,
		hemi_oct_RB = false
	const REDI = ParseRED2(layout[0].get("RED2")) ?? ParseREDI(layout[0].get("REDI"))
	if (REDI !== undefined) {
		is_YCoCg = REDI.SpecialDependencies.some(dep => (
			dep.compiler_identifier === "CompileTexture"
			&& dep.str === "Texture Compiler Version Image YCoCg Conversion"
		))
		normalize = REDI.SpecialDependencies.some(dep => (
			dep.compiler_identifier === "CompileTexture"
			&& dep.str === "Texture Compiler Version Image NormalizeNormals"
		))
		is_inverted = REDI.SpecialDependencies.some(dep => (
			dep.compiler_identifier === "CompileTexture"
			&& dep.str === "Texture Compiler Version LegacySource1InvertNormals"
		))
		hemi_oct = REDI.SpecialDependencies.some(dep => (
			dep.compiler_identifier === "CompileTexture"
			&& dep.str === "Texture Compiler Version Mip HemiOctAnisoRoughness"
		))
		hemi_oct_RB = REDI.SpecialDependencies.some(dep => (
			dep.compiler_identifier === "CompileTexture"
			&& dep.str === "Texture Compiler Version Mip HemiOctIsoRoughness_RG_B"
		))
	}

	stream.pos += data_block.Offset - stream.Offset
	return WASM.ParseVTex(stream, data_block, is_YCoCg, normalize, is_inverted, hemi_oct, hemi_oct_RB)
}
