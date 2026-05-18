export function HowItWorks() {
  const steps = [
    { n: '01', t: 'Brand posts a campaign', d: 'Set budget in INR, write the brief, publish when ready.' },
    { n: '02', t: 'Creators apply', d: 'Pitch and quote in rupees. Brands review side by side.' },
    { n: '03', t: 'Deliver & pay', d: 'Upload deliverables, approve work, release payout.' },
  ];

  return (
    <section id="how" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-display text-3xl font-bold">How it works</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-display text-5xl font-bold text-muted-foreground/30">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
