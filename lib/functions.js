
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
    try {
        return  await fetch(url)
            .then(async res => await res.json())
            .then(data => data);
    } catch(e) {
        window.location.assign(window.location.origin)
    }
}

async function getConfig(size=12) {
    const configFile = window.location.origin + `/MapConfig/config${size}x${size}.json`;
    const config = await getData(configFile);
    config.grid = await getMapFile(config.map_xlsx);
    return config;
}


function objectMemorySize(obj) {
    const objectList = []
    let sizeInBytes = 0;
    const stack = [obj];
    while (stack.length) {
        const item = stack.pop()
        const itemType = typeof item;
        switch (itemType) {
            case 'boolean':
                sizeInBytes += 4
                break;
            case 'string':
                sizeInBytes += item.length * 2
                break;
            case 'number':
                sizeInBytes += 8
                break;
            case 'object':
                objectList.push(item)
                for(let key in item) {
                    stack.push(item[key])
                }
                break;
            default:
                break;
        }
    }
    return sizeInBytes
}