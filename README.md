# Reetcode


Source of problem sets icons: https://www.iconizer.io/free-duo-tone-icons

Sample page design for new problem page:

https://preply.com/en/tutor/488216#reviews

# Challenge ideas

## Defer offscreen images task.

1. Build a statically generated site, a site generated from a CMS like Contentful or Directus. Or use an open source website fork
2. Run performance check on the website, and show that some images are causing poor load times.
3. Task is to fix the loading of these images so they load at the correct time thus improving TTI of web page.

### Defer offscreen background images task

1. Build a statically generated site, a site generated from a CMS like Contentful or Directus. Or use an open source website fork. Or just a HTML, CSS and JS template index.html file. This site should have a component right down at the bottom that has a heavy sized background image.
2. Run a performance check such that in the diagnosis, Lighthouse recommends deferring images.
2. Task is to fix the loading of this background image so it loads at the correct time thus improving the TTI of the web page. (hint: use intersection observer.)


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

## Remove the feature flags

- Slack just migrated to the new designs using feature flags. Now that all customers are on the new plan, remove the feature flags from the codebase.

## Dynamic card component

- Implement a css only dynamic card component
- You are provided with the Javascript and HTML, and you are required to write only CSS to solve the challenge
- Example markup:

```html
<div class="card">
    <div class="card-media-wrapper" data-media-count="3">
        <div class="card-media" role="img" style="background-image: url('...')">

        </div>
    </div>

    <div class="card-text-wrapper">
        Lorem ...
    </div>

    <div class="card-actions-wrapper">
        <button>Delete card</button>
        <button>View more...</button>
    </div>
</div>
```

You are to style something similar to the designs in the image /public/buffer-dynamic-card.png

## Google Translate Language Search

- Implement the fuzzy search feature on Google Translate Languages
- As user searches, instantly display the results, highlighting in bold the part of the result that closely matched the query searched for. (Google Translate Search Languages)

# How tests Work

1. Each template set of files has a file called `tests.spec.js` or `tests.spec.ts`. 
2. We hide this file from editable results on frontend.
3. To execute tests, we call the Execute API with this file content. 
4. Get back results, parse it, display it.

For running tests in HTML ONLY / VANILLA TEMPLATES, USE THIS TUTORIAL https://dev.to/thawkin3/how-to-unit-test-html-and-vanilla-javascript-without-a-ui-framework-4io?comments_sort=latest
