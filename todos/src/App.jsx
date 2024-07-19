import './App.css';
import { ethers } from 'ethers';
import { useEffect, useState, useCallback } from 'react';
import WalletConnect from './components/WalletDetails';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import BlockchainTodoService from './service';

function App() {
  const [wallet, setWallet] = useState({ accounts: [], balance: '' });
  const [readOnlyContract, setReadOnlyContract] = useState();
  const [writableContract, setWritableContract] = useState();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState('');

  const todoService = new BlockchainTodoService();

  useEffect(() => {
    const setupProvider = async () => {
      if (window.ethereum) {
        window.provider = new ethers.BrowserProvider(window.ethereum);
      } else {
        console.error('ethers.js: web3 provider not found. please install a wallet with web3 support.');
        return;
      }

      try {
        const signer = await window.provider.getSigner();
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });


        setReadOnlyContract(todoService.getReadContract(window.provider));
        setWritableContract(todoService.getWriteContract(signer));
        updateWalletInfo(accounts);

        window.ethereum.on('accountsChanged', (newAccounts) => {
          updateWalletInfo(newAccounts);
        });

        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error setting up provider:', error);
      }
    };

    setupProvider();
  }, []);

  const updateWalletInfo = async (accounts) => {
    if (accounts.length > 0) {
      try {
        const balance = await window.provider.getBalance(accounts[0]);
        const formattedBalance = ethers.utils ? ethers.utils.formatEther(balance.toString()) : (BigInt(balance).toString() / 1e18).toString();
        console.log("Balance: ", formattedBalance);
        setWallet({ accounts, balance: formattedBalance });
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    } else {
      setWallet({ accounts: [], balance: '' });
    }
  };

  const fetchTodos = useCallback(async () => {
    if (!readOnlyContract) return;

    try {
      const todoCount = await readOnlyContract.todoCount();
      const todosArray = [];

      for (let i = 1; i <= todoCount; i++) {
        const todo = await readOnlyContract.todos(i);
        if (todo.id > 0) todosArray.push(todo);
      }

      setTodos(todosArray);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }, [readOnlyContract]);

  useEffect(() => {
    if (wallet.accounts.length > 0 && readOnlyContract) {
      fetchTodos();
    }
  }, [wallet, readOnlyContract, fetchTodos]);

  return (
    <div className="App">
      <h1>Blockchain Todo List</h1>

      <WalletConnect wallet={wallet} />

      <AddTodo
        input={newTodoText}
        setInput={setNewTodoText}
        wallet={wallet}
        contract={writableContract}
        refreshTodos={fetchTodos}
        refreshWallet={updateWalletInfo}
      />

      <TodoList
        todos={todos}
        wallet={wallet}
        contract={writableContract}
        refreshTodos={fetchTodos}
        refreshWallet={updateWalletInfo}
      />
    </div>
  );
}

export default App;
