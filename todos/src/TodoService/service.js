import { ethers } from 'ethers';
import { abi, contractAdress } from '../abi';


const getProvider = () => {
    if (window.ethereum) {
        return new ethers.providers.Web3Provider(window.ethereum);
    } else if (window.web3) {
        return new ethers.providers.Web3Provider(window.web3.currentProvider);
    } else {
        console.log('error');
        return null;
    }
};


const getContract = () => {
    const provider = getProvider();
    if (provider) {
        const signer = provider.getSigner();
        return new ethers.Contract(contractAdress, abi, signer);
    }
    return null;
};


