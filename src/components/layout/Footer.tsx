import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="py-20 border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="size-6 rounded-md bg-primary grid place-items-center">
                <span className="size-2 rounded-sm bg-accent" />
              </span>
              <span className="font-semibold tracking-tight">Smart Deal</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[32ch] mb-6">
              The AI intelligence layer for Indian retail. Price comparison, real-time availability, and localized savings.
            </p>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
            <FooterCol title="Platform" links={[["/deal-map","Deal Map"],["/ai-planner","AI Planner"],["/products","All Deals"],["/stores","Stores"]]} />
            <FooterCol title="Company" links={[["/about","About"],["/features","Features"],["/pricing","Pricing"],["/contact","Contact"]]} />
            <div className="col-span-2 md:col-span-1">
              <h5 className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">Subscribe</h5>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email" className="flex-1 bg-card ring-1 ring-border rounded-lg px-3 py-2 text-sm focus:ring-accent outline-none" />
                <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg">Join</button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Smart Deal Intelligence Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/about" className="text-xs text-muted-foreground hover:text-primary">Privacy</Link>
            <Link to="/about" className="text-xs text-muted-foreground hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h5 className="text-xs font-semibold uppercase tracking-widest text-primary mb-5">{title}</h5>
      <ul className="space-y-3">
        {links.map(([to, label]) => (
          <li key={to}>
            <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}