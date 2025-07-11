<!-- src/lib/ScreenSizeWarning.svelte -->
<script>
  import { onMount, onDestroy } from "svelte";
  import { mdiPhoneRotateLandscape } from "@mdi/js";
  import { Icon } from "svelte-ux";

  export let minWidth = 768; // Example: Common tablet portrait width
  export let minHeight = 300; // Example: Common mobile landscape height

  let windowWidth = 0;
  let windowHeight = 0;
  let isMounted = false;

  function updateWindowDimensions() {
    if (isMounted) {
      windowWidth = window.innerWidth;
      windowHeight = window.innerHeight;
    }
  }

  onMount(() => {
    isMounted = true;
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
  });

  onDestroy(() => {
    if (isMounted) {
      window.removeEventListener("resize", updateWindowDimensions);
    }
  });

  // Check if current dimensions are unsuitable at all
  $: isUnsuitable =
    isMounted && (windowWidth < minWidth || windowHeight < minHeight);

  // Determine if rotating to landscape would satisfy *both* minWidth and minHeight
  // (i.e., if current height becomes new width, and current width becomes new height)
  $: canBeFixedByLandscape =
    isMounted && // Make sure we're on the client
    isUnsuitable && // Only check if currently unsuitable
    windowHeight >= minWidth && // Current height would satisfy minWidth when rotated
    windowWidth >= minHeight; // Current width would satisfy minHeight when rotated

  // The final message to display
  $: displayRecommendation = "";
  $: if (isUnsuitable) {
    if (canBeFixedByLandscape) {
      displayRecommendation = "please rotate your device to landscape mode.";
    } else {
      displayRecommendation = "please switch to a larger device.";
    }
  }
</script>

{#if isUnsuitable}
  <div class="screen-size-warning">
    <!-- The main dynamic message -->
    <p>
      For the best experience, {displayRecommendation}
      {#if canBeFixedByLandscape}
        <p>
          <Icon
            data={mdiPhoneRotateLandscape}
            size={24}
            class="inline-block mb-1"
          ></Icon>
        </p>
      {/if}
    </p>
  </div>
{:else}
  <slot></slot>
{/if}

<style>
  .screen-size-warning {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;
    z-index: 9999;
    font-family: sans-serif;
  }

  .screen-size-warning p {
    margin: 10px 0;
    max-width: 600px;
  }

  /* Basic responsiveness for font size */
  @media (max-width: 480px) {
    .screen-size-warning p {
      font-size: 1.1em;
    }
  }
</style>
