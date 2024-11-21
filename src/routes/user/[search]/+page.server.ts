import { VIEW_AUTH } from "$env/static/private";
import getItems from "$lib/functions/items.js";
import type Game from "$lib/types/Game.js";
import type { BaseUserData, UserApiResponsexd } from "$lib/types/User.js";
import { error } from "@sveltejs/kit";
import dayjs from "dayjs";

export const load = async ({
  params,
  fetch,
  getClientAddress,
  request,
  locals,
  setHeaders,
  parent,
}) => {
  setHeaders({ "cache-control": "s-maxage=600" });
  const search = params.search;
  let userId: string;

  if (!search) return error(404, { message: "not found" });

  if (search.match(/^\d{17,19}$/)) {
    userId = search;
  } else {
    const res = await fetch(`/api/user/getid/${search}`).then((r) => r.json());

    if (res.id) {
      userId = res.id;
    } else if (res.message === "private profile") {
      if (res.private) return error(403, { message: "private profile" });
    } else {
      return error(404, { message: "unknown user" });
    }
  }

  const [baseUserDataResponse, items] = await Promise.all([
    fetch(`/api/user/${userId}/base`),
    getItems(fetch),
  ]);

  if (baseUserDataResponse.status !== 200) {
    const errorData = await baseUserDataResponse.json();

    return error(baseUserDataResponse.status, errorData.message);
  }

  const before = dayjs()
    .set("minutes", 0)
    .set("seconds", 0)
    .set("milliseconds", 0)
    .toDate()
    .getTime();

  if (request.headers.get("user-agent").toLowerCase().includes("bot")) {
    return {
      baseUserData: (await baseUserDataResponse.json()) as BaseUserData,
      items,
      allUserData: await fetch(`/api/user/${userId}`).then(
        (r) => r.json() as Promise<UserApiResponsexd>,
      ),
      games: (await fetch(`/api/game?user=${userId}&before=${before}&take=20`).then((r) =>
        r.json(),
      )) as Promise<{
        ok: boolean;
        games: Game[];
      }>,
      gamesBefore: before,
    };
  } else {
    return {
      baseUserData: (await baseUserDataResponse.json()) as BaseUserData,
      items,
      allUserData: fetch(`/api/user/${userId}`).then((r) => r.json() as Promise<UserApiResponsexd>),
      games: fetch(`/api/game?user=${userId}&before=${before}&take=20`).then((r) =>
        r.json(),
      ) as Promise<{
        ok: boolean;
        games: Game[];
      }>,
      gamesBefore: before,
      _view: (async () => {
        if (request.headers.get("user-agent").includes("bot")) return;
        const auth = await locals.validate();

        if (auth) {
          if (auth.user.id === userId) return;
        }

        let ip: string;

        try {
          ip = getClientAddress();
        } catch {
          ip = "127.0.0.1";
        }

        return fetch("/api/user/view/add", {
          method: "POST",
          headers: { Authorization: VIEW_AUTH },
          body: JSON.stringify({
            userId,
            viewerId: auth ? auth.user.id : undefined,
            viewerIp: ip,
            referrer: request.headers.get("referer") || undefined,
          }),
        })
          .then((r) => r.json().catch(() => null))
          .catch(() => null);
      })(),
    };
  }
};
