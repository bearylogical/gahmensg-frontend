import * as d3 from 'd3';

export let mainChartColors = {
    borderColor: '#E5E7EB',
    labelColor: '#6B7280',
    opacityFrom: 0.65,
    opacityTo: 0,

};

// format y axis labels using d3 format with $ sign
function formatYAxis(value) {
    return d3.format("$,.4s")(value).replace("G", "B");
};

export let chartOptions = {
    chart: {
        height: 420,
        type: 'area',
        fontFamily: 'Inter, sans-serif',
        foreColor: mainChartColors.labelColor,
        toolbar: {
            show: true,
            tools: {
                download: false,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: true,
            },
            autoSelected: 'zoom'
        },
    },
    fill: {
        type: 'gradient',
        gradient: {
            enabled: true,
            opacityFrom: mainChartColors.opacityFrom,
            opacityTo: mainChartColors.opacityTo,
        }
    },
    dataLabels: {
        enabled: false
    },

    tooltip: {
        style: {
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif'
        }
    },
    grid: {
        show: true,
        borderColor: mainChartColors.borderColor,
        strokeDashArray: 1,
        padding: {
            left: 35,
            bottom: 15
        }
    },
    series: [],
    markers: {
        size: [5, 5, 5],
        strokeColors: '#ffffff',
        hover: {
            size: undefined,
            sizeOffset: 3
        }
    },
    xaxis: {
        tickPlacement: 'on',
        labels: {
            style: {
                colors: [mainChartColors.labelColor],
                fontSize: '14px',
                fontWeight: 500
            }
        },
        axisBorder: {
            color: mainChartColors.borderColor
        },
        axisTicks: {
            color: mainChartColors.borderColor
        },
        crosshairs: {
            show: true,
            position: 'back',
            stroke: {
                color: mainChartColors.borderColor,
                width: 2,
                dashArray: 10
            }
        },

    },

    yaxis: {
        min: 0,
        labels: {
            style: {
                colors: [mainChartColors.labelColor],
                fontSize: '14px',
                fontWeight: 500
            },
            formatter: formatYAxis
        }
    },
    legend: {
        fontSize: '14px',
        fontWeight: 500,
        fontFamily: 'Inter, sans-serif',
        labels: {
            colors: [mainChartColors.labelColor]
        },
        itemMargin: {
            horizontal: 12
        }
    },
    responsive: [
        {
            breakpoint: 1024,
            options: {
                xaxis: {
                    labels: {
                        show: false
                    }
                }
            }
        }
    ]
};