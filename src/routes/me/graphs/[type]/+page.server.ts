import getItems from "$lib/functions/items.js";
import getItemCountDataForUser from "$lib/server/functions/graphs/getItemCountDataForUser.js";
import { redirect } from "@sveltejs/kit";

export async function load({ parent, setHeaders, params, url }) {
  try {
    setHeaders({
      "cache-control": "private, max-age=0",
    });
  } catch {}

  const parentData = await parent();

  if (!parentData.user) return;
  if (!parentData.premium) return redirect(302, "/me/graphs");

  const days = parseInt(url.searchParams.get("days")) || 30;

  if (params.type === "balance") {
    return {
      chartData: await getItemCountDataForUser(
        ["user-money"],
        parentData.user.id,
        await getItems(),
        days,
      ),
      options: "money",
    };
  } else if (params.type === "net") {
    return {
      chartData: await getItemCountDataForUser(
        ["user-net"],
        parentData.user.id,
        await getItems(),
        days,
      ),
      options: "money",
    };
  } else if (params.type === "level") {
    return {
      chartData: await getItemCountDataForUser(
        ["user-level"],
        parentData.user.id,
        await getItems(),
        days,
      ),
      options: "karma",
    };
  } else if (params.type === "karma") {
    return {
      chartData: await getItemCountDataForUser(
        ["user-karma"],
        parentData.user.id,
        await getItems(),
        days,
      ),
      options: "karma",
    };
  } else {
    return redirect(302, "/me/graphs");
  }
}
