const WalletDetails = ({ wallet }) => {

  return (
    <div className="wallet-container">
      <div className="wallet-info">
        <h4>Wallet Address:</h4>
        <p>{wallet.accounts.length > 0 ? wallet.accounts[0] : 'Not connected'}</p>
      </div>
      <div className="wallet-info">
        <h4>Balance:</h4>
        <p>{wallet.balance} ETH</p>
      </div>
    </div>
  );
};

export default WalletDetails;
