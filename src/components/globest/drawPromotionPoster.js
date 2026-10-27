const loadImage = src => new Promise((resolve,reject) => {
  const image = new window.Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = src;
});

export async function drawPromotionPoster(canvas, code, link, lang) {
  const qr = await loadImage(`https://api.qrserver.com/v1/create-qr-code/?size=500x500&margin=8&data=${encodeURIComponent(link)}`);
  const ctx = canvas.getContext('2d');
  canvas.width = 1080; canvas.height = 1350;
  const gradient = ctx.createLinearGradient(0,0,1000,1350);
  gradient.addColorStop(0,'#0D3329'); gradient.addColorStop(0.6,'#174638'); gradient.addColorStop(1,'#08271F');
  ctx.fillStyle = gradient; ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle = '#D2B478'; ctx.lineWidth = 2; ctx.strokeRect(44,44,992,1262);
  ctx.globalAlpha = 0.18;
  for(let i=0;i<9;i++) {
    const x=100+i*105, y=290+(i%3)*90;
    ctx.strokeStyle='#C9DEB9'; ctx.lineWidth=3; ctx.beginPath();ctx.moveTo(x, y+210);ctx.quadraticCurveTo(x+90,y+95,x+80,y-15);ctx.stroke();
    for(let j=0;j<4;j++) {const yy=y+42*j;ctx.beginPath();ctx.ellipse(x+42+12*j,yy,38,13,-0.7,0,2*Math.PI);ctx.stroke();}
  }
  ctx.globalAlpha=1;ctx.textAlign='center';
  ctx.fillStyle='#DFC48A'; ctx.font='600 32px Georgia, serif'; ctx.fillText('GLOBEST MALL',540,143);
  ctx.fillStyle='#F9F6EA'; ctx.font='700 72px sans-serif';
  ctx.fillText(lang==='zh'?'分享健康 · 一起成长':'SHARE WELLNESS',540,460);
  if(lang!=='zh') {ctx.fillText('GROW TOGETHER',540,548);} else {ctx.font='34px sans-serif';ctx.fillText('东方滋养 · 环球健康',540,535);}
  ctx.font='30px sans-serif';ctx.fillStyle='#E2D7BC';ctx.fillText(lang==='zh'?'专属邀请，扫码开启健康生活':'A personal invitation to a healthier everyday',540,650);
  ctx.fillStyle='#FDFCF8';ctx.fillRect(367,720,346,346);ctx.drawImage(qr,383,736,314,314);
  ctx.fillStyle='#D9BE7E';ctx.font='600 31px sans-serif';ctx.fillText(lang==='zh'?'扫码注册 / 邀约码':'SCAN TO JOIN / INVITE CODE',540,1130);
  ctx.fillStyle='#FFFFFF';ctx.font='700 52px sans-serif';ctx.fillText(code,540,1200);
  return canvas;
}