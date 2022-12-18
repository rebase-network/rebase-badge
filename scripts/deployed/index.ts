import { network } from "hardhat";

import ethereum from "./ethereum";


import hardhat from "./hardhat";
import bnbtest from "./bnbchain-test";

var configuration: any;

switch (network.name) {
    case 'ethereum':
    case 'mainnet':
        configuration = ethereum;
        break;

    case 'bnbchain-test':
    case 'bnbchaintest':
    case 'bsctest':
        configuration = bnbtest;
        break;

    case 'hardhat':
        configuration = hardhat;
        break;

    default:
        break;
}

export default configuration;