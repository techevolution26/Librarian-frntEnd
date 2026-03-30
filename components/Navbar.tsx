export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-6 py-4 bg-black text-white">
      <h1 className="text-xl font-bold">The Librarian</h1>
      <input
        className="bg-gray-800 px-3 py-1 rounded"
        placeholder="Search books..."
      />
    </div>
  );
}