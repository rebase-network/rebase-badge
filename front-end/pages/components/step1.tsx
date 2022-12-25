import { Row, Col, Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
import styled from "styled-components";
import { ChangeEvent, useState, useEffect } from "react";
import { useWeb3 } from "../api/connect";
import Excel from "./excel";
import { ActionType } from "../api/types";
import { ethers } from "ethers";
import ConfigJson from "../config/config.json";

const Box = styled.div`
    .height50{
      height: 200px;
    }
  .upload{
    svg{
      margin-right: 10px;
    }
  }
  label[for="Addresses"]{
    background: #fff;
    height: 33px;
    width: 99%;
    line-height: 4px;
    margin: 7.5px 0 0 1px;
    opacity: 1!important;
    color: #aaa;
  }
`

const TipsBox = styled.div`
  margin-bottom: 20px;
`


interface Props {
    handleNext: Function
}


export default function Step1(props: Props) {

    const { dispatch, state } = useWeb3();
    const { account, web3Provider } = state;

    const [tokenId, settokenId] = useState<string>('0');
    const [addressesStr, setaddressesStr] = useState<string>('');
    const [btndisabled, setbtndisabled] = useState(true);
    const [errorTips, setErrorTips] = useState<string>('');
    const [support, setSupport] = useState<boolean | null>(null);

    useEffect(() => {
        if (!account || account === "" || !addressesStr || !tokenId) {
            setbtndisabled(true)

        } else {
            setbtndisabled(false)
        }
    }, [account, addressesStr, tokenId]);


    useEffect(() => {
        initChainInfo()
    }, [])

    const initChainInfo = async () => {
        const { chainId } = await web3Provider.getNetwork();
        const chainArr = ConfigJson.filter(item => item.chainId === chainId);
        if (chainArr.length) {
            setSupport(true)
        } else {
            setErrorTips('Unsupported network!!!!')
            setSupport(false)
        }

    };

    const handleInput = (e: ChangeEvent) => {
        const { name, value } = e.target as HTMLInputElement;

        switch (name) {
            case 'token':
                settokenId(value)
                break;
            case 'addressStr':
                setaddressesStr(value)
                break;
            default: break;
        }
    }
    const nextPage = async () => {

        let arr = addressesStr.split('\n');
        let data: any[] = [];
        let validAddressesStr = '';

        await Promise.all(
            arr.map(async (item) => {
                let address = item.split(",")[0];
                let tokenId = item.split(",")[1];
                data.push({
                    address,
                    tokenId
                })

                if (address.endsWith('.eth')) {
                    console.log(`address: ${address}`);
                    address = await ethers.getDefaultProvider().resolveName(address) || '';
                    console.log(address);
                }

                let isAddress = ethers.utils.isAddress(address);
                if (isAddress && !isNaN(parseFloat(tokenId))) {
                    validAddressesStr += `${address},${parseFloat(tokenId)} \n`;
                }
            })
        )
        dispatch({ type: ActionType.STORE_IMPORT, payload: data });
        props.handleNext(2);
        const obj = {
            addressesStr: validAddressesStr, tokenId: tokenId
        }
        dispatch({ type: ActionType.STORE_FIRST, payload: obj });
    }

    const getChildrenMsg = (data: any[]) => {
        let str = '';
        for (let ele of data) {
            let eleStr = [];
            for (let key in ele) {
                eleStr.push(ele[key]);
            }
            str += eleStr.join(",");
            str += "\n";
        }

        setaddressesStr(str)

    }

    return <Box>
        <div className="mb-3">
            <Excel getChildrenMsg={getChildrenMsg} />
        </div>
        <Row>
            <Col md={12}>
                <FloatingLabel
                    controlId="Addresses"
                    label="Enter one address and tokenId on each line, split by comma. E Address,TokenId"
                    className="mb-3 addressLabel"
                >
                    <Form.Control
                        placeholder="Address,TokenId"
                        as="textarea"
                        name='addressStr'
                        className="height50"
                        value={addressesStr}
                        onChange={(e) => handleInput(e)}
                    />
                </FloatingLabel>

            </Col>
        </Row>
        <TipsBox>
            {
                !!errorTips.length && <Alert variant='danger'>{errorTips}</Alert>
            }

        </TipsBox>
        <div>
            <Button
                variant="flat"
                onClick={() => nextPage()}
                disabled={!support || btndisabled}
            >Next</Button>
        </div>

    </Box>
}