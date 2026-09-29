// Serverless chat endpoint for Mohamed Ali Aoun's portfolio.
// Runs on Vercel as /api/chat. Calls Groq (free tier) with an OpenAI-compatible API.
// The API key is read from the environment variable GROQ_API_KEY (set it in Vercel, never in this file).
//
// To switch to Mistral instead of Groq:
//   - API_URL  -> 'https://api.mistral.ai/v1/chat/completions'
//   - MODEL    -> 'mistral-small-latest'
//   - env var  -> use MISTRAL_API_KEY (and update process.env below)

const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile'; // Groq free model. If this name ever errors, try 'llama-3.1-8b-instant'.

// --- Grounding: everything the assistant is allowed to know about Dali ---
const DALI_CONTEXT = `
IDENTITY
- Full name: Mohamed Ali Aoun. Goes by Dali. Based in Tunis, Tunisia.
- Role: AI Engineer. Master's student in Artificial Intelligence and Data Science.
- Looking for: an end-of-studies internship in AI engineering (stage de fin d'etudes), in France or internationally.
- Contact: mohamed-ali.aoun@dauphine.eu. LinkedIn: linkedin.com/in/mohamed-ali-aoun.
- Languages spoken: Arabic (native), French (fluent), English (professional).

EDUCATION
- Universite Paris Dauphine-PSL (Tunis), MSc Artificial Intelligence and Data Science, 2025 to present. Top of his class (major de promotion).
- Institut Superieur d'Informatique El Manar, Bachelor in Computer Science, 2021 to 2024.
- Selected coursework: Generative AI, NLP, Deep Learning for Image Analysis, Optimization for Machine Learning, Monte Carlo Search and Games, Knowledge Graphs, Data Analysis, Statistical Learning, Time Series, Data Mining.

EXPERIENCE
- Kin'Yu Consulting, AI Engineer on Oracle Cloud (Jun 2026 to Sep 2026). Built LAWAI, an end-to-end document verification and understanding pipeline for law firms on Oracle Cloud Infrastructure. OCR and structured extraction with strict Pydantic interface contracts and a per-document-type schema architecture, agentic OCI Integration workflows, and a client-facing Oracle APEX app backed by Oracle Database 26ai. Containerized with Docker.
- VistaDeep, AI Engineer (freelance) (May 2026 to Jul 2026). Built a supply-chain risk-intelligence assistant with a multi-agent architecture (Events, Index, Report, Formulation) on a hand-rolled Python orchestrator. LLM-based routing (direct OpenAI API calls, JSON-mode agent selection) with a keyword fallback, agents run concurrently via asyncio, data retrieved via Text-to-SQL against PostgreSQL on Supabase (read-only role), executions traced to a dedicated table for observability. He also ran a vector-search experiment with Qdrant but Text-to-SQL won on his benchmark.
- Opus Lab, AI Instructor (Aug 2026 to Sep 2026). Designed and delivered a hands-on AI development bootcamp for students aged 15 to 19 with no coding background, guiding each one to build their first chatbot and first AI agent.
- UmanLink Digital Service, AI Software Developer (Sep 2024 to Mar 2025). Built LLM and RAG solutions: recruitment matching (Orientalent), a multi-agent e-commerce assistant, and a full-stack call-center analytics tool that saved 40+ hours a month.
- Medianet, Data Science Intern (Feb 2024 to Jul 2024). Built an AI-powered SEO reporting platform that cut processing time from days to about 3 minutes, with NLP at 97 percent accuracy.
- Croki (EdTech startup), Co-founder, Operations and Events (Sep 2023 to Sep 2025). Ran operations end to end: sessions, recruiting professors, content, scheduling, logistics and marketing. Flagship initiatives (Bac to the Future, Orientour) reached 650+ high-school students.

PROJECTS AND THEIR STACKS
- LAWAI (Kin'Yu): Python, Pydantic, LLM Applications, Prompt Engineering, OCI Document Understanding, OCI Generative AI, OCI Integration, Oracle APEX, Oracle Database 26ai, Oracle Cloud, Docker, Git.
- Supply-Chain Risk Assistant (VistaDeep): Python, OpenAI API, asyncio, Multi-Agent Systems, Text-to-SQL, SQL, PostgreSQL, Supabase, Qdrant, Prompt Engineering, Git.
- FIFA World Cup 2026 Prediction Engine (personal): probabilistic match and tournament prediction combining a Dixon-Coles model with XGBoost, Monte Carlo simulations and a dedicated penalty-shootout model. Python, scikit-learn, Pandas, NumPy, Jupyter. Documented on LinkedIn.
- Call-Center Analytics Tool (UmanLink): full-stack, Python back-end and Flask interface, automated pipelines for cleaning, processing and visualizing data. Pandas, NumPy, Matplotlib, Plotly, Git. Saved 40+ hours a month.
- Orientalent (UmanLink): intelligent recruitment platform, OCR and RAG-based candidate matching from natural-language job descriptions. Python, FastAPI, LangChain, RAG, DeepSeek-R1, OpenCV, MongoDB, Angular, Git.
- E-commerce Chatbot (UmanLink): multi-agent assistant for product search, order tracking and FAQ over a vector database and RAG. Python, LangChain, GPT-4, Text-to-SQL, Chroma, Streamlit, Git.
- AI Swimming Assistant (Esperance Sportive de Tunis): full-stack AI chatbot for the EST swimming team, session, progress and nutrition tracking with personalized programs, plus a search engine over 38,000+ historical competition records. LLaMA 3.1, LangChain, RAG, Text-to-SQL, Streamlit, Web Scraping, Agile. Built in Agile, Git.
- Seam Carving (academic, graph theory): content-aware image resizing with graph modeling (DAG) and dynamic programming. Python.
- Social-Media Perception Study (academic, data analysis): questionnaire design to statistics, preprocessing, PCA (ACP), MCA (ACM) and clustering. R.
- SEO Report Automation (Medianet): analysis, dashboards and AI-generated summaries. Python, NLP, GPT-3.5, BeautifulSoup, Web Scraping, Power BI.

SKILLS
- LLMs and GenAI: LLM Applications, RAG, Prompt Engineering, Multi-Agent Systems, Text-to-SQL, LangChain, OpenAI API, GPT-4, LLaMA 3.1, DeepSeek-R1.
- Machine Learning and Stats: Machine Learning, Statistical Learning, NLP, Time Series, PCA/MCA, Clustering, XGBoost, Monte Carlo, scikit-learn.
- Languages and Frameworks: Python (primary), FastAPI, Pydantic, asyncio, Flask, Streamlit, R, Java, SQL, C.
- Data and Libraries: Pandas, NumPy, Matplotlib, Plotly, OpenCV, BeautifulSoup, Web Scraping, Data Visualization, Power BI.
- Databases and Vector Stores: PostgreSQL, MySQL, MongoDB, Supabase, Chroma, Qdrant, Vector Databases.
- Cloud, DevOps and Tools: Oracle Cloud (OCI), OCI Document Understanding, OCI Generative AI, OCI Integration, Oracle APEX, Oracle Database 26ai, Docker, Linux/shell (entry level), Git, Jupyter, LaTeX, Agile/Scrum.

LEADERSHIP AND COMMUNITY
- Croki: co-founder, operations and events (see above).
- Enactus ISI, Finance and Events Lead and Pitching Lead (2021 to 2023). Led Career Rock-IT, a national career fair with 500+ attendees and 50+ members, and pitched at national and world competitions with podium placements.
- Don Bosco Manouba and Tunis, Volunteer Youth Animator (2017 to 2020). Cultural, sport and educational events for underserved youth, starting at fifteen, plus Tunisia-Italy exchange programs.
- FITT Timisoara, volunteer at an EU-funded international youth festival in Romania (2025). Dauphine Tunis Ambassador (2025 to present).

WHAT DRIVES HIM
- Building things people actually use. The same thread runs through his AI work and the communities he runs: start from a real problem and work until it is solved. Big football fan (Barcelona), which is why he built the World Cup prediction engine for fun.
`;

const SYSTEM_PROMPT = `You are the friendly AI assistant embedded in Mohamed Ali Aoun's (Dali) personal portfolio. Your job is to answer questions from recruiters and visitors about Dali, based ONLY on the CONTEXT below.

Rules:
- Be warm, concise and professional. Default to 2 to 4 sentences. Give more detail only when asked.
- Answer only from the context. If a detail is not there, say you do not have that specific detail and suggest emailing Dali at mohamed-ali.aoun@dauphine.eu. Never invent facts, numbers, employers or dates.
- Speak about Dali in the third person ("he", "Dali").
- If asked something unrelated to Dali or his work, gently steer back to his background.
- Never use em dashes. Use commas, colons, parentheses or periods instead.

CONTEXT:
${DALI_CONTEXT}`;

// --- soft, best-effort rate limiting (free-tier key means no billing risk anyway) ---
const RATE = new Map();
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 12;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!process.env.GROQ_API_KEY) {
    res.status(200).json({ reply: "The assistant is not configured yet: the site owner still needs to add the GROQ_API_KEY environment variable in Vercel." });
    return;
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const rec = RATE.get(ip);
  if (rec && now - rec.ts < WINDOW_MS) {
    if (rec.count >= MAX_PER_WINDOW) {
      res.status(200).json({ reply: "I'm getting a lot of questions at once. Please try again in a minute." });
      return;
    }
    rec.count++;
  } else {
    RATE.set(ip, { count: 1, ts: now });
  }

  try {
    const body = req.body || {};
    let messages = Array.isArray(body.messages) ? body.messages : [];
    messages = messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content.slice(0, 1000) }));

    const payload = {
      model: MODEL,
      temperature: 0.4,
      max_tokens: 400,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages]
    };

    const r = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!r.ok) {
      res.status(200).json({ reply: "Sorry, I could not reach the AI service just now. You can always email Dali at mohamed-ali.aoun@dauphine.eu." });
      return;
    }

    const data = await r.json();
    const reply = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '').trim()
      || "I'm not sure about that one. Feel free to email Dali at mohamed-ali.aoun@dauphine.eu.";
    res.status(200).json({ reply });
  } catch (e) {
    res.status(200).json({ reply: "Something went wrong on my side. Please try again in a moment, or email Dali at mohamed-ali.aoun@dauphine.eu." });
  }
};
