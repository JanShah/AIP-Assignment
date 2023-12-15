class TestRunner {
    constructor(grid) {
        this.grid = grid
        this.weightIncrements = 0.1
        this.minWeight = 0.0
        this.maxWeight = 20
        this.metrics = [euclidian, chebyshev, manhattan];
        this.solvers = ['DFS', 'BFS', 'UCS'];
        this.maxResolution = 0.04 //4cm resolution is over a million points!
        this.minResolution = 1.0
        this.resolutionIncrements = 0.02
        this.motionModels = [false, true] //4 and 8
        this.targetDistance = 1.5 //give it a bigger target radius
        this.robotRadius = 0.3; //so it will always be able to navigate obstacles
        //set the visual scale to minimum.  
        //This also reduces CPU load, for more accurate and consistent results
        this.visualScale = 1

    }

    testRun() {
        this.grid.listeners.switchOffAll();
        this.grid.agent.reScale(0.3);
        this.grid.testsRunning = true;
        this.grid.minTargetDistance = this.targetDistance;
        //for each of the weights
        //for each of the resolutions
        let testsConducted = 0;
        for (let solver of this.solvers)
            for (let motionModel of this.motionModels)
                for (let resolution = this.maxResolution;
                    resolution <= this.minResolution;
                    resolution += this.resolutionIncrements) {
                    setTimeout(() => {
                        this.grid.setMotionModel(motionModel);
                        // console.log(Number(weight.toFixed(2)), Number(resolution.toFixed(2)));
                        this.grid.agent.resolution = Number(resolution.toFixed(2));
                        this.grid.createGridAtResolution();
                        this.grid.listeners.changeSolver(solver);
                        this.grid.listeners.runSolver();
                        noOfTests.innerHTML = 'Test #' + (testsConducted++)

                    }, 1 * testsConducted)
                }

        this.grid.listeners.changeSolver('AStar');
        for (let resolution = this.maxResolution;
            resolution <= this.minResolution;
            resolution += this.resolutionIncrements) {
            for (let motionModel of this.motionModels) {
                for (let metric of this.metrics) {
                    for (let weight = this.minWeight;
                        weight <= this.maxWeight; weight += this.weightIncrements) {
                        setTimeout(() => {
                            this.grid.setMotionModel(motionModel);
                            this.grid.hw = Number(weight.toFixed(2));
                            this.grid.agent.resolution = Number(resolution.toFixed(2));
                            this.grid.createGridAtResolution();
                            this.grid.activeHeuristic = metric;
                            this.grid.listeners.runSolver();
                            noOfTests.innerHTML = 'Test #' + (testsConducted++)
                        }, 1 * testsConducted)
                    }
                }
            }
        }
        this.grid.testsRunning = false;
        window.location.reload();



    }
}