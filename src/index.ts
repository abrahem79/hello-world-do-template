import { DurableObject } from "cloudflare:workers";

/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

/** A Durable Object's behavior is defined in an exported Javascript class */
export class MyDurableObject extends DurableObject<Env> {
  /**
   * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
   * 	`DurableObjectStub::get` for a given identifier (no-op constructors can be omitted)
   *
   * @param ctx - The interface for interacting with Durable Object state
   * @param env - The interface to reference bindings declared in wrangler.jsonc
   */
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  /**
   * The Durable Object exposes an RPC method sayHello which will be invoked when when a Durable
   *  Object instance receives a request from a Worker via the same method invocation on the stub
   *
   * @returns The greeting to be sent back to the Worker
   */
  async sayHello(): Promise<string> {
    let result = this.ctx.storage.sql
      .exec("SELECT 'Hello, World!' as greeting")
      .one() as { greeting: string };
    return result.greeting;
  }

  /**
   * Handle user state based greeting with conditional logic similar to Vue template
   * 
   * @param isLoaded - Whether the application has finished loading
   * @param isSignedIn - Whether the user is signed in
   * @param fullName - The user's full name (optional)
   * @returns The appropriate greeting based on state
   */
  async getGreeting(isLoaded: boolean, isSignedIn: boolean, fullName?: string): Promise<string> {
    if (!isLoaded) {
      return "Loading...";
    }

    if (isSignedIn) {
      return `Hello ${fullName || 'User'}!`;
    }

    return "Not signed in";
  }
}

export default {
  /**
   * This is the standard fetch handler for a Cloudflare Worker
   *
   * @param request - The request submitted to the Worker from the client
   * @param env - The interface to reference bindings declared in wrangler.jsonc
   * @param ctx - The execution context of the Worker
   * @returns The response to be sent back to the client
   */
  async fetch(request, env, ctx): Promise<Response> {
    // Parse URL and query parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Extract state parameters (similar to Vue template logic)
    const isLoaded = searchParams.get('loaded') !== 'false'; // Default to true unless explicitly false
    const isSignedIn = searchParams.get('signedIn') === 'true';
    const fullName = searchParams.get('fullName') || undefined;

    // Create a `DurableObjectId` for an instance of the `MyDurableObject`
    // class. The name of class is used to identify the Durable Object.
    // Requests from all Workers to the instance named
    // will go to a single globally unique Durable Object instance.
    const id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName(
      url.pathname,
    );

    // Create a stub to open a communication channel with the Durable
    // Object instance.
    const stub = env.MY_DURABLE_OBJECT.get(id);

    // Use conditional logic based on user state (similar to Vue template)
    const greeting = await stub.getGreeting(isLoaded, isSignedIn, fullName);

    return new Response(greeting);
  },
} satisfies ExportedHandler<Env>;
