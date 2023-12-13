class TestRunner {
    constructor(grid) {
        this.grid = grid
        this.solvers = [AStar, UCS, BFS, DFS];
        this.weightIncrements = 0.25
        this.minWeight = 0.0
        this.maxWeight = 20
        this.metrics = ['euclidian', 'chebyshev', 'manhattan'];
        this.solvers = ['DFS', 'BFS', 'UCS'];
        this.maxResolution = 0.05 //5cm resolution is nearly a million points!
        this.minResolution = 1
        this.motionModels = [false, true] //4 and 8
        this.resolutionIncrements = 0.01
        this.targetDistance = 2 //give it a bigger target radius
        this.robotRadius = 0.2; //so it will always be able to navigate obstacles
        //set the visual scale to minimum.  
        //This also reduces CPU load, for more accurate and consistent results
        this.visualScale = 1

    }

    testRun() {
        this.grid.listeners.switchOffAll();
        this.grid.agent.reScale(0.3);
        this.grid.createGridAtResolution()
        this.grid.testsRunning = true
        //for each of the weights
        //for each of the resolutions
        for (let solver of this.solvers)
            for (let motionModel of this.motionModels)
                for (let resolution = this.maxResolution;
                    resolution <= this.minResolution;
                    resolution += this.resolutionIncrements) {
                    this.grid.setMotionModel(motionModel)
                    // console.log(Number(weight.toFixed(2)), Number(resolution.toFixed(2)));
                    this.grid.agent.resolution = Number(resolution.toFixed(2));
                    this.grid.createGridAtResolution();
                    this.grid.listeners.changeSolver(solver);
                    this.grid.listeners.runSolver();
                }

        this.grid.testsRunning = false




    }
}