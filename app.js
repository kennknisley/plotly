// Pull Results
function buildMetadata(sample) {
    d3.json("samples.json").then((data) =>{
        var metaData = data.metadata;
        var resultsArray = metaData.filter(sampleObject => sampleObject.id == sample);
        var results = resultsArray[0];
        var panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(results).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });
}

function buildSampleData(sampleData) {
    d3.json("samples.json").then((data) => {
        var samplesData = data.samples;
        var samplesResultsArray = samplesData.filter(sampleObject => sampleObject.id == sampleData);
        var samplesResults = samplesResultsArray [0];
        var otu_ids = samplesResults.otu_ids;
        var otu_labels = samplesResults.otu_labels;
        var sample_values = samplesResults.sample_values;

        var layout = {
            title: "Bacteria Samples",
            margin: {t:0},
            hovemode: 'closest',
            xaxis: { title: "OTU IDs"},
            // margin:(t:15)
        };

        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "YlOrRd",
            }
        }];

        Plotly.newPlot("bubble", bubbleData, layout);

        var yticks = otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse();

        var barData = [{
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            text: otu_labels.slice(0,10).reverse(),
            type: "bar",
            orientation:"h"
        }];

        var barLayout = {
            title: "Top 10 Cultures Found",
            margin: {t:30, l:150},
            xaxis: {title: "OTU"},
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}



function init(){
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset")
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        // Use the first sample from the list to build the initial plots
        var firstSample = sampleNames[0];
        buildSampleData(firstSample);
        buildMetadata(firstSample);        
    });
}

function optionChanged(newSample) {
    buildSampleData(newSample)
    buildMetadata(newSample)
}

init();