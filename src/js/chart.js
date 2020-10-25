
const widthChart = 450;
const heightChart = 450;
const margin = 40;



function createChart(data){

    var total = 0;
    data.forEach((d) => {
        total += d.value;
    });

    var radius = Math.min(widthChart, heightChart) / 2 - margin;

    const svg = d3.select("#chart")
        .html("")
        .append("svg")
        .attr("width", widthChart)
        .attr("height", heightChart)
        .append("g")
        .attr("transform", "translate(" + widthChart / 2 + "," + heightChart / 2 + ")");

    var pie = d3.pie()
        .value(function (d) {
            return d.value;
        })
    var data_ready = pie(data);

    var color = d3.scaleOrdinal()
        .domain(data)
        .range(["#6E0101","#8A0101","#DA0303", "#FE2F00", "#FC4D01", "#F98A03", "#FCB901","#FBDD01"]);

    svg
        .selectAll()
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(100)
            .outerRadius(radius)
        )
        .attr('fill', function (d) {
            return (color(d.data.value))
        })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave)
        .on('mouseover', d => {
            Tooltip
                .style("opacity", 1)
                .html(d.data.label + ": " + (100 / total * d.data.value).toFixed(1) + "%");
        })
}
