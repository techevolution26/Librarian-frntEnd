"use client";

interface TextReaderProps {
  content: string;
}

export default function TextReader({ content }: TextReaderProps) {
  const paragraphs = content
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 sm:p-8">
      <div className="prose prose-invert max-w-none prose-p:leading-8 prose-p:text-white/80 prose-headings:text-white">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        ) : (
          <p>No readable text is available for this book yet.</p>
        )}
      </div>
    </section>
  );
}