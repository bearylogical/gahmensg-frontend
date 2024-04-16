<script lang="ts">
    import ChangeText from "./ChangeText.svelte";
    import type { ApexOptions } from "apexcharts";
    import { Card, Chart, Heading } from "flowbite-svelte";

    export let title: string = "";
    export let subtitle: string = "";
    export let chartOptions: ApexOptions;
    export let changeValue: number = 0;
    export let changeSince: string = "";
</script>

<Card size="xl" class="w-full max-w-none">
    <div class="mb-4 flex items-center justify-between">
        <div class="flex-shrink-0">
            <Heading tag="h3" class="text-2xl">{title}</Heading>
            <p class="text-base font-light text-gray-500 dark:text-gray-400">
                {subtitle}
            </p>
        </div>
        <ChangeText
            value={changeValue}
            since={changeSince}
            equalHeight={true}
            class="justify-right text-right font-medium"
        />
    </div>

    <Chart options={chartOptions}></Chart>
</Card>
