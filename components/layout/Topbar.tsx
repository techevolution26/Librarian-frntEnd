export default function Topbar() {
  return (
    <div className="p-4 bg-neutral-900 flex justify-between">
      <input
        placeholder="Search books..."
        className="bg-black px-3 py-2 rounded w-64"
      />
    </div>
  );
}