import React,{useState} from 'react';
import {Plus} from 'lucide-react';
import {useExperience} from './ExperienceProvider';
import GinsengPlant from './GinsengPlant';
export default function GameBoard(){
 const {state,t,gameMove}=useExperience();const [selected,setSelected]=useState(null),[busy,setBusy]=useState(false);
 const send=async move=>{if(busy)return;setBusy(true);try{await gameMove(move);setSelected(null);}finally{setBusy(false);}};
 const move=i=>{if(selected===i)return setSelected(null);if(selected===null||state.board[i]&&state.board[i]!==state.board[selected])return state.board[i]&&setSelected(i);return send({move:'move',from:selected,to:i});};
 return <><div className="garden-stats"><span>{t('累计合成','Total merges')}<b>{state.merges}</b></span><span>{t('最高等级','Highest level')}<b>Lv.{Math.max(...state.board)}</b></span><span>{t('每日游戏奖励上限','Daily reward cap')}<b>200 HBH</b></span></div><div className="game-board">{state.board.map((level,i)=><button disabled={busy} key={i} onClick={()=>move(i)} className={`game-cell ${selected===i?'selected':''} ${level?'planted':''}`} aria-label={`Plot ${i+1}`}>{level?<><GinsengPlant level={level}/><span>Lv.{level}</span></>:<Plus size={22}/>}</button>)}</div><p className="text-center muted my-5">{t('选中人参后，点击同级人参合成或空地移动。奖励以服务器确认结果为准。','Select a root, then a match or empty plot. Rewards are confirmed by the server.')}</p><button className="primary-btn w-full" disabled={busy||!state.board.includes(0)} onClick={()=>send({move:'plant'})}>{t('种下一支幼参','Plant a seedling')}</button>{!state.board.includes(0)&&!state.board.some((v,i)=>v<6&&state.board.indexOf(v)!==i)&&<button className="outline-btn w-full mt-3" disabled={busy} onClick={()=>send({move:'reset'})}>{t('开始新一轮','Start a new round')}</button>}</>;
}
