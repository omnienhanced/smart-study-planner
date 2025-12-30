export const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-dark">
      <div className="relative w-16 h-16">
        {/* Outer spinning gradient ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-pink-500 border-r-purple-500 border-b-indigo-500 border-l-pink-500 animate-spin"></div>

        {/* Inner pulsing circle */}
        <div className="absolute inset-3 rounded-full bg-dark flex items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
