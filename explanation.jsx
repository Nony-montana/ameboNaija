// Two things were added:

// **1. Reading Time**

// At the top of every post, next to the date, it now shows something like "· 5 min read". It works by counting all the words in the post content and dividing by 200 (the average reading speed per minute). So a 400-word post shows "2 min read", a 1000-word post shows "5 min read" and so on.

// **2. SEO Meta Tags**

// This is the bigger one. When someone shares your post link on WhatsApp, Twitter or Facebook, instead of just showing a plain URL, it will now show a proper preview card with the post title, a description and the post thumbnail image. This is handled by the `<Helmet>` block which injects tags into the `<head>` of the page for each post. Specifically it sets:

// - **Page title** — the browser tab will show the post title + "| AmeboNaija"
// - **Description** — first 155 characters of the post content, used by Google for search results
// - **Canonical URL** — tells Google the official URL of the post to avoid duplicate content issues
// - **Open Graph tags** — these control how the post looks when shared on WhatsApp, Facebook and LinkedIn — title, image and description
// - **Twitter Card** — same thing but specifically for Twitter/X, shows a large image preview
// - **Article tags** — tells Google the publish date, author name, category and post tags

// The most visible impact will be on WhatsApp sharing — when someone copies and pastes a post link into WhatsApp, it will now show the post image and title as a preview instead of just a raw link.