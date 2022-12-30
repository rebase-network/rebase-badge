import { Form, Table, Button, Alert } from 'react-bootstrap';
import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { useWeb3 } from "../api/connect";
import { ethers, BigNumber } from 'ethers';

import badgeABI from '../abi/RebaseBadge.json';

import { ActionType } from "../api/types";
import UrlJson from "../config/url.json";
import ConfigJson from "../config/config.json";

const Box = styled.div`
  padding: 40px 0;
  .numbers{
    font-size: 20px;
  }
  .tips{
    font-size: 12px;
    color: #999;
  }
  h5{
    padding:10px 0 5px 10px;
    color: #000000;
  }
  .ml2{
    margin-left: 10px;
  }
  .flexNumber{
    word-break: break-all;
  }
`
const TableBox = styled.div`
    margin-top: 10px;
  height: 470px;
  padding-bottom: 20px;
  overflow-y: auto;
  .tableStyle{
    border-top: 1px solid #eee;
    color: #666666;
    th{
      height: 60px;
      line-height: 60px;
    }
    .first{
      display: flex;
      justify-content: center;
      align-items: stretch;
      .form-check-inline{
        margin-right: 0;
        display: flex;
        margin-top: 13px;
      }
    }
    td{
      line-height: 50px;
      word-break: break-all;
      &:nth-child(4){
       width: 30%;
      }
    }
    tr:nth-child(2n+1) td{
      background:rgba(255,255,255,0.3)!important;
      color: #666666!important;
    }
    tr:hover td{
      background:rgba(0,0,0,0.01)!important;
    }
  }

`

const H5Box = styled.h5`
  display: inline-block;
  margin-bottom: 20px;
`

const TipsBox = styled.div`
  margin-bottom: 20px;
`

interface accountObj {
    address: string
    tokenId: string
}

interface Iprops {
    handleNext: Function;
}


export default function Step2(props: Iprops) {
    const { state, dispatch } = useWeb3();
    const { account, first, web3Provider, importRecord } = state;
    const { handleNext } = props;

    const [ethBalance, setethBalance] = useState<string>('0');

    const [tablelist, setTablelist] = useState<accountObj[]>([])
    const [pageSize] = useState<number>(200); // Default 200 transfer per tx
    const [badgeContract, setTokenContract] = useState<ethers.Contract | null>();
    const [badgeAddress, setBadgeAddress] = useState<string>('');
    const [txURL, setTxURL] = useState<string>('');
    const [showLoading, setshowLoading] = useState<boolean>(false);
    const [tips, settips] = useState<string>('');
    const [txHashList, setTxHashList] = useState<string[]>([]);
    const [txHash, setTxHash] = useState<string>('');
    const [addressArray, setAddressArray] = useState<string[]>([]);
    const [tokenIdArray, setTokenIdArray] = useState<any[]>([]);
    const [errorTips, setErrorTips] = useState<string>('');
    const [successArr, setSuccessArr] = useState<string[]>([]);

    useEffect(() => {
        if (first == null) return;

        const { addressesStr, tokenIds } = first;

        // Split addresses
        let addressList = addressesStr.split('\n');
        let arr: accountObj[] = [];
        addressList.map(item => {
            if (!item) {
                console.log(`invalide item ${item}`);
                return
            };
            arr.push({
                address: item.split(',')[0].trim(),
                tokenId: item.split(',')[1].trim(),
            })
        })

        setTablelist(arr);
        setTotal();
        handleETH();


    }, [first])



    const setTotal = async () => {
        if (first == null) return;
        const { addressesStr } = first;

        let lines = addressesStr.split('\n');
        let addresses = [];
        let tokenIds = [];

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index]?.trim();
            if (line.length === 0) {
                console.log(`skip empty line ${index}`);
                continue;
            }
            let values = line.split(',');


            let address = values[0].trim();
            let tokenId = parseFloat(values[1].trim());

            if (address.endsWith('.eth')) {
                address = await ethers.getDefaultProvider().resolveName(address) || '';
            }


            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            addresses.push(address);
            tokenIds.push(tokenId);
        }

        setAddressArray(addresses);
        setTokenIdArray(tokenIds);
        console.log(`Total address : ${addresses.length}`);
    }

    const initBadgeAddress = async () => {

        const { chainId } = await web3Provider.getNetwork();
        console.log('chainId', chainId);

        let contractAddress;
        const urlArr = UrlJson.filter(item => item.id === chainId);
        let url = urlArr[0]?.url;

        const chainArr = ConfigJson.filter(item => item.chainId === chainId);
        if (chainArr.length) {
            contractAddress = chainArr[0].contract;
        } else {
            console.error('Unsupported network!!!!');
            return;
        }

        setBadgeAddress(contractAddress);
        setTxURL(url);
        console.log("contract address: ", contractAddress);
    };

    useEffect(() => {
        initBadgeAddress()
    }, [])
    useEffect(() => {
        if (first == null || !badgeContract || !badgeAddress) return;
        CheckAddresses();
    }, [first, badgeContract, badgeAddress])

    const handleETH = async () => {
        if (first == null) return;
        dispatch({ type: ActionType.TIPS, payload: `Query balance in progress... ` })
        setTokenContract(null);
        const signer = web3Provider.getSigner(account);
        const ethBalance = await signer.getBalance();
        let ethBalanceAfter = ethers.utils.formatEther(ethBalance);
        setethBalance(ethBalanceAfter);
        dispatch({ type: ActionType.TIPS, payload: null });
    }


    const doMint = async () => {

        if (first == null) return;

        console.log(`~~~~doMint`);


        const signer = web3Provider.getSigner(account);
        const badgeContract = new ethers.Contract(badgeAddress, badgeABI, web3Provider);

        // Step-2: Sending
        let txIndex = 0;
        let txHashArr: string[] = [];

        let mySuccessArr = [...successArr];
        for (let index = 0; index < addressArray.length; index += pageSize) {
            txIndex++;
            let addressArr = addressArray.slice(index, index + pageSize);
            let tokenIdArr = tokenIdArray.slice(index, index + pageSize);

            settips(`Minting Badge in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})`);

            dispatch({ type: ActionType.TIPS, payload: `Minting Badge in progress... (${txIndex}/${Math.ceil(addressArray.length / pageSize)})` });
            try {
                let rec = await badgeContract.connect(signer).mintBatchAddresses(addressArr, tokenIdArr, "0x")
                let data = await rec.wait();
                console.log('mintBatchAddresses', data);
                txHashArr.push(data.hash || data.transactionHash);

                mySuccessArr = mySuccessArr.concat(addressArr);
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    setshowLoading(false);
                    dispatch({ type: ActionType.TIPS, payload: null })
                    dispatch({ type: ActionType.STORE_TXHASHLIST, payload: txHashArr });
                    handleNext(3);

                }
            } catch (e: any) {
                setshowLoading(false);
                dispatch({ type: ActionType.TIPS, payload: null })
                setErrorTips(e.data?.message || e.message)
                if (txIndex >= Math.ceil(addressArray.length / pageSize)) {
                    console.error(successArr);
                }
            }
        }
        setSuccessArr(mySuccessArr);
    }

    const CheckAddresses = async () => {
        if (first == null) return;

        const { addressesStr } = first;
        setshowLoading(true);
        settips('Waiting...');
        dispatch({ type: ActionType.TIPS, payload: "Waiting..." })


        // Step-1: Check addresses...
        let lines = addressesStr.split('\n');
        let _addressArray = [];
        let _tokenIdArray = [];

        for (let index = 0; index < lines.length; index++) {
            const line = lines[index].trim();
            if (line.length === 0) {
                console.log(`skip empty line ${index}`);
                continue;
            }
            let values = line.split(',');

            let address = values[0].trim();
            if (address.endsWith('.eth')) {
                address = await ethers.getDefaultProvider().resolveName(address) || '';
            }

            let tokenId = values[1].trim();

            if (!ethers.utils.isAddress(address)) {
                console.log('Invalid address: ', address);
                continue;
            }

            _addressArray.push(address);
            _tokenIdArray.push(tokenId);

        }
        dispatch({ type: ActionType.TIPS, payload: null });
    }


    return <Box>
        <div className="mb-3">
            <h5>List of recipients</h5>
            <TableBox>
                <Table striped borderless hover className="tableStyle">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Address</th>
                            <th>TokenId</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tablelist.map((i, index) => (<tr key={`${i.address}_${index}`}>
                                <td>{index}</td>
                                <td>{i.address}</td>
                                <td>{i.tokenId}</td>
                            </tr>))
                        }
                    </tbody>
                </Table>
            </TableBox>
        </div>
        <div className="mb-3">
            <h5>Summary</h5>
            <Table bordered >
                <tbody>
                    <tr>
                        <td width="50%">
                            <div className='numbers'>{addressArray.length}</div>
                            <div className="tips">Total number of addresses</div>
                        </td>
                        <td>
                            <div className='numbers'>{Math.ceil(addressArray.length / pageSize)}</div>
                            <div className="tips">Total number of transaction needed</div>
                        </td>
                    </tr>
                    <tr>
                        <td width="50%">
                            <div className='numbers' >&nbsp; </div>
                            <div className="tips">Approximate cost of operation</div>
                        </td>
                        <td>
                            <div className='numbers'>{ethBalance} ETH</div>
                            <div className="tips">Your ETH balance</div>
                        </td>
                    </tr>

                </tbody>
            </Table>
        </div>

        <TipsBox>
            {
                !!errorTips.length && <Alert variant='danger'>{errorTips}</Alert>
            }

        </TipsBox>

        {
            <div className="ml2">
                <Button
                    variant="flat"
                    onClick={doMint}
                >Mint</Button>
            </div>
        }





    </Box>
}