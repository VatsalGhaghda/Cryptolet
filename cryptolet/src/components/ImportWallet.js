import React, { useState } from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { ethers } from "ethers";
import { encryptData } from '../utils/passwordManager';

function ImportWallet({ setSeedPhrase, setWallet }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [importedPhrase, setImportedPhrase] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateAndProceed = () => {
    try {
      ethers.Wallet.fromPhrase(importedPhrase);
      setStep(2);
    } catch (error) {
      toast.error("Invalid seed phrase!");
    }
  };

  const handleImport = () => {
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
      toast.success("Wallet imported successfully!");
      navigate("/yourwallet");
    } catch (error) {
      toast.error("Error importing wallet. Please try again.");
    }
  };

  return (
    <div className="content">
      {step === 1 ? (
        <>
          <h2>Import Wallet</h2>
          <p style={{ color: "white", marginBottom: "20px" }}>
            Enter your 12-word seed phrase
          </p>
          <Input.TextArea
            placeholder="Enter seed phrase..."
            value={importedPhrase}
            onChange={(e) => setImportedPhrase(e.target.value)}
            style={{ width: "90%", marginBottom: "20px", height: "100px" }}
          />
          <Button
            type="primary"
            onClick={validateAndProceed}
            style={{ width: "90%" }}
          >
            Continue
          </Button>
        </>
      ) : (
        <>
          <h2>Set Password</h2>
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
            type="primary"
            onClick={handleImport}
            style={{ width: "90%" }}
          >
            Import Wallet
          </Button>
        </>
      )}
      <p className="frontPageBottom" onClick={() => navigate("/")}>
        Back Home
      </p>
    </div>
  );
}

export default ImportWallet;