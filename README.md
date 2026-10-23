# ResumeRoast — private, free ATS preparation

A static, browser-only resume preparation tool. It runs 27 transparent checks across content, ATS readability, design signals, skills, and profile completeness.

## What it does

- Reads pasted text or a local PDF, DOCX, DOC, or TXT file in the browser
- Shows the evidence, explanation, and recommended action for every finding
- Compares resume keywords with a pasted target job description
- Provides rewrite patterns without inventing a user's achievements
- Generates a free downloadable plain-text report and supports printing

## Privacy and scoring

No resume file or text is uploaded by this site. The score is deterministic: the same extracted text produces the same 27-check score. It is a preparation aid, not a simulation or guarantee of a specific employer's ATS decision.

## Run locally

Open `index.html` in a modern browser. The page uses PDF.js and JSZip from CDNJS for PDF and DOCX text extraction.
