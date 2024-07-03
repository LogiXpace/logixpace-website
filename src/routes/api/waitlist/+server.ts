import { db } from "$lib/db";
import { users } from "$lib/db/schema";
import { EmailSchema } from "$lib/validations/email";
import type { RequestHandler } from "@sveltejs/kit";
import * as v from "valibot"

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.text();
    const valid = v.safeParse(EmailSchema, body);

    if (!valid.success) {
      return new Response(valid.issues[0].message, { status: 400 });
    }

    await db.insert(users).values({ email: valid.output });

    return new Response("succesfully submitted", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
};