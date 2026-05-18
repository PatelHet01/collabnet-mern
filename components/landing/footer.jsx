import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="border-t py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <p className="font-display font-semibold">CollabNet</p>
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} — Made for the Indian creator economy</p>
        <div className="flex gap-6 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">Log in</Link>
          <Link href="/register" className="text-muted-foreground hover:text-foreground">Register</Link>
        </div>
      </div>
    </footer>
  );
}
