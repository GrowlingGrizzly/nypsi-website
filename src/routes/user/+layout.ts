import { redirect } from "@sveltejs/kit";

export const load = async ({ url }) => {
  const search = url.searchParams.get("search");

  if (!search) {
    return;
  }

  redirect(300, "/user/" + search);
};
