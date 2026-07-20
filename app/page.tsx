"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  HeartHandshake,
  Info,
  Landmark,
  RotateCcw,
  ShieldCheck,
  Stethoscope,
  Users
} from "lucide-react";

type RetirementSystem = "middlesex" | "mtrs" | "unknown";
type YesNo = "yes" | "no" | "unknown";

type AccordionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function Accordion({ title, icon, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="accordion">
      <button className="accordionButton" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="accordionTitle">{icon}{title}</span>
        <ChevronDown className={open ? "chevron open" : "chevron"} size={20} />
      </button>
      {open && <div className="accordionContent">{children}</div>}
    </section>
  );
}

function addYears(dateString: string, years: number) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;
  const d = new Date(year + years, month - 1, day);
  return d;
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function SelectCard({ active, title, text, onClick }: { active: boolean; title: string; text: string; onClick: () => void }) {
  return (
    <button className={active ? "choice active" : "choice"} onClick={onClick}>
      <strong>{title}</strong>
      <span>{text}</span>
    </button>
  );
}

export default function Home() {
  const [system, setSystem] = useState<RetirementSystem>("unknown");
  const [years, setYears] = useState("");
  const [retiring, setRetiring] = useState<YesNo>("unknown");
  const [dob, setDob] = useState("");
  const [spouse, setSpouse] = useState<YesNo>("unknown");
  const [spouseDob, setSpouseDob] = useState("");

  const retiree65 = useMemo(() => addYears(dob, 65), [dob]);
  const retireeReview = useMemo(() => retiree65 ? addMonths(retiree65, -6) : null, [retiree65]);
  const spouse65 = useMemo(() => addYears(spouseDob, 65), [spouseDob]);
  const spouseReview = useMemo(() => spouse65 ? addMonths(spouse65, -6) : null, [spouse65]);
  const serviceYears = Number(years);
  const gicLikely = years !== "" && serviceYears >= 10;

  function reset() {
    setSystem("unknown");
    setYears("");
    setRetiring("unknown");
    setDob("");
    setSpouse("unknown");
    setSpouseDob("");
  }

  return (
    <main>
      <header className="hero">
        <div className="heroInner">
          <div className="eyebrow">Town of Bedford, Massachusetts</div>
          <h1>Retirement Benefits Navigator</h1>
          <p>Use this tool to identify the retirement, GIC, Medicare, spouse, dependent, and timing questions that should be reviewed with Human Resources.</p>
          <div className="heroBadges">
            <span><ShieldCheck size={18} /> Bedford-specific guidance</span>
            <span><CalendarDays size={18} /> Automatic age-65 dates</span>
            <span><HeartHandshake size={18} /> Retiree and family paths</span>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="notice">
          <Info size={20} />
          <div><strong>Planning tool only.</strong> Final eligibility and enrollment decisions must be confirmed with Bedford Human Resources, the applicable retirement system, GIC, Medicare, and any other administering agency.</div>
        </div>

        <section className="panel">
          <div className="panelHeader">
            <div>
              <span className="step">STEP 1</span>
              <h2>Build your retirement profile</h2>
            </div>
            <button className="reset" onClick={reset}><RotateCcw size={16} /> Reset</button>
          </div>

          <div className="questionBlock">
            <h3>Which retirement system applies?</h3>
            <div className="choiceGrid three">
              <SelectCard active={system === "middlesex"} title="Middlesex Retirement" text="Most Town employees" onClick={() => setSystem("middlesex")} />
              <SelectCard active={system === "mtrs"} title="MTRS" text="Eligible educators and school staff" onClick={() => setSystem("mtrs")} />
              <SelectCard active={system === "unknown"} title="Not sure" text="HR can help confirm" onClick={() => setSystem("unknown")} />
            </div>
          </div>

          <div className="twoCol">
            <label className="field">
              <span>Creditable service at retirement</span>
              <input type="number" min="0" max="60" placeholder="Years" value={years} onChange={(e) => setYears(e.target.value)} />
            </label>
            <div className="questionBlock compact">
              <h3>Are you retiring from Bedford?</h3>
              <div className="choiceGrid two">
                <SelectCard active={retiring === "yes"} title="Yes" text="Retiring from active service" onClick={() => setRetiring("yes")} />
                <SelectCard active={retiring === "no"} title="No / unsure" text="Review with HR" onClick={() => setRetiring("no")} />
              </div>
            </div>
          </div>

          <div className="twoCol">
            <label className="field">
              <span>Your date of birth</span>
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
              {retiree65 && (
                <div className="calculated">
                  <strong>Turns 65:</strong> {formatDate(retiree65)}<br />
                  <strong>Begin Medicare review by:</strong> {formatDate(retireeReview)}
                </div>
              )}
            </label>
            <div className="questionBlock compact">
              <h3>Will a spouse be covered?</h3>
              <div className="choiceGrid two">
                <SelectCard active={spouse === "yes"} title="Yes" text="Include spouse planning" onClick={() => setSpouse("yes")} />
                <SelectCard active={spouse === "no"} title="No" text="Individual coverage" onClick={() => setSpouse("no")} />
              </div>
            </div>
          </div>

          {spouse === "yes" && (
            <label className="field spouseField">
              <span>Spouse date of birth</span>
              <input type="date" value={spouseDob} onChange={(e) => setSpouseDob(e.target.value)} />
              {spouse65 && (
                <div className="calculated">
                  <strong>Spouse turns 65:</strong> {formatDate(spouse65)}<br />
                  <strong>Begin spouse Medicare review by:</strong> {formatDate(spouseReview)}
                </div>
              )}
            </label>
          )}
        </section>

        <section className="resultPanel">
          <div className="resultHeader">
            <span className="step">STEP 2</span>
            <h2>Your likely path</h2>
          </div>

          <div className="pathGrid">
            <div className="pathCard">
              <Landmark />
              <h3>Retirement system</h3>
              <p>{system === "middlesex" ? "Contact Middlesex Retirement to review pension eligibility, estimates, forms, survivor options, and filing deadlines." : system === "mtrs" ? "Contact MTRS to review pension eligibility, estimates, forms, survivor options, and filing deadlines." : "Confirm whether Middlesex Retirement or MTRS applies before beginning the pension application."}</p>
            </div>

            <div className={gicLikely ? "pathCard positive" : "pathCard warning"}>
              <BadgeCheck />
              <h3>GIC screening</h3>
              <p>{years === "" ? "Enter expected creditable service to screen for the Town's 10-year GIC eligibility requirement." : gicLikely ? "You meet the 10-year service screening threshold. HR must still confirm all final eligibility requirements." : "You appear to have fewer than 10 years of service. Ask HR about eligibility, COBRA, or other available coverage."}</p>
            </div>

            <div className="pathCard">
              <Stethoscope />
              <h3>Medicare path</h3>
              <p>{retiree65 ? `Your 65th birthday is ${formatDate(retiree65)}. Start the Medicare and GIC review approximately six months beforehand.` : "Enter your date of birth to calculate the Medicare planning date automatically."}</p>
            </div>

            <div className="pathCard">
              <Users />
              <h3>Family coverage</h3>
              <p>{spouse === "yes" ? spouse65 ? `Plan separately for your spouse's transition at age 65 on ${formatDate(spouse65)}.` : "Add your spouse's date of birth to calculate their separate age-65 transition." : "Review any eligible dependent children, documentation, and qualifying-event requirements with HR."}</p>
            </div>
          </div>

          <div className="critical">
            <CheckCircle2 size={24} />
            <div><strong>Critical Medicare reminder:</strong> Retirees enrolled in a GIC Medicare plan generally should not separately enroll in Medicare Part D because prescription coverage is included through the GIC plan. Confirm instructions before enrolling in any separate prescription plan.</div>
          </div>
        </section>

        <section className="details">
          <Accordion title="Health insurance decision path" icon={<ShieldCheck size={21} />} defaultOpen>
            <ol className="timeline">
              <li><strong>Confirm the retirement system.</strong><span>Middlesex Retirement and MTRS administer pension benefits separately from GIC health coverage.</span></li>
              <li><strong>Confirm the service requirement.</strong><span>Bedford uses a 10-year service screening requirement for retiree GIC eligibility; HR makes the final determination.</span></li>
              <li><strong>Identify Medicare status.</strong><span>Individuals under 65 generally remain on a non-Medicare GIC plan. Medicare-eligible retirees and spouses transition separately.</span></li>
              <li><strong>Submit enrollment forms and documentation.</strong><span>Deadlines and required forms vary depending on retirement date, age, family status, and qualifying events.</span></li>
            </ol>
          </Accordion>

          <Accordion title="Medicare and age 65+ checklist" icon={<Stethoscope size={21} />}>
            <div className="checklist">
              <p><strong>Approximately six months before age 65:</strong> Contact Bedford HR and review Medicare enrollment timing.</p>
              <p><strong>Medicare Part A and Part B:</strong> Medicare-eligible retirees and spouses generally need both parts to enroll in a GIC Medicare plan.</p>
              <p><strong>Do not independently add Part D:</strong> GIC Medicare plans include prescription coverage.</p>
              <p><strong>Part B reimbursement:</strong> Ask Bedford Finance or HR about the Town's current reimbursement process and required proof.</p>
              <p><strong>Spouses transition independently:</strong> A younger spouse may remain on a non-Medicare plan until their own Medicare eligibility date.</p>
            </div>
          </Accordion>

          <Accordion title="Spouse and dependent guidance" icon={<Users size={21} />}>
            <div className="checklist">
              <p><strong>Adding a spouse:</strong> Marriage documentation may be required, and enrollment may be limited to retirement, open enrollment, or another qualifying event.</p>
              <p><strong>Spouse turns 65:</strong> Begin the spouse's Medicare review approximately six months before their birthday, even if the retiree is already in a Medicare plan.</p>
              <p><strong>Dependent children:</strong> Children generally may remain eligible through age 26, subject to GIC rules and documentation.</p>
              <p><strong>Documentation:</strong> Be prepared to provide marriage certificates, birth certificates, Medicare cards, or other supporting records.</p>
            </div>
          </Accordion>

          <Accordion title="Suggested retirement timeline" icon={<CalendarDays size={21} />}>
            <div className="timelineCards">
              <div><strong>6 months before retirement</strong><span>Request pension estimates; contact HR; review GIC and Medicare timing.</span></div>
              <div><strong>3-4 months before</strong><span>Submit retirement application and begin collecting health-plan documentation.</span></div>
              <div><strong>1-2 months before</strong><span>Confirm pension effective date, deductions, GIC enrollment, and family coverage.</span></div>
              <div><strong>At retirement</strong><span>Verify coverage start dates and retain copies of all forms and confirmations.</span></div>
              <div><strong>After retirement</strong><span>Watch for annual GIC notices, open enrollment, Medicare changes, and reimbursement requirements.</span></div>
            </div>
          </Accordion>
        </section>

        <section className="resources">
          <h2>Official resources</h2>
          <div className="resourceGrid">
            <a href="https://www.bedfordma.gov/884/Retirement-Information" target="_blank" rel="noreferrer">Bedford Retirement Information <ExternalLink size={16} /></a>
            <a href="https://middlesexretirement.org/" target="_blank" rel="noreferrer">Middlesex Retirement <ExternalLink size={16} /></a>
            <a href="https://mtrs.state.ma.us/" target="_blank" rel="noreferrer">Massachusetts Teachers' Retirement System <ExternalLink size={16} /></a>
            <a href="https://www.mass.gov/orgs/group-insurance-commission" target="_blank" rel="noreferrer">Group Insurance Commission <ExternalLink size={16} /></a>
            <a href="https://www.medicare.gov/" target="_blank" rel="noreferrer">Medicare <ExternalLink size={16} /></a>
            <a href="https://www.mass.gov/info-details/serving-the-health-insurance-needs-of-everyone-shine-program" target="_blank" rel="noreferrer">SHINE Counseling <ExternalLink size={16} /></a>
          </div>
        </section>

        <footer>
          <p>Town of Bedford Retirement Benefits Navigator</p>
          <span>This tool does not replace plan documents, statutes, regulations, or official eligibility determinations.</span>
        </footer>
      </div>
    </main>
  );
}
