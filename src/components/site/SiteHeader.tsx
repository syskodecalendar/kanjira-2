import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BRAND, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
        overHero ? "text-ivory" : "border-b bg-background/95 text-foreground backdrop-blur",
      )}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl leading-none tracking-wide md:text-[1.4rem] xl:text-[1.7rem]">
          {BRAND}
        </Link>
        <nav className="hidden items-center gap-4 xl:gap-6 xl:flex" aria-label="Main">
          {NAV.slice(1).map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "relative text-[13px] xl:text-[15px] tracking-wide transition-opacity hover:opacity-100",
                n.to === "/contact"
                  ? overHero
                    ? "border border-ivory/70 px-5 py-2.5"
                    : "bg-primary px-5 py-2.5 text-primary-foreground"
                  : "opacity-85",
              )}
              activeProps={{ className: n.to === "/contact" ? "" : "opacity-100 after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:bg-current" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          className="xl:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-7" /> : <Menu className="size-7" />}
        </button>
      </div>
      {open && (
        <nav className="h-[calc(100dvh-5rem)] border-t bg-background px-6 py-8 xl:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="block border-b py-4 font-display text-3xl"
                  activeProps={{ className: "text-accent" }}
                  activeOptions={{ exact: true }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
