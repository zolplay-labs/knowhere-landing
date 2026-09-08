import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconArrowsHorizontal,
  IconFileText,
  IconStack2,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({ component: App });

const trialUrl = "https://knowhereto.ai/login";
const contactUrl = "mailto:team@knowhereto.ai";
const docsUrl = "https://docs.knowhereto.ai/";
const money = (pages: number) =>
  (pages * 0.015).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
const number = (value: number) => value.toLocaleString("en-US");

function Header() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <div className="shell header-inner">
        <a href="https://knowhereto.ai/" aria-label="Knowhere home">
          <img
            className="logo"
            src="/assets/knowhere-back-to-top.svg"
            width="132"
            height="52"
            alt="Knowhere"
          />
        </a>
        <nav
          aria-label="Main navigation"
          className={open ? "navigation is-open" : "navigation"}
          id="navigation"
        >
          <a href="https://knowhereto.ai/">Product</a>
          <a
            href="#overview"
            aria-current="page"
            onClick={() => setOpen(false)}
          >
            Pricing
          </a>
          <a href={docsUrl}>
            Documentation <IconArrowUpRight size={13} />
          </a>
          <a href={contactUrl}>Contact sales</a>
        </nav>
        <a className="button header-cta" href={trialUrl}>
          Start free trial <IconArrowUpRight size={16} />
        </a>
        <button
          ref={trigger}
          className="menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <IconX /> : <IconMenu2 />}
        </button>
      </div>
    </header>
  );
}

function Calculator() {
  const [pages, setPages] = useState(500);
  const [input, setInput] = useState("500");
  const progress = ((pages - 100) / 9900) * 100;
  function updatePages(value: number) {
    setPages(value);
    setInput(String(value));
  }
  return (
    <section
      id="calculator"
      className="section calculator-section"
      aria-labelledby="calculator-title"
    >
      <div className="shell">
        <div className="section-heading">
          <div>
            <p className="section-no">[ 02 / COST CALCULATOR ]</p>
            <h2 id="calculator-title">Your documents. Your budget.</h2>
          </div>
          <p>
            From your first experiment to your next workflow.
            <br />
            See exactly what your pages could cost.
          </p>
        </div>
        <div className="calculator">
          <div className="calculator-top">
            <div>
              <label htmlFor="page-count">Pages to process</label>
              <div className="page-input">
                <input
                  id="page-count"
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={input}
                  onChange={(event) => {
                    const value = event.target.value;
                    setInput(value);
                    const count = Number(value);
                    if (count >= 100 && count <= 10000 && count % 100 === 0)
                      setPages(count);
                  }}
                  onBlur={() =>
                    updatePages(
                      Math.min(
                        10000,
                        Math.max(
                          100,
                          Math.round((Number(input) || 100) / 100) * 100,
                        ),
                      ),
                    )
                  }
                  aria-describedby="calculator-note"
                />
                <span>pages</span>
              </div>
            </div>
            <div className="estimated">
              <span>
                Estimated cost <span className="currency">USD</span>
              </span>
              <output aria-live="polite" className="total">
                {money(pages)}
              </output>
              <span>$1.50 per 100 pages</span>
            </div>
          </div>
          <div
            className="ruler-wrap"
            style={{ "--progress": `${progress}%` } as CSSProperties}
          >
            <div className="ruler">
              <div className="ruler-fill" />
              <div className="ruler-ticks" />
              <span className="ruler-line" />
              <span className="ruler-budget" aria-hidden="true">
                {money(pages)}
              </span>
              <span className="ruler-handle">
                <IconArrowsHorizontal size={18} />
              </span>
              <input
                aria-label="Pages to process"
                aria-valuetext={`${number(pages)} pages, estimated cost ${money(pages)}`}
                type="range"
                min="100"
                max="10000"
                step="100"
                value={pages}
                onChange={(event) => updatePages(Number(event.target.value))}
              />
            </div>
            <div className="ruler-labels">
              <span>100 pages</span>
              <span>2,500</span>
              <span>5,000</span>
              <span>7,500</span>
              <span>10,000 pages</span>
            </div>
          </div>
          <div className="calculator-bottom">
            <div>
              <IconFileText size={20} />
              <span>
                <strong>
                  {number(Math.floor(pages / 100))}{" "}
                  {Math.floor(pages / 100) === 1 ? "document" : "documents"}
                </strong>
                <small>at 100 pages each</small>
              </span>
            </div>
            <div>
              <IconStack2 size={20} />
              <span>
                <strong>
                  {number(Math.floor(pages / 500))}{" "}
                  {Math.floor(pages / 500) === 1 ? "document" : "documents"}
                </strong>
                <small>at 500 pages each</small>
              </span>
            </div>
            <p>
              <IconCheck size={16} /> Same rate. At every step.
            </p>
          </div>
        </div>
        <div className="calculator-foot">
          <p id="calculator-note">
            Estimates in 100-page steps, not a billing minimum. Document counts
            are rounded down.
          </p>
          <a className="text-link" href="#enterprise">
            Processing more? Let’s talk <IconArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}

const questions = [
  [
    "Do unused page credits roll over?",
    "Page credits expire 3 months after purchase. Plan your purchase around the documents you expect to process during that period.",
  ],
  [
    "What payment methods do you accept?",
    "We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express.",
  ],
  [
    "Can I get a refund?",
    "Contact team@knowhereto.ai for refund requests within 14 days of purchase.",
  ],
  [
    "Are taxes included in the estimate?",
    "This calculator estimates page-processing costs only. Contact our team to confirm applicable taxes and invoice requirements before purchasing.",
  ],
  [
    "How do I get started?",
    "Start a free 14-day trial. No credit card is required. Get your API key and try Knowhere with your own documents.",
  ],
];

function App() {
  return (
    <>
      <a className="skip-link" href="#overview">
        Skip to content
      </a>
      <Header />
      <main>
        <section
          id="overview"
          className="overview shell"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="section-no">
              <span className="status-dot" /> [ 01 / PRICING ]
            </p>
            <h1 id="hero-title">
              Better document context.
              <br />
              <span>Not a bigger bill.</span>
            </h1>
          </div>
          <div className="hero-intro">
            <p className="lede">
              Simple, transparent pricing for your document workflows. Pay only
              for what you use. No hidden fees, no complex tiers.
            </p>
            <div className="hero-actions">
              <a className="button" href={trialUrl}>
                Start free trial <IconArrowUpRight size={17} />
              </a>
              <a className="text-link" href="#calculator">
                Estimate your cost <IconArrowRight size={16} />
              </a>
            </div>
            <p className="trial-note">
              <IconCheck size={14} /> Free 14-day trial <span>·</span> No credit
              card required
            </p>
          </div>
          <div className="rate-card">
            <div className="rate-main">
              <p className="rate-top">PAY AS YOU GO</p>
              <div className="unit-price">
                $1.50<span>/ 100 pages</span>
              </div>
              <p className="rate-bottom">
                $0.015 per page <span>·</span> Billed in USD
              </p>
            </div>
            <div className="rate-details">
              <h3>One straightforward rate.</h3>
              <p>Every page, the same possibility.</p>
              <ul>
                <li>
                  <IconCheck size={16} /> No subscription fee
                </li>
                <li>
                  <IconCheck size={16} /> No minimum commitment
                </li>
                <li>
                  <IconCheck size={16} /> Only successful jobs are charged
                </li>
              </ul>
            </div>
          </div>
          <nav className="overview-bottom" aria-label="Pricing sections">
            <a href="#calculator">
              Cost calculator <IconChevronDown size={14} />
            </a>
            <a href="#how-it-works">
              How pricing works <IconChevronDown size={14} />
            </a>
            <a href="#enterprise">
              Limits & enterprise <IconChevronDown size={14} />
            </a>
            <a href="#faq">
              Pricing FAQ <IconChevronDown size={14} />
            </a>
          </nav>
        </section>
        <Calculator />
        <section
          id="how-it-works"
          className="section shell"
          aria-labelledby="how-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-no">[ 03 / HOW PRICING WORKS ]</p>
              <h2 id="how-title">Clear from page to payment.</h2>
            </div>
            <p>
              No guesswork. Here’s what counts,
              <br />
              and when your credits are used.
            </p>
          </div>
          <div className="how-grid">
            <article>
              <span className="step-number">01</span>
              <div className="rule-copy">
                <h3>Start with your pages</h3>
                <p>
                  Pricing is based on processed pages, not the number of files
                  you upload.
                </p>
                <p className="detail-note">
                  Working with spreadsheets or presentations? Ask our team to
                  confirm format-specific page counting before estimating.
                </p>
                <a className="text-link" href={contactUrl}>
                  Confirm how your files are counted{" "}
                  <IconArrowUpRight size={15} />
                </a>
              </div>
              <div className="format-row" aria-label="Supported formats">
                <span>PDF</span>
                <span>DOCX</span>
                <span>XLSX</span>
                <span>PPTX</span>
              </div>
            </article>
            <article>
              <span className="step-number">02</span>
              <div className="rule-copy">
                <h3>Pay for completed work</h3>
                <p>
                  Page credits are deducted when a job completes successfully.
                  Your balance follows your actual usage.
                </p>
              </div>
              <div className="job-status">
                <span>
                  <i /> Job completed
                </span>
                <span>
                  Credits deducted <IconCheck size={15} />
                </span>
              </div>
            </article>
            <article>
              <span className="step-number">03</span>
              <div className="rule-copy">
                <h3>Failed job? No charge.</h3>
                <p>
                  Failed jobs don’t consume credits. You only pay for
                  successfully processed work.
                </p>
              </div>
              <div className="job-status failed">
                <span>
                  <i /> Job failed
                </span>
                <span>0 credits charged</span>
              </div>
            </article>
          </div>
        </section>
        <section
          id="enterprise"
          className="section shell"
          aria-labelledby="limits-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-no">[ 04 / LIMITS & ENTERPRISE ]</p>
              <h2 id="limits-title">
                Room to build.
                <br />A path to scale.
              </h2>
            </div>
            <p>
              Start with standard file limits.
              <br />
              Talk to us when your workload needs more.
            </p>
          </div>
          <div className="limits-layout">
            <div className="limits-table">
              <div className="table-title">
                <h3>Standard file limits</h3>
                <span>PER FILE</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th scope="col">File format</th>
                    <th scope="col">Maximum size</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["PDF document", ".pdf", "100M"],
                    ["Word document", ".docx", "50M"],
                    ["Excel spreadsheet", ".xlsx", "100M"],
                    ["PowerPoint presentation", ".pptx", "100M"],
                  ].map(([label, extension, size]) => (
                    <tr key={extension}>
                      <th scope="row">
                        <span className="file-label">
                          <IconFileText size={18} />
                          <span>{label}</span>
                          <small>{extension}</small>
                        </span>
                      </th>
                      <td>{size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                Have a long document or need a higher page limit?
                <br />
                <a href={contactUrl}>
                  Check your requirements with our team{" "}
                  <IconArrowUpRight size={14} />
                </a>
              </p>
            </div>
            <div className="enterprise-card">
              <p className="section-no">BUILT AROUND YOUR WORKLOAD</p>
              <h3>Beyond the standard.</h3>
              <p>
                Custom limits, deployment, support, and SLAs.
                <br />
                Built for the way your team works.
              </p>
              <ul>
                <li>
                  <IconCheck size={16} /> Volume & custom rate limits
                </li>
                <li>
                  <IconCheck size={16} /> Dedicated or self-hosted deployment
                </li>
                <li>
                  <IconCheck size={16} /> Priority processing & support
                </li>
                <li>
                  <IconCheck size={16} /> Custom SLAs & commercial terms
                </li>
              </ul>
              <a href={contactUrl} className="button">
                Talk to our team <IconArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="section shell faq-section"
          aria-labelledby="faq-title"
        >
          <div className="faq-layout">
            <div className="faq-heading">
              <p className="section-no">[ 05 / A FEW MORE DETAILS ]</p>
              <h2 id="faq-title">
                Good questions.
                <br />
                Straight answers.
              </h2>
              <p>Still have something on your mind?</p>
              <a className="text-link" href={contactUrl}>
                Talk to a real person <IconArrowUpRight size={15} />
              </a>
            </div>
            <div className="faq-list">
              {questions.map(([question, answer], index) => (
                <details key={question} open={index === 0}>
                  <summary>
                    {question}
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </div>
          <div className="final-cta">
            <div>
              <p className="section-no">[ YOUR NEXT CHAPTER ]</p>
              <h2>Put your documents to work.</h2>
              <p>Better context for your agents. A clear price for you.</p>
            </div>
            <div>
              <a className="button" href={trialUrl}>
                Start free trial <IconArrowUpRight size={17} />
              </a>
              <a className="cta-contact" href={contactUrl}>
                Or, talk to our team <IconArrowRight size={15} />
              </a>
              <small>14 days free. No credit card required.</small>
            </div>
          </div>
        </section>
      </main>
      <footer className="shell footer">
        <a href="https://knowhereto.ai/" aria-label="Knowhere home">
          <img
            src="/assets/knowhere-back-to-top.svg"
            width="132"
            height="52"
            alt="Knowhere"
          />
        </a>
        <p>© {new Date().getFullYear()} Knowhere. All rights reserved.</p>
        <div>
          <a href={docsUrl}>
            Documentation <IconArrowUpRight size={14} />
          </a>
          <a href={contactUrl}>
            Contact <IconArrowUpRight size={14} />
          </a>
        </div>
      </footer>
    </>
  );
}
