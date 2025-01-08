export const GradientHeader = () => (
  <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-blue-400 p-8 rounded-lg mb-8">
    <div className="flex justify-between items-start">
      <div className="text-white">
        <p className="text-xs uppercase tracking-wider mb-2">CURRENT PLAN</p>
        <h1 className="text-3xl font-medium mb-4">Researcher</h1>
        <div>
          <div className="flex items-center gap-1">
            <p className="text-sm">API Limit</p>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4"/>
              <path d="M12 8h.01"/>
            </svg>
          </div>
          <div className="bg-white/20 rounded-full h-1.5 w-full mt-2">
            <div className="bg-white rounded-full h-1.5 w-1/4"></div>
          </div>
          <p className="text-sm mt-2">24/1,000 Requests</p>
        </div>
      </div>
      <button className="text-white/80 hover:text-white text-sm">
        Manage Plan
      </button>
    </div>
  </div>
) 