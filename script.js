const mario=document.querySelector('.mario'),pipe=document.querySelector('.pipe'),cloud=document.querySelector('.cloud'),board=document.querySelector('.game-board');
const startScreen=document.querySelector('.start-screen'),gameOver=document.querySelector('.game-over'),rotateScreen=document.querySelector('.rotate-screen');
const scoreEl=document.querySelector('#score'),bestEl=document.querySelector('#best-score'),finalEl=document.querySelector('#final-score');
let score=0,best=Number(localStorage.getItem('superCiroBest')||0),running=false,frame=null,counted=false,jumpTimer=null;
bestEl.textContent=best;
const portrait=()=>matchMedia('(orientation: portrait)').matches;
function orientationMessage(){rotateScreen.hidden=!(running&&portrait());}
window.addEventListener('resize',orientationMessage);window.addEventListener('orientationchange',orientationMessage);
async function lockLandscape(){try{if(screen.orientation?.lock)await screen.orientation.lock('landscape');}catch(e){}}
function reset(){
 score=0;scoreEl.textContent='0';finalEl.textContent='0';counted=false;
 mario.src='assets/imgs/mario.gif';mario.classList.remove('jump');mario.removeAttribute('style');
 pipe.style.animation='none';pipe.style.right='-90px';pipe.style.left='auto';cloud.style.animation='';
 void pipe.offsetWidth;pipe.style.animation='';
}
function start(){
 if(running)return;reset();running=true;startScreen.hidden=true;gameOver.hidden=true;orientationMessage();lockLandscape();
 if(document.documentElement.requestFullscreen)document.documentElement.requestFullscreen().catch(()=>{});
 pipe.style.animation='pipe-animations 1.3s infinite linear';gameLoop();
}
function jump(){
 if(!running||portrait()||mario.classList.contains('jump'))return;
 mario.classList.add('jump');clearTimeout(jumpTimer);jumpTimer=setTimeout(()=>mario.classList.remove('jump'),500);
}
function finish(){
 running=false;cancelAnimationFrame(frame);const p=pipe.getBoundingClientRect(),b=board.getBoundingClientRect();
 pipe.style.animation='none';pipe.style.left=(p.left-b.left)+'px';pipe.style.right='auto';
 mario.style.animation='none';mario.src='assets/imgs/game-over.png';mario.style.width='70px';mario.style.marginLeft='35px';
 finalEl.textContent=score;gameOver.hidden=false;rotateScreen.hidden=true;
 if(score>best){best=score;localStorage.setItem('superCiroBest',String(best));bestEl.textContent=best;}
}
function gameLoop(){
 if(!running)return;
 const m=mario.getBoundingClientRect(),p=pipe.getBoundingClientRect();
 if(m.right>p.left+8&&m.left<p.right-8&&m.bottom>p.top+12){finish();return;}
 if(!counted&&p.right<m.left){score++;scoreEl.textContent=score;counted=true;}
 if(p.right>m.right)counted=false;
 orientationMessage();frame=requestAnimationFrame(gameLoop);
}
document.querySelector('.start-button').addEventListener('click',start);
document.querySelector('.restart').addEventListener('click',start);
document.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();jump();}});
board.addEventListener('pointerdown',e=>{if(!e.target.closest('button'))jump();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running){running=false;cancelAnimationFrame(frame);startScreen.hidden=false;startScreen.querySelector('h1').textContent='JOGO PAUSADO';startScreen.querySelector('.instructions').textContent='Toque em iniciar para começar uma nova partida.';rotateScreen.hidden=true;}});
