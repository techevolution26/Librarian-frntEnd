export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200">
      {children}
    </button>
  );
}