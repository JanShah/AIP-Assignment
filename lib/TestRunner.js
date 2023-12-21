class TestRunner {
    constructor(grid) {
        this.grid = grid
        this.weightIncrements = 0.01
        this.minWeight = 0.0
        this.maxWeight = 3
        this.metrics = [euclidian, chebyshev, manhattan];
        this.solvers = ['DFS', 'BFS', 'UCS'];
        this.maxResolution = 0.25
        this.minResolution = 1.0
        this.resolutionIncrements = 0.05
        this.motionModels = [false, true] //4 and 8
        this.targetDistance = 1.5 //give it a bigger target radius
        this.robotRadius = 0.3; //so it will always be able to navigate obstacles
        //set the visual scale to minimum.  
        //This also reduces CPU load, for more accurate and consistent results
        this.visualScale = 1

    }

    testRun() {
        localStorage.removeItem('performance')
        this.grid.agent.reScale(0.3);
        this.grid.minTargetDistance = this.targetDistance;
        this.grid.testsRunning = true;
        //for each of the weights
        //for each of the resolutions
        let testsConducted = 0;
        for (let resolution = this.maxResolution;
            resolution <= this.minResolution;
            resolution += this.resolutionIncrements) {
            for (let solver of this.solvers) {
                for (let motionModel of this.motionModels) {
                    this.grid.setMotionModel(motionModel);
                    this.grid.agent.resolution = Number(resolution.toFixed(2));
                    this.grid.createGridAtResolution();
                    this.grid.listeners.changeSolver(solver);
                    this.grid.listeners.runSolver();
                    noOfTests.innerHTML = 'Test #' + (testsConducted++)
                }
            }
        }

        this.grid.listeners.changeSolver('AStar');

        this.grid.agent.resolution = this.minResolution;
        this.grid.createGridAtResolution();
        for (let motionModel of this.motionModels) {
            for (let metric of this.metrics) {
                for (let weight = this.maxWeight;
                    weight > this.minWeight; weight -= this.weightIncrements) {
                    setTimeout(() => {
                        this.grid.setMotionModel(motionModel);
                        this.grid.hw = Number(weight.toFixed(2));
                       
                        this.grid.activeHeuristic = metric;
                        this.grid.listeners.runSolver();
                        noOfTests.innerHTML = 'Test #' + (testsConducted++)
                    }, 1 * testsConducted)
                }
            }
        }

    }
}