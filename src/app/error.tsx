"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-serif text-4xl">Something went wrong</h1>
      <button onClick={reset} className="mt-6 rounded-full bg-brand px-5 py-2 text-white">
        Try again
      </button>
    </div>
  );
}
