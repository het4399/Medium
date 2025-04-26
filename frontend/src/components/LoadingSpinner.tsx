export const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Adjust the sizes for mobile first, then for larger screens */}
        <div className="relative w-14 h-14 flex items-center justify-center animate-bounce">
          {/* Outer glow effect */}
          <div className="absolute inset-0 w-full h-full animate-ping rounded-full bg-gradient-to-r from-blue-700 to-blue-600 opacity-75"></div>
  
          {/* Inner logo container */}
          <div className="relative w-full h-full border-2 border-indigo-400 rounded-full flex items-center justify-center">
            {/* Circular logo in the center */}
            <img
              src="/logo.jpg"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>
      </div>
    );
  };
  