<script lang="ts">
  import { parse } from "@twemoji/parser";

  interface Props {
    data: {
      style: 1 | 2 | 3 | 4;
      emoji?: { name: string; id?: string; animated?: boolean };
    };
  }

  let { data }: Props = $props();

  let background = $state("#1f2937");
  if (data.style === 3) {
    background = "#166534";
  } else if (data.style === 4) {
    background = "#c62828";
  }

  // svelte-ignore non_reactive_update
  let emojiUrl = "";

  if (data.emoji && parse(data.emoji.name, { assetType: "png" })[0]?.url) {
    emojiUrl = parse(data.emoji.name, { assetType: "png" })[0].url;
  } else if (data.emoji && data.emoji.id) {
    emojiUrl = `https://cdn.discordapp.com/emojis/${data.emoji.id}`;

    if (data.emoji.animated) {
      emojiUrl = emojiUrl + ".gif";
    } else {
      emojiUrl = emojiUrl + ".png";
    }
  }
</script>

<div
  style="background-color: {background};"
  class="flex h-8 w-16 items-center justify-center overflow-hidden rounded-lg p-[5px] sm:h-12 sm:w-24"
>
  {#if emojiUrl}
    <img src={emojiUrl} class="h-4 opacity-50 sm:h-8" alt="scratch card item" />
  {/if}
</div>
