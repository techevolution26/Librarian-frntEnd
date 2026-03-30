export default function Hero({ book }) {
  return (
    <div className="relative h-[60vh] text-white">
      <img src={book.cover} className="absolute w-full h-full object-cover opacity-40" />
      <div className="relative p-10">
        <h1 className="text-4xl font-bold">{book.title}</h1>
        <p className="mt-4 max-w-xl">{book.description}</p>
        <button className="mt-6 bg-white text-black px-4 py-2 rounded">
          Read Now
        </button>
      </div>
    </div>
  );
}