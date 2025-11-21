interface AIRoadmapCardProps {
  onGenerate: () => void;
}

export const AIRoadmapCard = ({ onGenerate }: AIRoadmapCardProps) => {
  return (
    <div className="bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border-2 border-dashed border-cyan-500/30 rounded-xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">Generate Roadmap</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-xs">
          Let AI help you create a step-by-step plan for your goals.
        </p>
        
        <button
          onClick={onGenerate}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};
