import { browser } from "$app/environment";
import type { User } from "lucia";
import { writable } from "svelte/store";

export let auth = writable<Authed | NotAuthed | null>();

type Authed = {
  authenticated: true;
  user: User;
};

type NotAuthed = {
  authenticated: false;
};

export async function getClientAuth() {
  if (!browser) return;

  if (navigator.userAgent.includes("bot")) {
    auth.set({ authenticated: false });
    return;
  }

  const res = await fetch("/api/auth").then((r) => r.json());

  if (res.authenticated) {
    auth.set({ authenticated: true, user: res.user });
  } else {
    auth.set({ authenticated: false });
  }
}
