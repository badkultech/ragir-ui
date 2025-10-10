// components/ui/ModalWrapper.tsx
export function ModalWrapper({ children, onClose }: { children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="relative w-full max-w-lg animate-fadeIn">
        {/* Close/X button */}
        <button
          className="absolute top-4 right-4 z-10 text-2xl text-gray-500 hover:text-black font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-lg">{children}</div>
      </div>
    </div>
  );
}
