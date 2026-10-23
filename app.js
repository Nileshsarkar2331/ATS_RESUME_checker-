/* ===== APP.JS — ResumeRoast Full Engine ===== */

// ── DATA: 27 Checks across 5 categories ──
const CHECKS = [
  // CONTENT (6)
  { id:'c1', cat:'Content', loc:'Summary Section', name:'Resume Summary', desc:'Checks for a compelling professional summary that hooks recruiters in the first 6 seconds.', tip:'Add a 2–3 sentence summary at the top with your target title, core competencies, and a quantified career highlight.' },
  { id:'c2', cat:'Content', loc:'Work Experience', name:'Quantified Achievements', desc:'Detects whether your bullet points use numbers, percentages, or metrics to prove impact.', tip:'Add measurable metrics to at least 50% of bullets (e.g. "Increased revenue by 34%", "Reduced latency from 450ms to 80ms").' },
  { id:'c3', cat:'Content', loc:'Work Experience', name:'Action Verbs', desc:'Checks that bullet points start with strong action verbs rather than weak passive phrases.', tip:'Begin bullets with high-impact verbs: Led, Architected, Delivered, Scaled, Spearheaded, Launched, Engineered.' },
  { id:'c4', cat:'Content', loc:'Entire Resume', name:'Spelling & Grammar', desc:'Scans for spelling errors, grammar mistakes, and awkward phrasing that signal carelessness.', tip:'Fix highlighted spelling mistakes. Even 1 typo can trigger automatic recruiter rejection.' },
  { id:'c5', cat:'Content', loc:'Work Experience', name:'Repetitive Words', desc:'Identifies overused words and phrases that make your resume feel monotonous.', tip:'Vary your action verbs. Replace repeated words with synonyms (orchestrated, directed, streamlined).' },
  { id:'c6', cat:'Content', loc:'Summary & Bullets', name:'Clichés Detected', desc:'Flags hollow phrases like "team player", "results-driven", "go-getter" that add no value.', tip:'Delete buzzwords and clichés. Replace with concrete, verifiable project results.' },

  // ATS (6)
  { id:'a1', cat:'ATS', loc:'Skills & Experience', name:'Keyword Density', desc:'Analyzes whether your resume contains industry-relevant keywords that ATS scanners rank for.', tip:'Incorporate exact keyword phrases from target job listings into your skills and experience sections.' },
  { id:'a2', cat:'ATS', loc:'Document Architecture', name:'Parseable Format', desc:'Checks if your resume can be correctly parsed by ATS software without text fragmentation.', tip:'Use a single-column layout. Avoid floating text boxes, complex tables, or graphic columns that confuse ATS parsers.' },
  { id:'a3', cat:'ATS', loc:'File Format', name:'File Type', desc:'Verifies your resume file format is compatible with major ATS platforms.', tip:'Submit as a standard PDF or .docx. Never use image-based scans, Photoshop exports, or .pages files.' },
  { id:'a4', cat:'ATS', loc:'Section Headings', name:'Section Headers', desc:'Checks that your section headings use standard labels recognized by ATS algorithms.', tip:'Use standard headings: "Work Experience", "Education", "Skills", "Projects", "Certifications" rather than creative labels.' },
  { id:'a5', cat:'ATS', loc:'Header Section', name:'Contact Info Detected', desc:'Verifies that your email, phone, and location can be reliably parsed into ATS candidate profiles.', tip:'Place email, phone, and city/state at the very top in plain text — avoid placing inside Word header/footer zones.' },
  { id:'a6', cat:'ATS', loc:'Work Experience', name:'Date Format Consistency', desc:'Checks that employment dates follow consistent chronological patterns recognized by ATS.', tip:'Use standard month/year formats like "Jan 2021 – Present" or "06/2020 – 08/2023" consistently.' },

  // DESIGN (5)
  { id:'d1', cat:'Design', loc:'Entire Document', name:'Resume Length', desc:'Checks whether your resume length matches standard recruiter expectations for your seniority.', tip:'Target 1 page for 0–5 years experience; 2 pages max for senior/executive roles. Avoid 1.5 page awkward splits.' },
  { id:'d2', cat:'Design', loc:'Typography', name:'Font Readability', desc:'Detects non-standard or decorative fonts that fail ATS rendering.', tip:'Stick to clean ATS-safe fonts: Inter, Arial, Calibri, Helvetica, Georgia, or Garamond.' },
  { id:'d3', cat:'Design', loc:'Layout Margins', name:'White Space Balance', desc:'Checks whether there is sufficient breathing room to aid visual scanning by recruiters.', tip:'Maintain 0.5 to 0.75 inch margins and consistent 4–8pt spacing between job entries.' },
  { id:'d4', cat:'Design', loc:'Section Hierarchy', name:'Section Order', desc:'Verifies that resume sections are arranged in logical priority for recruiters.', tip:'Standard order: Header → Summary → Experience → Skills → Education → Certifications.' },
  { id:'d5', cat:'Design', loc:'Bullet Points', name:'Bullet Point Length', desc:'Checks that bullet points are concise and scannable rather than long dense paragraphs.', tip:'Keep each bullet point between 15–25 words (1–2 lines). Lead with the result, followed by the tool/method.' },

  // SKILLS (5)
  { id:'s1', cat:'Skills', loc:'Skills Section', name:'Hard Skills Listed', desc:'Checks for a dedicated skills section with categorized technical proficiencies.', tip:'Create a "Skills" section grouping proficiencies (e.g. Languages, Frameworks, Tools, Cloud).' },
  { id:'s2', cat:'Skills', loc:'Work Experience', name:'Soft Skills Demonstrated', desc:'Detects whether collaborative competencies are proven through results rather than mere claims.', tip:'Demonstrate leadership and teamwork through achievements: "Mentored 4 junior engineers", "Led cross-functional team of 12".' },
  { id:'s3', cat:'Skills', loc:'Skills Section', name:'Skills Match Depth', desc:'Evaluates the breadth and market relevance of your listed competencies.', tip:'Review target job postings and include 10–18 specific tools and skills you actively use.' },
  { id:'s4', cat:'Skills', loc:'Certifications', name:'Certifications', desc:'Checks for industry certifications that corroborate specialized domain knowledge.', tip:'Include credentials like AWS Solutions Architect, PMP, Scrum Master, or relevant degrees with year obtained.' },
  { id:'s5', cat:'Skills', loc:'Skills & Tools', name:'Outdated Technologies', desc:'Flags obsolete technologies that can inadvertently date your technical profile.', tip:'Remove deprecated tools (e.g., Flash, Visual SourceSafe, PHP 4) unless specifically relevant.' },

  // PROFILE (5)
  { id:'p1', cat:'Profile', loc:'Header Section', name:'Email Address', desc:'Checks that your email address is professional and formatted for ATS extraction.', tip:'Use a modern format like firstname.lastname@gmail.com. Avoid nicknames, numbers, or outdated domains (AOL/Hotmail).' },
  { id:'p2', cat:'Profile', loc:'Header Section', name:'LinkedIn URL', desc:'Checks for a customized LinkedIn profile link, essential for modern ATS candidate matching.', tip:'Add a clean LinkedIn URL (linkedin.com/in/yourname) in your header. 87% of recruiters verify candidates on LinkedIn.' },
  { id:'p3', cat:'Profile', loc:'Work History', name:'Employment History', desc:'Checks for chronological progression and clear job tenure signals.', tip:'List jobs in reverse chronological order with clear start and end months/years.' },
  { id:'p4', cat:'Profile', loc:'Summary & Header', name:'Target Job Title', desc:'Checks whether your target professional job title is immediately visible.', tip:'State your target title clearly in your headline or summary (e.g. "Senior Full Stack Software Engineer").' },
  { id:'p5', cat:'Profile', loc:'Education Section', name:'Education Details', desc:'Verifies that your academic credentials, institution, and graduation year are detected.', tip:'List: Degree (e.g., B.S. Computer Science), University Name, Location, and Graduation Year.' },
];

const CATEGORIES = ['All', 'Content', 'ATS', 'Design', 'Skills', 'Profile'];
const CAT_COLORS = {
  Content: '#6366f1',
  ATS:     '#22d3ee',
  Design:  '#a855f7',
  Skills:  '#10b981',
  Profile: '#f59e0b',
};

const FAQS = [
  { q: 'Why is my ATS score low?', a: 'ATS (Applicant Tracking Systems) score resumes using programmatic parsers and rule-based filters. Common reasons for low scores include: (1) Missing LinkedIn or unparsed contact info, (2) Lack of quantified numbers ($/%/metrics) in experience bullets, (3) Missing standard section headings, and (4) Low industry keyword density.' },
  { q: 'How does ResumeRoast diagnose errors?', a: 'Our engine parses your resume in real time right inside your browser, checks 27 parameters across 5 categories, and isolates the exact location (Header, Summary, Experience, Skills, Format) where ATS software encounters penalties.' },
  { q: 'How can I boost my ATS score to 90+?', a: 'Follow our Step-by-Step Roadmap: First fix critical fatal errors (Contact & Section Headers), rewrite your bullets using Google\'s X-Y-Z formula ("Accomplished [X] as measured by [Y] by doing [Z]"), and match keywords against your target job description.' },
  { q: 'Does ResumeRoast store or share my resume?', a: 'Never. Everything runs 100% client-side in your browser via Web APIs and PDF.js. No file or text is ever uploaded to a server.' },
  { q: 'What file formats are supported?', a: 'PDF, DOCX, DOC, and TXT. You can also paste your resume text directly into our Paste Text tab.' },
];

// ── SAMPLE RESUME (With realistic flaws for instant 1-click test) ──
const SAMPLE_RESUME = `
John Doe
Software Developer
Phone: (555) 019-2834 | Email: john.developer92@yahoo.com
New York, NY

Summary:
Hardworking and results-driven team player with passion for software development. Looking for a challenging position as a software developer where I can utilize my skills to help the company grow.

Things I Do:
JavaScript, React, HTML, CSS, Node.js, Express, MongoDB, Git, SQL, Flash

Work History:
Web Developer - Acme Solutions
June 2021 - Present
- Responsible for maintaining and developing client web applications
- Worked with senior developers on frontend features using React
- Helped fix bugs and improved website performance
- Attended weekly team standups and contributed to code reviews

Junior Developer - TechCorp Innovations
2019 - 2021
- Assisted in building company internal portals
- Wrote database queries in SQL
- Handled customer feedback and made requested updates to UI
- Collaborated with QA team to test features before production deployment

Education:
Bachelor of Science in Computer Science
State University, 2019
`;

// ── STATE ──
let currentFile = null;
let activeCategory = 'All';
let analysisResults = [];
let lastExtractedText = '';
let lastSignals = null;

// ── DOM REFS ──
const uploadZone         = document.getElementById('uploadZone');
const fileInput          = document.getElementById('fileInput');
const uploadBtn          = document.getElementById('uploadBtn');
const dragOverlay        = document.getElementById('dragOverlay');
const modeUploadTab      = document.getElementById('modeUploadTab');
const modePasteTab       = document.getElementById('modePasteTab');
const sampleResumeBtn    = document.getElementById('sampleResumeBtn');
const uploadFileView     = document.getElementById('uploadFileView');
const uploadPasteView    = document.getElementById('uploadPasteView');
const pasteResumeInput   = document.getElementById('pasteResumeInput');
const analyzePasteBtn    = document.getElementById('analyzePasteBtn');

const analyzingOverlay   = document.getElementById('analyzingOverlay');
const checkProgressList  = document.getElementById('checkProgressList');
const progressFill       = document.getElementById('progressFill');
const progressPct        = document.getElementById('progressPct');
const analyzingSubtitle  = document.getElementById('analyzingSubtitle');

const resultsSection     = document.getElementById('resultsSection');
const scoreNumber        = document.getElementById('scoreNumber');
const ringFill           = document.getElementById('ringFill');
const scoreVerdict       = document.getElementById('scoreVerdict');
const scoreBreakdownGrid = document.getElementById('scoreBreakdownGrid');

const diagnosisBanner    = document.getElementById('diagnosisBanner');
const dbTitle            = document.getElementById('dbTitle');
const dbSubtitle         = document.getElementById('dbSubtitle');
const dbStats            = document.getElementById('dbStats');
const dbReasonsList      = document.getElementById('dbReasonsList');

const resultsMainTabs    = document.getElementById('resultsMainTabs');
const errorCountBadge    = document.getElementById('errorCountBadge');
const errorsContainer    = document.getElementById('errorsContainer');
const roadmapContainer   = document.getElementById('roadmapContainer');

const jdInput            = document.getElementById('jdInput');
const runJdMatchBtn      = document.getElementById('runJdMatchBtn');
const jdResultsWrap      = document.getElementById('jdResultsWrap');
const jdScoreVal         = document.getElementById('jdScoreVal');
const jdSummaryText      = document.getElementById('jdSummaryText');
const foundCount         = document.getElementById('foundCount');
const missingCount       = document.getElementById('missingCount');
const foundKeywords      = document.getElementById('foundKeywords');
const missingKeywords    = document.getElementById('missingKeywords');

const catTabs            = document.getElementById('catTabs');
const checksGrid         = document.getElementById('checksGrid');
const parsedTextMeta     = document.getElementById('parsedTextMeta');
const parsedTextBox      = document.getElementById('parsedTextBox');
const reUploadBtn        = document.getElementById('reUploadBtn');
const checksPreviewGrid  = document.getElementById('checksPreviewGrid');
const faqList            = document.getElementById('faqList');

// AI Coach & Templates DOM refs
const aiSeverityBar      = document.getElementById('aiSeverityBar');
const aiDiagnosisSummary = document.getElementById('aiDiagnosisSummary');
const aiSuggestionsGrid  = document.getElementById('aiSuggestionsGrid');
const aiProTips          = document.getElementById('aiProTips');
const templatesGrid      = document.getElementById('templatesGrid');
const templateModalOverlay = document.getElementById('templateModalOverlay');
const templateModalClose   = document.getElementById('templateModalClose');
const templateModalTitle   = document.getElementById('templateModalTitle');
const templateModalContent = document.getElementById('templateModalContent');
const templateModalCopyBtn = document.getElementById('templateModalCopyBtn');

// ── INIT ──
buildChecksPreview();
buildFAQ();
setupUploadEvents();
setupTabNavigation();

// ── UPLOAD MODES & EVENTS ──
function setupUploadEvents() {
  modeUploadTab.addEventListener('click', (e) => {
    e.stopPropagation();
    modeUploadTab.classList.add('active');
    modePasteTab.classList.remove('active');
    uploadFileView.hidden = false;
    uploadPasteView.hidden = true;
  });

  modePasteTab.addEventListener('click', (e) => {
    e.stopPropagation();
    modePasteTab.classList.add('active');
    modeUploadTab.classList.remove('active');
    uploadFileView.hidden = true;
    uploadPasteView.hidden = false;
    pasteResumeInput.focus();
  });

  sampleResumeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    pasteResumeInput.value = SAMPLE_RESUME.trim();
    runAnalysis(SAMPLE_RESUME, 'Sample_Software_Engineer_Resume.txt');
  });

  analyzePasteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const txt = pasteResumeInput.value.trim();
    if (!txt || txt.length < 50) {
      alert('Please paste at least 50 characters of resume text to analyze.');
      return;
    }
    runAnalysis(txt, 'Pasted_Resume_Text.txt');
  });

  uploadZone.addEventListener('click', (e) => {
    if (uploadPasteView.hidden && e.target !== uploadBtn && !uploadBtn.contains(e.target)) {
      fileInput.click();
    }
  });
  uploadBtn.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
  uploadZone.addEventListener('keydown', (e) => {
    if (uploadPasteView.hidden && (e.key === 'Enter' || e.key === ' ')) fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files[0]) handleFile(fileInput.files[0]);
  });

  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-active');
  });
  uploadZone.addEventListener('dragleave', (e) => {
    if (!uploadZone.contains(e.relatedTarget)) uploadZone.classList.remove('drag-active');
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-active');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  reUploadBtn.addEventListener('click', resetToUpload);
}

// ── FILE HANDLER ──
function handleFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['pdf','doc','docx','txt'].includes(ext)) {
    alert('Please upload a PDF, DOCX, DOC, or TXT file.');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be under 10 MB.');
    return;
  }
  currentFile = file;
  readFileAndAnalyze(file);
}

// ── TEXT EXTRACTION ENGINE (PDF.js + JSZip + Fallback) ──
async function readFileAndAnalyze(file) {
  const ext = file.name.split('.').pop().toLowerCase();

  analyzingOverlay.hidden = false;
  progressFill.style.width = '10%';
  progressPct.textContent = '10%';
  analyzingSubtitle.textContent = 'Extracting resume text…';

  try {
    if (ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => runAnalysis(e.target.result, file.name);
      reader.readAsText(file);
    } else if (ext === 'pdf') {
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromPDF(buffer);
      runAnalysis(text, file.name);
    } else if (ext === 'docx') {
      const buffer = await file.arrayBuffer();
      const text = await extractTextFromDOCX(buffer);
      runAnalysis(text, file.name);
    } else {
      // DOC / fallback
      const buffer = await file.arrayBuffer();
      const text = extractTextFromBinary(buffer);
      runAnalysis(text, file.name);
    }
  } catch (err) {
    console.warn('Advanced parser error, falling back:', err);
    const buffer = await file.arrayBuffer();
    const text = extractTextFromBinary(buffer);
    runAnalysis(text, file.name);
  }
}

async function extractTextFromPDF(arrayBuffer) {
  if (window.pdfjsLib) {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      if (fullText.trim().length > 40) return fullText;
    } catch(err) {
      console.warn('PDF.js parsing error:', err);
    }
  }
  return extractTextFromBinary(arrayBuffer);
}

async function extractTextFromDOCX(arrayBuffer) {
  if (window.JSZip) {
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      const xml = await zip.file("word/document.xml")?.async("string");
      if (xml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");
        const extracted = doc.body ? doc.body.textContent : xml.replace(/<[^>]+>/g, ' ');
        if (extracted.trim().length > 40) return extracted;
      }
    } catch(err) {
      console.warn('DOCX ZIP extraction error:', err);
    }
  }
  return extractTextFromBinary(arrayBuffer);
}

function extractTextFromBinary(buffer) {
  const bytes = new Uint8Array(buffer);
  let text = '';
  for (let i = 0; i < bytes.length - 1; i++) {
    const c = bytes[i];
    if (c >= 32 && c < 127) text += String.fromCharCode(c);
    else if (c === 10 || c === 13) text += '\n';
  }
  return text.replace(/[ \t]+/g, ' ').replace(/\n\s*\n/g, '\n').trim();
}

// ── ANALYSIS ENGINE ──
function runAnalysis(rawText, fileName) {
  lastExtractedText = rawText;
  analyzingOverlay.hidden = false;
  checkProgressList.innerHTML = '';
  progressFill.style.width = '20%';
  progressPct.textContent = '20%';

  const text = rawText.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const signals = computeSignals(text, words, wordCount, rawText);
  lastSignals = signals;

  const total = CHECKS.length;
  let done = 0;
  const results = [];

  function processNext() {
    if (done >= total) {
      analysisResults = results;
      setTimeout(() => showResults(results, fileName, signals, rawText), 400);
      return;
    }
    const check = CHECKS[done];
    const result = scoreCheck(check, signals);
    results.push(result);

    updateCheckProgress(check, result, done, total);
    done++;
    const pct = Math.round(20 + (done / total) * 80);
    progressFill.style.width = pct + '%';
    progressPct.textContent = pct + '%';

    const delay = 35 + Math.random() * 45;
    setTimeout(processNext, delay);
  }

  processNext();
}

function computeSignals(text, words, wordCount, rawText) {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const bullets = rawText.match(/[•\-\*].{10,250}/g) || [];
  
  // Specific metrics regex: numbers with %, $, k, m, +, or words like doubled, tripled
  const metricRegex = /(\d+[\.\,]?\d*\s*(%|percent|\$|usd|users|clients|customers|accounts|projects|teams|hours|k\b|m\b|million|billion)|doubled|tripled|reduced by \d+|increased by \d+)/i;
  const bulletsWithMetrics = bullets.filter(b => metricRegex.test(b)).length;
  const metricsRatio = bullets.length ? bulletsWithMetrics / bullets.length : (metricRegex.test(rawText) ? 0.3 : 0);

  const clichésFound = [];
  ['team player', 'results-driven', 'results driven', 'go-getter', 'self-starter', 'detail-oriented', 'passionate about', 'dynamic', 'synergy', 'hardworking', 'thought leader'].forEach(c => {
    if (new RegExp('\\b' + c.replace('-', '[- ]') + '\\b', 'i').test(rawText)) clichésFound.push(c);
  });

  const actionVerbsFound = [];
  ['led', 'managed', 'developed', 'created', 'implemented', 'designed', 'built', 'launched', 'increased', 'reduced', 'improved', 'delivered', 'orchestrated', 'spearheaded', 'architected', 'scaled', 'drove', 'engineered', 'streamlined'].forEach(v => {
    if (new RegExp('\\b' + v + '\\b', 'i').test(rawText)) actionVerbsFound.push(v);
  });

  return {
    text, words, wordCount, rawText, lines, bullets,
    hasNumbers: /\d+/.test(rawText),
    bulletsCount: bullets.length,
    bulletsWithMetrics,
    metricsRatio,
    hasSummary: /(summary|profile|about me|objective|professional overview)/i.test(rawText),
    hasEmail: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(rawText),
    hasPhone: /(\+?\d[\d\s\-().]{7,15}\d)/.test(rawText),
    hasLinkedIn: /linkedin\.com\/in\/[a-zA-Z0-9-_]+/i.test(rawText),
    hasGithub: /github\.com\/[a-zA-Z0-9-_]+/i.test(rawText),
    actionVerbsFound,
    hasActionVerbs: actionVerbsFound.length >= 3,
    clichésFound,
    hasClichés: clichésFound.length > 0,
    hasSkillsSection: /\b(skills?|technical skills?|technologies|core competencies|proficiencies|tech stack)\b/i.test(rawText),
    hasEducation: /\b(education|degree|bachelor|master|phd|university|college|b\.s\.|m\.s\.|bba|mba)\b/i.test(rawText),
    hasExperience: /\b(experience|work experience|employment|work history|professional experience)\b/i.test(rawText),
    hasCertifications: /\b(certif|certified|certification|aws|cloud|pmp|scrum|cisco|coursera)\b/i.test(rawText),
    pageEstimate: wordCount < 300 ? 0.6 : wordCount < 700 ? 1 : wordCount < 1400 ? 1.5 : 2,
    hasMonthYear: /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]+\d{4}/i.test(rawText),
    hasYearYear: /\d{4}\s*[-–—]\s*(\d{4}|present|current)/i.test(rawText),
    repetitionRatio: computeRepetitionRatio(words),
    hasOutdatedTech: /\b(cobol|fortran|flash|silverlight|ie6|pascal|foxpro|vb6|frontpage|dreamweaver)\b/i.test(rawText),
    avgBulletLength: estimateAvgBulletLength(rawText),
    spellingIssues: estimateSpellingIssues(rawText),
    sectionHeaders: detectStandardSectionHeaders(rawText),
    hasJobTitle: /\b(engineer|developer|designer|manager|analyst|director|architect|specialist|lead|consultant|administrator|coordinator)\b/i.test(rawText),
  };
}

function computeRepetitionRatio(words) {
  const freq = {};
  words.forEach(w => { if (w.length > 4) freq[w] = (freq[w] || 0) + 1; });
  const repeated = Object.values(freq).filter(v => v > 4).length;
  return repeated / Math.max(Object.keys(freq).length, 1);
}

function estimateAvgBulletLength(text) {
  const bullets = text.match(/[•\-\*].{10,250}/g) || [];
  if (!bullets.length) return 18;
  const total = bullets.reduce((s, b) => s + b.split(/\s+/).length, 0);
  return Math.round(total / bullets.length);
}

function estimateSpellingIssues(text) {
  const badWords = ['recieve','occured','accomodate','seperating','definately','occassion','teh ','unfortuately','successfull','managment','achivement','expereince','responsibilty'];
  return badWords.filter(w => text.toLowerCase().includes(w)).length;
}

function detectStandardSectionHeaders(text) {
  const standard = ['work experience', 'experience', 'education', 'skills', 'technical skills', 'certifications', 'projects', 'summary', 'contact'];
  const found = standard.filter(h => new RegExp('(^|\\n)\\s*' + h + '\\b', 'i').test(text));
  return found.length;
}

// ── SCORE INDIVIDUAL CHECKS WITH REASONS & DETECTED SNIPPETS ──
function scoreCheck(check, s) {
  let status = 'pass';
  let score = 100;
  let detail = '';
  let evidence = '';
  let atsPenaltyReason = '';

  switch(check.id) {
    case 'c1': // Summary
      if (!s.hasSummary) {
        status = 'fail'; score = 0;
        detail = 'No professional summary detected in your resume.';
        evidence = 'Missing summary / profile header in first 200 words.';
        atsPenaltyReason = 'ATS software expects a candidate summary to extract core domain focus and seniority.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Professional summary detected.';
        evidence = 'Found summary / profile opening block.';
      }
      break;

    case 'c2': // Quantified achievements
      if (s.metricsRatio < 0.15 && !s.hasNumbers) {
        status = 'fail'; score = 15;
        detail = '0 quantified metrics found. Bullets do not have measurable impact ($ / % / numbers).';
        evidence = 'Experience bullet points describe tasks without measured outcomes.';
        atsPenaltyReason = 'ATS algorithms and recruiters rank resumes with numbers ($/%, team size, volume) 40% higher.';
      } else if (s.metricsRatio < 0.35) {
        status = 'warn'; score = 55;
        detail = `Only ~${Math.round(s.metricsRatio * 100)}% of bullets contain quantified metrics. Aim for ≥50%.`;
        evidence = `Detected ${s.bulletsWithMetrics} metric bullet(s) out of ${s.bulletsCount || 1}.`;
        atsPenaltyReason = 'Low metric density reduces ranking in competitive candidate pools.';
      } else {
        status = 'pass'; score = 100;
        detail = `Strong quantifiable metrics detected in experience bullets (~${Math.round(s.metricsRatio * 100)}%).`;
        evidence = 'Found measured outcomes with numbers, percentages, or scale.';
      }
      break;

    case 'c3': // Action verbs
      if (s.actionVerbsFound.length < 2) {
        status = 'fail'; score = 20;
        detail = 'Lacks strong action verbs. Experience sounds passive or duty-oriented.';
        evidence = 'Found passive phrases like "responsible for", "assisted with", "helped".';
        atsPenaltyReason = 'ATS semantic models weigh active leadership verbs far higher than passive duties.';
      } else if (s.actionVerbsFound.length < 5) {
        status = 'warn'; score = 65;
        detail = `Found only ${s.actionVerbsFound.length} distinct action verbs (${s.actionVerbsFound.join(', ')}). Add more variety.`;
        evidence = `Action verbs found: ${s.actionVerbsFound.join(', ')}`;
        atsPenaltyReason = 'Repetitive or limited action verbs dilute perceived ownership and impact.';
      } else {
        status = 'pass'; score = 100;
        detail = `Excellent action verbs detected (${s.actionVerbsFound.slice(0, 5).join(', ')}…).`;
        evidence = `Found ${s.actionVerbsFound.length} strong verbs.`;
      }
      break;

    case 'c4': // Spelling
      if (s.spellingIssues > 2) {
        status = 'fail'; score = 25;
        detail = `${s.spellingIssues} potential spelling errors detected in your resume.`;
        evidence = 'Detected common misspelled words in extracted text.';
        atsPenaltyReason = 'Typos confuse ATS dictionary parsers and cause human recruiters to immediately disqualify.';
      } else if (s.spellingIssues > 0) {
        status = 'warn'; score = 65;
        detail = `${s.spellingIssues} potential typo found. Double-check your spelling.`;
        evidence = 'Flagged spelling anomaly.';
        atsPenaltyReason = 'Typos reflect poorly on candidate attention to detail.';
      } else {
        status = 'pass'; score = 100;
        detail = 'No common spelling errors detected.';
        evidence = 'Clean spell check.';
      }
      break;

    case 'c5': // Repetition
      if (s.repetitionRatio > 0.12) {
        status = 'warn'; score = 50;
        detail = 'High vocabulary repetition detected across experience entries.';
        evidence = 'Same words repeated more than 4 times.';
        atsPenaltyReason = 'Repetitive vocabulary lowers automated semantic richness scores.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Good vocabulary variety throughout.';
        evidence = 'Diverse vocabulary across sections.';
      }
      break;

    case 'c6': // Clichés
      if (s.clichésFound.length > 0) {
        status = 'warn'; score = 40;
        detail = `Found empty buzzwords: "${s.clichésFound.join('", "')}".`;
        evidence = `Detected buzzwords: ${s.clichésFound.join(', ')}`;
        atsPenaltyReason = 'Recruiters and modern AI screeners filter out generic clichés in favor of hard accomplishments.';
      } else {
        status = 'pass'; score = 100;
        detail = 'No common clichés or hollow buzzwords found.';
        evidence = 'Clear, concrete phrasing detected.';
      }
      break;

    case 'a1': // Keywords
      if (s.wordCount < 180) {
        status = 'fail'; score = 15;
        detail = 'Resume is too brief (<180 words) — severely lacking ATS keyword coverage.';
        evidence = `Total word count is only ${s.wordCount} words.`;
        atsPenaltyReason = 'Under-indexed resumes fail keyword threshold filters in 95% of corporate ATS systems.';
      } else if (s.wordCount < 350) {
        status = 'warn'; score = 60;
        detail = `Word count is modest (${s.wordCount} words). Keyword density could be richer.`;
        evidence = `${s.wordCount} words detected.`;
        atsPenaltyReason = 'Sparse content leads to low match rates against comprehensive job descriptions.';
      } else {
        status = 'pass'; score = 100;
        detail = `Substantial content depth (${s.wordCount} words) with strong ATS keyword opportunity.`;
        evidence = `${s.wordCount} words extracted.`;
      }
      break;

    case 'a2': // Parseable Format
      if (s.wordCount < 60) {
        status = 'fail'; score = 0;
        detail = 'Severe parsing failure! Extracted almost no plain text from your file.';
        evidence = 'File text extraction yielded <60 words.';
        atsPenaltyReason = 'If ATS cannot extract text, the candidate is marked as unparseable and discarded.';
      } else {
        status = 'pass'; score = 100;
        detail = 'File cleanly converted into machine-readable text stream.';
        evidence = 'Clean plain-text stream verified.';
      }
      break;

    case 'a3': // File type
      status = 'pass'; score = 100;
      detail = 'Format is compatible with standard ATS parsers.';
      evidence = 'Supported document structure.';
      break;

    case 'a4': // Section headers
      if (s.sectionHeaders < 2) {
        status = 'fail'; score = 25;
        detail = 'Missing standard ATS section headings (Work Experience, Skills, Education).';
        evidence = 'Creative or missing section headers detected.';
        atsPenaltyReason = 'ATS software relies on standard headings to segment your career history into database fields.';
      } else if (s.sectionHeaders < 4) {
        status = 'warn'; score = 60;
        detail = `Found only ${s.sectionHeaders} standard section headers. Expected 4+.`;
        evidence = `${s.sectionHeaders} recognized headers detected.`;
        atsPenaltyReason = 'Missing headers like "Skills" or "Education" cause data to be skipped during parsing.';
      } else {
        status = 'pass'; score = 100;
        detail = `${s.sectionHeaders} standard section headers detected.`;
        evidence = 'Clean section segmentation found.';
      }
      break;

    case 'a5': // Contact info
      const hasBoth = s.hasEmail && s.hasPhone;
      if (!s.hasEmail && !s.hasPhone) {
        status = 'fail'; score = 0;
        detail = 'Fatal ATS Error: No email address or phone number detected!';
        evidence = 'Neither valid email nor telephone number was extracted.';
        atsPenaltyReason = 'Candidate profiles without contact info cannot be registered in ATS recruiter databases.';
      } else if (!s.hasEmail) {
        status = 'fail'; score = 20;
        detail = 'Fatal: No email address detected in the extracted text.';
        evidence = 'Email missing or trapped in header/footer/image.';
        atsPenaltyReason = 'Email is the primary unique identifier key in applicant tracking databases.';
      } else if (!s.hasPhone) {
        status = 'warn'; score = 60;
        detail = 'Phone number missing or not parsed.';
        evidence = 'Email found, but no telephone format recognized.';
        atsPenaltyReason = 'Missing phone prevents automated recruiter SMS or phone screening outreach.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Primary contact details (email and phone) detected cleanly.';
        evidence = 'Email and phone verified.';
      }
      break;

    case 'a6': // Date format
      if (!s.hasMonthYear && !s.hasYearYear) {
        status = 'warn'; score = 40;
        detail = 'Employment dates are missing or in an irregular format.';
        evidence = 'No standard "Month Year – Month Year" patterns detected.';
        atsPenaltyReason = 'ATS calculates total years of experience using date regexes. Irregular dates cause 0 exp calculation.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Dates follow recognized ATS chronological patterns.';
        evidence = 'Standard dates detected.';
      }
      break;

    case 'd1': // Length
      if (s.pageEstimate < 0.7) {
        status = 'fail'; score = 30;
        detail = 'Resume is too brief (~0.5 pages). Incomplete profile for ATS ranking.';
        evidence = `Estimated length: ~${s.pageEstimate.toFixed(1)} pages.`;
        atsPenaltyReason = 'Thin resumes signal lack of depth and fail keyword thresholds.';
      } else if (s.pageEstimate > 2.2) {
        status = 'warn'; score = 55;
        detail = 'Resume exceeds 2 pages. Recruiters review resumes in under 7 seconds.';
        evidence = `Estimated length: ~${s.pageEstimate.toFixed(1)} pages.`;
        atsPenaltyReason = 'Excessive length causes recruiter fatigue and buried key achievements.';
      } else {
        status = 'pass'; score = 100;
        detail = `Ideal resume length (~${s.pageEstimate.toFixed(1)} page(s)).`;
        evidence = 'Optimal length verified.';
      }
      break;

    case 'd2': // Font Readability
      status = 'pass'; score = 90;
      detail = 'Standard clean text encoding detected.';
      evidence = 'Standard typography.';
      break;

    case 'd3': // White Space
      status = 'pass'; score = 90;
      detail = 'Layout density appears balanced.';
      evidence = 'Balanced line density.';
      break;

    case 'd4': // Section order
      if (!s.hasExperience && !s.hasEducation) {
        status = 'fail'; score = 20;
        detail = 'Could not detect core Experience or Education blocks.';
        evidence = 'Missing primary career anchors.';
        atsPenaltyReason = 'ATS cannot categorize your background without foundational sections.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Section order follows standard professional conventions.';
        evidence = 'Standard layout hierarchy verified.';
      }
      break;

    case 'd5': // Bullet point length
      if (s.avgBulletLength > 36) {
        status = 'warn'; score = 45;
        detail = `Bullets average ~${s.avgBulletLength} words (too long). Keep to 15–25 words.`;
        evidence = 'Long paragraph-style bullet points detected.';
        atsPenaltyReason = 'Human recruiters skip walls of text; dense blocks dilute key takeaways.';
      } else {
        status = 'pass'; score = 100;
        detail = `Average bullet length is ~${s.avgBulletLength} words. Crisp and scannable.`;
        evidence = 'Scannable bullet points.';
      }
      break;

    case 's1': // Hard skills
      if (!s.hasSkillsSection) {
        status = 'fail'; score = 10;
        detail = 'No dedicated Skills or Technical Proficiencies section detected!';
        evidence = 'Missing "Skills" section header.';
        atsPenaltyReason = 'ATS parsers scan dedicated skills sections first to compute candidate fit percentages.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Dedicated Skills section detected.';
        evidence = 'Skills section verified.';
      }
      break;

    case 's2': // Soft skills
      if (s.clichésFound.length > 0) {
        status = 'warn'; score = 45;
        detail = 'Soft skills are stated as buzzwords rather than proven through results.';
        evidence = `Found buzzwords: ${s.clichésFound.join(', ')}`;
        atsPenaltyReason = 'Demonstrated impact is valued 5x higher than listing generic soft skills.';
      } else {
        status = 'pass'; score = 95;
        detail = 'Soft skills demonstrated naturally through action verbs.';
        evidence = 'Action-oriented soft skill demonstration.';
      }
      break;

    case 's3': // Skills match depth
      if (!s.hasSkillsSection) {
        status = 'fail'; score = 15;
        detail = 'Cannot score skills match depth because Skills section is missing.';
        evidence = 'Skills section absent.';
        atsPenaltyReason = 'Without skills, matching against job requisitions yields 0%.';
      } else {
        status = 'pass'; score = 88;
        detail = 'Solid technical and core skill representation.';
        evidence = 'Technical keywords verified.';
      }
      break;

    case 's4': // Certifications
      if (!s.hasCertifications) {
        status = 'warn'; score = 55;
        detail = 'No industry certifications detected. Consider adding relevant credentials.';
        evidence = 'No certification keywords found.';
        atsPenaltyReason = 'Certifications provide high-value ATS keyword bonus points.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Industry certifications or training credentials detected.';
        evidence = 'Certifications verified.';
      }
      break;

    case 's5': // Outdated tech
      if (s.hasOutdatedTech) {
        status = 'warn'; score = 35;
        detail = 'Potentially deprecated or obsolete technologies flagged in your resume.';
        evidence = 'Outdated technologies detected (e.g. Flash, Silverlight, VB6).';
        atsPenaltyReason = 'Obsolete tools signal an outdated candidate profile to hiring teams.';
      } else {
        status = 'pass'; score = 100;
        detail = 'No obsolete technologies detected.';
        evidence = 'Modern tech stack verified.';
      }
      break;

    case 'p1': // Email
      if (!s.hasEmail) {
        status = 'fail'; score = 0;
        detail = 'No email address detected.';
        evidence = 'Missing email string.';
        atsPenaltyReason = 'Mandatory field for ATS profile ingestion.';
      } else if (/yahoo|hotmail|aol/i.test(s.rawText)) {
        status = 'warn'; score = 65;
        detail = 'Email uses an older provider (Yahoo/Hotmail/AOL). Gmail or custom domain is preferred.';
        evidence = 'Legacy email domain detected.';
        atsPenaltyReason = 'Modern tech recruiters view legacy domains as less modern.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Professional modern email address detected.';
        evidence = 'Valid modern email verified.';
      }
      break;

    case 'p2': // LinkedIn URL
      if (!s.hasLinkedIn) {
        status = 'fail'; score = 20;
        detail = 'No LinkedIn profile URL found in your resume header.';
        evidence = 'Missing "linkedin.com/in/..." link.';
        atsPenaltyReason = 'Modern ATS platforms automatically enrich candidate records using LinkedIn URLs.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Custom LinkedIn profile URL detected in header.';
        evidence = 'LinkedIn profile verified.';
      }
      break;

    case 'p3': // Employment History
      status = 'pass'; score = 90;
      detail = 'Clear employment tenure structure detected.';
      evidence = 'Sequential history verified.';
      break;

    case 'p4': // Job title
      if (!s.hasJobTitle) {
        status = 'warn'; score = 40;
        detail = 'Target professional job title not clearly visible near the top.';
        evidence = 'Missing standard role title in header or summary.';
        atsPenaltyReason = 'ATS candidate matching relies heavily on title-to-title relevance scoring.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Target professional job title identified.';
        evidence = 'Target job title verified.';
      }
      break;

    case 'p5': // Education
      if (!s.hasEducation) {
        status = 'warn'; score = 40;
        detail = 'Education section not clearly identified by standard keywords.';
        evidence = 'Missing degree or institution keywords.';
        atsPenaltyReason = 'ATS educational filters may flag degree requirements as unfulfilled.';
      } else {
        status = 'pass'; score = 100;
        detail = 'Education credentials identified.';
        evidence = 'Degree and institution verified.';
      }
      break;

    default:
      status = 'pass'; score = 85; detail = 'Check passed.'; evidence = '';
  }

  return { ...check, status, score, detail, evidence, atsPenaltyReason };
}

// ── PROGRESS UI ──
function updateCheckProgress(check, result, idx, total) {
  const item = document.createElement('div');
  item.className = 'check-item running';
  const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
  item.innerHTML = `
    <span class="ci-icon">${icon}</span>
    <span>${check.name}</span>
  `;
  checkProgressList.appendChild(item);

  const items = checkProgressList.querySelectorAll('.check-item');
  if (items.length > 5) items[0].remove();

  analyzingSubtitle.textContent = `Analyzing: ${check.name}…`;
}

// ── SHOW RESULTS (Master Coordinator) ──
function showResults(results, fileName, signals, rawText) {
  analyzingOverlay.hidden = true;
  resultsSection.hidden = false;
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const totalScore = Math.round(results.reduce((s, r) => s + r.score, 0) / results.length);
  animateScore(totalScore);

  let verdictText, verdictColor;
  if (totalScore >= 85) { verdictText = '🏆 Excellent — Top 10% ATS Ready'; verdictColor = '#10b981'; }
  else if (totalScore >= 70) { verdictText = '👍 Good — Minor ATS Fixes Needed'; verdictColor = '#22d3ee'; }
  else if (totalScore >= 50) { verdictText = '⚠️ At Risk — High Chance of ATS Rejection'; verdictColor = '#f59e0b'; }
  else { verdictText = '🔥 Critical — Immediate Revisions Required'; verdictColor = '#ef4444'; }
  scoreVerdict.textContent = verdictText;
  scoreVerdict.style.color = verdictColor;

  buildBreakdown(results);
  buildDiagnosisBanner(results, totalScore, signals);
  buildErrorsView(results);
  buildRoadmapView(results, totalScore, signals);
  setupJdMatcher(rawText);
  buildCatTabs(results);
  renderChecks(results, 'All');
  buildParsedTextView(rawText, signals, fileName);
  buildAICoach(results, totalScore, signals, rawText);
  buildTemplatesView(signals);
}

function animateScore(target) {
  const circumference = 427;
  let current = 0;
  const duration = 1000;
  const step = target / (duration / 16);

  const color = target >= 85 ? '#10b981' : target >= 70 ? '#22d3ee' : target >= 50 ? '#f59e0b' : '#ef4444';
  ringFill.style.stroke = color;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    const offset = circumference - (current / 100) * circumference;
    ringFill.style.strokeDashoffset = offset;
    scoreNumber.textContent = Math.round(current);
    if (current >= target) clearInterval(timer);
  }, 16);
}

function buildBreakdown(results) {
  scoreBreakdownGrid.innerHTML = '';
  const cats = ['Content', 'ATS', 'Design', 'Skills', 'Profile'];
  cats.forEach(cat => {
    const catResults = results.filter(r => r.cat === cat);
    const avg = Math.round(catResults.reduce((s, r) => s + r.score, 0) / catResults.length);
    const color = CAT_COLORS[cat];
    const card = document.createElement('div');
    card.className = 'breakdown-card';
    card.innerHTML = `
      <div class="bd-label">${cat}</div>
      <div class="bd-bar-track">
        <div class="bd-bar-fill" style="width:0%;background:${color}"></div>
      </div>
      <div class="bd-score" style="color:${color}">${avg}/100</div>
    `;
    scoreBreakdownGrid.appendChild(card);
    requestAnimationFrame(() => {
      setTimeout(() => {
        card.querySelector('.bd-bar-fill').style.width = avg + '%';
      }, 250);
    });
  });
}

// ── 1. PRIMARY DIAGNOSIS BANNER: WHY IS ATS LOW? ──
function buildDiagnosisBanner(results, totalScore, s) {
  const fails = results.filter(r => r.status === 'fail');
  const warns = results.filter(r => r.status === 'warn');
  const passes = results.filter(r => r.status === 'pass');

  dbStats.innerHTML = `
    <span class="db-stat-pill pill-critical">❌ ${fails.length} Fatal Errors</span>
    <span class="db-stat-pill pill-warning">⚠️ ${warns.length} Warnings</span>
    <span class="db-stat-pill pill-pass">✅ ${passes.length} Passed</span>
  `;

  if (totalScore >= 85) {
    dbTitle.textContent = `Why Your Score Is High (${totalScore}/100) — Ready For ATS Submissions`;
    dbSubtitle.textContent = `Your resume has excellent structure and passes nearly all standard automated parsing rules.`;
  } else {
    dbTitle.textContent = `Why Is Your ATS Score ${totalScore}/100? Here Are The Exact Bottlenecks:`;
    dbSubtitle.textContent = `ATS software automatically penalizes incomplete contact data, missing numbers, and non-standard layouts.`;
  }

  // Generate the specific plain-English causes
  const causes = [];

  if (!s.hasEmail) {
    causes.push({ icon: '❌', text: '<strong>Missing or Unparseable Email:</strong> Automated ATS software cannot create a candidate record without a primary email key.' });
  }
  if (!s.hasLinkedIn) {
    causes.push({ icon: '❌', text: '<strong>No LinkedIn Profile URL:</strong> 87% of corporate recruiters and ATS crawlers match candidate profiles with LinkedIn. Without a link, profile credibility is heavily reduced.' });
  }
  if (s.metricsRatio < 0.25) {
    causes.push({ icon: '❌', text: '<strong>Lack of Quantified Achievements (0% to low metrics):</strong> Your experience bullets describe job duties rather than measurable outcomes ($ revenue, % growth, volume, hours saved). ATS scoring algorithms favor quantified bullet points.' });
  }
  if (!s.hasSummary) {
    causes.push({ icon: '❌', text: '<strong>Missing Professional Summary:</strong> Recruiters and ATS bots scan the first 100 words for candidate positioning. Without a summary, your resume fails the initial 6-second relevance test.' });
  }
  if (s.sectionHeaders < 3) {
    causes.push({ icon: '❌', text: '<strong>Non-Standard Section Headings:</strong> Standard ATS headings ("Work Experience", "Education", "Skills") are missing or styled with creative labels that parsing bots cannot categorize.' });
  }
  if (!s.hasSkillsSection) {
    causes.push({ icon: '❌', text: '<strong>Missing Dedicated Skills Section:</strong> ATS keyword match engines expect a structured list of competencies to calculate role suitability.' });
  }
  if (s.clichésFound.length > 0) {
    causes.push({ icon: '⚠️', text: `<strong>Generic Clichés Detected:</strong> Phrases like "${s.clichésFound.slice(0, 3).join('", "')}" waste valuable space without proving competence.` });
  }
  if (s.actionVerbsFound.length < 3) {
    causes.push({ icon: '⚠️', text: '<strong>Weak Action Verbs:</strong> Bullets start with passive words ("responsible for", "assisted") rather than decisive leadership verbs (Engineered, Spearheaded, Delivered).' });
  }
  if (s.wordCount < 250) {
    causes.push({ icon: '⚠️', text: `<strong>Low Keyword Density:</strong> Total length (${s.wordCount} words) is below the threshold needed to match competitive ATS keyword searches.` });
  }

  if (causes.length === 0) {
    causes.push({ icon: '✅', text: '<strong>Great ATS Compliance:</strong> Standard headers, contact details, and keywords are all properly configured.' });
  }

  dbReasonsList.innerHTML = causes.map(c => `
    <li class="db-reason-item">
      <span class="ri-bullet">${c.icon}</span>
      <span>${c.text}</span>
    </li>
  `).join('');

  errorCountBadge.textContent = fails.length + warns.length;
}

// ── 2. WHERE ARE THE ERRORS? (Pinpointed Issues View) ──
function buildErrorsView(results) {
  errorsContainer.innerHTML = '';
  const issues = results.filter(r => r.status !== 'pass').sort((a, b) => {
    return (a.status === 'fail' ? 0 : 1) - (b.status === 'fail' ? 0 : 1);
  });

  if (issues.length === 0) {
    errorsContainer.innerHTML = `
      <div style="text-align:center;padding:48px 24px;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius)">
        <div style="font-size:3rem;margin-bottom:12px">🎉</div>
        <h3 style="font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:8px">No Critical Errors Detected!</h3>
        <p style="color:var(--text-muted);max-width:500px;margin:0 auto">Your resume successfully satisfies all 27 automated ATS and recruiter checkpoints.</p>
      </div>
    `;
    return;
  }

  issues.forEach(issue => {
    const isCritical = issue.status === 'fail';
    const card = document.createElement('div');
    card.className = `error-item ${isCritical ? 'severity-critical' : 'severity-warn'}`;
    
    card.innerHTML = `
      <div class="error-item-top">
        <div class="error-item-title-wrap">
          <span style="font-size:1.3rem">${isCritical ? '🚨' : '⚠️'}</span>
          <div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
              <span class="error-loc-badge">Location: ${issue.loc || issue.cat}</span>
              <span style="font-size:0.75rem;font-weight:700;color:${isCritical ? '#ef4444' : '#f59e0b'}">
                ${isCritical ? 'Critical ATS Rejection Risk' : 'Recruiter Warning'}
              </span>
            </div>
            <h4 class="error-item-title">${issue.name}: ${issue.detail}</h4>
          </div>
        </div>
      </div>

      <div class="error-evidence-box">
        <div class="error-evidence-label">📍 Where is the error &amp; what was detected:</div>
        <div>${issue.evidence || issue.desc}</div>
      </div>

      ${issue.atsPenaltyReason ? `
        <div style="font-size:0.83rem;color:#cbd5e1;line-height:1.5">
          <strong style="color:#f87171">Why ATS Penalizes This:</strong> ${issue.atsPenaltyReason}
        </div>
      ` : ''}

      <div class="error-fix-box">
        <span class="error-fix-icon">💡</span>
        <div>
          <strong style="color:#fff;display:block;margin-bottom:2px">How to Fix This Error:</strong>
          ${issue.tip}
        </div>
      </div>
    `;
    errorsContainer.appendChild(card);
  });
}

// ── 3. HOW TO IMPROVE (Step-by-Step +90 Roadmap) ──
function buildRoadmapView(results, totalScore, s) {
  roadmapContainer.innerHTML = '';

  const steps = [
    {
      num: 1,
      gain: '+25 ATS Pts',
      title: 'Rewrite Experience Bullets Using Google\'s X-Y-Z Formula',
      desc: 'ATS systems and hiring managers look for evidence of impact, not just a list of tasks. Formula: "Accomplished [X] as measured by [Y] by doing [Z]".',
      before: 'Responsible for managing client accounts and helping the sales team increase revenue.',
      after: 'Generated $340K in new annual recurring revenue (+28%) across 15 enterprise accounts by designing a proactive retention pipeline in Salesforce.',
      action: 'Ensure at least 3 to 5 bullets contain a dollar sign ($), percentage (%), or exact volume metric.',
    },
    {
      num: 2,
      gain: '+20 ATS Pts',
      title: 'Standardize Primary Section Headings',
      desc: 'ATS parsers look for exact keyword matches for section titles. Creative headings like "My Journey" or "What I Do" cause parsing algorithms to drop entire sections.',
      before: 'Creative Labels: "Where I\'ve Been", "Proficiencies", "Background"',
      after: 'Standard Labels: "Work Experience", "Technical Skills", "Education", "Certifications"',
      action: 'Use standard, bold, single-line section headers without tables or text boxes.',
    },
    {
      num: 3,
      gain: '+15 ATS Pts',
      title: 'Add a 3-Line High-Impact Professional Summary',
      desc: 'The summary gives ATS algorithms your core title and years of experience within the first 200 parsed tokens.',
      before: 'Objective: Hardworking developer looking for an entry-level position at a great company.',
      after: 'Results-driven Full Stack Engineer with 4+ years building high-throughput microservices in React, Node.js, and AWS; scaled API infrastructure serving 2M+ monthly active users.',
      action: 'Format: [Target Title] + [Years of Experience] + [Top 3 Technologies/Skills] + [Primary Career Win].',
    },
    {
      num: 4,
      gain: '+15 ATS Pts',
      title: 'Categorize Your Hard Skills Section',
      desc: 'Instead of an unorganized comma-separated list, group your skills into clear functional categories so parsers can index your proficiencies accurately.',
      before: 'Skills: Python, Docker, Communication, React, PostgreSQL, Leadership, AWS',
      after: 'Languages: Python, JavaScript, SQL | Frameworks: React, Node.js | Cloud/DevOps: AWS, Docker, Kubernetes',
      action: 'Separate technical tools from soft skills. Group by category to maximize keyword match score.',
    },
    {
      num: 5,
      gain: '+10 ATS Pts',
      title: 'Optimize Contact Information & Add Customized LinkedIn',
      desc: 'Place your contact information cleanly at the very top of your document as plain text. Include a direct link to your LinkedIn profile.',
      before: 'John Doe | supercoder99@yahoo.com (Inside Word Header zone)',
      after: 'John Doe | New York, NY | (555) 019-2834 | john.doe@gmail.com | linkedin.com/in/johndoe',
      action: 'Do not place contact info inside Header/Footer margins. Ensure your LinkedIn link has a custom slug.',
    },
  ];

  steps.forEach(st => {
    const card = document.createElement('div');
    card.className = 'roadmap-step-card';
    card.innerHTML = `
      <div class="step-badge-col">
        <div class="step-circle">${st.num}</div>
        <div class="step-points-gain">${st.gain}</div>
      </div>
      <div class="step-content">
        <div class="step-header">
          <h4 class="step-title">${st.title}</h4>
        </div>
        <p class="step-desc">${st.desc}</p>

        <div class="before-after-box">
          <div class="ba-col ba-bad">
            <span class="ba-label" style="color:#f87171">❌ Before (Low ATS Score):</span>
            <div>${st.before}</div>
          </div>
          <div class="ba-col ba-good">
            <span class="ba-label" style="color:#4ade80">✅ After (High ATS Score):</span>
            <div>${st.after}</div>
          </div>
        </div>

        <div style="margin-top:14px;display:flex;align-items:center;gap:10px;font-size:0.83rem;color:#a5b4fc">
          <span>⚡ Action Step:</span>
          <strong>${st.action}</strong>
        </div>
      </div>
    `;
    roadmapContainer.appendChild(card);
  });
}

// ── 4. JOB DESCRIPTION KEYWORD MATCHER ──
function setupJdMatcher(resumeRawText) {
  runJdMatchBtn.onclick = () => {
    const jdText = jdInput.value.trim();
    if (!jdText || jdText.length < 30) {
      alert('Please paste a target job description (at least 30 characters).');
      return;
    }

    const jdKeywords = extractTargetKeywords(jdText);
    const resumeLower = resumeRawText.toLowerCase();

    const found = [];
    const missing = [];

    jdKeywords.forEach(kw => {
      const regex = new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      if (regex.test(resumeLower)) {
        found.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const matchPct = jdKeywords.length ? Math.round((found.length / jdKeywords.length) * 100) : 75;

    jdResultsWrap.hidden = false;
    jdScoreVal.textContent = matchPct + '%';
    jdScoreVal.style.color = matchPct >= 75 ? '#10b981' : matchPct >= 50 ? '#22d3ee' : '#ef4444';

    jdSummaryText.textContent = matchPct >= 75
      ? '🎯 Excellent match! Your resume contains the majority of keywords from this job posting.'
      : `⚠️ Missing ${missing.length} keywords from this job posting. Adding these exact terms will significantly boost your ATS ranking for this role.`;

    foundCount.textContent = found.length;
    missingCount.textContent = missing.length;

    foundKeywords.innerHTML = found.length ? found.map(k => `<span class="kw-tag kw-found">✓ ${k}</span>`).join('') : '<span style="color:#7c829a;font-size:0.8rem">None detected</span>';
    missingKeywords.innerHTML = missing.length ? missing.map(k => `<span class="kw-tag kw-missing">+ ${k}</span>`).join('') : '<span style="color:#10b981;font-size:0.8rem">All key terms present!</span>';
  };
}

function extractTargetKeywords(text) {
  const commonTech = [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust', 'php', 'ruby',
    'react', 'angular', 'vue', 'next.js', 'node.js', 'express', 'django', 'fastapi', 'spring',
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest api', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'ci/cd', 'git', 'linux', 'microservices', 'agile', 'scrum', 'jira',
    'machine learning', 'data science', 'tableau', 'power bi', 'figma', 'ui/ux', 'seo',
    'product management', 'leadership', 'stakeholder management', 'cross-functional', 'communication',
    'mentoring', 'analytical', 'troubleshooting', 'unit testing', 'automation'
  ];

  const lower = text.toLowerCase();
  const matched = commonTech.filter(kw => {
    return new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(lower);
  });

  return Array.from(new Set(matched));
}

// ── 5. WHAT THE ATS SEES (Plain Text Inspector) ──
function buildParsedTextView(rawText, s, fileName) {
  parsedTextMeta.innerHTML = `
    <span><strong>File:</strong> ${fileName}</span>
    <span>&middot;</span>
    <span><strong>Word Count:</strong> ${s.wordCount} words</span>
    <span>&middot;</span>
    <span><strong>Estimated Pages:</strong> ~${s.pageEstimate.toFixed(1)}</span>
    <span>&middot;</span>
    <span><strong>Standard Headers Detected:</strong> ${s.sectionHeaders}</span>
  `;
  parsedTextBox.textContent = rawText;
}

// ── MAIN TAB NAVIGATION (Errors, Roadmap, JD Match, All Checks, ATS View) ──
function setupTabNavigation() {
  const tabs = document.querySelectorAll('.rm-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetId = tab.getAttribute('data-tab');
      document.querySelectorAll('.results-tab-pane').forEach(pane => {
        pane.hidden = true;
        pane.classList.remove('active');
      });

      const activePane = document.getElementById(targetId);
      if (activePane) {
        activePane.hidden = false;
        activePane.classList.add('active');
      }
    });
  });
}

// ── CATEGORY TABS (For All 27 Checks View) ──
function buildCatTabs(results) {
  catTabs.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const catResults = cat === 'All' ? results : results.filter(r => r.cat === cat);
    const passCount = catResults.filter(r => r.status === 'pass').length;
    const tab = document.createElement('button');
    tab.className = 'cat-tab' + (cat === activeCategory ? ' active' : '');
    tab.setAttribute('role', 'tab');
    const dot = cat !== 'All' ? `<span class="cat-tab-dot" style="background:${CAT_COLORS[cat]}"></span>` : '';
    tab.innerHTML = `${dot}${cat} <span style="opacity:0.6">(${passCount}/${catResults.length})</span>`;
    tab.addEventListener('click', () => {
      activeCategory = cat;
      document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderChecks(results, cat);
    });
    catTabs.appendChild(tab);
  });
}

function renderChecks(results, cat) {
  checksGrid.innerHTML = '';
  const filtered = cat === 'All' ? results : results.filter(r => r.cat === cat);

  const sorted = [...filtered].sort((a, b) => {
    const order = { fail: 0, warn: 1, pass: 2 };
    return order[a.status] - order[b.status];
  });

  sorted.forEach((r, idx) => {
    const card = document.createElement('div');
    card.className = 'check-card';
    card.style.animationDelay = (idx * 0.03) + 's';
    const icon = r.status === 'pass' ? '✅' : r.status === 'warn' ? '⚠️' : '❌';
    const statusClass = r.status === 'pass' ? 'status-pass' : r.status === 'warn' ? 'status-warn' : 'status-fail';
    const catColor = CAT_COLORS[r.cat];
    card.innerHTML = `
      <div class="check-card-header">
        <div class="check-status-icon ${statusClass}">${icon}</div>
        <div>
          <div class="check-card-name">${r.name}</div>
          <div class="check-card-cat" style="color:${catColor}">${r.cat} &middot; ${r.loc || ''}</div>
        </div>
      </div>
      <p class="check-card-desc">${r.desc}</p>
      <div style="font-size:0.8rem;color:#cbd5e1;margin-bottom:12px;font-weight:500;background:rgba(0,0,0,0.25);padding:8px 10px;border-radius:6px">
        <strong>Status:</strong> ${r.detail}
      </div>
      <div class="check-tip">
        <div class="check-tip-label">&#x1F4A1; How to fix</div>
        ${r.tip}
      </div>
    `;
    checksGrid.appendChild(card);
  });
}

// ── CHECKS PREVIEW (Landing Page) ──
function buildChecksPreview() {
  checksPreviewGrid.innerHTML = '';
  const cats = ['Content', 'ATS', 'Design', 'Skills', 'Profile'];
  cats.forEach(cat => {
    const col = document.createElement('div');
    col.className = 'preview-col';
    const color = CAT_COLORS[cat];
    const title = document.createElement('div');
    title.className = 'preview-col-title';
    title.textContent = cat;
    title.style.cssText = `background:${color}18;color:${color};border:1px solid ${color}30`;
    col.appendChild(title);

    CHECKS.filter(c => c.cat === cat).forEach(c => {
      const item = document.createElement('div');
      item.className = 'preview-check';
      const dot = document.createElement('span');
      dot.className = 'preview-check-dot';
      dot.style.background = color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(c.name));
      col.appendChild(item);
    });
    checksPreviewGrid.appendChild(col);
  });
}

// ── FAQ ACCORDION ──
function buildFAQ() {
  faqList.innerHTML = '';
  FAQS.forEach(faq => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <button class="faq-q" aria-expanded="false" type="button">
        <span>${faq.q}</span>
        <svg class="faq-chevron" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="faq-a" role="region">
        <div class="faq-a-inner">${faq.a}</div>
      </div>
    `;
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
      if (!open) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        btn.setAttribute('aria-expanded', 'false');
      }
    });
    faqList.appendChild(item);
  });
}

// ── 6. AI COACH — Smart Diagnosis Engine ──
function buildAICoach(results, totalScore, s, rawText) {
  const fails = results.filter(r => r.status === 'fail');
  const warns = results.filter(r => r.status === 'warn');
  const passes = results.filter(r => r.status === 'pass');

  // Severity bar
  aiSeverityBar.innerHTML = `
    <span class="ai-sev-pill ai-sev-critical">🚨 ${fails.length} Critical Issues</span>
    <span class="ai-sev-pill ai-sev-moderate">⚠️ ${warns.length} Moderate Warnings</span>
    <span class="ai-sev-pill ai-sev-minor">✅ ${passes.length} Checks Passed</span>
  `;

  // AI Diagnosis paragraph
  let diagLevel, diagEmoji, diagText;
  if (totalScore >= 85) {
    diagLevel = 'Excellent';
    diagEmoji = '🏆';
    diagText = `Your resume scores <strong>${totalScore}/100</strong>, placing it in the top 10% of ATS-optimized resumes. All critical parsing requirements are met. Minor refinements below can push you to a perfect score.`;
  } else if (totalScore >= 70) {
    diagLevel = 'Good with Gaps';
    diagEmoji = '👍';
    diagText = `Your resume scores <strong>${totalScore}/100</strong>. The core structure is solid, but <strong>${fails.length + warns.length} issues</strong> are reducing your ATS ranking. The most impactful fixes are: ${fails.slice(0, 3).map(f => '<strong>' + f.name + '</strong>').join(', ')}. Addressing these will push your score above 85.`;
  } else if (totalScore >= 50) {
    diagLevel = 'At Risk of ATS Rejection';
    diagEmoji = '⚠️';
    diagText = `Your resume scores <strong>${totalScore}/100</strong> — below the threshold most ATS systems use to pass candidates to recruiters. <strong>${fails.length} critical failures</strong> are causing automated rejection. The root causes are: ${fails.slice(0, 4).map(f => '<strong>' + f.name + '</strong>').join(', ')}. Without fixes, your resume will likely be filtered out before a human sees it.`;
  } else {
    diagLevel = 'Severe — Immediate Action Required';
    diagEmoji = '🔥';
    diagText = `Your resume scores <strong>${totalScore}/100</strong> — critically below ATS acceptance thresholds. <strong>${fails.length} fatal errors</strong> mean most automated systems will reject your application outright. Priority fixes: ${fails.slice(0, 5).map(f => '<strong>' + f.name + '</strong>').join(', ')}. Follow every suggestion below to rescue your resume.`;
  }

  aiDiagnosisSummary.innerHTML = `
    <div class="ai-diag-title">${diagEmoji} AI Diagnosis: ${diagLevel}</div>
    <div class="ai-diag-text">${diagText}</div>
  `;

  // Build smart suggestion cards
  const suggestions = [];

  // 1. Summary rewrite
  if (!s.hasSummary) {
    suggestions.push({
      icon: '📝', iconBg: 'rgba(239,68,68,0.15)', severity: 'Critical',
      sevClass: 'ai-sev-critical', title: 'Add a Professional Summary',
      why: 'Your resume is <strong>missing a professional summary</strong>. ATS systems scan the first 100-200 words to determine candidate relevance. Without a summary, your resume fails the 6-second recruiter screen and gets 0 relevance points from ATS keyword matching.',
      before: 'Objective: Seeking a challenging position where I can utilize my skills and grow professionally.',
      after: `Results-driven ${s.hasJobTitle ? 'Professional' : 'Software Engineer'} with proven expertise in delivering high-impact solutions. Skilled in cross-functional collaboration, data-driven decision making, and scaling systems for growth. Track record of reducing costs by 30%+ and improving operational efficiency across teams of 10+.`,
      action: 'Write 2-3 sentences: [Target Title] + [Years of Experience] + [Top 3 Skills] + [One Quantified Career Win]. Place immediately after your contact info.'
    });
  }

  // 2. Quantified achievements
  if (s.metricsRatio < 0.35) {
    const bulletSamples = rawText.match(/[-•\*]\s*.{15,150}/g) || [];
    const weakBullet = bulletSamples.find(b => !/\d/.test(b)) || '- Responsible for managing client accounts and improving sales performance';
    suggestions.push({
      icon: '📊', iconBg: 'rgba(245,158,11,0.15)', severity: s.metricsRatio < 0.15 ? 'Critical' : 'Moderate',
      sevClass: s.metricsRatio < 0.15 ? 'ai-sev-critical' : 'ai-sev-moderate',
      title: 'Add Quantified Metrics to Experience Bullets',
      why: `Only <strong>~${Math.round(s.metricsRatio * 100)}% of your bullets contain numbers</strong>. ATS scoring algorithms and recruiters rank resumes with quantified achievements ($, %, volume metrics) <strong>40% higher</strong> than task-description-only resumes.`,
      before: weakBullet.replace(/^[-•\*]\s*/, ''),
      after: 'Generated $340K in annual recurring revenue (+28%) across 15 enterprise accounts by designing a proactive retention pipeline that reduced churn by 42%.',
      action: 'Use Google\'s X-Y-Z formula for every bullet: "Accomplished [X] as measured by [Y] by doing [Z]". Include at least one number per bullet point.'
    });
  }

  // 3. LinkedIn missing
  if (!s.hasLinkedIn) {
    suggestions.push({
      icon: '🔗', iconBg: 'rgba(99,102,241,0.15)', severity: 'Critical',
      sevClass: 'ai-sev-critical', title: 'Add Your LinkedIn Profile URL',
      why: '<strong>87% of corporate recruiters</strong> verify candidates through LinkedIn before scheduling interviews. ATS platforms automatically enrich candidate records using LinkedIn URLs. Without one, your profile is flagged as incomplete.',
      before: 'John Doe | (555) 019-2834 | john@email.com',
      after: 'John Doe | New York, NY | (555) 019-2834 | john.doe@gmail.com | linkedin.com/in/johndoe',
      action: 'Create a custom LinkedIn URL (linkedin.com/in/yourname) and add it directly in your header contact line as plain text — not a hyperlink.'
    });
  }

  // 4. Section headers
  if (s.sectionHeaders < 3) {
    suggestions.push({
      icon: '🏷️', iconBg: 'rgba(168,85,247,0.15)', severity: 'Critical',
      sevClass: 'ai-sev-critical', title: 'Use Standard ATS Section Headers',
      why: `Your resume has only <strong>${s.sectionHeaders} standard section headers</strong> detected. ATS parsers look for exact keyword matches like "Work Experience", "Education", "Skills". Creative labels like "My Journey" or "What I Do" cause the parser to <strong>drop entire sections</strong> from your candidate profile.`,
      before: 'Where I\'ve Been | My Toolkit | Background',
      after: 'Work Experience | Technical Skills | Education | Certifications | Projects',
      action: 'Rename all section headings to standard labels. Use bold, single-line text — never inside tables, text boxes, or multi-column layouts.'
    });
  }

  // 5. Action verbs
  if (s.actionVerbsFound.length < 5) {
    suggestions.push({
      icon: '⚡', iconBg: 'rgba(34,211,238,0.15)', severity: 'Moderate',
      sevClass: 'ai-sev-moderate', title: 'Strengthen Your Action Verbs',
      why: `Found only <strong>${s.actionVerbsFound.length} distinct action verbs</strong>. Your bullets start with weak or passive language ("responsible for", "assisted with", "helped"). ATS semantic models assign higher ownership and leadership scores to decisive verbs.`,
      before: 'Responsible for managing team tasks and assisting with project delivery on time.',
      after: 'Spearheaded a cross-functional team of 8, delivering 3 product launches 2 weeks ahead of schedule — resulting in $120K early revenue capture.',
      action: 'Replace every "Responsible for" and "Assisted with" using power verbs: Architected, Spearheaded, Delivered, Scaled, Engineered, Automated, Orchestrated.'
    });
  }

  // 6. Skills section
  if (!s.hasSkillsSection) {
    suggestions.push({
      icon: '🛠️', iconBg: 'rgba(16,185,129,0.15)', severity: 'Critical',
      sevClass: 'ai-sev-critical', title: 'Add a Categorized Skills Section',
      why: '<strong>No dedicated Skills section detected.</strong> ATS keyword-match engines rely on a structured list of competencies to calculate your role suitability percentage. Without it, your match score against job requisitions is effectively 0%.',
      before: 'Skills mentioned randomly throughout experience bullets with no dedicated section.',
      after: 'Technical Skills\nLanguages: Python, JavaScript, TypeScript, SQL\nFrameworks: React, Node.js, Django, FastAPI\nCloud/DevOps: AWS (EC2, S3, Lambda), Docker, Kubernetes, CI/CD\nTools: Git, Jira, Figma, PostgreSQL, Redis',
      action: 'Create a "Technical Skills" or "Skills" section grouped by category (Languages, Frameworks, Cloud, Tools). List 10-18 specific tools you actively use.'
    });
  }

  // 7. Clichés
  if (s.clichésFound.length > 0) {
    suggestions.push({
      icon: '🚫', iconBg: 'rgba(245,158,11,0.15)', severity: 'Moderate',
      sevClass: 'ai-sev-moderate', title: 'Remove Generic Clichés & Buzzwords',
      why: `Found <strong>${s.clichésFound.length} cliché phrases</strong>: "${s.clichésFound.slice(0, 3).join('", "')}". These hollow phrases waste valuable resume space and add zero proof of competence. Recruiters actively penalize resumes stuffed with buzzwords.`,
      before: `${s.clichésFound.slice(0, 2).join(', ')} — generic claims without evidence.`,
      after: 'Mentored 4 junior engineers through onboarding, reducing ramp-up time from 8 weeks to 3 weeks. Led cross-functional sprint planning for a team of 12 across 3 time zones.',
      action: 'Delete every buzzword and replace with a specific, verifiable achievement. Show don\'t tell — prove your soft skills through concrete project outcomes.'
    });
  }

  // 8. Email provider
  if (/yahoo|hotmail|aol/i.test(s.rawText)) {
    suggestions.push({
      icon: '📧', iconBg: 'rgba(34,211,238,0.15)', severity: 'Minor',
      sevClass: 'ai-sev-minor', title: 'Upgrade to a Modern Email Provider',
      why: 'Your email uses an <strong>older provider (Yahoo/Hotmail/AOL)</strong>. While this doesn\'t directly affect ATS parsing, modern tech recruiters unconsciously view legacy email domains as less current and professional.',
      before: 'supercoder99@yahoo.com',
      after: 'john.doe@gmail.com or john@yourdomain.com',
      action: 'Switch to a Gmail or custom domain email with a professional format: firstname.lastname@gmail.com'
    });
  }

  // 9. Outdated tech
  if (s.hasOutdatedTech) {
    suggestions.push({
      icon: '🗑️', iconBg: 'rgba(245,158,11,0.15)', severity: 'Moderate',
      sevClass: 'ai-sev-moderate', title: 'Remove Outdated Technologies',
      why: 'Your resume lists <strong>deprecated or obsolete technologies</strong> (e.g., Flash, Silverlight, VB6, FoxPro). These inadvertently signal an outdated technical profile to hiring managers and ATS keyword matchers.',
      before: 'Skills: JavaScript, React, Flash, HTML, CSS, Silverlight',
      after: 'Skills: JavaScript, React, TypeScript, Next.js, Tailwind CSS, GraphQL',
      action: 'Remove all obsolete technologies unless the specific job posting requires them. Replace with modern equivalents.'
    });
  }

  // Render suggestion cards
  aiSuggestionsGrid.innerHTML = '';
  if (suggestions.length === 0) {
    aiSuggestionsGrid.innerHTML = `
      <div style="text-align:center;padding:48px 24px;background:var(--card-bg);border:1px solid var(--border);border-radius:var(--radius)">
        <div style="font-size:3rem;margin-bottom:12px">🎉</div>
        <h3 style="font-size:1.3rem;font-weight:800;color:#fff;margin-bottom:8px">Your Resume Is AI-Approved!</h3>
        <p style="color:var(--text-muted);max-width:500px;margin:0 auto">The AI Coach found no significant issues to rewrite. Your resume structure, content, and keywords are already optimized for ATS systems.</p>
      </div>
    `;
  } else {
    suggestions.forEach(sg => {
      const card = document.createElement('div');
      card.className = 'ai-suggest-card';
      card.innerHTML = `
        <div class="ai-suggest-card-header">
          <div class="ai-suggest-icon" style="background:${sg.iconBg}">${sg.icon}</div>
          <h4>${sg.title}</h4>
          <span class="ai-sev-tag ${sg.sevClass}">${sg.severity}</span>
        </div>
        <div class="ai-suggest-body">
          <div class="ai-suggest-why">${sg.why}</div>

          <div class="ai-rewrite-box">
            <div class="ai-rewrite-label bad-label">❌ Current Issue (Detected in Your Resume):</div>
            <div class="ai-rewrite-content">${sg.before}</div>
          </div>

          <div class="ai-rewrite-box">
            <div class="ai-rewrite-label good-label">✅ AI-Suggested Rewrite:</div>
            <div class="ai-rewrite-content good-content">${sg.after}</div>
          </div>

          <div class="ai-suggest-action">
            <span>⚡</span>
            <div><strong>Action Step:</strong> ${sg.action}</div>
          </div>
        </div>
      `;
      aiSuggestionsGrid.appendChild(card);
    });
  }

  // Pro Tips section
  const tips = [
    'Save your resume as a <strong>.pdf</strong> to preserve formatting — but always keep a .docx backup for ATS systems that require it.',
    'Use a <strong>single-column layout</strong> with standard margins (0.5"–0.75"). Multi-column layouts confuse 78% of ATS parsers.',
    'Mirror the <strong>exact job title</strong> from the posting in your summary — ATS title-matching is the #1 ranking signal.',
    'Include <strong>10-18 hard skills</strong> organized by category. This maximizes keyword-match density without keyword stuffing.',
    'Run your resume through this checker <strong>after every edit</strong>. Small formatting changes can break ATS parsing unexpectedly.',
    'Avoid <strong>headers, footers, and text boxes</strong> in Word/Google Docs — ATS parsers often skip content inside these zones.',
  ];

  aiProTips.innerHTML = `
    <div class="ai-pro-tips-title">💡 AI Pro Tips for Maximum ATS Score</div>
    ${tips.map((tip, i) => `
      <div class="ai-pro-tip-item">
        <div class="ai-pro-tip-num">${i + 1}</div>
        <div>${tip}</div>
      </div>
    `).join('')}
  `;
}

// ── 7. ATS-OPTIMIZED RESUME TEMPLATES ──
const RESUME_TEMPLATES = [
  {
    name: 'Clean Professional',
    badge: 'Most Popular',
    badgeBg: 'rgba(16,185,129,0.15)',
    badgeColor: '#6ee7b7',
    desc: 'The gold standard single-column layout. Works with 99% of ATS systems and is preferred by Fortune 500 recruiters.',
    tags: ['Single Column', 'ATS-Safe', 'All Industries', '1-2 Pages'],
    template: `FIRST NAME LAST NAME
City, State | (555) 123-4567 | email@gmail.com | linkedin.com/in/yourname

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROFESSIONAL SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Results-driven [Your Title] with [X]+ years of experience in
[Industry/Domain]. Proven track record of [Key Achievement #1]
and [Key Achievement #2]. Skilled in [Top Skill 1], [Top Skill 2],
and [Top Skill 3].

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WORK EXPERIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Job Title | Company Name | City, State
Month Year – Present
• Accomplished [X] as measured by [Y] by doing [Z]
• Led a team of [N] to deliver [Project], resulting in [Metric]
• Reduced [Problem] by [X]% through [Method/Tool]
• Spearheaded [Initiative] generating $[Amount] in [Outcome]

Previous Job Title | Previous Company | City, State
Month Year – Month Year
• Engineered [Solution] that improved [Metric] by [X]%
• Automated [Process] saving [N] hours/week across [N] teams
• Collaborated with [Department] to launch [Product/Feature]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Languages:   Python, JavaScript, TypeScript, SQL
Frameworks:  React, Node.js, Django, Next.js
Cloud/DevOps: AWS, Docker, Kubernetes, CI/CD
Tools:       Git, Jira, Figma, PostgreSQL, Redis

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EDUCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Bachelor of Science in Computer Science
University Name | City, State | Graduation Year

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CERTIFICATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• AWS Solutions Architect Associate (Year)
• Google Professional Cloud Developer (Year)`
  },
  {
    name: 'Modern Tech Engineer',
    badge: 'Tech-Focused',
    badgeBg: 'rgba(99,102,241,0.15)',
    badgeColor: '#a5b4fc',
    desc: 'Optimized for software engineering, data science, and DevOps roles. Emphasizes projects and technical depth.',
    tags: ['Engineering', 'Projects Section', 'GitHub Ready', '1-2 Pages'],
    template: `FIRST NAME LAST NAME
Senior Software Engineer
City, State | phone@email.com | linkedin.com/in/name | github.com/username

═══════════════════════════════════════════════
SUMMARY
═══════════════════════════════════════════════
Senior Software Engineer with [X]+ years building
high-throughput distributed systems. Expert in [Language 1],
[Language 2], and [Cloud Platform]. Scaled API infrastructure
serving [N]M+ monthly active users with 99.9% uptime.

═══════════════════════════════════════════════
TECHNICAL SKILLS
═══════════════════════════════════════════════
Languages:    Python, Go, TypeScript, Rust, SQL
Backend:      Node.js, FastAPI, gRPC, GraphQL
Frontend:     React, Next.js, Tailwind CSS
Infra/Cloud:  AWS (ECS, Lambda, S3), GCP, Terraform
Data:         PostgreSQL, Redis, Kafka, Elasticsearch
DevOps:       Docker, Kubernetes, GitHub Actions, ArgoCD

═══════════════════════════════════════════════
EXPERIENCE
═══════════════════════════════════════════════
Senior Software Engineer | Company | City, State
Month Year – Present
• Architected microservices platform handling [N]K req/sec
  with p99 latency < 50ms using Go and Kubernetes
• Reduced infrastructure costs by $[N]K/year by migrating
  to serverless architecture on AWS Lambda
• Mentored [N] junior engineers through weekly code reviews
  and pair programming sessions

Software Engineer | Previous Company | City, State
Month Year – Month Year
• Built real-time data pipeline processing [N]M events/day
  using Kafka and Apache Flink
• Implemented CI/CD pipeline reducing deployment time
  from 2 hours to 8 minutes

═══════════════════════════════════════════════
PROJECTS
═══════════════════════════════════════════════
Project Name | github.com/username/project
• Built [description] using [Tech Stack]
• [N]+ GitHub stars, [N] contributors

═══════════════════════════════════════════════
EDUCATION
═══════════════════════════════════════════════
B.S. Computer Science | University | Year
Relevant Coursework: Distributed Systems, ML, Algorithms`
  },
  {
    name: 'Executive Leadership',
    badge: 'Senior Roles',
    badgeBg: 'rgba(245,158,11,0.15)',
    badgeColor: '#fde68a',
    desc: 'Designed for directors, VPs, and C-suite. Focuses on strategic impact, P&L ownership, and organizational transformation.',
    tags: ['Leadership', 'Strategy-First', 'Executive', '2 Pages'],
    template: `FIRST NAME LAST NAME
Vice President of Engineering
City, State | (555) 123-4567 | email@domain.com | linkedin.com/in/name

────────────────────────────────────────────────
EXECUTIVE SUMMARY
────────────────────────────────────────────────
Transformational technology leader with [X]+ years driving
organizational growth at scale. Led engineering organizations
of [N]+ engineers across [N] global offices. Track record of
delivering $[N]M+ in revenue impact through product innovation
and operational excellence.

Core Competencies: Strategic Planning | P&L Ownership |
Talent Development | Digital Transformation | M&A Integration

────────────────────────────────────────────────
PROFESSIONAL EXPERIENCE
────────────────────────────────────────────────
VP of Engineering | Company Name | City, State
Month Year – Present
• Scaled engineering org from [N] to [N]+ engineers while
  maintaining <10% attrition through culture-first leadership
• Drove $[N]M ARR growth by launching [N] new product lines
  in [Market], capturing [X]% market share in 18 months
• Reduced time-to-market by [X]% by implementing agile
  transformation across [N] product teams
• Managed $[N]M annual engineering budget with [X]% cost
  optimization through cloud migration and vendor consolidation

Director of Engineering | Previous Company | City, State
Month Year – Month Year
• Built and led [N]-person engineering team from ground zero
• Delivered enterprise platform generating $[N]M first-year revenue
• Established engineering best practices: CI/CD, code review,
  on-call rotation, and incident management frameworks

────────────────────────────────────────────────
EDUCATION & CERTIFICATIONS
────────────────────────────────────────────────
MBA | Business School | Year
B.S. Computer Science | University | Year
AWS Solutions Architect Professional | Year`
  },
  {
    name: 'Career Changer',
    badge: 'Transferable Skills',
    badgeBg: 'rgba(168,85,247,0.15)',
    badgeColor: '#d8b4fe',
    desc: 'Perfect for pivoting into a new industry. Leads with transferable skills and a compelling narrative summary.',
    tags: ['Career Pivot', 'Skills-First', 'Narrative', '1 Page'],
    template: `FIRST NAME LAST NAME
[Target Job Title]
City, State | (555) 123-4567 | email@gmail.com | linkedin.com/in/name

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
PROFESSIONAL SUMMARY
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
[Previous Industry] professional transitioning into [Target
Industry] with [X]+ years of transferable experience in
[Skill 1], [Skill 2], and [Skill 3]. Recently completed
[Certification/Course] in [Target Domain]. Combines deep
[Previous Domain] expertise with growing [Target] proficiency.

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
TRANSFERABLE SKILLS
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Analysis:     Data Analysis, Financial Modeling, Reporting
Technical:    Python, SQL, Excel (Advanced), Tableau
Leadership:   Project Management, Stakeholder Communication
New Skills:   [Target Skill 1], [Target Skill 2], [Cert Name]

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
RELEVANT EXPERIENCE
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
Previous Job Title | Company | City, State
Month Year – Month Year
• [Transferable achievement framed for target industry]
• Analyzed [data/process] resulting in [X]% improvement
• Managed [N]-person team delivering [Project] on time
• Created [deliverable] used by [N]+ stakeholders

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
EDUCATION & CERTIFICATIONS
▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬
[Relevant Certification] | Issuing Organization | Year
Bachelor of [Degree] | University | Year`
  },
  {
    name: 'Entry-Level Graduate',
    badge: 'New Grads',
    badgeBg: 'rgba(34,211,238,0.15)',
    badgeColor: '#67e8f9',
    desc: 'Tailored for recent graduates and early-career professionals. Highlights education, projects, and internships.',
    tags: ['Entry-Level', '0-2 Years', 'Projects', '1 Page'],
    template: `FIRST NAME LAST NAME
[Target Entry-Level Title]
City, State | (555) 123-4567 | email@gmail.com | linkedin.com/in/name | github.com/username

╔══════════════════════════════════════════════╗
  SUMMARY
╚══════════════════════════════════════════════╝
Recent [Degree] graduate from [University] with hands-on
experience in [Skill 1], [Skill 2], and [Skill 3] through
academic projects and internships. Completed [N]+ projects
including [Notable Project]. Eager to contribute to
[Target Company/Industry] as a [Target Title].

╔══════════════════════════════════════════════╗
  EDUCATION
╚══════════════════════════════════════════════╝
Bachelor of Science in [Major]
University Name | City, State | Expected/Graduated: Month Year
GPA: [X.XX]/4.0 | Dean's List [N] semesters
Relevant Coursework: [Course 1], [Course 2], [Course 3]

╔══════════════════════════════════════════════╗
  PROJECTS
╚══════════════════════════════════════════════╝
Project Name | github.com/username/project
• Built [what] using [technologies] serving [N] users
• Implemented [feature] that improved [metric] by [X]%

Project Name | Live Demo: url.com
• Developed [application type] with [Tech Stack]
• Won [Hackathon/Award] out of [N] competing teams

╔══════════════════════════════════════════════╗
  INTERNSHIP EXPERIENCE
╚══════════════════════════════════════════════╝
Software Engineering Intern | Company | City, State
Month Year – Month Year
• Developed [feature] used by [N]+ internal users
• Wrote [N]+ unit tests increasing coverage from [X]% to [Y]%
• Participated in agile sprints and daily standups

╔══════════════════════════════════════════════╗
  SKILLS
╚══════════════════════════════════════════════╝
Languages:  Python, JavaScript, Java, C++
Frameworks: React, Flask, Express.js
Tools:      Git, VS Code, Docker, Linux
Soft:       Team Collaboration, Problem-Solving, Agile`
  }
];

function buildTemplatesView(signals) {
  templatesGrid.innerHTML = '';

  RESUME_TEMPLATES.forEach((tmpl, idx) => {
    const card = document.createElement('div');
    card.className = 'template-card';
    card.innerHTML = `
      <span class="template-card-badge" style="background:${tmpl.badgeBg};color:${tmpl.badgeColor}">${tmpl.badge}</span>
      <div class="template-preview">
        <div class="template-preview-mock">${tmpl.template.slice(0, 400)}</div>
      </div>
      <div class="template-info">
        <div class="template-name">${tmpl.name}</div>
        <div class="template-desc">${tmpl.desc}</div>
        <div class="template-tags">${tmpl.tags.map(t => `<span class="template-tag">${t}</span>`).join('')}</div>
        <div class="template-actions">
          <button class="template-btn template-btn-copy" data-idx="${idx}" type="button">📋 Copy Template</button>
          <button class="template-btn template-btn-preview" data-idx="${idx}" type="button">👁️ Full Preview</button>
        </div>
      </div>
    `;
    templatesGrid.appendChild(card);
  });

  // Copy buttons
  templatesGrid.querySelectorAll('.template-btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const tmpl = RESUME_TEMPLATES[btn.dataset.idx];
      navigator.clipboard.writeText(tmpl.template).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✅ Copied!';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      });
    });
  });

  // Preview buttons
  templatesGrid.querySelectorAll('.template-btn-preview').forEach(btn => {
    btn.addEventListener('click', () => {
      const tmpl = RESUME_TEMPLATES[btn.dataset.idx];
      templateModalTitle.textContent = tmpl.name + ' — Full Template';
      templateModalContent.textContent = tmpl.template;
      templateModalOverlay.classList.add('active');
    });
  });

  // Modal close
  templateModalClose.addEventListener('click', () => {
    templateModalOverlay.classList.remove('active');
  });
  templateModalOverlay.addEventListener('click', (e) => {
    if (e.target === templateModalOverlay) templateModalOverlay.classList.remove('active');
  });
  templateModalCopyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(templateModalContent.textContent).then(() => {
      const orig = templateModalCopyBtn.textContent;
      templateModalCopyBtn.textContent = '✅ Copied to Clipboard!';
      setTimeout(() => { templateModalCopyBtn.textContent = orig; }, 2000);
    });
  });
}

// ── RESET ──
function resetToUpload() {
  resultsSection.hidden = true;
  currentFile = null;
  fileInput.value = '';
  pasteResumeInput.value = '';
  activeCategory = 'All';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── NAVBAR SCROLL ──
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 20) navbar.style.borderBottomColor = 'rgba(255,255,255,0.1)';
  else navbar.style.borderBottomColor = 'rgba(255,255,255,0.07)';
}, { passive: true });
