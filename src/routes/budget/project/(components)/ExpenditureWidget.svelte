<script lang="ts">
    import ChangeText from "$lib/components/MinistryDashboard/ChangeText.svelte";
    import type { ApexOptions } from "apexcharts";
    import { Card, Chart, Heading } from "flowbite-svelte";
    import { cn } from "$lib/utils/utils";
    export let title: string = "";
    export let subtitle: string = "";
    export let chartOptions: ApexOptions;
    export let changeValue: number = 0;
    export let changeSince: string = "";
</script>

<div class="flex w-full flex-col gap-1">
    <div class="flex items-center">
        <div class="flex items-center gap-2">
            <div class="text-wrap font-semibold text-2xl">
                {title}
            </div>
        </div>
        <div class="ml-auto text-xs text-foreground">
            <ChangeText
                value={changeValue}
                since={changeSince}
                equalHeight={true}
                class="justify-right text-right font-medium"
            />
        </div>
    </div>
</div>
<!-- <div class="mb-6 flex items-center justify-between">
    <div class="w-full flex-shrink-0">
        <div class="flex items-center">
            <Heading tag="h3" class="text-2xl truncate ... ">{title}</Heading>
        </div>
        <p class="text-base font-light text-gray-500 dark:text-gray-400">
            {subtitle}
        </p>
        <ChangeText
            value={changeValue}
            since={changeSince}
            equalHeight={true}
            class="justify-right text-right font-medium"
        />
    </div>
</div> -->

<Chart options={chartOptions}></Chart>
