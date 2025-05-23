<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import { auth } from "$lib/state.svelte.js";
  import { Check } from "@lucide/svelte";
  import { onMount } from "svelte";

  let { data } = $props();

  let captchaElement: HTMLDivElement = $state();
  let form: HTMLFormElement = $state();
  let loaded = $state(false);

  $effect(() => {
    if (!data.solved && loaded) {
      // @ts-expect-error
      hcaptcha?.render(captchaElement, {
        sitekey: env.PUBLIC_HCAPTCHA_SITEKEY,
        theme: "dark",
        callback: () => {
          form.submit();
        },
        "error-callback": () => {
          invalidateAll();
        },
      });
    }
  });

  onMount(() => {
    if (data.authUser && !auth?.value) {
      auth.value = {
        authenticated: true,
        user: data.authUser,
      };
    } else {
      auth.value = {
        authenticated: false,
      };
    }
  });
</script>

<svelte:head>
  <title>captcha | nypsi</title>
  <meta name="og:title" content="captcha | nypsi" />

  <script
    src="https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off"
    async
    defer
    onload={() => (loaded = true)}
  ></script>

  <meta name="robots" content="noindex" />
</svelte:head>

<div class="mt-16 flex w-full justify-center md:mt-32">
  <div class="flex w-full flex-col gap-4 px-4 md:max-w-lg md:px-0">
    {#if data.solved}
      <h1 class="text-success flex justify-center gap-2 text-xl font-bold">
        verified <Check strokeWidth={3} />
      </h1>

      {#if data.rickroll}
        <iframe
          class="h-[200px] w-full rounded-xl md:h-[432px]"
          src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
          title="YouTube video player"
        ></iframe>
      {/if}
    {:else}
      <h1 class="text-error text-center text-xl font-bold">
        complete the captcha to continue using commands
      </h1>

      <form method="POST" class="flex w-full flex-col items-center justify-center" bind:this={form}>
        <div class="h-captcha" bind:this={captchaElement}></div>
      </form>

      <div>
        <h2 class="font-semibold text-slate-500">why do i have to do this?</h2>
        <p>
          on nypsi, automating commands (by use of macros or scripts) is not allowed as it provides
          an unfair advantage. some players still attempt to bypass this rule, thus we implemented a
          system to detect possible cheaters and force them to do captchas.
        </p>
        <br />
        <p>
          failing too many times or ignoring captchas <strong>will</strong> result in a ban from using
          nypsi.
        </p>
      </div>
    {/if}
  </div>
</div>
