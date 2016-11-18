#! /usr/local/bin/node

var fs = require('fs');

// Usage:
// ./step.js <stepfile> <filename> <difficulty>

if (process.argv.length != 5) {
    console.log('Usage: ./step.js <stepfile> <filename> <difficulty>');
    process.exit(1);
}

var difficulty = process.argv[4].toLowerCase();
var filename = process.argv[3];
var stepFile = fs.readFileSync(process.argv[2], 'utf8').split('\n').map(function(line) { return line.trim(); });
var position = 0;

var title = advanceAndGetMetadataForKey('TITLE');
var artist = advanceAndGetMetadataForKey('ARTIST');
var bpm = +(advanceAndGetMetadataForKey('BPMS').split('=')[1]);
var beatsPerMeasure = 4;
var tracks = [[], [], [], []];

while (position < stepFile.length) {
    advanceAndGetMetadataForKey('NOTES');
    position++;

    if (stepFile[position] !== 'dance-single:') continue;
    position += 2;

    if (stepFile[position].toLowerCase() !== difficulty + ':') continue;
    position += 3;

    parseNotes();
    break;
}

console.log(JSON.stringify({
    artist: artist,
    name: title,
    track: {
        guitar: tracks,
        drums: tracks
    },
    file: filename,
    difficulty: difficulty[0].toUpperCase() + difficulty.substr(1)
}, null, 2));

function advanceAndGetMetadataForKey(key) {
    for (; position < stepFile.length; position++) {
        var line = stepFile[position];
        if (line[0] === '#') {
            var metadata = line.split(':');
            if (metadata[0] === '#' + key) {
                return metadata[1].split(';')[0];
            }
        }
    }
}

function parseNotes() {
    var beatToLastMeasure = 0;
    var millisPerBeat = 1.0 / bpm * 60000;
    // Skip any comments preceeding the notes
    for (; position < stepFile.length; position++) {
        if (stepFile[position][0] !== '/') break;
    }
    for (;;) {
        var measure = [];
        // Read the measure
        for (; position < stepFile.length; position++) {
            if (stepFile[position][0] === ',' || stepFile[position][0] === ';') break;
            measure.push(stepFile[position]);
        }
        var beatsPerLine = beatsPerMeasure / measure.length;
        measure.forEach(function(measureLine, measureLineIndex) {
            var beatAtThisMeasureLine = beatToLastMeasure + measureLineIndex * beatsPerLine;
            tracks.forEach(function(track, trackIndex) {
                if (measureLine[trackIndex] === '1' || measure[trackIndex] === '2') {
                    //track.push(Math.floor(beatAtThisMeasureLine * millisPerBeat));
                    track.push(Math.round(beatAtThisMeasureLine * millisPerBeat));
                }
            });
        });
        if (stepFile[position][0] === ';') break;
        position++;
        // Use beatToLastMeasure and beatsPerMeasure to prevent accumulation of floating point error
        // since beatsPerMeasure is an integer and beatsPerLine is not necessarily an integer
        beatToLastMeasure += beatsPerMeasure;
    }
    return tracks;
}
