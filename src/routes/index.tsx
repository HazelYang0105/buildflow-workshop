import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, Chip } from "@/components/Shell";
import { CPS, GROUP, MEMBERS, STAN_TYPES, loadPrefs, savePrefs } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BiasBrief — Your K-pop Fandom Daily Digest" },
      { name: "description", content: "Pick your bias, CPs and stan style. Get a personalized daily K-pop digest in minutes." },
      { property: "og:title", content: "BiasBrief — Your K-pop Fandom Daily Digest" },
      { property: "og:description", content: "Personalized idol updates and fan buzz in one 3-minute read." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function toggle(list: string[], v: string) {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function Index() {
  const nav = useNavigate();
  const [members, setMembers] = useState<string[]>([]);
  const [cps, setCps] = useState<string[]>([]);
  const [stanType, setStanType] = useState<string>("Group stan");

  useEffect(() => {
    const p = loadPrefs();
    if (p) { setMembers(p.members); setCps(p.cps); setStanType(p.stanType); }
  }, []);

  return (
    <Shell>
      <section className="pb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pilot · {GROUP}</p>
        <h1 className="font-display mt-2 text-5xl font-bold leading-[1.05] sm:text-6xl">
          Your fandom,<br />in three minutes.
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Tell us who you stan. We'll pull official updates and fan buzz into one brief — clearly labeled, always sourced.
        </p>
      </section>

      <div className="max-w-3xl space-y-8">
        <Block n="1" title="How do you stan?">
          {STAN_TYPES.map((s) => <Chip key={s} on={stanType === s} onClick={() => setStanType(s)}>{s}</Chip>)}
        </Block>
        <Block n="2" title="Your bias(es)">
          {MEMBERS.map((m) => <Chip key={m} on={members.includes(m)} onClick={() => setMembers(toggle(members, m))}>{m}</Chip>)}
        </Block>
        <Block n="3" title="CPs you follow (optional)">
          {CPS.map((c) => <Chip key={c} on={cps.includes(c)} onClick={() => setCps(toggle(cps, c))}>♡ {c}</Chip>)}
        </Block>
        <Button
          onClick={() => { savePrefs({ members, cps, stanType }); nav({ to: "/digest" }); }}
          className="card-pop h-14 w-full rounded-lg border border-foreground font-display text-lg font-bold"
        >
          Get today's brief <ArrowUpRight />
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Sources: official channels + curated fan discussions. No unrestricted social scraping.
        </p>
      </div>
    </Shell>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display mb-3 text-xl font-bold"><span className="text-primary">{n}.</span> {title}</h2>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
