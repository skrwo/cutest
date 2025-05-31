# Cutest

## – tiny tests website, hosted on GitHub Pages

Simple tool for creating one-page tests, bingos, quizzes with endless possibilities.

Every test is defined in separate HTML (SEO, Open Graph, styles and more) and JSON (main configuration) files.
Each have different sets of ranks (results), allows custom score calculating JS and CSS styles,
so it's possible to create unique appearence and different questions weights.

Currently only 1 question type – checkmark is implemented, yet it is enough for many interesting things.

## Client-only design

Cutest is developed with no server in mind, so it can be built into static files and hosted on GitHub Pages for free.

Don't forget to set your repository name into [build workflow](.github/workflows/build.yml) env to make it work without custom domain.

## Project Setup

```sh
git clone https://github.com/skrwo/cutest
cd cutest
```

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Add your own tests

Define new files in src/pages and public/tests directories, and you're good to go. Schemes are already simple and easy to understand by looking at the present examples IMO.
