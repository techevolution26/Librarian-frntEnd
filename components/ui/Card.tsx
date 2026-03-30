export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-neutral-900 p-4 rounded-xl shadow">
      {children}
    </div>
  );
}