<script lang="ts">
    import type { SizeType } from "flowbite-svelte";
    import { twMerge } from "tailwind-merge";
    export let value: number;
    export let unit: string = "%";
    export let since: string = "vs last month";
    export let sinceSubtitle: boolean = true;

    const colorUp = "text-green-500 dark:text-green-400";
    const colorDown = "text-red-500 dark:text-red-400";

    export let size: SizeType = "md";
    export let equalHeight: boolean = false;

    const textSize = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
    };

    const spanTextSize = {
        xs: "text-sm",
        sm: "text-base",
        md: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
    };

    let divClass: string;
    $: divClass = twMerge(textSize[size], $$props.class);
    let color: string;
    $: color = value > 0 ? colorUp : value < 0 ? colorDown : "";
</script>

<div class={divClass}>
    {#if isFinite(value)}
        <span class={color}>
            {#if value > 0}
                <span class="text-base leading-4">↑</span>{value}{unit}
            {:else if value < 0}
                <span class="text-base leading-4">↓</span>{Math.abs(
                    value,
                )}{unit}
            {:else}
                Unchanged
            {/if}
        </span>&nbsp;
        {#if sinceSubtitle}
            <span class="text-base font-light text-gray-500 dark:text-gray-400"
                ><br />{since}</span
            >
        {:else if equalHeight}
            <span>{since}</span>
        {:else}
            <span class={spanTextSize[size]}>{since}</span>
        {/if}
    {/if}
</div>
