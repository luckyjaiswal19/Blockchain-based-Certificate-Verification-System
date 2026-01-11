import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletConnect from './components/WalletConnect'
import IssueCertificate from './components/IssueCertificate'
import VerifyCertificate from './components/VerifyCertificate'
// Import contract details (will be available after deployment)
import contractAddress from './contracts/contract-address.json'
import CertificateRegistry from './contracts/CertificateRegistry.json'

function App() {
  const [activeTab, setActiveTab] = useState('issue')
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)

  useEffect(() => {
    const init = async () => {
      if (window.ethereum && account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()

          // Connect to contract
          const registryContract = new ethers.Contract(
            contractAddress.CertificateRegistry,
            CertificateRegistry.abi,
            signer
          )
          setContract(registryContract)
        } catch (error) {
          console.error("Error connecting to contract:", error)
        }
      }
    }
    init()
  }, [account])

  // Read-only contract for verify if not connected
  useEffect(() => {
    const initReadOnly = async () => {
      if (!account) {
        try {
          // Try to use window.ethereum if available, otherwise fallback to local JSON-RPC
          let provider;
          if (window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum);
          } else {
            console.log("No wallet found, using read-only JSON-RPC provider");
            provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
          }

          const registryContract = new ethers.Contract(
            contractAddress.CertificateRegistry,
            CertificateRegistry.abi,
            provider
          );
          setContract(registryContract);
        } catch (e) {
          console.error("Failed to initialize read-only contract:", e);
        }
      }
    };
    initReadOnly();
  }, [account]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <nav className="border-b border-slate-800 p-4 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="font-bold text-white text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              CertifyBlock
            </h1>
          </div>
          <WalletConnect onConnect={setAccount} connectedAccount={account} />
        </div>
      </nav>

      <main className="container mx-auto p-4 md:p-8">
        <div className="flex justify-center mb-10">
          <div className="bg-slate-800 p-1 rounded-xl inline-flex shadow-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('issue')}
              className={`px-8 py-3 rounded-lg transition-all font-medium ${activeTab === 'issue'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              Issue Certificate
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-8 py-3 rounded-lg transition-all font-medium ${activeTab === 'verify'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
            >
              Verify Certificate
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto transform transition-all">
          {activeTab === 'issue' ? (
            <IssueCertificate contract={contract && contract.runner ? contract : null} account={account} />
          ) : (
            <VerifyCertificate contract={contract} />
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-600 text-sm pb-6">
        <p>Blockchain-Based Certificate Verification System &copy; 2026</p>
      </footer>
    </div>
  )
}

export default App
