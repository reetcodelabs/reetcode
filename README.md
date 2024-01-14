# Reetcode


Source of problem sets icons: https://www.iconizer.io/free-duo-tone-icons

Sample page design for new problem page:

https://preply.com/en/tutor/488216#reviews

# Challenge ideas

## Defer offscreen images task.

1. Build a statically generated site, a site generated from a CMS like Contentful or Directus. Or use an open source website fork
2. Run performance check on the website, and show that some images are causing poor load times.
3. Task is to fix the loading of these images so they load at the correct time thus improving TTI of web page.

## Fix time to interactive

- Youtube video embedded on landing page is making it load slowly, and the data shows that only 33% of customers visiting the page click and watch the video. 
Can you propose a fix that works for both customers?

## Modal mounting

- Modal is continuously mounting and unmounting, and everytime it mounts, it makes an API call. Fix so it just mounts once, and does not make an API call again.
- Also fix transition state on modal.

Use the Cowrywise referral modal for this task.

## Make me static

- Write a NodeJS script that generates a static website instead of continuously making API calls and rendering using Server Side Rendering

## Filter the products

- Add a filter to a products catalog search. This filter should allow for sending multiple options to the API. Inspiration is: Boring project Mono filtering.
