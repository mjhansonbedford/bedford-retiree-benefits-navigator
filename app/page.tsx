"use client";

import { useMemo, useState } from "react";

type System = "middlesex" | "mtrs" | "unknown";
type Medicare = "not65" | "approaching" | "enrolled" | "unknown";
type Spouse = "yes" | "no";

type TimelineItem = { date: Date | null; label: string; detail: string; priority?: boolean };

const contacts = [
  { name: "Bedford Human Resources", detail: "Confirm retiree health eligibility, GIC forms, qualifying events, and required documentation.", href: "https://www.bedfordma.gov/884/Retirement-Information" },
  { name: "Bedford Finance", detail: "Ask about the current Medicare Part B reimbursement process and proof requirements.", href: "https://www.bedfordma.gov/" },
  { name: "Middlesex County Retirement System", detail: "Pension estimates, retirement applications, survivor options, and filing deadlines.", href: "https://middlesexretirement.org/" },
  { name: "Massachusetts Teachers' Retirement System", detail: "Retirement guidance for eligible educators and school employees.", href: "https://mtrs.state.ma.us/" },
  { name: "Group Insurance Commission", detail: "State retiree health plans, enrollment forms, plan comparisons, and Medicare plan information.", href: "https://www.mass.gov/orgs/group-insurance-commission" },
  { name: "Medicare", detail: "Official Medicare enrollment, Parts A and B, and eligibility information.", href: "https://www.medicare.gov/" },
  { name: "SHINE", detail: "Free, unbiased Medicare counseling for Massachusetts residents.", href: "https://www.mass.gov/info-details/serving-the-health-insurance-needs-of-everyone-shine-program" }
];

const faqs = [
  ["How do I add my spouse?", "Contact Bedford HR. A marriage certificate and enrollment forms may be required, and timing may depend on retirement, open enrollment, or another qualifying event."],
  ["What happens when my spouse turns 65?", "Your spouse's Medicare transition is handled separately. Begin reviewing Medicare Parts A and B and the GIC Medicare plan approximately six months before the spouse's 65th birthday."],
  ["Should I enroll in Medicare Part D?", "Generally, no. GIC Medicare plans include prescription drug coverage. Enrolling separately in Part D can create coverage problems. Confirm with GIC and Bedford HR before taking action."],
  ["What documents should I gather?", "Typical documents include retirement applications, marriage and birth certificates, Medicare cards, proof of Medicare enrollment, and any forms required by GIC or Bedford."],
  ["Can children remain covered?", "Dependent children are generally eligible through age 26, subject to current GIC rules and documentation requirements."],
  ["What if I have fewer than 10 years of service?", "Ask Bedford HR to confirm whether retiree GIC coverage is available and to explain COBRA or other coverage options."],
  ["When should I contact Medicare?", "Start planning about six months before age 65. Medicare generally recommends enrolling during the applicable enrollment window, but individual circumstances can vary."],
  ["How does Part B reimbursement work?", "After Medicare enrollment, contact Bedford HR or Finance for the Town's current reimbursement instructions and required proof."],
  ["What if I retire before age 65?", "You may remain in a non-Medicare GIC retiree plan until Medicare eligibility, provided you meet all eligibility requirements. Confirm the transition with HR."],
  ["What if I keep working after age 65?", "Medicare timing can depend on active employment and coverage status. Review your situation with HR, Medicare, and GIC before delaying enrollment."]
];

function parseDate(value: string): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return y && m && d ? new Date(y, m - 1, d) : null;
}
function addYears(date: Date | null, years: number) { if (!date) return null; return new Date(date.getFullYear() + years, date.getMonth(), date.getDate()); }
function addMonths(date: Date | null, months: number) { if (!date) return null; const n = new Date(date); n.setMonth(n.getMonth() + months); return n; }
function fmt(date: Date | null) { return date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date) : "Date not entered"; }
function dateInput(date: Date | null) { if (!date) return ""; const y = date.getFullYear(); const m = String(date.getMonth()+1).padStart(2,"0"); const d = String(date.getDate()).padStart(2,"0"); return `${y}-${m}-${d}`; }

export default function Home() {
  const [dob, setDob] = useState("");
  const [retirementDate, setRetirementDate] = useState("");
  const [system, setSystem] = useState<System>("unknown");
  const [service, setService] = useState("");
  const [medicare, setMedicare] = useState<Medicare>("unknown");
  const [spouse, setSpouse] = useState<Spouse>("no");
  const [spouseDob, setSpouseDob] = useState("");
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const birth = parseDate(dob);
  const retirement = parseDate(retirementDate);
  const age65 = addYears(birth, 65);
  const spouse65 = addYears(parseDate(spouseDob), 65);
  const serviceYears = Number(service);
  const meetsTenYears = service !== "" && serviceYears >= 10;

  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = [];
    if (retirement) {
      items.push({ date: addMonths(retirement, -6), label: "Begin retirement planning", detail: `Contact ${system === "mtrs" ? "MTRS" : system === "middlesex" ? "Middlesex Retirement" : "the applicable retirement system"} and Bedford HR. Request estimates and review forms.` });
      items.push({ date: addMonths(retirement, -3), label: "Confirm health enrollment steps", detail: "Review GIC forms, family coverage, documentation, and effective dates with HR." });
      items.push({ date: retirement, label: "Planned retirement date", detail: "Verify pension effective date, health deductions, and coverage start dates.", priority: true });
      items.push({ date: addMonths(retirement, 1), label: "Post-retirement check", detail: "Confirm pension payment, health coverage, beneficiary records, and outstanding documentation." });
    }
    if (age65) {
      items.push({ date: addMonths(age65, -6), label: "Begin Medicare review", detail: "Contact HR, GIC, and Medicare. Review Parts A and B and the GIC Medicare transition." });
      items.push({ date: addMonths(age65, -3), label: "Medicare enrollment target", detail: "Complete Medicare Parts A and B enrollment as appropriate and prepare proof for GIC.", priority: true });
      items.push({ date: age65, label: "Your 65th birthday", detail: "Confirm that the GIC Medicare plan transition is complete. Do not separately enroll in Part D without confirming instructions." });
      items.push({ date: addMonths(age65, 1), label: "Part B reimbursement follow-up", detail: "Provide the required proof to Bedford Finance or HR under the Town's current process." });
    }
    if (spouse === "yes" && spouse65) {
      items.push({ date: addMonths(spouse65, -6), label: "Begin spouse Medicare review", detail: "Plan the spouse's separate Medicare and GIC transition." });
      items.push({ date: spouse65, label: "Spouse's 65th birthday", detail: "Confirm Medicare Parts A and B and the spouse's GIC Medicare coverage." });
    }
    return items.sort((a,b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));
  }, [retirementDate, dob, spouseDob, spouse, system]);

  const filteredFaqs = faqs.filter(([q,a]) => `${q} ${a}`.toLowerCase().includes(search.toLowerCase()));

  function printSummary() { window.print(); }
  function reset() { setDob(""); setRetirementDate(""); setSystem("unknown"); setService(""); setMedicare("unknown"); setSpouse("no"); setSpouseDob(""); }

  return (
    <div className="site-shell">
      <aside className="sidebar no-print" aria-label="Section navigation">
        <div className="brand">BEDFORD<br/><span>Retirement Navigator</span></div>
        <nav>
          <a href="#profile">Your profile</a><a href="#summary">Personalized path</a><a href="#timeline">Timeline</a><a href="#decisions">Decision trees</a><a href="#faq">Search & FAQ</a><a href="#contacts">Contacts</a>
        </nav>
        <button onClick={printSummary} className="side-button">Print / Save PDF</button>
      </aside>

      <main>
        <header className="hero">
          <p className="kicker">Town of Bedford, Massachusetts</p>
          <h1>Retirement Benefits Navigator</h1>
          <p className="lede">Build a personalized retirement, GIC, Medicare, spouse, and dependent checklist in a few minutes.</p>
          <div className="hero-actions no-print"><a href="#profile" className="primary">Start my plan</a><button onClick={printSummary} className="secondary">Print summary</button></div>
        </header>

        <div className="alert info"><strong>Planning guidance only.</strong> Final eligibility and deadlines must be confirmed with Bedford Human Resources, the applicable retirement system, GIC, and Medicare.</div>

        <section id="profile" className="card">
          <div className="section-head"><div><span className="eyebrow">Step 1</span><h2>Tell us about your situation</h2></div><button className="text-button no-print" onClick={reset}>Reset</button></div>
          <div className="form-grid">
            <label><span>Date of birth</span><input type="date" value={dob} onChange={e=>setDob(e.target.value)}/>{age65 && <small>You turn 65 on <strong>{fmt(age65)}</strong>.</small>}</label>
            <label><span>Planned retirement date</span><input type="date" value={retirementDate} onChange={e=>setRetirementDate(e.target.value)}/></label>
            <label><span>Retirement system</span><select value={system} onChange={e=>setSystem(e.target.value as System)}><option value="unknown">Not sure</option><option value="middlesex">Middlesex Retirement</option><option value="mtrs">MTRS</option></select></label>
            <label><span>Creditable service at retirement</span><input type="number" min="0" max="60" placeholder="Years" value={service} onChange={e=>setService(e.target.value)}/></label>
            <label><span>Current Medicare status</span><select value={medicare} onChange={e=>setMedicare(e.target.value as Medicare)}><option value="unknown">Not sure</option><option value="not65">Not yet Medicare eligible</option><option value="approaching">Approaching age 65</option><option value="enrolled">Already enrolled in Parts A and B</option></select></label>
            <label><span>Include spouse planning?</span><select value={spouse} onChange={e=>setSpouse(e.target.value as Spouse)}><option value="no">No</option><option value="yes">Yes</option></select></label>
            {spouse === "yes" && <label><span>Spouse date of birth</span><input type="date" value={spouseDob} onChange={e=>setSpouseDob(e.target.value)}/>{spouse65 && <small>Spouse turns 65 on <strong>{fmt(spouse65)}</strong>.</small>}</label>}
          </div>
        </section>

        <section id="summary" className="card printable-summary">
          <span className="eyebrow">Step 2</span><h2>Your personalized path</h2>
          <div className="summary-grid">
            <article><h3>Retirement system</h3><p>{system === "middlesex" ? "Contact Middlesex Retirement for pension estimates, forms, survivor options, and filing deadlines." : system === "mtrs" ? "Contact MTRS for pension estimates, forms, survivor options, and filing deadlines." : "Confirm your retirement system with HR before filing pension paperwork."}</p></article>
            <article className={service === "" ? "" : meetsTenYears ? "good" : "warn"}><h3>GIC eligibility screening</h3><p>{service === "" ? "Enter your expected service to screen against Bedford's 10-year requirement." : meetsTenYears ? "You meet the 10-year screening threshold. HR must confirm final eligibility." : "You appear below the 10-year threshold. Ask HR about GIC eligibility, COBRA, and other options."}</p></article>
            <article><h3>Medicare planning</h3><p>{age65 ? `Begin the Medicare review by ${fmt(addMonths(age65,-6))}. Your 65th birthday is ${fmt(age65)}.` : "Enter your date of birth to calculate Medicare planning dates automatically."}</p></article>
            <article><h3>Spouse and dependents</h3><p>{spouse === "yes" ? spouse65 ? `Your spouse's separate age-65 transition begins around ${fmt(addMonths(spouse65,-6))}.` : "Enter your spouse's birth date to generate a separate Medicare timeline." : "Review dependent eligibility and qualifying-event rules with HR as needed."}</p></article>
          </div>
          <div className="alert danger"><strong>Do not independently enroll in Medicare Part D.</strong> GIC Medicare plans include prescription drug coverage. Confirm instructions with GIC and Bedford HR before enrolling in any separate drug plan.</div>
          <div className="alert warning"><strong>Apply before age 65.</strong> Begin planning early so Medicare Parts A and B and the GIC Medicare plan can be coordinated without a gap.</div>
          <div className="alert warning"><strong>Report qualifying events promptly.</strong> Marriage, divorce, birth, loss of coverage, and other events may have strict enrollment windows.</div>
        </section>

        <section id="timeline" className="card">
          <span className="eyebrow">Step 3</span><h2>Your personalized timeline</h2>
          {timeline.length ? <div className="timeline">{timeline.map((item,i)=><article key={`${item.label}-${i}`} className={item.priority ? "priority" : ""}><time>{fmt(item.date)}</time><div><h3>{item.label}</h3><p>{item.detail}</p></div></article>)}</div> : <p className="empty">Enter your date of birth and planned retirement date to generate a dated checklist.</p>}
          <button className="primary no-print" onClick={printSummary}>Print or save this plan as PDF</button>
        </section>

        <section id="decisions" className="card">
          <span className="eyebrow">Explore</span><h2>Clickable decision trees</h2>
          <div className="decision-grid">
            <details open><summary>Retiring before age 65</summary><ol><li>Confirm 10-year GIC eligibility with HR.</li><li>Choose the applicable non-Medicare GIC retiree plan.</li><li>Start Medicare planning about six months before age 65.</li><li>Transition to a GIC Medicare plan when eligible.</li></ol></details>
            <details><summary>Turning 65</summary><ol><li>Contact HR and GIC about six months ahead.</li><li>Enroll in Medicare Parts A and B as appropriate.</li><li>Provide proof to complete the GIC Medicare transition.</li><li>Do not separately enroll in Part D.</li><li>Ask Finance about Part B reimbursement.</li></ol></details>
            <details><summary>Spouse turns 65 separately</summary><ol><li>Begin spouse planning six months before the birthday.</li><li>Enroll the spouse in Parts A and B as appropriate.</li><li>Submit Medicare information to HR/GIC.</li><li>Confirm the retiree's own plan remains unchanged.</li></ol></details>
            <details><summary>Adding family coverage</summary><ol><li>Contact HR immediately after the qualifying event.</li><li>Gather marriage or birth certificates.</li><li>Complete GIC enrollment forms within the required window.</li><li>Confirm effective dates and deductions.</li></ol></details>
          </div>
        </section>

        <section id="faq" className="card no-print">
          <span className="eyebrow">Find an answer</span><h2>Search retirement questions</h2>
          <input className="search" aria-label="Search retirement questions" placeholder="Try: spouse, Medicare, Part D, documents..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div className="faq-list">{filteredFaqs.map(([q,a],i)=><button key={q} className="faq" onClick={()=>setOpenFaq(openFaq===i?null:i)} aria-expanded={openFaq===i}><span>{q}</span><b>{openFaq===i?"−":"+"}</b>{openFaq===i && <p>{a}</p>}</button>)}</div>
        </section>

        <section id="contacts" className="card">
          <span className="eyebrow">Bedford resources</span><h2>Contacts and official information</h2>
          <div className="contacts">{contacts.map(c=><a key={c.name} href={c.href} target="_blank" rel="noreferrer"><strong>{c.name}</strong><span>{c.detail}</span><em>Open official resource →</em></a>)}</div>
        </section>

        <section className="card admin-note no-print"><span className="eyebrow">Administrator mode roadmap</span><h2>Easy updates for HR</h2><p>This version keeps all contact links and guidance in clearly labeled data lists at the top of <code>app/page.tsx</code>. The next step is a password-protected administrator screen backed by a small database so the Benefits Coordinator can change contacts, deadlines, warnings, and links without editing code or redeploying.</p></section>

        <footer>Town of Bedford Retirement Benefits Navigator • Verify all benefits decisions with the administering agency.</footer>
      </main>
    </div>
  );
}
