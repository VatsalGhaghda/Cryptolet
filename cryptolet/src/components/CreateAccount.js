import React from "react";
import { Button, Card, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";
import { toast } from 'react-toastify';
import { encryptData } from '../utils/passwordManager';

function CreateAccount({ setWallet, setSeedPhrase }) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const navigate = useNavigate();

  function generateWallet() {
    if (!password || !confirmPassword) {
      toast.error("Please enter and confirm your password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }

    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhrase(mnemonic);
    setShowSeedPhrase(true);
  }

  function setWalletAndMnemonic() {
    if (!newSeedPhrase) return;

    const walletData = {
      seedPhrase: newSeedPhrase,
      wallet: ethers.Wallet.fromPhrase(newSeedPhrase).address,
      hashedPassword: btoa(password)
    };

    try {
      // Encrypt the wallet data
      const encryptedData = encryptData(walletData, password);
      localStorage.setItem('encryptedWalletData', encryptedData);

      setSeedPhrase(newSeedPhrase);
      setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);

      toast.success("Wallet created successfully!");
      navigate("/yourwallet"); // Navigate to WalletView
    } catch (error) {
      toast.error("Error creating wallet. Please try again.");
      console.error("Wallet creation error:", error);
    }
  }

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Create a password to secure your wallet. Save your seed phrase securely to recover your wallet if you forget your password.
          </div>
        </div>

        {!showSeedPhrase ? (
          <>
            <Input.Password
              placeholder="Create password (min 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "90%", marginBottom: "20px" }}
            />
            <Input.Password
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: "90%", marginBottom: "20px" }}
            />
            <Button
              className="frontPageButton"
              type="primary"
              onClick={() => generateWallet()}
            >
              Create Wallet
            </Button>
          </>
        ) : (
          <>
            <Card className="seedPhraseContainer">
              {newSeedPhrase && <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>}
            </Card>
            <Button
              className="frontPageButton"
              type="default"
              onClick={() => setWalletAndMnemonic()}
            >
              Open Your New Wallet
            </Button>
          </>
        )}

        <p className="frontPageBottom" onClick={() => navigate("/")}>
          Back Home
        </p>
      </div>
    </>
  );
}

export default CreateAccount;