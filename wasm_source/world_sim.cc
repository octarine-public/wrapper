#include "stdafx.h"
#include <bvh/ray.hpp>
#include <bvh/triangle.hpp>
#include <bvh/locally_ordered_clustering_builder.hpp>
#include <bvh/parallel_reinsertion_optimizer.hpp>
#include <bvh/leaf_collapser.hpp>
#include <bvh/primitive_intersectors.hpp>
#include <bvh/single_ray_traverser.hpp>

// this file is inspired by NanoSG, but rewritten to use BVH library
// because NanoRT needs patching and it's performance is pretty bad

class Mesh {
public:
	std::vector<bvh::Triangle<vec_t>> triangles{};
	bvh::BoundingBox<vec_t> bbox{};
	bvh::Bvh<vec_t> accel{};
	Vector area{};
	uint32_t flags = 0;
	uint32_t path_id = 0;

	Mesh() = default;
	explicit Mesh(
		std::string_view vertex_buffer, size_t vertex_elem_size,
		std::string_view index_buffer, size_t index_elem_size,
		uint32_t flags,
		uint32_t path_id
	) {
		if (vertex_elem_size >= 3 * sizeof(vec_t))
			switch (index_elem_size) {
				case 1:
					this->InitTriangles<uint8_t>(vertex_buffer, vertex_elem_size, index_buffer, index_elem_size);
					break;
				case 2:
					this->InitTriangles<uint16_t>(vertex_buffer, vertex_elem_size, index_buffer, index_elem_size);
					break;
				case 4:
					this->InitTriangles<uint32_t>(vertex_buffer, vertex_elem_size, index_buffer, index_elem_size);
					break;
				default:
					break;
			}
		this->flags = flags;
	}

	void Init(bool build_accel) {
		if (this->triangles.empty())
			return;
		auto [bboxes, centers] = bvh::compute_bounding_boxes_and_centers(
			this->triangles.data(),
			this->triangles.size()
		);
		this->bbox = bvh::compute_bounding_boxes_union(bboxes.get(), this->triangles.size());
		for (auto& triangle : this->triangles) {
			this->area[0] += std::abs(triangle.n[0]);
			this->area[1] += std::abs(triangle.n[1]);
			this->area[2] += std::abs(triangle.n[2]);
		}
		if (!build_accel)
			return;
		{
			using Morton = uint32_t;
			bvh::LocallyOrderedClusteringBuilder<bvh::Bvh<vec_t>, Morton> builder{ this->accel };
			builder.build(this->bbox, bboxes.get(), centers.get(), this->triangles.size());
		}
		{
			bvh::ParallelReinsertionOptimizer<bvh::Bvh<vec_t>> reinsertion_optimizer{ this->accel };
			reinsertion_optimizer.optimize();
		}
		{
			bvh::LeafCollapser leaf_collapser{ this->accel };
			leaf_collapser.collapse();
		}
	}

private:
	FORCEINLINE void ReadVertexPos(
		const void* vertices,
		size_t vertex_count,
		size_t vertex_elem_size,
		bvh::Vector3<vec_t>& vec,
		uint32_t id
	) {
		if (id >= vertex_count)
			return;
		auto vertex = GetPointer<float>(vertices, id * vertex_elem_size);
		// there are tiny gaps in meshes because of near-epsilon decimals, fix it with rounding
		for (size_t i = 0; i < 3; i++)
			vec.values[i] = std::round(vertex[i] * 100.f) / 100.f;
	}
	template<typename I>
	void InitTriangles(
		std::string_view vertex_buffer, size_t vertex_elem_size,
		std::string_view index_buffer, size_t index_elem_size
	) {
		auto vertices = vertex_buffer.data();
		auto vertex_count = vertex_buffer.size() / vertex_elem_size;
		if (vertex_count == 0)
			return;
		auto indices = (I*)index_buffer.data();
		size_t index_count = index_buffer.size() / sizeof(I);
		auto triangles_count = index_count / 3;
		if (triangles_count == 0)
			return;
		this->triangles.resize(triangles_count);
		for (size_t i = 0; i < triangles_count; i++) {
			auto base_index = i * 3;
			auto i1 = indices[base_index + 0],
				i2 = indices[base_index + 1],
				i3 = indices[base_index + 2];
			bvh::Vector3<vec_t> v1, v2, v3;
			this->ReadVertexPos(vertices, vertex_count, vertex_elem_size, v1, i1);
			this->ReadVertexPos(vertices, vertex_count, vertex_elem_size, v2, i2);
			this->ReadVertexPos(vertices, vertex_count, vertex_elem_size, v3, i3);
			this->triangles[i] = { v1, v2, v3 };
		}
	}
};

template<typename T>
class Node {
public:
	using ScalarType = T;
	VMatrix mat{};
	VMatrix inv_mat{};
	bvh::BoundingBox<T> bbox{};
	Mesh* mesh = nullptr;

	explicit Node(Mesh* mesh, const VMatrix& mat) : mat(mat), bbox(mesh->bbox), mesh(mesh) {
		this->mat[3][0] = 0.f;
		this->mat[3][1] = 0.f;
		this->mat[3][2] = 0.f;
		this->mat[3][3] = 1.f;
		MatrixInverseGeneral(this->mat, this->inv_mat);
		auto& bmin = *(Vector*)this->bbox.min.values;
		Vector3DMultiplyPosition(this->mat, bmin, bmin);
		auto& bmax = *(Vector*)this->bbox.max.values;
		Vector3DMultiplyPosition(this->mat, bmax, bmax);
	}

	struct IntersectionType {
		bvh::Vector3<T> pos{};
		T t = T(0.0);
		T distance() const { return t; }
	};

	bvh::BoundingBox<T> bounding_box() const {
		return this->bbox;
	}

	bvh::Vector3<T> center() const {
		return this->bbox.center();
	}

	T area() const {
		return (this->mat * this->mesh->area).Length() / T(2.0);
	}

	std::optional<IntersectionType> intersect(const bvh::Ray<T>& ray) const {
		bvh::ClosestPrimitiveIntersector<bvh::Bvh<T>, bvh::Triangle<T>> intersector{
			this->mesh->accel,
			this->mesh->triangles.data()
		};
		bvh::SingleRayTraverser<bvh::Bvh<T>, 64, bvh::RobustNodeIntersector<bvh::Bvh<T>>> traverser{ this->mesh->accel };
		auto local_ray = ray;
		auto& local_ray_origin = *(Vector*)local_ray.origin.values;
		auto& local_ray_direction = *(Vector*)local_ray.direction.values;
		Vector3DMultiplyPosition(this->inv_mat, local_ray_origin, local_ray_origin);
		Vector3DMultiply(this->inv_mat, local_ray_direction, local_ray_direction);
		if (auto hit = traverser.traverse(local_ray, intersector)) {
			auto& triangle = this->mesh->triangles[hit->primitive_index];
			auto u = hit->intersection.u,
				v = hit->intersection.v,
				c_mul = 1.f - u - v;
			IntersectionType res{
				.pos = c_mul * triangle.p0 + u * triangle.p1() + v * triangle.p2(),
				.t = hit->intersection.t
			};
			auto& pos = *(Vector*)res.pos.values;
			Vector3DMultiplyPosition(this->mat, pos, pos);
			return res;
		}
		return std::nullopt;
	}
};

template <typename Bvh, typename Primitive, bool Permuted = false>
struct ClosestFilteredNodeIntersector : public bvh::PrimitiveIntersector<Bvh, Primitive, Permuted, false> {
	using Scalar = typename Primitive::ScalarType;
	using Intersection = typename Primitive::IntersectionType;
	uint32_t flags = 0;

	struct Result {
		Intersection intersection{};
		uint32_t flags = 0, path_id = 0;
		vec_t distance() const { return intersection.t; }
	};

	ClosestFilteredNodeIntersector(const Bvh& bvh, const Primitive* primitives, uint32_t flags)
		: bvh::PrimitiveIntersector<Bvh, Primitive, Permuted, false>(bvh, primitives), flags(flags) {}

	std::optional<Result> intersect(size_t index, const bvh::Ray<Scalar>& ray) const {
		auto [p, i] = this->primitive_at(index);
		if ((p.mesh->flags & this->flags) == 0)
			if (auto hit = p.intersect(ray))
				return { { *hit, p.mesh->flags, p.mesh->path_id } };
		return std::nullopt;
	}
};

class Scene {
public:
	///
	/// Commit the scene. Must be called before tracing rays into the scene.
	///
	void BuildAccel() {
		// the scene should contains something
		if (nodes.size() == 0)
			return;
		auto [bboxes, centers] = bvh::compute_bounding_boxes_and_centers(
			this->nodes.data(),
			this->nodes.size()
		);
		auto global_bbox = bvh::compute_bounding_boxes_union(bboxes.get(), this->nodes.size());
		{
			using Morton = uint32_t;
			bvh::LocallyOrderedClusteringBuilder<bvh::Bvh<vec_t>, Morton> builder{ this->toplevel_accel };
			builder.build(global_bbox, bboxes.get(), centers.get(), this->nodes.size());
		}
		{
			bvh::ParallelReinsertionOptimizer<bvh::Bvh<vec_t>> reinsertion_optimizer{ this->toplevel_accel };
			reinsertion_optimizer.optimize();
		}
		{
			bvh::LeafCollapser leaf_collapser{ this->toplevel_accel };
			leaf_collapser.collapse();
		}
	}
	template<typename I>
	std::optional<typename I::Result> intersect(const bvh::Ray<vec_t>& ray, uint32_t flags) const {
		I intersector{
			this->toplevel_accel,
			this->nodes.data(),
			flags
		};
		bvh::SingleRayTraverser<bvh::Bvh<vec_t>, 64, bvh::RobustNodeIntersector<bvh::Bvh<vec_t>>> traverser{ this->toplevel_accel };
		return traverser.traverse(ray, intersector);
	}

	// Toplevel BVH accel.
	bvh::Bvh<vec_t> toplevel_accel{};
	std::vector<Node<vec_t>> nodes{};
};

std::vector<std::unique_ptr<Mesh>> loaded_meshes;
Scene world_scene;
bool world_scene_initialized = false;
void ResetWorldInternal() {
	world_scene = {};
	loaded_meshes.clear();
	world_scene_initialized = false;
}

std::pair<std::string_view, std::string_view> SerializeCachedAccel(const bvh::Bvh<vec_t>& accel) {
	auto& nodes = accel.nodes;
	auto node_count = accel.node_count;
	auto& indices = accel.primitive_indices;
	size_t index_count = 0;
	for (size_t i = 0; i < node_count; i++) {
		auto& node = nodes[i];
		if (node.is_leaf())
			index_count = std::max(index_count, (size_t)node.first_child_or_primitive + (size_t)node.primitive_count);
	}
	return {
		{ (const char*)nodes.get(), node_count * sizeof(*nodes.get()) },
		{ (const char*)indices.get(), index_count * sizeof(*indices.get()) }
	};
}

void DeserializeCachedAccel(bvh::Bvh<vec_t>& accel, std::string_view cached_nodes, std::string_view cached_indices) {
	auto& nodes = accel.nodes;
	accel.node_count = cached_nodes.size() / sizeof(*nodes.get());
	nodes = std::make_unique<bvh::Bvh<float>::Node[]>(accel.node_count);
	memcpy(nodes.get(), cached_nodes.data(), accel.node_count * sizeof(*nodes.get()));

	auto& indices = accel.primitive_indices;
	auto indices_count = cached_indices.size() / sizeof(*indices.get());
	indices = std::make_unique<size_t[]>(indices_count);
	memcpy(indices.get(), cached_indices.data(), indices_count * sizeof(*indices.get()));
}

void LoadWorldMeshInternal(
	uint32_t id,
	std::string_view vertex_data, size_t vertex_elem_size,
	std::string_view index_data, size_t index_elem_size,
	uint32_t flags,
	uint32_t path_id
) {
	if (loaded_meshes.size() <= id)
		loaded_meshes.resize(id + 1);
	auto& mesh = loaded_meshes[id];
	mesh = std::make_unique<Mesh>(
		vertex_data,
		vertex_elem_size,
		index_data,
		index_elem_size,
		flags,
		path_id
	);
	mesh->Init(true);
	mesh->flags = flags;
	mesh->path_id = path_id;
}

void LoadWorldMeshCachedInternal(
	uint32_t id,
	std::string_view triangles_data,
	std::string_view cached_nodes,
	std::string_view cached_indices,
	uint32_t flags,
	uint32_t path_id
) {
	if (loaded_meshes.size() <= id)
		loaded_meshes.resize(id + 1);
	auto& mesh = loaded_meshes[id];
	mesh = std::make_unique<Mesh>();
	mesh->triangles.resize(triangles_data.size() / sizeof(mesh->triangles[0]));
	memcpy(mesh->triangles.data(), triangles_data.data(), mesh->triangles.size() * sizeof(mesh->triangles[0]));
	mesh->Init(false);
	DeserializeCachedAccel(mesh->accel, cached_nodes, cached_indices);
	mesh->flags = flags;
	mesh->path_id = path_id;
}

void SpawnWorldMeshInternal(uint32_t id, const VMatrix& transform) {
	if (loaded_meshes.size() <= id)
		return;
	auto& mesh = loaded_meshes[id];
	if (mesh == nullptr)
		return;
	world_scene.nodes.emplace_back(mesh.get(), transform);
}

void FinishWorldInternal(std::string_view cached_nodes, std::string_view cached_indices) {
	if (!cached_nodes.empty() && !cached_indices.empty())
		DeserializeCachedAccel(world_scene.toplevel_accel, cached_nodes, cached_indices);
	else
		world_scene.BuildAccel();
	world_scene_initialized = true;
}

std::pair<std::string_view, std::string_view> ExtractWorldBVHInternal() {
	return SerializeCachedAccel(world_scene.toplevel_accel);
}

MeshData ExtractMeshDataInternal(uint32_t id) {
	if (loaded_meshes.size() <= id)
		return {};
	auto& mesh = loaded_meshes[id];
	if (mesh == nullptr)
		return {};
	auto& triangles = mesh->triangles;
	auto [nodes, indices] = SerializeCachedAccel(mesh->accel);
	return {
		{ (const char*)triangles.data(), triangles.size() * sizeof(*triangles.data()) },
		nodes,
		indices,
		mesh->flags,
		mesh->path_id
	};
}

bool RayTraceInitialized() {
	return world_scene_initialized;
}

std::optional<RayTraceResult> TryRayTrace(Vector camera_position, Vector ray_direction, uint32_t flags) {
	bvh::Ray<float> ray;
	ray.origin[0] = camera_position.x;
	ray.origin[1] = camera_position.y;
	ray.origin[2] = camera_position.z;
	ray.direction[0] = ray_direction.x;
	ray.direction[1] = ray_direction.y;
	ray.direction[2] = ray_direction.z;
	ray.tmin = 0.f;
	ray.tmax = 1.0e+30f;

	if (auto hit = world_scene.intersect<ClosestFilteredNodeIntersector<bvh::Bvh<vec_t>, Node<vec_t>>>(ray, flags))
		return { { *(Vector*)hit->intersection.pos.values, hit->flags, hit->path_id } };
	return std::nullopt;
}
