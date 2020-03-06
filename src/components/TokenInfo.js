import React, { useContext, useEffect } from 'react';

import { Web3ConnectContext, CurrentUserContext, ContractContext } from '../contexts/Store.js';

import { Container } from 'react-bootstrap'

export const TokenInfo = () => {
    const [web3Connect] = useContext(Web3ConnectContext);
    const [currentUser, setCurrentUser] = useContext(CurrentUserContext);
    const [contracts] = useContext(ContractContext);

    useEffect(() => {
        const getInfo = async () => {
            const wethBalanceInWei = await contracts.weth.methods
                .balanceOf(currentUser.username)
                .call();
            const wethBalance = web3Connect.web3.utils.fromWei("" + wethBalanceInWei);
            return wethBalance
        }

        const getExchange = async () => {
            const exchangeAddress = await contracts.uniFactory.methods.getExchange(process.env.REACT_APP_SETH_CONTRACT_ADDR)
                .call();
            console.log(exchangeAddress);
            return exchangeAddress;
        }

        const getTotalSupply = async () => {
            const totalSupply = await contracts.seth.methods.totalSupply()
                .call();
            const decimal = await contracts.seth.methods.decimals()
                .call();
            console.log(totalSupply);
            return totalSupply / 10 ** decimal;
        }

        const getAll = async () => {
            const wethBalance = await getInfo();
            const exchangeAddress = await getExchange();
            const totalSupply = await getTotalSupply();
            setCurrentUser({ ...currentUser, ...{ totalSupply, exchangeAddress, wethBalance } })
        }

        if (contracts) {
            getAll();
        }
        // eslint-disable-next-line
    }, [contracts])

    useEffect(() => {
        const getExchangeBalance = async () => {
            const exchangeBalanceInWei = await web3Connect.web3.eth.getBalance(currentUser.exchangeAddress)
            const exchangeBalance = web3Connect.web3.utils.fromWei("" + exchangeBalanceInWei);
            const outputReserveInWei = await contracts.seth.methods.balanceOf(currentUser.exchangeAddress).call()
            const outputReserve = web3Connect.web3.utils.fromWei("" + outputReserveInWei);
            const inputAmount = web3Connect.web3.utils.fromWei("" + 1000000000000000000);

            const numerator = inputAmount * outputReserve * 997
            const denominator = exchangeBalance * 1000 + inputAmount * 997
            const outputAmount = numerator / denominator

            setCurrentUser({ ...currentUser, ...{ exchangeBalance, outputReserve, outputAmount, inputAmount } })
        }
        if (currentUser && currentUser.exchangeAddress) {
            getExchangeBalance();
        }
    },[currentUser])



    const forDisplay = (number) => {

        return number ? (+number).toFixed(4) : 0;
    }

    return (
        <Container>
            <p>WETH Balance: {currentUser && forDisplay(currentUser.wethBalance)}</p>
            <p>Uni exchange Address: {currentUser && currentUser.exchangeAddress}</p>
            <p>Uni exchange Balance: {currentUser && currentUser.exchangeBalance}</p>
            <p>Uni output reserve: {currentUser && currentUser.outputReserve}</p>
            <p>Seth Total Supply: {currentUser && currentUser.totalSupply}</p>
            <p>Input {currentUser && currentUser.inputAmount}</p>
            <p>Output {currentUser && currentUser.outputAmount}</p>
        </Container>
    );
};
