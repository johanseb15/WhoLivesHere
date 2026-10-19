"""Generate an editable, self-contained Vera character in Blender 5.2.2.

Run:
  blender --background --python generate_vera_master_v01.py

The script uses only Blender's bundled Python API and creates all geometry,
materials, cameras and lighting procedurally. It writes its .blend and renders
beside this script.
"""

import bpy
import json
import math
import os
import time
from mathutils import Vector


OUT_DIR = os.path.dirname(os.path.abspath(__file__))
BLEND_PATH = os.path.join(OUT_DIR, "Vera_Master_v01.blend")
RENDER_SIZE = (900, 1200)
RENDER_SAMPLES = 24


def srgb_channel(value):
    value /= 255.0
    return value / 12.92 if value < 0.04045 else ((value + 0.055) / 1.055) ** 2.4


def rgba(hex_value, alpha=1.0):
    value = hex_value.lstrip("#")
    return tuple(srgb_channel(int(value[i:i + 2], 16)) for i in (0, 2, 4)) + (alpha,)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.collections:
        if block.name != "Collection":
            bpy.data.collections.remove(block)
    root = bpy.context.scene.collection
    if bpy.data.collections.get("Collection"):
        bpy.data.collections.remove(bpy.data.collections["Collection"])
    return root


def make_collection(name, parent):
    collection = bpy.data.collections.new(name)
    parent.children.link(collection)
    return collection


ROOT = None
BODY = None
HAIR = None
CLOTH = None
DETAILS = None


def link_object(obj, collection):
    for old in list(obj.users_collection):
        old.objects.unlink(obj)
    collection.objects.link(obj)
    return obj


def material(name, color, roughness=0.48, metallic=0.0, subsurface=0.0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = rgba(color)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = rgba(color)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Subsurface Weight" in bsdf.inputs:
        bsdf.inputs["Subsurface Weight"].default_value = subsurface
    return mat


M = {}


def assign(obj, mat):
    if mat:
        obj.data.materials.append(mat)
    return obj


def smooth(obj):
    if obj.type == "MESH":
        for face in obj.data.polygons:
            face.use_smooth = True
    return obj


def uv_sphere(name, location, scale, mat, collection=None, segments=32, rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.scale = scale
    link_object(obj, collection or BODY)
    assign(obj, mat)
    smooth(obj)
    return obj


def bevel_cube(name, location, scale, mat, bevel=0.06, collection=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    link_object(obj, collection or DETAILS)
    assign(obj, mat)
    if bevel:
        modifier = obj.modifiers.new("Soft tailored edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 3
        obj.modifiers.new("Weighted corner normals", "WEIGHTED_NORMAL")
    return obj


def cylinder_between(name, start, end, radius, mat, collection=None, vertices=16, radius_end=None):
    start, end = Vector(start), Vector(end)
    delta = end - start
    depth = delta.length
    bpy.ops.mesh.primitive_cone_add(
        vertices=vertices,
        radius1=radius if radius_end is None else radius,
        radius2=radius if radius_end is None else radius_end,
        depth=depth,
        location=(start + end) / 2,
    )
    obj = bpy.context.object
    obj.name = name
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = delta.to_track_quat("Z", "Y")
    link_object(obj, collection or DETAILS)
    assign(obj, mat)
    smooth(obj)
    bevel = obj.modifiers.new("Rounded ends", "BEVEL")
    bevel.width = min(radius * 0.25, depth * 0.15)
    bevel.segments = 2
    obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def line(name, points, mat, radius=0.012, collection=None, cyclic=False):
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.resolution_u = 2
    curve.bevel_depth = radius
    curve.bevel_resolution = 3
    spline = curve.splines.new("POLY")
    spline.points.add(len(points) - 1)
    for point, coord in zip(spline.points, points):
        point.co = (*coord, 1)
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, curve)
    (collection or DETAILS).objects.link(obj)
    assign(obj, mat)
    return obj


def extruded_polygon(name, points_xz, depth, mat, collection=None, bevel=0.012, y_center=-0.32):
    """Create a shallow solid from a front-facing X/Z polygon at y=-depth/2."""
    vertices = []
    for y in (y_center - depth / 2, y_center + depth / 2):
        vertices.extend((x, y, z) for x, z in points_xz)
    n = len(points_xz)
    faces = [tuple(range(n)), tuple(range(n, 2 * n))]
    for i in range(n):
        j = (i + 1) % n
        faces.append((i, j, j + n, i + n))
    mesh = bpy.data.meshes.new(name + " mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(mat)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    (collection or DETAILS).objects.link(obj)
    if bevel:
        modifier = obj.modifiers.new("Soft cut edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        obj.modifiers.new("Weighted normals", "WEIGHTED_NORMAL")
    return obj


def torus(name, location, major_radius, minor_radius, mat, collection=None, rotation=None):
    bpy.ops.mesh.primitive_torus_add(
        major_segments=48, minor_segments=12,
        major_radius=major_radius, minor_radius=minor_radius,
        location=location, rotation=rotation or (0, 0, 0),
    )
    obj = bpy.context.object
    obj.name = name
    link_object(obj, collection or DETAILS)
    assign(obj, mat)
    smooth(obj)
    return obj


def eye_detail(x, z):
    uv_sphere("Eye · warm ivory", (x, -0.378, z), (0.115, 0.075, 0.142), M["eye_white"], BODY)
    uv_sphere("Iris · espresso", (x + 0.005, -0.443, z - 0.005), (0.074, 0.045, 0.096), M["iris"], BODY)
    uv_sphere("Pupil", (x + 0.009, -0.480, z - 0.012), (0.043, 0.026, 0.062), M["pupil"], BODY)
    uv_sphere("Eye sparkle", (x - 0.018, -0.503, z + 0.032), (0.023, 0.014, 0.027), M["white"], DETAILS, 20, 12)
    uv_sphere("Eye sparkle small", (x + 0.029, -0.501, z - 0.026), (0.010, 0.009, 0.012), M["white"], DETAILS, 16, 10)


def build_materials():
    palette = {
        "skin": ("#B86F49", 0.38, 0, 0.06),
        "skin_light": ("#D78D64", 0.4, 0, 0.04),
        "blush": ("#D87769", 0.62, 0, 0),
        "hair": ("#101827", 0.46, 0, 0),
        "hair_light": ("#25334A", 0.49, 0, 0),
        "scrunchie": ("#F2C830", 0.42, 0, 0),
        "cyan": ("#31C6D2", 0.34, 0.03, 0),
        "shirt": ("#F5EBDD", 0.72, 0, 0),
        "apron": ("#1457A6", 0.48, 0, 0),
        "apron_light": ("#2677C3", 0.48, 0, 0),
        "apron_dark": ("#0C3D79", 0.51, 0, 0),
        "olive": ("#777341", 0.68, 0, 0),
        "olive_light": ("#989051", 0.68, 0, 0),
        "shoe": ("#F5F3EC", 0.53, 0, 0),
        "sole": ("#D8D6CE", 0.64, 0, 0),
        "ink": ("#18232E", 0.44, 0, 0),
        "metal": ("#C5BBAA", 0.3, 0.72, 0),
        "eye_white": ("#FFF3DB", 0.21, 0, 0),
        "iris": ("#4C2B20", 0.22, 0.04, 0),
        "pupil": ("#121A26", 0.15, 0, 0),
        "white": ("#FFFFFF", 0.16, 0, 0),
        "paint_coral": ("#F26D54", 0.42, 0, 0),
        "paint_yellow": ("#F4C742", 0.42, 0, 0),
        "paint_teal": ("#22A9A3", 0.42, 0, 0),
        "paint_green": ("#75B96C", 0.42, 0, 0),
        "paint_lilac": ("#9E83C5", 0.42, 0, 0),
        "paint_blue": ("#4389D6", 0.42, 0, 0),
    }
    for key, (color, rough, metal, sub) in palette.items():
        M[key] = material("Vera · " + key.replace("_", " "), color, rough, metal, sub)
    # Subtle procedural canvas grain, entirely self-contained in the .blend.
    fabric = M["apron"].node_tree
    noise = fabric.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 115
    noise.inputs["Detail"].default_value = 2
    bump = fabric.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.11
    bump.inputs["Distance"].default_value = 0.012
    fabric.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    fabric.links.new(bump.outputs["Normal"], fabric.nodes.get("Principled BSDF").inputs["Normal"])
    fabric_light = M["apron_light"].node_tree
    noise_light = fabric_light.nodes.new("ShaderNodeTexNoise")
    noise_light.inputs["Scale"].default_value = 115
    bump_light = fabric_light.nodes.new("ShaderNodeBump")
    bump_light.inputs["Strength"].default_value = 0.10
    bump_light.inputs["Distance"].default_value = 0.01
    fabric_light.links.new(noise_light.outputs["Fac"], bump_light.inputs["Height"])
    fabric_light.links.new(bump_light.outputs["Normal"], fabric_light.nodes.get("Principled BSDF").inputs["Normal"])


def build_head():
    # Large toy-like face with a soft jaw; facial details are separate editable meshes.
    uv_sphere("Head · warm vinyl", (0, 0, 2.34), (0.485, 0.395, 0.64), M["skin"], BODY, 48, 32)
    for side in (-1, 1):
        uv_sphere("Ear", (side * 0.475, -0.005, 2.34), (0.105, 0.105, 0.145), M["skin"], BODY)
        uv_sphere("Ear inset", (side * 0.512, -0.076, 2.34), (0.047, 0.035, 0.072), M["skin_light"], DETAILS, 20, 14)
        uv_sphere("Cheek tint", (side * 0.295, -0.337, 2.205), (0.105, 0.025, 0.055), M["blush"], DETAILS, 24, 16)
        eye_detail(side * 0.185, 2.405)
        line("Expressive brow", [
            (side * 0.30, -0.386, 2.595),
            (side * 0.20, -0.416, 2.625),
            (side * 0.10, -0.391, 2.607),
        ], M["hair"], 0.027, DETAILS)

    # Small nose bridge paint mark is a defining color accent, not a nose accessory.
    extruded_polygon("Cyan paint mark on nose", [(-0.050, 2.325), (-0.016, 2.341), (0.044, 2.333), (0.053, 2.310), (0.006, 2.302), (-0.044, 2.306)], 0.012, M["cyan"], DETAILS, 0.005, -0.406)
    line("Gentle smile", [(-0.105, -0.386, 2.135), (-0.082, -0.396, 2.119), (-0.045, -0.405, 2.105), (0, -0.409, 2.101), (0.045, -0.405, 2.105), (0.082, -0.396, 2.119), (0.105, -0.386, 2.137)], M["ink"], 0.012, DETAILS)
    uv_sphere("Lower lip highlight", (0, -0.384, 2.083), (0.054, 0.014, 0.012), M["skin_light"], DETAILS, 18, 10)


def build_hair():
    # The cap, side curls and bun overlap into a single designed silhouette.
    uv_sphere("Hair cap", (0, 0.018, 2.718), (0.508, 0.414, 0.315), M["hair"], HAIR, 40, 24)
    # Low-contrast curved strand ridges give the cap a curled, groomed surface.
    for index, base_x in enumerate((-0.34, -0.22, -0.10, 0.03, 0.16, 0.29)):
        points = []
        for step in range(9):
            t = step / 8
            x = base_x + 0.055 * math.sin(t * math.pi * 1.7 + index * 0.65)
            z = 2.69 + t * 0.25 + 0.025 * math.sin(t * math.pi * 2 + index)
            nx = (x / 0.508) ** 2
            nz = ((z - 2.718) / 0.315) ** 2
            y = 0.018 - 0.414 * math.sqrt(max(0.08, 1 - nx - nz)) - 0.006
            points.append((x, y, z))
        line("Sculpted curl ridge %02d" % index, points, M["hair_light"], 0.012, HAIR)
    # Front hairline is a deliberate scalloped arc above the brows.
    for i, x in enumerate((-0.37, -0.27, -0.16, -0.05, 0.07, 0.19, 0.31, 0.39)):
        z = 2.638 + 0.038 * math.cos((x / 0.4) * math.pi / 2)
        y = -0.337 + 0.05 * abs(x)
        uv_sphere("Curl · fringe %02d" % i, (x, y, z), (0.095, 0.105, 0.102), M["hair" if i % 3 else "hair_light"], HAIR, 20, 14)
    # Loose ringlets frame both cheeks; their repeated rhythm creates an intentional outline.
    for side in (-1, 1):
        for i in range(5):
            z = 2.57 - i * 0.145
            x = side * (0.435 + 0.025 * math.sin(i * 1.2))
            y = -0.07 + 0.025 * (i % 2)
            uv_sphere("Curl · side %s %02d" % (side, i), (x, y, z), (0.105, 0.11, 0.13), M["hair" if i % 2 else "hair_light"], HAIR, 20, 14)
    uv_sphere("High curly bun", (0, 0.045, 2.93), (0.315, 0.295, 0.31), M["hair"], HAIR, 36, 24)
    # Raised, rounded curl clumps texture the bun without breaking its silhouette.
    for index, (x, z) in enumerate(((-0.17, 2.95), (-0.08, 3.08), (0.055, 3.12), (0.18, 2.99), (0.02, 2.89))):
        nx = (x / 0.315) ** 2
        nz = ((z - 2.93) / 0.31) ** 2
        y = 0.045 - 0.295 * math.sqrt(max(0.12, 1 - nx - nz)) - 0.018
        uv_sphere("Bun surface curl %02d" % index, (x, y, z), (0.082, 0.071, 0.085), M["hair_light" if index % 2 == 0 else "hair"], HAIR, 20, 14)
    for i in range(19):
        angle = 2 * math.pi * i / 19
        x = 0.27 * math.cos(angle)
        y = 0.045 + 0.245 * math.sin(angle)
        z = 2.92 + 0.09 * math.sin(2 * angle + 0.5)
        uv_sphere("Bun curl %02d" % i, (x, y, z), (0.105, 0.10, 0.105), M["hair" if i % 3 else "hair_light"], HAIR, 18, 12)
    # Puffy yellow inner-tube scrunchie around the base of the bun.
    torus("Yellow bicycle scrunchie", (0, -0.18, 2.785), 0.255, 0.073, M["scrunchie"], HAIR)
    for i in range(16):
        angle = 2 * math.pi * i / 16
        uv_sphere("Scrunchie gathered fold %02d" % i,
                  (0.255 * math.cos(angle), -0.18 + 0.255 * math.sin(angle), 2.785),
                  (0.055, 0.050, 0.052), M["scrunchie"], HAIR, 16, 10)
    # Small front-facing badge and a readable bicycle pictogram made from curves.
    uv_sphere("Scrunchie pictogram badge", (0, -0.475, 2.792), (0.112, 0.026, 0.076), M["scrunchie"], DETAILS, 24, 12)
    for x in (-0.042, 0.042):
        torus("Bicycle icon wheel", (x, -0.506, 2.785), 0.027, 0.006, M["ink"], DETAILS, (math.pi / 2, 0, 0))
    line("Bicycle pictogram frame", [(-0.042, -0.509, 2.785), (-0.012, -0.509, 2.818), (0.042, -0.509, 2.785), (-0.042, -0.509, 2.785)], M["ink"], 0.005, DETAILS)
    line("Bicycle pictogram handle", [(0.014, -0.509, 2.818), (0.043, -0.509, 2.822)], M["ink"], 0.005, DETAILS)
    line("Bicycle pictogram saddle", [(-0.024, -0.509, 2.822), (0.001, -0.509, 2.822)], M["ink"], 0.005, DETAILS)


def build_clothes():
    # Shirt, neck and soft toy-like limbs.
    uv_sphere("Neck", (0, 0.005, 1.81), (0.19, 0.18, 0.22), M["skin"], BODY)
    uv_sphere("Cream shirt torso", (0, 0.02, 1.50), (0.405, 0.285, 0.49), M["shirt"], BODY, 36, 24)
    uv_sphere("Olive trousers waist", (0, 0.015, 1.13), (0.345, 0.27, 0.30), M["olive"], BODY)
    # Slightly relaxed stance gives a stable silhouette without human realism.
    for side in (-1, 1):
        x = side * 0.205
        uv_sphere("Olive trouser leg", (x, 0.02, 0.69), (0.205, 0.235, 0.48), M["olive"], BODY, 28, 20)
        uv_sphere("Knee patch", (x, -0.203, 0.78), (0.132, 0.035, 0.12), M["olive_light"], CLOTH, 24, 16)
        line("Knee patch stitch", [(x - 0.09, -0.238, 0.78), (x + 0.09, -0.238, 0.78)], M["scrunchie"], 0.007, DETAILS)
        # White canvas sneakers, toe points toward the character's front (-Y).
        uv_sphere("Sneaker sole", (x + side * 0.015, -0.07, 0.115), (0.235, 0.355, 0.085), M["sole"], BODY, 32, 18)
        uv_sphere("White canvas sneaker", (x + side * 0.015, -0.105, 0.225), (0.215, 0.335, 0.16), M["shoe"], BODY, 32, 20)
        uv_sphere("Sneaker toe cap", (x + side * 0.015, -0.345, 0.245), (0.14, 0.11, 0.10), M["white"], DETAILS, 24, 14)
        # Eyelets and laces read at full-body scale.
        for j in range(3):
            z = 0.265 + j * 0.034
            y = -0.18 + j * 0.04
            line("Sneaker lace", [(x - 0.075, y, z), (x + 0.075, y - 0.006, z)], M["sole"], 0.009, DETAILS)
        # Bright but small paint spatters distinguish the canvas sneakers.
        for j, (dx, dy, dz, color) in enumerate([
            (-0.11, -0.13, 0.31, "paint_coral"), (0.08, -0.20, 0.34, "paint_teal"),
            (0.13, -0.02, 0.32, "paint_yellow"), (-0.04, -0.31, 0.29, "paint_lilac"),
        ]):
            uv_sphere("Sneaker paint fleck %02d" % j, (x + dx, -0.392 + dy * 0.12, dz), (0.027, 0.014, 0.018), M[color], DETAILS, 12, 8)

    # Arms bend gently toward the waist; right hand presents the swatch fan.
    for side in (-1, 1):
        shoulder = (side * 0.34, 0.01, 1.72)
        elbow = (side * 0.59, -0.015, 1.48)
        wrist = (side * 0.63, -0.07, 1.27)
        uv_sphere("Rolled shirt sleeve", shoulder, (0.19, 0.22, 0.20), M["shirt"], BODY)
        cylinder_between("Forearm", shoulder, elbow, 0.115, M["skin"], BODY, 24, 0.09)
        cylinder_between("Wrist", elbow, wrist, 0.09, M["skin"], BODY, 20, 0.075)
        uv_sphere("Fingerless fabric mitt", (side * 0.64, -0.10, 1.235), (0.115, 0.10, 0.13), M["ink"], BODY)
        uv_sphere("Exposed fingertips", (side * 0.65, -0.175, 1.19), (0.07, 0.045, 0.045), M["skin_light"], DETAILS, 18, 10)
        # Stitch line at rolled sleeve and glove cuff.
        torus("Sleeve rolled hem", (side * 0.36, 0.01, 1.63), 0.142, 0.018, M["shirt"], DETAILS, (math.pi / 2, 0, 0))

    # Apron body: shaped, thick, editable polygon rather than a flat decal.
    extruded_polygon("Cobalt apron skirt", [(-0.34, 1.56), (0.34, 1.56), (0.405, 0.86), (0.34, 0.81), (-0.34, 0.81), (-0.405, 0.86)], 0.09, M["apron"], CLOTH, 0.035, -0.305)
    extruded_polygon("Cobalt apron bib", [(-0.245, 1.90), (0.245, 1.90), (0.215, 1.48), (-0.215, 1.48)], 0.10, M["apron"], CLOTH, 0.028, -0.335)
    # Double topstitching, panel seams and neck/waist straps.
    for side in (-1, 1):
        line("Apron side seam", [(side * 0.30, -0.36, 1.52), (side * 0.37, -0.36, 0.88)], M["apron_light"], 0.009, DETAILS)
        line("Apron shoulder strap", [(side * 0.18, -0.34, 1.86), (side * 0.24, -0.37, 1.74), (side * 0.16, -0.37, 1.62)], M["apron_light"], 0.033, CLOTH)
        # Back ties visible in the rear view.
        line("Apron waist tie", [(side * 0.25, 0.13, 1.22), (side * 0.42, 0.26, 1.28), (side * 0.50, 0.25, 1.13)], M["apron_light"], 0.036, CLOTH)
    line("Apron hem stitch", [(-0.33, -0.36, 0.885), (0, -0.36, 0.87), (0.33, -0.36, 0.885)], M["apron_light"], 0.009, DETAILS)
    bevel_cube("Apron front pocket", (0, -0.373, 1.06), (0.34, 0.045, 0.23), M["apron_dark"], 0.045, CLOTH)
    line("Pocket top stitch", [(-0.15, -0.40, 1.165), (0.15, -0.40, 1.165)], M["apron_light"], 0.009, DETAILS)
    # A few restrained paint flecks make the apron feel used in Vera's workshop.
    for i, (x, z, color, sx, sz) in enumerate([
        (-0.27, 1.45, "paint_coral", 0.035, 0.018), (0.28, 1.39, "paint_yellow", 0.022, 0.030),
        (-0.28, 1.32, "paint_teal", 0.025, 0.017), (0.26, 1.06, "paint_lilac", 0.032, 0.018),
        (-0.25, 0.97, "paint_yellow", 0.019, 0.028), (0.27, 0.93, "paint_coral", 0.028, 0.020),
    ]):
        uv_sphere("Apron paint fleck %02d" % i, (x, -0.363, z), (sx, 0.012, sz), M[color], DETAILS, 14, 8)

    # Tailored tool belt, buckle, compact pouches and recognizable small tools.
    line("Tool belt", [(-0.37, -0.405, 1.29), (-0.20, -0.425, 1.31), (0.20, -0.425, 1.31), (0.37, -0.405, 1.29)], M["ink"], 0.035, DETAILS)
    bevel_cube("Belt buckle", (0, -0.442, 1.30), (0.115, 0.035, 0.085), M["metal"], 0.018, DETAILS)
    bevel_cube("Belt pouch", (-0.30, -0.44, 1.29), (0.13, 0.09, 0.16), M["apron_dark"], 0.025, DETAILS)
    cylinder_between("Mini wrench handle", (0.30, -0.455, 1.22), (0.34, -0.455, 1.42), 0.018, M["metal"], DETAILS, 12)
    torus("Wrench open jaw", (0.34, -0.455, 1.43), 0.034, 0.009, M["metal"], DETAILS, (math.pi / 2, 0, 0))
    cylinder_between("Hex key long arm", (0.20, -0.455, 1.23), (0.20, -0.455, 1.39), 0.012, M["metal"], DETAILS, 10)
    cylinder_between("Hex key short arm", (0.20, -0.455, 1.39), (0.26, -0.455, 1.39), 0.012, M["metal"], DETAILS, 10)

    # A stitched paint-swatch fan sits in the apron pocket, plus a separate handheld fan.
    for index, color in enumerate(("paint_coral", "paint_yellow", "paint_teal", "paint_green", "paint_lilac")):
        x = -0.13 + index * 0.064
        extruded_polygon("Pocket swatch %02d" % index, [(x, 0.99), (x + 0.055, 0.99), (x + 0.065, 1.15), (x + 0.01, 1.15)], 0.018, M[color], DETAILS, 0.004, -0.427)
        uv_sphere("Swatch rivet", (x + 0.026, -0.442, 1.15), (0.012, 0.008, 0.012), M["metal"], DETAILS, 12, 8)


def build_handheld_fan():
    # Art Bible calls for a fan of paint chips in Vera's right hand (-X).
    pivot_x, pivot_y, pivot_z = -0.67, -0.215, 1.31
    palette = ["paint_coral", "paint_yellow", "paint_teal", "paint_green", "paint_lilac", "paint_blue"]
    angles = [122, 143, 164, 185, 206, 227]
    for index, (color, angle) in enumerate(zip(palette, angles)):
        theta = math.radians(angle)
        r1, r2 = 0.045, 0.37
        a1, a2 = theta - math.radians(10), theta + math.radians(10)
        pts = [
            (pivot_x + r1 * math.cos(a1), pivot_z + r1 * math.sin(a1)),
            (pivot_x + r2 * math.cos(a1), pivot_z + r2 * math.sin(a1)),
            (pivot_x + r2 * math.cos(a2), pivot_z + r2 * math.sin(a2)),
            (pivot_x + r1 * math.cos(a2), pivot_z + r1 * math.sin(a2)),
        ]
        extruded_polygon("Handheld paint chip %02d" % index, pts, 0.026, M[color], DETAILS, 0.009)
        # Fine dark outline makes individual chips legible at full-body scale.
        coords = [(x, pivot_y - 0.02, z) for x, z in pts]
        line("Paint chip edge %02d" % index, coords, M["apron_dark"], 0.006, DETAILS, True)
    uv_sphere("Paint fan brass pin", (pivot_x, pivot_y - 0.03, pivot_z), (0.032, 0.025, 0.032), M["metal"], DETAILS, 18, 12)


def camera_at(name, location, target):
    data = bpy.data.cameras.new(name + " data")
    camera = bpy.data.objects.new(name, data)
    ROOT.objects.link(camera)
    camera.location = location
    direction = Vector(target) - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    data.type = "ORTHO"
    data.ortho_scale = 3.65
    data.lens = 55
    bpy.context.scene.camera = camera
    return camera


def area_light(name, location, target, power, size, color):
    data = bpy.data.lights.new(name + " data", "AREA")
    data.energy = power
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    ROOT.objects.link(obj)
    obj.location = location
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()
    return obj


def setup_render():
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.eevee.taa_render_samples = RENDER_SAMPLES
    scene.render.resolution_x, scene.render.resolution_y = RENDER_SIZE
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = True
    scene.render.image_settings.compression = 20
    scene.render.filepath = os.path.join(OUT_DIR, "vera_front_transparent.png")
    scene.world.color = (0.07, 0.08, 0.10)
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.render.resolution_percentage = 100
    scene.render.use_file_extension = True
    scene.render.film_transparent = True
    area_light("Key · warm softbox", (-4, -5, 6), (0, 0, 1.8), 430, 4.0, (1.0, 0.83, 0.68))
    area_light("Fill · cool softbox", (4, -4, 3.4), (0, 0, 1.8), 280, 3.5, (0.66, 0.82, 1.0))
    area_light("Rim · cobalt separation", (1.5, 3.2, 5.0), (0, 0, 2.0), 540, 2.8, (0.43, 0.66, 1.0))
    area_light("Face bounce", (0, -3.5, 1.8), (0, 0, 2.2), 100, 2.4, (1.0, 0.91, 0.78))


def render_view(label, location, transparent=True):
    scene = bpy.context.scene
    camera_at("Camera · " + label, location, (0, 0, 1.52))
    scene.render.film_transparent = transparent
    scene.render.filepath = os.path.join(OUT_DIR, "vera_" + label.lower() + ("_transparent" if transparent else "") + ".png")
    started = time.perf_counter()
    bpy.ops.render.render(write_still=True)
    return time.perf_counter() - started


def character_bounds():
    depsgraph = bpy.context.evaluated_depsgraph_get()
    coords = []
    for collection in (BODY, HAIR, CLOTH, DETAILS):
        for obj in collection.objects:
            if obj.type != "MESH":
                continue
            evaluated = obj.evaluated_get(depsgraph)
            for corner in evaluated.bound_box:
                coords.append(evaluated.matrix_world @ Vector(corner))
    return (
        min(v.x for v in coords), max(v.x for v in coords),
        min(v.y for v in coords), max(v.y for v in coords),
        min(v.z for v in coords), max(v.z for v in coords),
    )


def main():
    global ROOT, BODY, HAIR, CLOTH, DETAILS
    ROOT = clear_scene()
    BODY = make_collection("VERA · Cuerpo y rostro", ROOT)
    HAIR = make_collection("VERA · Cabello y scrunchie", ROOT)
    CLOTH = make_collection("VERA · Vestuario", ROOT)
    DETAILS = make_collection("VERA · Herramientas y detalles", ROOT)
    build_materials()
    build_head()
    build_hair()
    build_clothes()
    build_handheld_fan()
    setup_render()

    bounds = character_bounds()
    height = bounds[5] - bounds[4]
    face_head_unit = 1.28  # skull mesh from crown to chin; hairstyle is excluded from the head unit
    head_ratio = height / face_head_unit
    scene = bpy.context.scene
    scene.render.film_transparent = True
    bpy.context.preferences.filepaths.save_version = 0
    # Save the editable source with a front camera and transparent render settings.
    camera_at("Camera · Front", (0, -8.5, 1.72), (0, 0, 1.52))
    scene.render.filepath = os.path.join(OUT_DIR, "vera_front_transparent.png")
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)

    timings = {}
    timings["front"] = render_view("front", (0, -8.5, 1.72), True)
    timings["side"] = render_view("side", (8.5, 0, 1.72), True)
    timings["back"] = render_view("back", (0, 8.5, 1.72), True)

    report = {
        "blender_version": bpy.app.version_string,
        "render_engine": scene.render.engine,
        "samples": RENDER_SAMPLES,
        "resolution_px": list(RENDER_SIZE),
        "render_seconds": timings,
        "dimensions_units": {
            "width_x": round(bounds[1] - bounds[0], 3),
            "depth_y": round(bounds[3] - bounds[2], 3),
            "height_z": round(height, 3),
            "bounds_xyz": [round(v, 3) for v in bounds],
        },
        "proportion_assumption": {
            "head_unit_z": face_head_unit,
            "total_height_in_head_units": round(head_ratio, 3),
            "target": 2.5,
        },
        "objects": len(bpy.data.objects),
        "materials": sum(1 for mat in bpy.data.materials if mat.users > 0),
        "external_assets": 0,
    }
    with open(os.path.join(OUT_DIR, "render_report.json"), "w", encoding="utf-8") as stream:
        json.dump(report, stream, ensure_ascii=False, indent=2)
    print("VERA_RENDER_REPORT=" + json.dumps(report, ensure_ascii=False))
    # Keep the project opening on the front camera and transparent front render.
    scene.render.film_transparent = True
    scene.camera = bpy.data.objects.get("Camera · Front")
    scene.render.filepath = os.path.join(OUT_DIR, "vera_front_transparent.png")
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)


if __name__ == "__main__":
    main()
