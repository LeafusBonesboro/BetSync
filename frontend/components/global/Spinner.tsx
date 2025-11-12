// components/shared/Spinner.tsx
export default function Spinner({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <div className="w-8 h-8 border-4 border-gray-700 border-t-amber-400 rounded-full animate-spin"></div>
      {text && <p className="text-gray-400 mt-4">{text}</p>}
    </div>
  );
}
