import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    // Check if wallet data exists in local storage
    const encryptedWalletData = localStorage.getItem('encryptedWalletData');
    setHasWallet(!!encryptedWalletData);
    
    // If wallet exists, redirect to password login page
    if (encryptedWalletData) {
      navigate("/password-login");
    }
  }, [navigate]);

  return (
    <>
      <div className="content">
        <h2>Best Crypto Wallet</h2>
        <h4 className="h4">Secure, Self Custodial, Decentralized</h4>
        
        {!hasWallet && (
          // Only show create/import options if no wallet exists
          <>
            <Button
              onClick={() => navigate("/create-wallet")}
              className="frontPageButton"
              type="primary"
            >
              Create A Wallet
            </Button>
            <Button
              onClick={() => navigate("/import-wallet")}
              className="frontPageButton"
              type="default"
            >
              Import Existing Wallet
            </Button>
            <p 
              className="frontPageBottom" 
              onClick={() => navigate("/recover")}
              style={{ cursor: "pointer" }}
            >
              Recover Account using Seed Phrase
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default Home;