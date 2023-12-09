
function chebyshev(start, end) {
    return Math.max(Math.pow(start.x - end.x, 2), Math.pow(start.y - end.y, 2));
}

function euclidian(start, end) {
    return Math.sqrt(Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2));
}

function manhattan(start, end) {
    return Math.abs((start.x - end.x) + (start.y - end.y))
}

async function getMapFile(filename) {
    const file = await (await fetch(window.location.origin + filename)).arrayBuffer();
    return await XLSX.utils.sheet_to_json(XLSX.read(file)
        .Sheets['Sheet1'], { header: 1 }).map(obj =>
            Object.keys(obj).map(key => obj[key]).reverse()
        ).reverse();
}

async function getData(url) {
    return await fetch(url)
        .then(async res => await res.json())
        .then(data => data);
}

async function getConfig() {
    const configFile = window.location.origin + '/MapConfig/config24x24.json';
    const config = await getData(configFile);
    config.grid = await getMapFile(config.map_xlsx);
    return config;
}
