import { useState } from 'react';

const VerifyCertificate = ({ contract }) => {
    const [certId, setCertId] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!contract) {
            setError("Contract not loaded. Make sure you are connected to local node.");
            return;
        }

        setIsLoading(true);
        setError('');
        setResult(null);

        try {
            const data = await contract.verifyCertificate(certId);
            // Data returns: [name, course, date, issuer, isValid]
            setResult({
                name: data[0],
                course: data[1],
                date: data[2],
                issuer: data[3],
                isValid: data[4]
            });
        } catch (err) {
            console.error(err);
            setError('Certificate not found or invalid.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6 text-white">Verify Certificate</h2>

            <form onSubmit={handleVerify} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                    placeholder="Enter Certificate ID"
                    required
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                    {isLoading ? '...' : 'Verify'}
                </button>
            </form>

            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-32 h-32">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-green-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                            </svg>
                            <span className="font-bold">Valid Certificate</span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="text-slate-500 text-sm">Recipient</span>
                                <p className="text-xl font-semibold text-white">{result.name}</p>
                            </div>
                            <div>
                                <span className="text-slate-500 text-sm">Course</span>
                                <p className="text-lg text-white">{result.course}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-slate-500 text-sm">Date</span>
                                    <p className="text-white">{result.date}</p>
                                </div>
                                <div>
                                    <span className="text-slate-500 text-sm">Issuer</span>
                                    <p className="text-white font-mono text-sm truncate" title={result.issuer}>
                                        {result.issuer.slice(0, 6)}...{result.issuer.slice(-4)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifyCertificate;
