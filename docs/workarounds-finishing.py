from pathlib import Path
import subprocess, json, sys
import numpy as np
from PIL import Image

root = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path(__file__).resolve().parents[3] / 'work'
dest = root.parent / 'outputs/catalyst-innovations/public/brand'
ffmpeg = str(root/'ffmpeg.exe')
source = root/'workarounds-original.mp4'
W,H,FPS=1920,1080,24
logo=Image.open(dest/'catalyst-official.png').convert('RGBA')
logo=logo.crop(logo.getbbox())
canvas=Image.new('RGBA',(1000,562))
logo.thumbnail((820,380),Image.Resampling.LANCZOS)
canvas.alpha_composite(logo,((1000-logo.width)//2,(562-logo.height)//2))

def screen_corners(a):
    dark=np.max(a,axis=2)<85
    ys=np.arange(230,510,10)
    left=[500+np.flatnonzero(dark[y,500:750])[0] for y in ys]
    right=[1100+np.flatnonzero(dark[y,1100:1450])[-1] for y in ys]
    la,lb=np.polyfit(ys,left,1); ra,rb=np.polyfit(ys,right,1)
    xs=np.arange(700,1250,20)
    top=[100+np.flatnonzero(dark[100:300,x])[0] for x in xs]
    xs2=np.array(list(range(700,850,20))+list(range(1130,1250,20)))
    bottom=[450+np.flatnonzero(dark[450:620,x])[-1] for x in xs2]
    ta,tb=np.polyfit(xs,top,1); ba,bb=np.polyfit(xs2,bottom,1)
    def cross(a,b,c,d):
        x=(a*d+b)/(1-a*c); return (x,c*x+d)
    corners=[cross(la,lb+5,ta,tb+5),cross(ra,rb-5,ta,tb+5),cross(ra,rb-5,ba,bb-15),cross(la,lb+5,ba,bb-15)]
    return corners

def project(corners):
    src=[(0,0),(1000,0),(1000,562),(0,562)]
    rows=[]; values=[]
    for (x,y),(u,v) in zip(corners,src):
        rows.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]])
        values.extend([u,v])
    coeff=np.linalg.solve(np.array(rows),np.array(values))
    return canvas.transform((W,H),Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC)

decode=subprocess.Popen([ffmpeg,'-v','error','-i',str(source),'-frames:v','480','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
encode=subprocess.Popen([ffmpeg,'-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','slow','-crf','21','-pix_fmt','yuv420p','-threads','4','-movflags','+faststart',str(dest/'catalyst-workarounds-v1.mp4')],stdin=subprocess.PIPE)
tracks=[]; held=None; overlay=None
for i in range(480):
    raw=decode.stdout.read(W*H*3)
    assert len(raw)==W*H*3, (i,len(raw))
    frame=Image.frombytes('RGB',(W,H),raw)
    if i==0: frame.save(dest/'catalyst-workarounds-poster-v1.webp',quality=88)
    t=i/FPS
    if i>=423:
        if held is None: held=frame.copy()
        frame=held.copy()
    if t>=17:
        if i<=423:
            corners=screen_corners(np.array(frame))
            tracks.append({'frame':i,'seconds':t,'corners':corners})
            overlay=project(corners)
        alpha=min(1,(t-17)/0.35)
        mark=overlay.copy()
        if alpha<1: mark.putalpha(mark.getchannel('A').point(lambda p:round(p*alpha)))
        frame=Image.alpha_composite(frame.convert('RGBA'),mark).convert('RGB')
    if i in [408,414,420,432,468]: frame.save(root/'workarounds-review'/f'logo-{t:.2f}.png')
    encode.stdin.write(frame.tobytes())
encode.stdin.close(); assert encode.wait()==0
decode.stdout.close();decode.terminate();decode.wait()
(root/'workarounds-review/screen-tracking.json').write_text(json.dumps(tracks,indent=2))
print(json.dumps({'videoBytes':(dest/'catalyst-workarounds-v1.mp4').stat().st_size,'posterBytes':(dest/'catalyst-workarounds-poster-v1.webp').stat().st_size,'frames':480,'duration':20,'fps':24,'audio':False,'holdFrom':423/FPS,'trackedFrames':len(tracks)}))
