## How to request a new page from an AI

1. Open `specs/page-request-template.md`.
2. Copy its contents into a new document (or directly into your AI chat).
3. Fill in only the fields you care about (typically: slug, book section, difficulty, a few sources, and goal/must-include bullets).
4. In your message to the AI, include the filled-in request and add an instruction like:

   "Here is a page request for *The Book of Robocode* (see `specs/spec.md`).
   Please write the page as Markdown suitable for VuePress, including frontmatter."

5. Save the AI's output to `docs/articles/<slug>.md` (or the path you specified in the request).

For AI-specific details about how to interpret the request, see `specs/spec.md`, and the other files in the `/specs` folder.
