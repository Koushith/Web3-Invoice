export const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Logo with pulse animation */}
        <div className="w-20 h-20 bg-[#635BFF] rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
          <span className="text-white text-4xl font-bold">D</span>
        </div>

        {/* App Name */}
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">DefInvoice</h1>

        {/* Loading Spinner */}
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#635BFF] rounded-full animate-spin mt-2" />
      </div>
    </div>
  );
};
