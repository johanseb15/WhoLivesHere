"""Vera Master v0.2 — independent organic-form iteration.
Run with Blender 5.2: blender --background --python generate_vera_master_v02.py
No external assets or Python packages are used.
"""
import bpy, math, os, time, json
from mathutils import Vector
from math import sin, cos, pi
OUT=os.path.dirname(os.path.abspath(__file__))
BLEND=os.path.join(OUT,'Vera_Master_v02.blend')

def hexcol(h):
    vals=[int(h[i:i+2],16)/255 for i in (1,3,5)]
    return tuple(v/12.92 if v<=.04045 else ((v+.055)/1.055)**2.4 for v in vals)+(1,)
def mat(n,h,rough=.55,metal=0):
    m=bpy.data.materials.new(n); m.diffuse_color=hexcol(h); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF'); p.inputs['Base Color'].default_value=hexcol(h); p.inputs['Roughness'].default_value=rough; p.inputs['Metallic'].default_value=metal
    if 'Subsurface Weight' in p.inputs: p.inputs['Subsurface Weight'].default_value=.06
    return m
M={k:mat(k,v,r) for k,v,r in [
 ('Skin','#B86D49',.43),('SkinLight','#D38A62',.43),('Hair','#101A2B',.3),('HairHi','#26364A',.32),('Yellow','#F6C928',.4),('Shirt','#F4E8D3',.66),('Apron','#1457A0',.62),('ApronLight','#2975B7',.6),('Olive','#647044',.68),('Patch','#A39363',.75),('White','#F4F0E7',.62),('Sole','#D9D4CA',.7),('Iris','#332016',.25),('IrisHi','#547451',.28),('Black','#141419',.22),('Cyan','#5BD9E8',.4),('Pink','#BE705D',.5),('Metal','#B9A887',.3),('PaintRed','#EA6956',.5),('PaintYellow','#E9B941',.5),('PaintGreen','#67A98C',.5),('PaintViolet','#A887C4',.5)]}

def mesh_obj(n,verts,faces,ma):
    me=bpy.data.meshes.new(n+'Mesh'); me.from_pydata(verts,[],faces); me.update(); o=bpy.data.objects.new(n,me); bpy.context.collection.objects.link(o); o.data.materials.append(M[ma]);
    for p in me.polygons:p.use_smooth=True
    return o
def smooth_sub(o,lev=2):
    s=o.modifiers.new('soft sculpted surface','SUBSURF'); s.levels=lev; s.render_levels=lev
    return o
def ellipsoid(n,loc,scale,ma,seg=32,rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg,ring_count=rings,location=loc); o=bpy.context.object; o.name=n; o.scale=scale; bpy.ops.object.transform_apply(location=False,rotation=False,scale=True); o.data.materials.append(M[ma]);
    for p in o.data.polygons:p.use_smooth=True
    return o
def loft(n,sections,ma,steps=32,sub=2):
    # sections: z,width,depth,ycenter,shapeExponent. Smooth interpolated ring loft, front is negative Y.
    verts=[]; faces=[]
    for z,w,d,yc,e in sections:
        for j in range(steps):
            a=2*pi*j/steps; c=cos(a); s=sin(a)
            x=w*(1 if c>=0 else -1)*abs(c)**e
            y=yc+d*(1 if s>=0 else -1)*abs(s)**e
            verts.append((x,y,z))
    nr=len(sections)
    for i in range(nr-1):
        for j in range(steps):
            a=i*steps+j; b=i*steps+(j+1)%steps; faces.append((a,b,b+steps,a+steps))
    faces += [tuple(range(steps-1,-1,-1)),tuple((nr-1)*steps+j for j in range(steps))]
    return smooth_sub(mesh_obj(n,verts,faces,ma),sub)
def curve(n,pts,ma,r=.04,cyclic=False,res=12):
    cu=bpy.data.curves.new(n+'Curve','CURVE'); cu.dimensions='3D'; cu.resolution_u=16; cu.bevel_depth=r; cu.bevel_resolution=4
    sp=cu.splines.new('BEZIER'); sp.bezier_points.add(len(pts)-1)
    for b,p in zip(sp.bezier_points,pts): b.co=p; b.handle_left_type='AUTO'; b.handle_right_type='AUTO'
    sp.use_cyclic_u=cyclic; ob=bpy.data.objects.new(n,cu); bpy.context.collection.objects.link(ob); ob.data.materials.append(M[ma]); return ob
def torus(n,loc,major,minor,ma,rot=(0,0,0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major,minor_radius=minor,major_segments=48,minor_segments=12,location=loc,rotation=rot); o=bpy.context.object;o.name=n;o.data.materials.append(M[ma]);
    for f in o.data.polygons:f.use_smooth=True
    return o

def reset():
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
reset(); scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE'; scene.eevee.taa_render_samples=32
scene.render.resolution_x=900; scene.render.resolution_y=1200; scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGBA'; scene.render.film_transparent=True
scene.view_settings.view_transform='AgX'
# Compact silhouette: joined visual masses, sculpted clothing shells, soft continuous limbs.
# trousers and torso
loft('Continuous shirt and torso',[(.91,.30,.22,0,.82),(1.05,.39,.25,0,.85),(1.24,.42,.24,0,.9),(1.43,.48,.23,0,.92),(1.58,.43,.22,0,.9),(1.68,.24,.19,0,.9)],'Shirt',40,2)
loft('Joined olive trousers',[(.31,.38,.23,.015,.8),(.45,.40,.25,.015,.82),(.64,.39,.24,.015,.86),(.83,.34,.22,.01,.9),(1.0,.36,.22,.01,.9)],'Olive',40,2)
# legs as tapered organic, gently bowed lofts, overlapping trousers rather than joints
for side in (-1,1):
    x=side*.205
    # softly connected lower leg and knee patch shells
    loft('Soft trouser leg '+str(side),[(.40,.155,.18,0,.88),(.52,.17,.19,0,.9),(.69,.19,.20,0,.9),(.86,.18,.19,0,.92),(1.03,.17,.18,0,.9)],'Olive',28,2).location.x=x
    ellipsoid('Knee patch '+str(side),(x,-.164,.69),(.132,.035,.12),'Patch')
# neck merges under jaw
loft('Neck',[(1.58,.13,.14,0,.9),(1.76,.16,.15,0,.9),(1.87,.18,.16,0,.9)],'Skin',32,2)
# Head custom organic profile, broad cheek/jaw and tapered chin
head=loft('Sculpted head',[(1.72,.18,.20,-.01,.92),(1.79,.29,.26,-.01,.9),(1.91,.42,.34,-.005,.9),(2.12,.52,.39,0,.9),(2.34,.55,.40,.01,.95),(2.55,.49,.37,.025,1),(2.72,.34,.29,.04,1),(2.80,.12,.13,.04,1)],'Skin',64,2)
# ears tuck into head silhouette
for s in (-1,1):
    ellipsoid('Ear',(s*.515,-.005,2.20),(.105,.10,.145),'SkinLight')
    ellipsoid('Ear inset',(s*.558,-.082,2.20),(.037,.026,.075),'Pink')
# Eyes: embedded tapered custom eye pads, irises, lids. Face faces -Y.
def eye_patch(cx,z,ma,w,h,y):
    # almond surface sampled in radial shape, pushed onto front plane
    verts=[(cx,y,z)]; faces=[]; rings=5; seg=40
    for ri in range(1,rings+1):
        r=ri/rings
        for j in range(seg):
            a=2*pi*j/seg; xx=w*r*cos(a); zz=h*r*sin(a)*(0.78+0.22*abs(cos(a)))
            verts.append((cx+xx,y+.025*r*r,z+zz))
    for j in range(seg):faces.append((0,1+j,1+(j+1)%seg))
    for ri in range(1,rings):
        a0=1+(ri-1)*seg; a1=1+ri*seg
        for j in range(seg):faces.append((a0+j,a1+j,a1+(j+1)%seg,a0+(j+1)%seg))
    o=mesh_obj('Eye form',verts,faces,ma); return o
for s in (-1,1):
    x=s*.225
    # soft brow ridge and lid lines
    eye_patch(x,2.32,'SkinLight',.178,.205,-.362)
    eye_patch(x,2.315,'White',.151,.176,-.391)
    ellipsoid('Iris',(x,-.411,2.31),(.094,.035,.115),'Iris')
    ellipsoid('Iris green ring',(x,-.435,2.292),(.073,.021,.070),'IrisHi')
    ellipsoid('Pupil',(x,-.451,2.318),(.055,.02,.078),'Black')
    ellipsoid('Eye catchlight',(x-.026,-.469,2.355),(.025,.012,.031),'White')
    ellipsoid('Eye catchlight small',(x+.031,-.466,2.292),(.012,.01,.014),'White')
    curve('Upper expressive lid',[(x-.15,-.396,2.34),(x,-.407,2.49),(x+.15,-.396,2.34)],'Skin',.023)
    curve('Brow',[(x-.14,-.38,2.52),(x,-.402,2.56),(x+.14,-.38,2.51)],'Hair',.034)
# nose bridge hint and cyan paint fleck
ellipsoid('Soft nose',(0,-.405,2.19),(.07,.085,.055),'SkinLight')
curve('Cyan paint mark',[(-.045,-.481,2.223),(0,-.49,2.238),(.042,-.48,2.226)],'Cyan',.016)
# cheeks subtle, smile curved
for s in (-1,1): ellipsoid('Warm cheek',(s*.355,-.335,2.12),(.095,.024,.050),'Pink')
curve('Smile',[(-.13,-.405,2.035),(-.065,-.438,2.012),(0,-.445,2.008),(.075,-.435,2.018),(.13,-.40,2.04)],'Hair',.018)
# Hair cap wraps skull and sweeps back, with molded broad locks rather than beads
loft('Sculpted hair cap',[(2.48,.48,.39,.065,.95),(2.62,.51,.42,.075,.95),(2.77,.45,.39,.075,1),(2.88,.29,.29,.08,1),(2.93,.08,.12,.08,1)],'Hair',64,2)
# side swept front fringe as ribbon-like tapered locks
for s in (-1,1):
    curve('Swept temple curl',[(s*.05,-.397,2.70),(s*.20,-.418,2.67),(s*.34,-.385,2.60),(s*.43,-.31,2.48)],'HairHi',.067)
    curve('Long face framing curl',[(s*.43,-.31,2.51),(s*.49,-.29,2.38),(s*.50,-.27,2.20),(s*.46,-.23,2.05)],'Hair',.055)
# bun behind upper head, organic loft and flowing carved curl grooves
ellipsoid('High curly bun',(0,.20,2.88),(.38,.36,.34),'Hair')
# sculptural spiral locks on bun use tapered flowing curves
for i in range(9):
    a=2*pi*i/9
    x=.27*cos(a); y=.20+.25*sin(a)
    curve('Bun curl %02d'%i,[(x*.55,y-.08,2.70),(x,y,2.84),(x*1.10,y+.02,3.02),(x*.55,y-.02,3.20)],'HairHi' if i%3==0 else 'Hair',.044)
# puffy yellow scrunchie around bun at crown: torus plus soft lobed quilting
# torus lies in XY plane, yellow ring near top/front
ring=torus('Puffy yellow scrunchie',(0,-.015,3.10),.275,.088,'Yellow')
for i in range(12):
    a=2*pi*i/12
    ellipsoid('Scrunchie gathered fold',(.29*cos(a),-.015+.29*sin(a),3.10),(.068,.073,.078),'Yellow',20,12)
# bicycle emblem on front-facing yellow tab/loop
ellipsoid('Scrunchie emblem tab',(0,-.322,3.105),(.19,.035,.088),'Yellow')
# tiny bicycle pictogram, clear black linework
curve('Bike frame', [(-.085,-.366,3.10),(-.03,-.37,3.15),(.015,-.37,3.10),(.075,-.366,3.10)],'Hair',.009)
for x in (-.09,.08): torus('Bike icon wheel',(x,-.368,3.095),.033,.007,'Hair',(pi/2,0,0))
curve('Bike icon handle',[(.015,-.37,3.10),(.047,-.37,3.14),(.085,-.37,3.14)],'Hair',.008)
# sculpted sleeves and continuous curved arms, cream fabric into skin forearm and mitts
for s in (-1,1):
    # sleeve volume nestled into shoulder
    ellipsoid('Rolled sleeve',(s*.425,0,1.48),(.18,.20,.15),'Shirt')
    curve('Organic arm',[(s*.49,-.015,1.48),(s*.60,-.035,1.36),(s*.70,-.055,1.20),(s*.77,-.08,1.03)],'Skin',.115)
    curve('Arm highlight seam',[(s*.54,-.142,1.39),(s*.65,-.157,1.25),(s*.73,-.17,1.10)],'SkinLight',.018)
    ellipsoid('Fabric fingerless mitt',(s*.78,-.09,.99),(.14,.13,.12),'Hair')
    # finger/thumb shaping integrated and subtle
    curve('Glove thumb',[(s*.72,-.18,1.00),(s*.68,-.21,.94),(s*.73,-.20,.90)],'Hair',.045)
# apron custom draped panel follows torso; apron shell bulges slightly forward
loft('Apron bib',[(1.02,.34,.035,-.249,.8),(1.13,.34,.045,-.255,.82),(1.38,.32,.045,-.245,.86),(1.57,.27,.035,-.225,.9),(1.69,.18,.025,-.19,.9)],'Apron',40,2)
loft('Apron skirt',[(.68,.38,.040,-.255,.84),(.74,.43,.045,-.255,.85),(.93,.41,.048,-.25,.88),(1.08,.36,.04,-.25,.88)],'Apron',40,2)
# straps flow over shoulders
for s in (-1,1):
    curve('Apron shoulder strap',[(s*.24,-.255,1.62),(s*.22,-.30,1.49),(s*.25,-.31,1.34)],'ApronLight',.045)
    ellipsoid('Strap rivet',(s*.225,-.35,1.51),(.025,.014,.025),'Metal')
# stitched seams / pockets
curve('Apron hem', [(-.36,-.29,.73),(-.2,-.31,.70),(0,-.31,.69),(.2,-.31,.70),(.36,-.29,.73)],'ApronLight',.012)
# pocket surface
loft('Apron pocket',[(.82,.18,.018,-.307,.8),(.85,.20,.022,-.309,.8),(1.00,.19,.022,-.305,.83)],'ApronLight',32,1)
# fan of color swatches from pocket side
swatches=['PaintRed','PaintYellow','PaintGreen','PaintViolet','Cyan']
for i,ma in enumerate(swatches):
    x=.20+i*.045; y=-.346-i*.002
    # little rounded cards via bevel cube
    bpy.ops.mesh.primitive_cube_add(size=1,location=(x,y,.91+i*.012)); o=bpy.context.object;o.name='Paint swatch';o.dimensions=(.075,.012,.20); bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);o.data.materials.append(M[ma]); b=o.modifiers.new('rounded card edge','BEVEL');b.width=.018;b.segments=3
# belt and tools
curve('Canvas tool belt',[(-.38,-.28,.78),(0,-.32,.75),(.38,-.28,.78)],'Hair',.045)
curve('Wrench',[(-.28,-.35,.77),(-.30,-.36,.92),(-.27,-.36,1.00)],'Metal',.018)
curve('Hex key',[(.30,-.35,.76),(.34,-.36,.91),(.41,-.35,.91)],'Metal',.014)
# shoes: integrated toe and sole, no separated ball toes
for s in (-1,1):
    x=s*.21
    ellipsoid('Sneaker upper',(x,-.10,.25),(.22,.31,.16),'White')
    ellipsoid('Sneaker toe',(x,-.29,.255),(.19,.18,.12),'White')
    ellipsoid('Sculpted sole',(x,-.10,.135),(.225,.31,.055),'Sole')
    curve('Sneaker piping',[(x-.14,-.30,.29),(x,-.405,.31),(x+.14,-.30,.29)],'Sole',.012)
    for i,(dx,ma) in enumerate([(-.08,'PaintRed'),(-.025,'PaintYellow'),(.035,'Cyan'),(.09,'PaintViolet')]):
        ellipsoid('Paint fleck',(x+dx,-.39,.30),(.018,.012,.014),ma,16,8)
# arms down relaxed; apron swatches + no earrings
# studio lighting and camera
def aim(obj,pt): obj.rotation_euler=(Vector(pt)-obj.location).to_track_quat('-Z','Y').to_euler()
def camera(name,loc,target,lens):
    bpy.ops.object.camera_add(location=loc); c=bpy.context.object;c.name=name;c.data.lens=lens;aim(c,target);return c
scene.world.color=(.12,.12,.12)
for name,loc,power,size,color in [('Key',(-4,-5,7),520,4,(1,.82,.67)),('Fill',(4,-4,4),370,3,(.68,.80,1)),('Rim',(2,3,6),650,3,(.75,.83,1))]:
    bpy.ops.object.light_add(type='AREA',location=loc); l=bpy.context.object;l.name=name;l.data.energy=power;l.data.shape='DISK';l.data.size=size;l.data.color=color;aim(l,(0,0,1.7))
# orthographic-like long lens perspective, transparent floorless
cams=[('bust',(0,-5.8,2.15),(0,0,2.15),78,(900,900)),('full',(0,-8.0,1.70),(0,0,1.58),68,(900,1200))]
render_times={}
for name,loc,target,lens,res in cams:
    c=camera('Review '+name,loc,target,lens);scene.camera=c;scene.render.resolution_x=res[0];scene.render.resolution_y=res[1];scene.render.filepath=os.path.join(OUT,'vera_v02_'+name+'_review.png');t=time.perf_counter();bpy.ops.render.render(write_still=True);render_times[name]=round(time.perf_counter()-t,2)
# save scene with front full-body camera selected
scene.camera=bpy.data.objects.get('Review full');bpy.ops.wm.save_as_mainfile(filepath=BLEND)
# lightweight metadata
with open(os.path.join(OUT,'render_report_v02.json'),'w',encoding='utf-8') as f: json.dump({'version':'0.2','engine':scene.render.engine,'resolution':{'bust':[900,900],'full':[900,1200]},'render_seconds':render_times,'head_crown_chin_units':1.08,'overall_height_units':3.18,'approx_heads_high':2.94,'note':'Hair bun and gathered scrunchie add silhouette height; body ratio to skull approx 2.5 heads. Review renders use transparent RGBA.'},f,indent=2)
