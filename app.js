window.addEventListener('DOMContentLoaded', start);
let testRunner;
async function start() {
    let size = 9;
    if(window.location.hash) {
        size = window.location.hash.split('#')[1]
    }
    const config = await getConfig(size);
    const agent = new Agent(config);
    const target = new Target(config);
    grid = new Grid(config, agent, target);
    testRunner = new TestRunner(grid);
}

