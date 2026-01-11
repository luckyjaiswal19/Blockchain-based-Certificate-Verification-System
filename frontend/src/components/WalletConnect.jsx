import { useState } from 'react';
import { ethers } from 'ethers';

const WalletConnect = ({ onConnect, connectedAccount }) => {
    const [error, setError] = useState('');

    const HARDHAT_NETWORK_ID = '0x7a69'; // 31337 in hex

    const checkNetwork = async () => {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== HARDHAT_NETWORK_ID) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: HARDHAT_NETWORK_ID }],
                });
            } catch (switchError) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: HARDHAT_NETWORK_ID,
                                    chainName: 'Hardhat Localhost',
                                    rpcUrls: ['http://127.0.0.1:8545'],
                                    nativeCurrency: {
                                        name: 'ETH',
                                        symbol: 'ETH',
                                        decimals: 18,
                                    },
                                },
                            ],
                        });
                    } catch (addError) {
                        setError('Failed to add Hardhat network.');
                    }
                } else {
                    setError('Failed to switch to Hardhat network.');
                }
            }
        }
    };

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                await checkNetwork();
                const provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await provider.send("eth_requestAccounts", []);
                onConnect(accounts[0]);
                setError('');
            } catch (err) {
                setError('Connection failed. Please try again.');
                console.error(err);
            }
        } else {
            setError('Please install MetaMask!');
        }
    };

    return (
        <div className="flex flex-col items-end">
            {connectedAccount ? (
                <div className="flex items-center gap-2 bg-slate-800 rounded-full px-4 py-2 border border-slate-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-mono text-slate-300">
                        {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}
                    </span>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium text-sm flex items-center gap-2"
                >
                    <span>Connect Wallet</span>
                    {/* Simple Wallet Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0 3 3 0 0 1 6 0h.75l-.615-.615a2.25 2.25 0 1 0-3.182 3.182l.615.615.615-.615a2.25 2.25 0 1 0-3.182-3.182l.615.615H3.75A2.25 2.25 0 0 0 1.5 12m19.5 0a2.25 2.25 0 0 1-2.25 2.25H15a3 3 0 1 1-6 0 3 3 0 0 1 6 0h.75l-.615-.615a2.25 2.25 0 1 0-3.182 3.182l.615.615.615-.615a2.25 2.25 0 1 0-3.182-3.182l.615.615H3.75A2.25 2.25 0 0 1 1.5 12" />
                    </svg>
                </button>
            )}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default WalletConnect;
