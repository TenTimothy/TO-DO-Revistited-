import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import { abi, contractAdress } from './config';
import './App.css';

const App = () => {
    const [readContract, setReadContract] = useState(null);
    const [writeContract, setWriteContract] = useState(null);

    useEffect(() => {
        const makeContracts = async () => {
            if (window.ethereum) {
                window.provider = new ethers.providers.Web3Provider(window.ethereum);
                const myReadContract = new ethers.Contract(contractAdress, abi, window.provider);
                setReadContract(myReadContract);

                const signer = await window.provider.getSigner();
                const myWriteContract = new ethers.Contract(contractAdress, abi, signer);
                setWriteContract(myWriteContract);
            } else {
                console.error("Ether.js web3 provider not found. Please install a wallet with Web3 support");
            }
        };

        makeContracts();
    }, []);

    return (
        <div>
            <h1>Blockchain Todo List</h1>
            {writeContract && <AddTodo writeContract={writeContract} />}
            {readContract && <TodoList readContract={readContract} />}
        </div>
    );
};

export default App;
