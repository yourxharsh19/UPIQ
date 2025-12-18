import { useState, useRef } from "react";
import { Upload, FileText, Check, X, AlertCircle, Save } from "lucide-react";
import PDFService from "../services/pdf.service";
import TransactionService from "../services/transaction.service";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router-dom";

const UploadPDF = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);
            setError(null);
        } else {
            setFile(null);
            setError("Please upload a valid PDF file.");
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            const response = await PDFService.upload(file);
            if (response.success) {
                setParsedData(response.data);
            } else {
                setError(response.message || "Failed to parse PDF.");
            }
        } catch (err) {
            console.error("Upload Error:", err);
            const errorMessage = err.response?.data?.message
                || err.response?.statusText
                || err.message
                || "An unknown error occurred";
            const status = err.response?.status ? ` (Status: ${err.response.status})` : "";
            setError(`Upload failed: ${errorMessage}${status}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!parsedData || !parsedData.transactions) return;
        setSaving(true);
        try {
            // Save each transaction sequentially or preferably in batch if supported
            // Current backend supports single add, so we loop (not ideal for large batches but works for MVP)
            let successCount = 0;
            for (const transaction of parsedData.transactions) {
                // Ensure date is in proper ISO format for backend (YYYY-MM-DDTHH:mm:ss)
                const dateObj = transaction.date ? new Date(transaction.date) : new Date();
                const isoDate = dateObj.toISOString().slice(0, 19); // Remove milliseconds and Z if backend prefers local

                await TransactionService.create({
                    ...transaction,
                    date: isoDate,
                    category: "Uncategorized", // Required by backend
                    paymentMethod: transaction.paymentMethod || "UPI"
                });
                successCount++;
            }
            alert(`Successfully saved ${successCount} transactions!`);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Failed to save some transactions.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Upload Statement</h1>
                <p className="text-gray-500">Upload your bank statement PDF to automatically extract transactions.</p>
            </div>

            {!parsedData ? (
                <Card className="p-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 hover:border-primary-500 transition-colors">
                    <div className="bg-primary-50 p-4 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Bank Statement</h3>
                    <p className="text-gray-500 text-sm mb-6 max-w-sm text-center">
                        Drag and drop your PDF here, or click to browse.
                    </p>

                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                    />

                    <Button variant="secondary" onClick={handleBrowseClick}>
                        Select PDF
                    </Button>

                    {file && (
                        <div className="mt-6 flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                            <FileText className="text-gray-500" size={20} />
                            <span className="text-sm font-medium text-gray-700">{file.name}</span>
                            <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2 rounded-lg">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="mt-8 w-full max-w-xs">
                        <Button
                            onClick={handleUpload}
                            disabled={!file}
                            loading={loading}
                            className="w-full"
                        >
                            {loading ? "Parsing..." : "Extract Transactions"}
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Preview Transactions</h3>
                                <p className="text-sm text-gray-500">
                                    Found {parsedData.totalTransactions} transactions. Please review before saving.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => setParsedData(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} loading={saving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save All
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Date</th>
                                        <th className="px-4 py-3">Description</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.transactions.map((t, i) => (
                                        <tr key={i} className="border-b last:border-0 hover:bg-gray-50 text-center">
                                            <td className="px-4 py-3 text-gray-600">
                                                {t.date ? new Date(t.date).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-gray-900 text-left">
                                                {t.description}
                                            </td>
                                            <td className={`px-4 py-3 font-bold ${t.type.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                                {t.type.toLowerCase() === 'income' ? '+' : '-'}₹{t.amount}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.type.toLowerCase() === 'income'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {t.type}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default UploadPDF;
