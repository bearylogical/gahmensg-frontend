export function transformData(data) {
    let transformedData = {
        series: [],
        xaxis: {
            categories: [],
            labels: {
                style: {
                    colors: [mainChartColors.labelColor],
                    fontSize: '14px',
                    fontWeight: 500
                }
            },
            axisBorder: {
                color: mainChartColors.borderColor
            }
        }
    };

    let series = [];
    let categories = [];

    data.forEach((item) => {
        series.push(item.value);
        categories.push(item.date);
    });

    transformedData.series.push({
        name: 'Value',
        data: series
    });

    transformedData.xaxis.categories = categories;

    return transformedData;
}