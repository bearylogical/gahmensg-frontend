<script lang="ts">
    import { pivotWider } from "layerchart";
    import Chart from "./Chart.svelte";
    import Axis from "../chart/Axis.svelte";
    import Bars from "../chart/Bars.svelte";
    import * as d3 from "d3";

    export let data;
    export let xLabel = "Year";
    export let yLabel = "Amount";

    let pivotData: [] = [];

    // filter out only value_type of "ACTUAL"
    $: pivotData = pivotWider(data, "value_year", "value_type", "value_amount");

    let width = 100;
    let height = 500;

    const margins = {
        marginTop: 40,
        marginRight: 30,
        marginBottom: 77,
        marginLeft: 75,
    };
    $: dms = {
        width,
        height,
        ...margins,
        boundedHeight: Math.max(
            height - margins.marginTop - margins.marginBottom,
            0,
        ),
        boundedWidth: Math.max(
            width - margins.marginLeft - margins.marginRight,
            0,
        ),
    };

    $: xAccessor = (d) => d.value_year;
    $: yAccessor = (d) => d.value_amount;

    $: xScale = d3
        .scaleLinear()
        .domain(d3.extent(pivotData, xAccessor))
        .range([0, dms.boundedWidth])
        .nice();

    $: yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([dms.boundedHeight, 0])
        .nice();

    $: xAccessorScaled = (d) => xScale(xAccessor(d));
    $: yAccessorScaled = (d) => yScale(yAccessor(d));
    $: keyAccessor = (d, i) => i;
</script>

<div
    class="ScatterPlot placeholder"
    bind:clientWidth={width}
    bind:clientHeight={height}
>
    <Chart dimensions={dms}>
        <Axis dimension="x" scale={xScale} label={xLabel} />
        <Axis dimension="y" scale={yScale} label={yLabel} />
        <Bars
            {data}
            xAccessor={xAccessorScaled}
            yAccessor={yAccessorScaled}
            {keyAccessor}
            widthAccessor={() => dms.boundedWidth / pivotData.length - 1}
            heightAccessor={(d) => dms.boundedHeight - yAccessorScaled(d)}
            style="fill: #9980fa;"
        />
    </Chart>
</div>
