// test/index.spec.ts
import { describe, it, expect } from "vitest";
import { env } from 'cloudflare:test'
import app from '../src/index'


describe("Example test", () => {
  it("respond with success", async () => {
   
    const response =  await app.request("/", {}, env)
    const data = await response.json();
    expect(data).toEqual({ success: true });
  });
});


