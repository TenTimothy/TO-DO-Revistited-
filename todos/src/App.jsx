import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import WalletInformation from './components/WalletInformation';
import TaskCreation from './components/TaskCreation';
import TaskListView from './components/TaskListView';
import BlockchainService from './service';

function App() {
  const [wallet, setWallet] = useState({ addresses: [], balance: '' });
  const [readContract, setReadContract] = useState(null);
  const [writeContract, setWriteContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const blockchainService = new BlockchainService();

  const setupBlockchainConnection = async () => {
    if (window.ethereum) {
      window.provider = new ethers.BrowserProvider(window.ethereum);
      try {
        const signer = await window.provider.getSigner();
        const addresses = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        setReadContract(blockchainService.getReadContract(window.provider));
        setWriteContract(blockchainService.getWriteContract(signer));
        updateWalletInfo(addresses);

        window.ethereum.on('accountsChanged', (newAddresses) => {
          updateWalletInfo(newAddresses);
        });

      } catch (error) {
        console.error('Provider error:', error);
      }
    } else {
      console.error('Web3 provider not found. Please install a wallet with Web3 support.');
    }
  };

  const updateWalletInfo = async (addresses) => {
    if (addresses.length > 0) {
      try {
        const balance = await window.provider.getBalance(addresses[0]);
        setWallet({ addresses, balance: ethers.formatEther(balance) });
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    } else {
      setWallet({ addresses: [], balance: '' });
    }
  };

  const fetchTasks = useCallback(async () => {
    if (!readContract) return;

    try {
      const taskCount = await readContract.todoCount();
      const tasksArray = [];

      for (let i = 1; i <= taskCount; i++) {
        const task = await readContract.todos(i);
        if (task.id > 0) tasksArray.push(task);
      }

      setTasks(tasksArray);
    } catch (error) {
      console.error('Error fetching task:', error);
    } finally {
      setIsLoading(false);
    }
  }, [readContract]);

  useEffect(() => {
    if (wallet.addresses.length > 0 && readContract) {
      fetchTasks();
    }
  }, [wallet, readContract, fetchTasks]);

  const renderAppContent = () => {
    if (wallet.addresses.length === 0) {
      return <button onClick={setupBlockchainConnection} className="connect-wallet-button">Connect Wallet</button>;
    }

    if (isLoading) {
      return <p>Loading tasks...</p>;
    }

    return (
      <div>
        <WalletInformation wallet={wallet} />
        <TaskCreation
          input={newTaskText}
          setInput={setNewTaskText}
          wallet={wallet}
          contract={writeContract}
          refreshTasks={fetchTasks}
          refreshWallet={updateWalletInfo}
        />
        <TaskListView
          tasks={tasks}
          wallet={wallet}
          contract={writeContract}
          refreshTasks={fetchTasks}
          refreshWallet={updateWalletInfo}
        />
      </div>
    );
  };

  return (
    <div className="App">
      <header>
        <h1>Blockchain TodoList</h1>
      </header>
      <main>
        {renderAppContent()}
      </main>
    </div>
  );
}

export default App;
