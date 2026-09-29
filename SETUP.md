# Portfolio + AI chatbot: setup guide

Your site is a normal website (the `index.html` file plus the `assets` folder) with one extra piece: a small backend function in `api/chat.js` that powers the "Ask about me" chatbot. Hosting both together is free on Vercel. Here is the whole thing, step by step, assuming you have never done this before.

The chatbot will not work when you just open `index.html` on your computer (there is no backend there). It comes alive once the site is deployed on Vercel with your API key set. Everything else (design, projects, CV download) works anywhere.

---

## Part 1: Get a free AI key (Groq), about 3 minutes

1. Go to `https://console.groq.com` and sign up. It is free and does not ask for a card.
2. In the left menu, open **API Keys**.
3. Click **Create API Key**, give it any name, and **copy the key** (it starts with `gsk_`). Keep it somewhere safe. You will paste it into Vercel later. Never put it inside your code or share it publicly.

(If you would rather use Mistral: sign up at `https://console.mistral.ai`, create a key, and see the note at the bottom of this file for the two small code changes.)

---

## Part 2: Put your project on GitHub, about 10 minutes

Vercel deploys from a GitHub repository. If you already have Git set up you can push; if not, the website upload below is the simplest way.

1. Create a free account at `https://github.com` if you do not have one.
2. Click the **+** at the top right, then **New repository**. Name it something like `portfolio`. Leave it Public or Private, your choice. Click **Create repository**.
3. On the new repo page, click **uploading an existing file** (the link in the middle of the page).
4. Unzip the portfolio folder on your computer, then drag these into the upload area, keeping the structure:
   - `index.html`  (must be at the top level, not inside another folder)
   - the `assets` folder
   - the `api` folder
5. Click **Commit changes**.

Important: `index.html` has to sit at the root of the repo, with `assets/` and `api/` next to it. If you accidentally upload the outer `portfolio` folder, just make sure the files end up at the top level.

---

## Part 3: Deploy on Vercel, about 5 minutes

1. Go to `https://vercel.com` and **Sign up with GitHub** (free). Authorize it.
2. Click **Add New... > Project**.
3. Find your `portfolio` repository in the list and click **Import**.
4. On the configure screen:
   - **Framework Preset**: choose **Other** (this is a plain site with a function, no build step).
   - Leave everything else as the default.
5. Open the **Environment Variables** section on that same screen and add one:
   - **Name**: `GROQ_API_KEY`
   - **Value**: paste the `gsk_...` key from Part 1.
   - Add it, then click **Deploy**.
6. Wait about a minute. Vercel gives you a live link like `your-portfolio.vercel.app`. Open it. Your site is live, and the chatbot works.

If you deployed before adding the key, add it under **Settings > Environment Variables**, then go to **Deployments**, open the latest one, and choose **Redeploy** so the function picks up the key.

---

## Part 4 (optional): Your own domain

In Vercel, open your project, go to **Settings > Domains**, and add a domain you own. Vercel shows you the DNS records to set. If you do not have a domain, the free `.vercel.app` link is perfectly fine to put on your CV and LinkedIn.

---

## Updating the site later

Whenever you change a file (for example when you add your header photo at `assets/hero.jpg`), upload the new file to the GitHub repo. Vercel notices the change and redeploys automatically within a minute. No extra steps.

Photos the site is waiting for (drop them into `assets/` with these exact names and they replace the placeholders automatically):
- `assets/hero.jpg`  (your header photo)
- `assets/opus-lab.jpg`  (the Opus Lab teaching photo)
- `assets/fitt.jpg`  (the FITT / Ambassadors photo)

Also remember to replace the GitHub link in the contact section of `index.html` (there is a `TODO` comment next to it) once your GitHub profile is ready.

---

## No-GitHub alternative (Vercel CLI)

If you prefer not to use GitHub:
1. Install Node.js from `https://nodejs.org`.
2. Open a terminal in the unzipped `portfolio` folder.
3. Run `npm i -g vercel`, then `vercel` and follow the prompts to log in and deploy.
4. Add the key with `vercel env add GROQ_API_KEY` (paste the key when asked), then run `vercel --prod` to redeploy.

---

## Switching from Groq to Mistral (optional)

Open `api/chat.js` and change three things:
- `API_URL` to `https://api.mistral.ai/v1/chat/completions`
- `MODEL` to `mistral-small-latest`
- everywhere it says `process.env.GROQ_API_KEY`, use `process.env.MISTRAL_API_KEY`, and name the Vercel variable `MISTRAL_API_KEY`.

---

## Costs, in one line

Vercel hosting: free. Groq (or Mistral) free tier: free, with generous rate limits. Because the key is a free-tier key, there is no billing even if the chatbot gets heavy use. The worst case is a short "try again in a minute" if limits are hit.
