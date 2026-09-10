import PixelCard from '../components/PixelCard';
import { HeroDataStream } from '../components/hero-data-stream'
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "../components/Header";
import { GridController } from "../components/GridController";
import { Footer } from "../components/Footer";
import { CheckCircleFill } from "../components/CheckCircleFill";
import type { CSSProperties } from "react";
import {
  IconArrowsHorizontal,
} from "@tabler/icons-react";

export const Route = createFileRoute("/")({ component: App });

const contactUrl = "mailto:team@knowhereto.ai";
const money = (pages: number) =>
  (pages * 0.015).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
const number = (value: number) => value.toLocaleString("en-US");

function Calculator() {
  const [pages, setPages] = useState(500);
  const [input, setInput] = useState("500");
  const progress = ((pages - 100) / 9900) * 100;
  const documents = (pageSize: number) => {
    const count = Math.floor(pages / pageSize);
    return `${number(count)} ${count === 1 ? "document" : "documents"}`;
  };
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
            <p className="section-no">[ COST CALCULATOR ]</p>
            <h2 id="calculator-title">Your documents. Your budget.</h2>
          </div>
          <p>
            From your first experiment to your next workflow. See exactly what
            your pages could cost.
          </p>
        </div>
        <div className="calculator">
          <div className="calculator-top">
            <div className="estimated">
              <span>Estimated cost ($0.015 per page)</span>
              <output aria-live="polite" className="total">
                {money(pages)}
              </output>
            </div>
            <div className="calculator-config">
              <label htmlFor="page-count">Number of pages</label>
              <div className="page-input">
                <input
                  id="page-count"
                  type="number"
                  min="100"
                  max="10000"
                  step="100"
                  value={input}
                  style={{ "--page-digits": Math.max(3, input.length) } as CSSProperties}
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
                />
              </div>
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
          <dl className="calculator-facts" aria-live="polite">
            <div><dt>Estimated budget</dt><dd>{money(pages)}</dd></div>
            <div><dt>100-page PDFs</dt><dd>{documents(100)}</dd></div>
            <div><dt>500-page documents</dt><dd>{documents(500)}</dd></div>
            <div><dt>Commitment</dt><dd>No minimum</dd></div>
          </dl>
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
          className="overview"
          aria-labelledby="hero-title"
        >
          <HeroDataStream />
          <div className="hero-copy">
            <h1 id="hero-title">
              Better document context.
              <br />
              <span>Not a bigger bill.</span>
            </h1>
            <p className="lede">
              Simple, transparent pricing for your document workflows. Pay only
              for what you use. No hidden fees, no complex tiers.
            </p>
          </div>
          <div className="rate-card">
            <a className="button" href="https://knowhere-login.knowhere-landing.workers.dev/">Start free trial</a>
            <div className="rate-rules">
            <div className="rate-stat rate-rule">
              <p><CheckCircleFill size={20} /> No subscription fee</p>
            </div>
            <div className="rate-stat rate-rule">
              <p><CheckCircleFill size={20} /> No minimum commitment</p>
            </div>
            <div className="rate-promises rate-rule">
              <p><CheckCircleFill size={20} /> Only successful jobs are charged</p>
            </div>
            </div>
          </div>
        </section>
        <Calculator />
        <section
          id="how-it-works"
          className="section shell"
          aria-labelledby="how-title"
        >
          <div className="section-heading">
            <div>
              <p className="section-no">[ HOW PRICING WORKS ]</p>
              <h2 id="how-title">Clear from page to payment.</h2>
            </div>
            <p>
              No guesswork. Here’s what counts, and when your credits are used.
            </p>
          </div>
          <div className="billing-matrix">
            <article className="billing-card" aria-labelledby="billing-plan-title">
              <div className="billing-card-top">
                <header className="billing-card-heading">
                  <h3 id="billing-plan-title">Pay as you go</h3>
                  <div className="billing-plan-price">
                    <p>$1.50 <span>/ 100 pages</span></p>
                  </div>
                </header>
                <aside className="billing-custom" aria-labelledby="billing-custom-title">
                  <div className="billing-custom-heading">
                    <h4 id="billing-custom-title">Built for the way your team works.</h4>
                  </div>
                  <div className="billing-custom-copy">
                    <p>Custom limits, deployment, support, and SLAs.</p>
                    <a href={contactUrl}>Talk to our team</a>
                  </div>
                </aside>
              </div>
              <div className="billing-rows" role="group" aria-labelledby="billing-rules-title">
                <p className="sr-only" id="billing-rules-title">Billing rules</p>
                <section className="billing-row" aria-labelledby="billing-rule-title">
                  <div className="billing-row-copy">
                    <h4 id="billing-rule-title">Start with your pages</h4>
                    <p>
                      Pricing is based on processed pages, not the number of files
                      you upload.
                    </p>
                  </div>
                  <div className="billing-row-charge">
                    <p className="billing-row-price">$0.015 <span className="billing-row-unit">/ page</span></p>
                  </div>
                </section>
                <section className="billing-row" aria-labelledby="billing-completed-title">
                  <div className="billing-row-copy">
                    <h4 id="billing-completed-title">Pay for completed work</h4>
                    <p>Page credits are deducted when a job completes successfully.</p>
                  </div>
                  <div className="billing-row-charge">
                    <p className="billing-row-result billing-row-success">Charged</p>
                  </div>
                </section>
                <section className="billing-row" aria-labelledby="billing-failed-title">
                  <div className="billing-row-copy">
                    <h4 id="billing-failed-title">Failed job? No charge.</h4>
                    <p>Failed jobs don’t consume credits.</p>
                  </div>
                  <div className="billing-row-charge">
                    <p className="billing-row-price">$0</p>
                  </div>
                </section>
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
              <p className="section-no">[ LIMITS & ENTERPRISE ]</p>
              <h2 id="limits-title">
                Room to build. A path to scale.
              </h2>
            </div>
            <p>
              Start with standard file limits. Talk to us when your workload needs more.
            </p>
          </div>
          <div className="limits-layout">
            <div className="limits-table" aria-labelledby="standard-limits-title">
              <h3 id="standard-limits-title">Standard file limits</h3>
              <table>
                <thead><tr><th scope="col">File format</th><th scope="col">Maximum size</th></tr></thead>
                <tbody>
                  {[
                    ["PDF document", ".pdf", "100M"],
                    ["Word document", ".docx", "50M"],
                    ["Excel spreadsheet", ".xlsx", "50M"],
                    ["PowerPoint presentation", ".pptx", "100M"],
                  ].map(([label, extension, limit]) => (
                    <tr key={extension}><th scope="row">{label}<small>{extension}</small></th><td>{limit}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PixelCard variant="pink" className="enterprise-card">
              <div className="enterprise-card-top">
                <h3>Enterprise custom pricing</h3>
                <p>Built for your team.</p>
              </div>
              <div className="enterprise-card-features">
                <ul>
                <li>
                    <CheckCircleFill size={20} />
                    <div><strong>Volume & custom limits</strong><p>Scale with your traffic.</p></div>
                </li>
                <li>
                    <CheckCircleFill size={20} />
                    <div><strong>Dedicated deployment</strong><p>Deploy your way.</p></div>
                </li>
                <li>
                    <CheckCircleFill size={20} />
                    <div><strong>Priority processing & support</strong><p>Faster jobs. Direct support.</p></div>
                </li>
                <li>
                    <CheckCircleFill size={20} />
                    <div><strong>Custom SLAs & terms</strong><p>Terms tailored to your needs.</p></div>
                </li>
                </ul>
              </div>
              <div className="enterprise-card-action">
                <a href={contactUrl} className="button">Contact Sales</a>
              </div>
            </PixelCard>
          </div>
        </section>
        <section
          id="faq"
          className="section shell faq-section"
          aria-labelledby="faq-title"
        >
          <div className="faq-layout">
            <div className="faq-heading">
              <p className="section-no">[ A FEW MORE DETAILS ]</p>
              <h2 id="faq-title">
                Good questions. Straight answers.
              </h2>
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
        </section>
        <div className="final-cta" id="final-cta" aria-labelledby="final-title">
          <div className="final-cta-inner">
            <div className="final-cta-copy">
            <h2 id="final-title">Put your documents to work.</h2>
            <p className="final-cta-description">
              Better context for your agents. A clear price for you.
            </p>
            <div className="final-cta-actions">
              <a className="button" href="https://knowhere-login.knowhere-landing.workers.dev">Start free trial</a>
              <a className="button button-secondary" href={contactUrl}>Book a demo</a>
            </div>
            </div>
            <div className="final-cta-detail">
              <ul className="final-cta-benefits">
                {["Free 14-day trial", "Custom limits and deployment", "No credit card required", "Direct support from our team"].map(item => (
                  <li key={item}><CheckCircleFill size={20} /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <GridController />
      </main>
      <Footer />
    </>
  );
}
