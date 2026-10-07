import sys, cv2, numpy as np, mediapipe as mp
src, out = sys.argv[1], sys.argv[2]
cap = cv2.VideoCapture(src)
W,H = int(cap.get(3)), int(cap.get(4)); fps = cap.get(5)
vw = cv2.VideoWriter(out, cv2.VideoWriter_fourcc(*'mp4v'), fps, (W,H), False)
seg = mp.solutions.selfie_segmentation.SelfieSegmentation(model_selection=0)
w,h = W//2, H//2
prev=None; n=0
while True:
    ok, fr = cap.read()
    if not ok: break
    m0 = seg.process(cv2.cvtColor(fr, cv2.COLOR_BGR2RGB)).segmentation_mask.astype(np.float32)
    m0 = cv2.resize(m0,(w,h),interpolation=cv2.INTER_CUBIC)
    small = cv2.resize(fr,(w,h),interpolation=cv2.INTER_AREA)
    gc = np.full((h,w), cv2.GC_PR_BGD, np.uint8)
    gc[m0>0.2] = cv2.GC_PR_FGD
    gc[cv2.erode((m0>0.9).astype(np.uint8),np.ones((15,15)))>0] = cv2.GC_FGD
    gc[cv2.dilate((m0>0.1).astype(np.uint8),np.ones((41,41)))==0] = cv2.GC_BGD
    bgd=np.zeros((1,65)); fgd=np.zeros((1,65))
    cv2.grabCut(small, gc, None, bgd, fgd, 3, cv2.GC_INIT_WITH_MASK)
    m = ((gc==cv2.GC_FGD)|(gc==cv2.GC_PR_FGD)).astype(np.float32)
    m = cv2.GaussianBlur(m,(0,0),2.0)
    m = np.clip((m-0.3)/0.4,0,1)
    m = cv2.resize(m,(W,H),interpolation=cv2.INTER_CUBIC)
    if prev is not None: m = 0.65*m+0.35*prev
    prev=m
    vw.write((np.clip(m,0,1)*255).astype(np.uint8)); n+=1
vw.release(); print(n)
