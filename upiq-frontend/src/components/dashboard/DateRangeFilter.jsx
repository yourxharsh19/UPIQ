import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDateFilter } from "../../context/DateFilterContext";

const DateRangeFilter = () => {
  const { startDate, endDate, setDateRange, resetToCurrentMonth, resetToLastMonth, resetToLast30Days, resetToLast90Days, resetToThisYear, resetToAllTime } = useDateFilter();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handlePresetClick = (presetFn) => {
    presetFn();
    setIsOpen(false);
  };

  const handleCustomRange = () => {
    // For now, just close. In a full implementation, you'd open a date picker modal
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
      >
        <Calendar size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {formatDate(startDate)} - {formatDate(endDate)}
        </span>
        <ChevronDown size={16} className={`text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Quick Filters
              </div>
              <button
                onClick={() => handlePresetClick(resetToCurrentMonth)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                This Month
              </button>
              <button
                onClick={() => handlePresetClick(resetToLastMonth)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Last Month
              </button>
              <button
                onClick={() => handlePresetClick(resetToLast30Days)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Last 30 Days
              </button>
              <button
                onClick={() => handlePresetClick(resetToLast90Days)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Last 90 Days
              </button>
              <button
                onClick={() => handlePresetClick(resetToThisYear)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                This Year
              </button>
              <button
                onClick={() => handlePresetClick(resetToAllTime)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition border-t border-gray-100 mt-1 pt-2"
              >
                All Time
              </button>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-t border-gray-100 mt-2">
                Custom Range
              </div>
              <button
                onClick={handleCustomRange}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
              >
                Select Dates...
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangeFilter;

