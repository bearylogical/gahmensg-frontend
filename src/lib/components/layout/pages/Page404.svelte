<script lang="ts">
    import { twMerge } from "tailwind-merge";
    export let divClass: string =
        "mr-auto place-self-center lg:col-span-12 text-center";
    export let h1Class: string =
        "mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500";
</script>

<div class={twMerge(divClass, $$props.class)}>
    {#if $$slots.h1}
        <h1 class={twMerge(h1Class, $$props.classH1)}><slot name="h1" /></h1>
    {/if}
    {#if $$slots.paragraph}
        <slot name="paragraph" />
    {/if}
</div>
