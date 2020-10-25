window.activeGemeinde = null;
window.gemeindeData = null;
getData();

const svgMap = d3.select('#map');
const width = svgMap.attr('width');
const height = svgMap.attr('height');
const Tooltip = d3.select(".tooltip")
    .style("opacity", 0);

fetch('gemeindegrenzen.geojson')
    .then(response => response.json())
    .then(data => {
            const projection = d3.geoMercator()
                .fitExtent([[0,30], [width, height]], data);

            const pathGenerator = d3.geoPath().projection(projection);

            svgMap.selectAll('path')
                .data(data.features)
                .enter().append('path')
                .attr('stroke', 'black')
                .attr('class', 'mapPath')
                .attr('d', d => pathGenerator(d))
                .on('mousemove', mousemove)
                .on('mouseleave', mouseleave)
                .on('mouseover', d => mouseover(d))
                .on('click',  d => mouseclick(d));
            colorMap();
    });

function mouseover(d) {
        Tooltip
            .style("opacity", 1)
            .html(d.properties.gemeinde_n);
};
function mousemove() {
        Tooltip
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 20) + "px");
};
function mouseleave() {
        Tooltip.style("opacity", 0);
};

function mouseclick(d){
        window.activeGemeinde = d;
        showGemeindeData();
        document.getElementById('dataDisplay').scrollIntoView({behavior: 'smooth' });
}


function showGemeindeData() {
        if(window.activeGemeinde != null) {
                const gemId = window.activeGemeinde.properties.gemeinde_b;
                const year = document.getElementById("yearInput").value;
                const display = document.getElementById('dataDisplay');
                const array = window.gemeindeData;
                let totalPopulation = 0;


                let pieArray = [];
                for (let i = 0; i < array.length; i++) {
                        if (array[i].id == gemId && array[i].year == year) {
                                totalPopulation += Number(array[i].count);
                                pieArray.push( {label: array[i].nation, value: Number(array[i].count)});
                        }
                }
                pieArray.sort(function(a,b){
                        return b.value - a.value;
                });

                display.innerHTML = "<p class='info' id='infoTitle'>Ausgewählte Gemeinde: " + window.activeGemeinde.properties["gemeinde_n"] + "</p>" +
                    "<p class='info' style='color: black'>Total: " + totalPopulation + "</p>";

                var color = d3.scaleOrdinal()
                    .domain(pieArray)
                    .range(["#6E0101","#8A0101","#DA0303", "#FE2F00", "#FC4D01", "#F98A03", "#FCB901","#FBDD01"]);

                d3.select("#dataDisplay").selectAll()
                    .data(pieArray)
                    .enter()
                    .append("p")
                    .html(function (d) {
                            return (d.label + ": " + d.value)
                    })
                    .style('background-color', function (d) {
                            return (color(d.value))
                    })
                    .attr("class", "info");

                createChart(pieArray);
        }
}

function createHttpRequest(){
        let httpRequest;
        if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
                httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE 6 and older
                httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return httpRequest;
}

function yearChange(source) {
        const display = document.getElementById("yearDisplay");
        display.innerText = "Jahr: " + source.value;
        showGemeindeData();
        colorMap();
}

function colorMap(){
        let array = window.gemeindeData;
        const year = document.getElementById("yearInput").value;
        d3.selectAll(".mapPath").style("fill", (d) => {
                var swissCount = 0;
                var foreignerCount = 0;
                for(var i = 0; i <  array.length; i++){
                        if(array[i].id == d.properties["gemeinde_b"] && array[i].year == year){
                                if(array[i]["nation"] === "Schweiz"){
                                        swissCount = array[i].count;
                                }else{
                                        foreignerCount += Number(array[i].count);
                                }
                        }
                }
                const percent = 100 / (Number(swissCount) + Number(foreignerCount)) * Number(foreignerCount);
                return "rgb(" + (255 - 255 / 100 * percent)+", "+(255 -255 / 100 * percent-175)+ ", 0)";
        });
}


function getData(){
        const httpRequest = createHttpRequest();
        httpRequest.onreadystatechange = function(){
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                        if (httpRequest.status === 200) {
                                window.gemeindeData = JSON.parse(this.responseText);
                        }
                }
        };
        httpRequest.open("GET", "readCSV.php", true);
        httpRequest.send();
}