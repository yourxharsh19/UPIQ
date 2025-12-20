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
                // Check for duplicates before showing parsed data
                const txResponse = await TransactionService.getAll();
                const existingTransactions = txResponse.success ? txResponse.data : [];

                // Debug log to check date format
                if (existingTransactions.length > 0) {
                    console.log("Sample existing transaction date:", existingTransactions[0].date);
                }
                const parsedTransactions = response.data.transactions;

                // Helper to normalize date from String or Array (LocalDateTime)
                const normalizeDate = (dateVal) => {
                    if (!dateVal) return null;
                    if (Array.isArray(dateVal)) {
                        // [yyyy, mm, dd, hh, mm, ss]
                        // Note: JS Date month is 0-indexed, Java/Array is 1-indexed
                        const [year, month, day, hour = 0, min = 0, sec = 0] = dateVal;
                        return new Date(year, month - 1, day, hour, min, sec);
                    }
                    return new Date(dateVal);
                };

                // Mark duplicates
                const transactionsWithDuplicateFlag = parsedTransactions.map(parsed => {
                    const isDuplicate = existingTransactions.some(existing => {
                        // Check if amounts match exactly
                        if (Math.abs(existing.amount - parsed.amount) > 0.01) return false;

                        // Check if dates are on the same day
                        const d1 = normalizeDate(existing.date);
                        const d2 = normalizeDate(parsed.date);

                        if (!d1 || !d2) return false;

                        if (d1.toDateString() !== d2.toDateString()) return false;

                        // Check if descriptions are similar (case-insensitive contains)
                        const existingDesc = (existing.description || "").toLowerCase();
                        const parsedDesc = (parsed.description || "").toLowerCase();

                        const isMatch = existingDesc.includes(parsedDesc) || parsedDesc.includes(existingDesc);

                        if (!isMatch && Math.abs(existing.amount - parsed.amount) < 0.01) {
                            console.log("Potential match failed description check:", {
                                existingDesc, parsedDesc, amount: parsed.amount
                            });
                        }

                        return isMatch;
                    });

                    if (isDuplicate) console.log("Duplicate found:", parsed);

                    return { ...parsed, isDuplicate };
                });

                setParsedData({
                    ...response.data,
                    transactions: transactionsWithDuplicateFlag
                });
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
            // Filter out duplicates
            const transactionsToSave = parsedData.transactions.filter(t => !t.isDuplicate);
            const totalToSave = transactionsToSave.length;
            const duplicateCount = parsedData.transactions.length - totalToSave;

            console.log(`Starting save: ${totalToSave} new transactions, ${duplicateCount} duplicates ignored.`);

            if (totalToSave === 0) {
                alert("All transactions are duplicates. No new transactions to save.");
                setSaving(false);
                return;
            }

            let successCount = 0;
            for (let i = 0; i < transactionsToSave.length; i++) {
                const transaction = transactionsToSave[i];
                let isoDate;

                if (transaction.date) {
                    isoDate = transaction.date;
                } else {
                    const now = new Date();
                    isoDate = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 19);
                    console.warn(`Transaction ${i + 1} missing date, using fallback:`, isoDate);
                }

                console.log(`Saving transaction ${i + 1}/${totalToSave}:`, {
                    desc: transaction.description,
                    amount: transaction.amount,
                    date: isoDate
                });

                try {
                    await TransactionService.create({
                        ...transaction,
                        date: isoDate,
                        category: "Uncategorized",
                        paymentMethod: transaction.paymentMethod || "UPI"
                    });
                    successCount++;
                } catch (txErr) {
                    console.error(`Failed to save transaction ${i + 1}:`, transaction, txErr);
                }
            }

            const message = successCount === totalToSave
                ? `Successfully saved all ${successCount} transactions!`
                : `Saved ${successCount} of ${totalToSave} transactions. Check console for errors.`;

            if (duplicateCount > 0) {
                alert(`${message} (${duplicateCount} duplicates skipped)`);
            } else {
                alert(message);
            }

            navigate("/transactions"); // Navigate to transactions page to see results
        } catch (err) {
            console.error("General save error:", err);
            setError("Failed to save transactions. Please check your connection.");
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
                                    Found {parsedData.totalTransactions} transactions
                                    {parsedData.transactions.filter(t => t.isDuplicate).length > 0 && (
                                        <span className="text-yellow-600 font-medium">
                                            {" "}({parsedData.transactions.filter(t => t.isDuplicate).length} duplicates will be skipped)
                                        </span>
                                    )}
                                    . Please review before saving.
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
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.transactions.map((t, i) => (
                                        <tr key={i} className={`border-b last:border-0 text-center ${t.isDuplicate ? 'bg-yellow-50 opacity-60' : 'hover:bg-gray-50'}`}>
                                            <td className={`px-4 py-3 text-gray-600 ${t.isDuplicate ? 'line-through' : ''}`}>
                                                {t.date ? new Date(t.date).toLocaleDateString() : "-"}
                                            </td>
                                            <td className={`px-4 py-3 font-medium text-gray-900 text-left ${t.isDuplicate ? 'line-through' : ''}`}>
                                                {t.description}
                                            </td>
                                            <td className={`px-4 py-3 font-bold ${t.isDuplicate ? 'line-through' : ''} ${t.type.toLowerCase() === 'income' ? 'text-green-600' : 'text-red-600'}`}>
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
                                            <td className="px-4 py-3">
                                                {t.isDuplicate ? (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                        Duplicate
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        New
                                                    </span>
                                                )}
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
