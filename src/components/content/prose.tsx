export function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-serif text-5xl">{title}</h1>
      <div className="mt-6 space-y-4 text-muted leading-7">{children}</div>
    </article>
  );
}
