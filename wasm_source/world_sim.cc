#include "stdafx.h"
#include "nanort/nanort.h"

std::pair<std::vector<Vector>, std::vector<uint32_t>> finished_world;
std::unique_ptr<nanort::BVHAccel<float>> accel;
void ResetWorldInternal() {
	accel = nullptr;
	finished_world.first.clear();
	finished_world.second.clear();
}

void LoadWorldModelInternal(
	std::string_view vertex_data, size_t vertex_size,
	std::string_view index_data, size_t index_size,
	VMatrix transform
) {
	auto& current_world_vb = finished_world.first;
	auto& current_world_ib = finished_world.second;

	auto vb_start = current_world_vb.size();
	size_t vertex_count = vertex_data.size() / vertex_size;
	current_world_vb.resize(vb_start + vertex_count);
	if (vertex_size >= 3 * sizeof(float))
		for (size_t i = 0; i < vertex_count; i++)
			current_world_vb[vb_start + i] = transform * *GetPointer<Vector>(vertex_data.data(), i * vertex_size);

	auto ib_start = current_world_ib.size();
	size_t index_count = index_data.size() / index_size;
	current_world_ib.resize(ib_start + index_count);
	switch (index_size) {
		case 1:
			for (size_t i = 0; i < index_count; i++)
				current_world_ib[ib_start + i] = vb_start + *GetPointer<uint8_t>(index_data.data(), i * sizeof(uint8_t));
			break;
		case 2:
			for (size_t i = 0; i < index_count; i++)
				current_world_ib[ib_start + i] = vb_start + *GetPointer<uint16_t>(index_data.data(), i * sizeof(uint16_t));
			break;
		case 4:
			for (size_t i = 0; i < index_count; i++)
				current_world_ib[ib_start + i] = vb_start + *GetPointer<uint32_t>(index_data.data(), i * sizeof(uint32_t));
			break;
		default:
			break;
	}
}

void FinishWorldInternal() {
	size_t last_index_count = finished_world.second.size();
	constexpr auto least_target_ratio = 256;
	size_t least_target = finished_world.second.size() / least_target_ratio;
	std::vector<Vector> current_world_vb;
	std::vector<uint32_t> current_world_ib;
	while (true) {
		auto index_count = finished_world.second.size();
		current_world_vb.resize(index_count);
		size_t current_vb_index = 0;
		for (auto& index : finished_world.second)
			current_world_vb[current_vb_index++] = finished_world.first[index];
		current_world_ib.resize(index_count);
		std::vector<unsigned int> remap;
		remap.resize(index_count);
		size_t vertex_count = meshopt_generateVertexRemap(
			remap.data(),
			nullptr,
			index_count,
			current_world_vb.data(),
			current_world_vb.size(),
			sizeof(Vector)
		);

		// 1.Indexing
		meshopt_remapIndexBuffer(
			current_world_ib.data(),
			nullptr,
			index_count,
			remap.data()
		);
		meshopt_remapVertexBuffer(
			current_world_vb.data(),
			current_world_vb.data(),
			current_world_vb.size(),
			sizeof(Vector),
			remap.data()
		);
		finished_world.first.resize(vertex_count);

		// 2. Vertex cache optimization
		meshopt_optimizeVertexCache(
			current_world_ib.data(),
			current_world_ib.data(),
			index_count,
			vertex_count
		);

		// 3. Overdraw optimization
		meshopt_optimizeOverdraw(
			current_world_ib.data(),
			current_world_ib.data(),
			index_count,
			(const float*)current_world_vb.data(),
			vertex_count,
			sizeof(Vector),
			1.05f
		);

		// 4. Vertex fetch optimization
		meshopt_optimizeVertexFetch(
			current_world_vb.data(),
			current_world_ib.data(),
			index_count,
			current_world_vb.data(),
			vertex_count,
			sizeof(Vector)
		);

		// No 5.Vertex quantization
		// No 6. Vertex/index buffer compression

		// 7?. Simplification
		float lod_error = 0.f;
		std::vector<uint32_t> lod;
		lod.resize(index_count);
		auto target_index_count = std::max(index_count / least_target_ratio, least_target);
		constexpr auto target_error = .001f; // do not introduce error >0.1%
		lod.resize(meshopt_simplify(
			lod.data(),
			current_world_ib.data(),
			index_count,
			(const float*)current_world_vb.data(),
			vertex_count,
			sizeof(Vector),
			target_index_count,
			target_error,
			&lod_error
		));
		finished_world.first = current_world_vb;
		finished_world.second = lod;
		if (lod.size() >= last_index_count || lod.size() <= least_target)
			break;
		last_index_count = lod.size();
	}
	nanort::TriangleMesh<float> triangle_mesh{
		(const float*)finished_world.first.data(),
		finished_world.second.data(),
		sizeof(Vector)
	};
	nanort::TriangleSAHPred<float> triangle_pred{
		(const float*)finished_world.first.data(),
		finished_world.second.data(),
		sizeof(Vector)
	};
	accel.reset(new nanort::BVHAccel<float>());
	accel->Build(finished_world.second.size() / 3, triangle_mesh, triangle_pred);
}

void FinishWorldCachedInternal(std::string_view cached_nodes, std::string_view cached_indices) {
	accel.reset(new nanort::BVHAccel<float>());
	auto& nodes = const_cast<std::vector<nanort::BVHNode<float>>&>(accel->GetNodes());
	nodes.resize(cached_nodes.size() / sizeof(*nodes.data()));
	memcpy(nodes.data(), cached_nodes.data(), nodes.size() * sizeof(*nodes.data()));
	auto& indices = const_cast<std::vector<uint32_t>&>(accel->GetIndices());
	indices.resize(cached_indices.size() / sizeof(*indices.data()));
	memcpy(indices.data(), cached_indices.data(), indices.size() * sizeof(*indices.data()));
}

std::pair<std::string_view, std::string_view> ExtractWorldVBIBInternal() {
	auto& vb = finished_world.first;
	auto& ib = finished_world.second;
	return {
		{ (const char*)vb.data(), vb.size() * sizeof(*vb.data()) },
		{ (const char*)ib.data(), ib.size() * sizeof(*ib.data()) }
	};
}

std::pair<std::string_view, std::string_view> ExtractWorldBVHInternal() {
	if (accel == nullptr)
		return {};
	auto& nodes = accel->GetNodes();
	auto& indices = accel->GetIndices();
	return {
		{ (const char*)nodes.data(), nodes.size() * sizeof(*nodes.data()) },
		{ (const char*)indices.data(), indices.size() * sizeof(*indices.data()) }
	};
}

bool RayTraceInitialized() {
	return accel != nullptr;
}

std::optional<Vector> TryRayTrace(Vector camera_position, Vector ray_direction) {
	nanort::Ray<float> ray;
	ray.org[0] = camera_position.x;
	ray.org[1] = camera_position.y;
	ray.org[2] = camera_position.z;
	ray.dir[0] = ray_direction.x;
	ray.dir[1] = ray_direction.y;
	ray.dir[2] = ray_direction.z;
	ray.min_t = 0.0f;
	ray.max_t = 1.0e+30f;

	nanort::TriangleIntersection<float> isect;
	nanort::TriangleIntersector<float> triangle_intersector{
		(const float*)finished_world.first.data(),
		finished_world.second.data(),
		sizeof(Vector)
	};
	if (!accel->Traverse(ray, triangle_intersector, &isect))
		return {};
	auto a = finished_world.first[finished_world.second[isect.prim_id * 3 + 0]],
		b = finished_world.first[finished_world.second[isect.prim_id * 3 + 1]],
		c = finished_world.first[finished_world.second[isect.prim_id * 3 + 2]];
	auto u = isect.u,
		v = isect.v;
	return (1.f - u - v) * a + u * b + v * c;
}
