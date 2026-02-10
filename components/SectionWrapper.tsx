interface SectionWrapperProps {
  id: string;
  title: string;
  summary?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  title,
  summary,
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className="mt-16">
      <div className="flex items-end justify-between gap-4 mb-6">
        <h2 className="section-title mb-0 pb-2 flex-shrink-0">{title}</h2>
        {summary && <span className="summary-badge mb-2">{summary}</span>}
      </div>
      {children}
    </section>
  );
}
