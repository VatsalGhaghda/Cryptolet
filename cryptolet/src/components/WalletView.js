import React, { useEffect, useState } from "react";
import {
  Divider,
  Tooltip,
  Spin,
  Input,
  Button,
} from "antd";
import { LogoutOutlined, CopyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CHAINS_CONFIG } from "../chains";
import { ethers } from "ethers";
import { toast } from 'react-toastify';

function WalletView({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}) {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [fetching, setFetching] = useState(true);
  const [amountToSend, setAmountToSend] = useState(null);
  const [sendToAddress, setSendToAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);

  async function sendTransaction(to, amount) {
    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);
    const pendingToast = toast.loading("Initiating transaction...");

    const tx = {
      to: to,
      value: ethers.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);

      toast.update(pendingToast, {
        render: "Transaction submitted, waiting for confirmation...",
        type: "info",
        isLoading: true
      });

      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);

      if (receipt.status === 1) {
        toast.update(pendingToast, {
          render: "Transaction successful! 🎉",
          type: "success",
          isLoading: false,
          autoClose: 5000
        });
        getAccountTokens();
      } else {
        toast.update(pendingToast, {
          render: "Transaction failed",
          type: "error",
          isLoading: false,
          autoClose: 5000
        });
      }
    } catch (err) {
      toast.update(pendingToast, {
        render: "Transaction failed: " + err.message,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
      setHash(null);
      setProcessing(false);
      setAmountToSend(null);
      setSendToAddress(null);
    }
  }

  async function getAccountTokens() {
    setFetching(true);
    const res = await axios.get(`http://localhost:3001/getTokens`, {
      params: {
        userAddress: wallet,
        chain: selectedChain,
      },
    });

    const response = res.data;
    setBalance(response.balance);
    setFetching(false);
  }

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setBalance(0);
    navigate("/");
  }

  useEffect(() => {
    if (!wallet || !selectedChain) return;
    setBalance(0);
    getAccountTokens();
  }, []);

  useEffect(() => {
    if (!wallet) return;
    setBalance(0);
    getAccountTokens();
  }, [selectedChain]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wallet);
    toast.success("Wallet address copied!", {
      autoClose: 2000,
    });
  };

  return (
    <>
      <div className="content">
        <div className="logoutButton" onClick={logout}>
          <LogoutOutlined />
        </div>
        <div className="walletName">Wallet</div>
        <Tooltip title={wallet}>
          <div className="walletAddress">
            {wallet.slice(0, 4)}...{wallet.slice(38)}
          </div>
        </Tooltip>
        <Tooltip title="Copy address">
          <CopyOutlined className="copyButton" onClick={copyToClipboard} />
        </Tooltip>
        <Divider />
        {fetching ? (
          <Spin />
        ) : (
          <div className="walletView">
            <h3>Native Balance </h3>
            <h1>
              {balance.toFixed(3)} {CHAINS_CONFIG[selectedChain].ticker}
            </h1>
            <div className="sendRow">
              <p style={{ width: "90px", textAlign: "left" }}> To:</p>
              <Input
                value={sendToAddress}
                onChange={(e) => setSendToAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="sendRow">
              <p style={{ width: "90px", textAlign: "left" }}> Amount:</p>
              <Input
                value={amountToSend}
                onChange={(e) => setAmountToSend(e.target.value)}
                placeholder="Native tokens you wish to send..."
              />
            </div>
            <Button
              style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }}
              type="primary"
              onClick={() => sendTransaction(sendToAddress, amountToSend)}
            >
              Send Tokens
            </Button>
            {processing && (
              <>
                <Spin />
                {hash && (
                  <Tooltip title={hash}>
                    <p>Hover For Tx Hash</p>
                  </Tooltip>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default WalletView;