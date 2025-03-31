import React, { useState } from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ethers } from "ethers";
import { encryptData } from '../utils/passwordManager';

function RecoverAccount({ setSeedPhrase, setWallet }) {
  const navigate = useNavigate();
  const [importedPhrase, setImportedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRecovery = () => {
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

    try {
      const wallet = ethers.Wallet.fromPhrase(importedPhrase);
      const walletData = {
        seedPhrase: importedPhrase,
        wallet: wallet.address,
        hashedPassword: btoa(password)
      };

      const encryptedData = encryptData(walletData, password);
      localStorage.setItem('encryptedWalletData', encryptedData);

      setSeedPhrase(importedPhrase);
      setWallet(wallet.address);
      toast.success("Account recovered successfully!");
      navigate("/yourwallet");
    } catch (error) {
      toast.error("Error recovering account. Please try again.");
    }
  };

  return (
    <div className="content">
      <h2>Recover Account</h2>
      <p style={{ color: "white", marginBottom: "20px" }}>
        Enter your 12-word seed phrase
      </p>
      <Input.TextArea
        placeholder="Enter seed phrase..."
        value={importedPhrase}
        onChange={(e) => setImportedPhrase(e.target.value)}
        style={{ width: "90%", marginBottom: "20px", height: "100px" }}
      />
      <Input.Password
        placeholder="Create new password (min 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "90%", marginBottom: "20px" }}
      />
      <Input.Password
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ width: "90%", marginBottom: "20px" }}
      />
      <Button
        type="primary"
        onClick={handleRecovery}
        style={{ width: "90%" }}
      >
        Recover Account
      </Button>
      <p className="frontPageBottom" onClick={() => navigate("/")}>
        Back Home
      </p>
    </div>
  );
}

export default RecoverAccount;