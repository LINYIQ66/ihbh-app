/// <reference types="vite/client" />
import '@tanstack/react-query';
interface ApiError extends Error { status?:number; response?:{status?:number;data?:{error?:string;reason?:string}} }
declare module '@tanstack/react-query' {interface Register {defaultError:ApiError}}
declare global {
 interface Window {phantom?:{solana?:{isPhantom:boolean;connect():Promise<{publicKey:{toString():string}}>;signMessage(message:Uint8Array,encoding:string):Promise<{signature:Uint8Array}>}}}
}
