import {Dispatch} from "react";

interface firstObj{
    addressesStr:string
    tokenIds:string

}

interface addressObj{
    address:string
    tokenId:string
}

export type State = {
    account: string | null
    tips: string | null
    importRecord: addressObj[] | null
    first:firstObj | null
    web3Provider: any
    txHash: any
    txHashList: any
}

export type Action = {
    type: ActionType
    payload: any
}


export interface ContextType {
    state: State
    dispatch: Dispatch<Action>
}

export const enum ActionType {
    SET_ACCOUNT = 'SET_ACCOUNT',
    STORE_FIRST = 'STORE_FIRST',
    CONNECT = 'CONNECT',
    STORE_TXHASH = 'STORE_TXHASH',
    STORE_TXHASHLIST = 'STORE_TXHASHLIST',
    TIPS = 'TIPS',
    STORE_IMPORT = 'STORE_IMPORT'
}