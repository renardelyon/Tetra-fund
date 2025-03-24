import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export interface Tokens { 'e8s' : bigint }
export interface TransferRequest {
  'to_principal' : Principal,
  'to_subaccount' : [] | [Uint8Array | number[]],
  'amount' : Tokens,
}
export interface _SERVICE {
  'transfer' : ActorMethod<[TransferRequest], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
