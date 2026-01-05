import React, { useState } from "react";
import { Plus, X, ThumbsUp, ThumbsDown } from "lucide-react";

interface RecommendationSectionProps {
  label: string;
  value: { dos: string[]; donts: string[] };
  onChange: (value: { dos: string[]; donts: string[] }) => void;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  label,
  value,
  onChange,
}) => {
  const [doInput, setDoInput] = useState("");
  const [dontInput, setDontInput] = useState("");

  const handleAddDo = () => {
    if (doInput.trim()) {
      onChange({
        ...value,
        dos: [...(value.dos || []), doInput.trim()],
      });
      setDoInput("");
    }
  };

  const handleAddDont = () => {
    if (dontInput.trim()) {
      onChange({
        ...value,
        donts: [...(value.donts || []), dontInput.trim()],
      });
      setDontInput("");
    }
  };

  const removeDo = (index: number) => {
    const newDos = [...(value.dos || [])];
    newDos.splice(index, 1);
    onChange({ ...value, dos: newDos });
  };

  const removeDont = (index: number) => {
    const newDonts = [...(value.donts || [])];
    newDonts.splice(index, 1);
    onChange({ ...value, donts: newDonts });
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        {label === "Diet" && "🍎"}
        {label === "Lifestyle" && "🧘"}
        {label === "Exercises" && "💪"}
        {label}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dos Column */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 mb-3 text-green-700 font-medium">
            <ThumbsUp className="w-4 h-4" />
            <span>Dos</span>
          </div>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={doInput}
              onChange={(e) => setDoInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDo()}
              placeholder="Add recommendation..."
              className="flex-1 px-3 py-2 text-sm border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            />
            <button
              onClick={handleAddDo}
              className="p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {value.dos?.map((item, idx) => (
              <div
                key={`do-${idx}`}
                className="flex items-start justify-between bg-white p-2 rounded border border-green-100 shadow-sm"
              >
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  onClick={() => removeDo(idx)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {(!value.dos || value.dos.length === 0) && (
              <p className="text-xs text-gray-400 italic">No recommendations added</p>
            )}
          </div>
        </div>

        {/* Donts Column */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 mb-3 text-red-700 font-medium">
            <ThumbsDown className="w-4 h-4" />
            <span>Don'ts</span>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={dontInput}
              onChange={(e) => setDontInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddDont()}
              placeholder="Add restriction..."
              className="flex-1 px-3 py-2 text-sm border border-red-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
            />
            <button
              onClick={handleAddDont}
              className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {value.donts?.map((item, idx) => (
              <div
                key={`dont-${idx}`}
                className="flex items-start justify-between bg-white p-2 rounded border border-red-100 shadow-sm"
              >
                <span className="text-sm text-gray-700">{item}</span>
                <button
                  onClick={() => removeDont(idx)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
             {(!value.donts || value.donts.length === 0) && (
              <p className="text-xs text-gray-400 italic">No restrictions added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
