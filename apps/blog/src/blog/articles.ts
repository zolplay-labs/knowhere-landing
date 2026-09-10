// Editorial snapshot of blog.knowhereto.ai. Original articles remain canonical.
export const articles = [
  {
    title: 'How to Choose a PDF Parser API for AI Agents',
    category: 'Research', date: '2026-08-10',
    slug: 'how-to-choose-a-pdf-parser-api-for-ai-agents',
    coverSource: '/covers/custom/2.png',
    description: 'Accuracy, layout structure, latency, and cost. A practical guide to the trade-offs that matter when your agents read documents.',
  },
  {
    title: 'Knowhere Can Now Plug Into Your Agent',
    category: 'Product', date: '2026-07-09',
    slug: 'knowhere-can-now-plug-into-your-agent',
    coverSource: '/covers/custom/3.png',
    description: 'A shared document brain for agents in Cursor, Claude, and Codex. Meet Knowhere Notebook and MCP.',
  },
  {
    title: 'Why RAG needs a World Model too',
    category: 'Research', date: '2026-06-11',
    slug: 'why-rag-needs-a-world-model-too',
    coverSource: '/covers/custom/1.png',
    description: 'Document agents need persistent world state, not just retrieved observations.',
  },
  {
    title: 'Does 90% of a RAG Project Have Nothing to Do With the Model?',
    category: 'Research', date: '2026-06-26',
    slug: 'does-90-of-a-rag-project-have-nothing-to-do-with-the-model',
    originalCover: true,
    coverSource: '/covers/custom/2.png',
    description: 'Production RAG quality is mostly evaluation and data work—not model swaps.',
  },
  {
    title: '1,500+ Stars in a Month: What Knowhere Adds Beyond MinerU',
    category: 'Product', date: '2026-06-17',
    slug: 'what-knowhere-adds-beyond-mineru',
    coverSource: '/covers/custom/5.png',
    description: 'Beyond parsing: tree hierarchy, multimodal assets, and agentic retrieval.',
  },
  {
    title: 'The Four Eras of OCR: From Manual Features to Multimodal Large Models',
    category: 'News', date: '2026-06-10', slug: 'the-four-eras-of-ocr',
    coverSource: '/covers/custom/4.png',
    description: 'A history of text recognition, from mechanical templates to multimodal models.',
  },
  {
    title: 'Is SkillOpt learning a skill or adjusting a prompt?',
    category: 'Research', date: '2026-06-10',
    slug: 'is-skillopt-learning-a-skill-or-adjusting-a-prompt',
    coverSource: '/covers/custom/1.png',
    description: 'Is editing skill.md real skill learning or prompt optimization?',
  },
  {
    title: 'SkillOpt: Building Agents Takes More Than Just Prompts and Fine-Tuning',
    category: 'News', date: '2026-06-03',
    slug: 'skillopt-building-agents-takes-more-than-prompts',
    coverSource: '/covers/custom/6.png',
    description: 'A closer look at treating skills as trainable text parameters.',
  },
  {
    title: 'How to Build RAG in Harness Engineering',
    category: 'Research', date: '2026-05-28',
    slug: 'how-to-build-rag-in-harness-engineering',
    originalCover: true,
    coverSource: '/covers/custom/2.png',
    description: 'Rethinking RAG failures rooted in ingestion and structure loss.',
  },
  {
    title: 'AI Hallucinations Aren’t Always the Model’s Fault',
    category: 'Product', date: '2026-05-22',
    slug: 'ai-hallucinations-arent-always-the-models-fault',
    coverSource: '/covers/custom/7.png',
    description: 'Why structured document memory helps where flat chunking falls short.',
  },
  {
    title: 'Our document parsing engine is now open source',
    category: 'Product', date: '2026-05-11',
    slug: 'document-parsing-engine-now-open-source',
    coverSource: '/covers/custom/3.png',
    description: 'Tree-like parsing, table fidelity, and a new foundation for your agents.',
  },
  {
    title: 'Why Raw Text Is the Wrong Data Layer for RAG (and What to Do Instead)',
    category: 'Product', date: '2026-04-22',
    slug: 'why-raw-text-is-the-wrong-data-layer-for-rag',
    coverSource: '/covers/custom/5.png',
    description: 'Parse, semantically chunk, and ship RAG-ready manifests with Knowhere.',
  },
] as const;

export type Article = typeof articles[number];

export function articleUrl(article: Article) {
  return `https://blog.knowhereto.ai/${article.date.replaceAll('-', '/')}/${article.slug}/`;
}

export function articleDate(date: string, month: 'short' | 'long' = 'short') {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    month, day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}
