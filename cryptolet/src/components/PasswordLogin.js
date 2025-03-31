import React, { useState, useEffect } from "react";
import { Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { decryptData } from '../utils/passwordManager';

function PasswordLogin({ setSeedPhrase, setWallet }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    // Check if wallet data exists in local storage
    const encryptedData = localStorage.getItem("encryptedWalletData");
    if (!encryptedData) {
      toast.error("No wallet found!");
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = () => {
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    const encryptedData = localStorage.getItem("encryptedWalletData");
    if (encryptedData) {
      try {
        const decryptedData = decryptData(encryptedData, password);
        if (decryptedData && btoa(password) === decryptedData.hashedPassword) {
          setSeedPhrase(decryptedData.seedPhrase);
          setWallet(decryptedData.wallet);
          toast.success("Login successful!");
          navigate("/yourwallet");
        } else {
          toast.error("Incorrect password!");
          setShowRecovery(true);
        }
      } catch (error) {
        toast.error("Failed to decrypt wallet data!");
        setShowRecovery(true);
      }
    } else {
      toast.error("No wallet found!");
      navigate("/");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className="content">
        <h2>Login to Wallet</h2>
        <Input.Password
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ width: "90%", marginBottom: "20px" }}
        />
        <Button
          type="primary"
          onClick={handleLogin}
          style={{ width: "90%", marginBottom: "20px" }}
        >
          Login
        </Button>
        
        {showRecovery && (
          <>
            <p style={{ margin: "10px 0" }}>Forgot your password?</p>
            <Button
              type="default"
              onClick={() => navigate("/recover")}
              style={{ width: "90%" }}
            >
              Recover with Seed Phrase
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

export default PasswordLogin;