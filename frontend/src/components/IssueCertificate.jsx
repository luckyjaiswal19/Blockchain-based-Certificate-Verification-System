import { useState } from 'react';
// We will import contract address and ABI later
// import { contractAddress, contractABI } from '../contracts/constants';

const IssueCertificate = ({ contract, account }) => {
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        course: '',
        date: ''
    });
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!contract) return;

        setIsLoading(true);
        setStatus('Processing...');

        try {
            const tx = await contract.issueCertificate(
                formData.id,
                formData.name,
                formData.course,
                formData.date
            );
            setStatus('Transaction sent. Waiting for confirmation...');
            await tx.wait();
            setStatus('Certificate issued successfully!');
            setFormData({ id: '', name: '', course: '', date: '' });
        } catch (error) {
            console.error(error);
            setStatus('Error: ' + (error.reason || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-white">Issue New Certificate</h2>

            {!account ? (
                <p className="text-yellow-400">Please connect wallet to issue certificates.</p>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Certificate ID</label>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            placeholder="e.g. CERT-001"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Candidate Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Alice Smith"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Course Name</label>
                        <input
                            type="text"
                            name="course"
                            value={formData.course}
                            onChange={handleChange}
                            placeholder="e.g. Advanced Blockchain"
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-400 text-sm mb-1">Issue Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-bold text-white transition-all ${isLoading
                            ? 'bg-slate-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg hover:shadow-blue-500/25'
                            }`}
                    >
                        {isLoading ? 'Issuing...' : 'Issue Certificate'}
                    </button>

                    {status && (
                        <div className={`mt-4 p-3 rounded-lg text-sm ${status.includes('Error') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
                            }`}>
                            {status}
                        </div>
                    )}
                </form>
            )}
        </div>
    );
};

export default IssueCertificate;
