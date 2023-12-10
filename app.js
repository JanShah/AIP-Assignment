window.addEventListener('DOMContentLoaded', start);
async function start() {
    let size = 9;
    if(window.location.hash) {
        size = window.location.hash.split('#')[1]
    }
    const config = await getConfig(size);
    const agent = new Agent(config);
    const target = new Target(config);
    new Grid(config, agent, target);
}