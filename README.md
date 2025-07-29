# Durable Objects Starter

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/templates/tree/main/hello-world-do-template)

<!-- dash-content-start -->

This is a [Durable Object](https://developers.cloudflare.com/durable-objects/) starter template. It comes with a `sayHello` method that returns `Hello World!`.

<!-- dash-content-end -->

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```bash
npm create cloudflare@latest -- --template=cloudflare/templates/hello-world-do-template
```

## Getting Started

First, run:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then run the development server (using the package manager of your choice):

```bash
npm run dev
```

Open [http://localhost:8787](http://localhost:8787) with your browser to see the result.

You can start editing the project by modifying `src/index.ts`.

## Features

The application now supports conditional responses based on user state, similar to Vue.js template logic:

- **Loading state**: `/?loaded=false` - Returns "Loading..."
- **Signed in state**: `/?signedIn=true&fullName=YourName` - Returns "Hello YourName!"
- **Not signed in state**: `/` (default) - Returns "Not signed in"

### Examples

```bash
# Default state (not signed in)
curl http://localhost:8787/

# Loading state
curl http://localhost:8787/?loaded=false

# Signed in with name
curl "http://localhost:8787/?signedIn=true&fullName=John%20Doe"

# Signed in without name (defaults to "User")
curl http://localhost:8787/?signedIn=true
```

## Deploying To Production

| Command          | Action                                |
| :--------------- | :------------------------------------ |
| `npm run deploy` | Deploy your application to Cloudflare |

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Durable Objects](https://developers.cloudflare.com/durable-objects/) - learn about Durable Objects

Your feedback and contributions are welcome!
