import { ethers } from 'ethers';
import config from './config';

class BlockchainTodoService {
  constructor() {
    this.contractAddress = config.contractAddress;
    this.abi = config.abi;
  }

  getReadContract(provider) {
    return new ethers.Contract(this.contractAddress, this.abi, provider);
  }

  getWriteContract(signer) {
    return new ethers.Contract(this.contractAddress, this.abi, signer);
  }
}

export default BlockchainTodoService;
