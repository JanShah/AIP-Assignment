class Listeners {
    #isMouseDown = false;
    #isDragging = false;
    #autoSolve = false;

    #currentOffsetX = 0;
    #currentOffsetY = 0;
    #posX;
    #posY;
    constructor(agent, grid, target) {
        this.agent = agent;
        this.grid = grid;
        this.target = target;
        this.solveHandler = this.#solve.bind(this);
        this.changeMotionModel = this.#changeMotionModel.bind(this);
        this.testMouseOnImgHandler = this.#testMouseOnImgHandler.bind(this);
        this.changeVisualScale = this.#changeVisualScale.bind(this);
        this.setActiveHeuristic = this.#setActiveHeuristic.bind(this);
        this.showVisualElement = this.#showVisualElement.bind(this);
        this.setScanDotSize = this.#setScanDotSize.bind(this);
        this.setQuickSolve = this.#setQuickSolve.bind(this);
        this.setAutoSolve = this.#setAutoSolve.bind(this);
        this.setNeighbourDotSize = this.#setNeighbourDotSize.bind(this);
        this.setRobotRadius = this.#setRobotRadius.bind(this);

        this.visualiser = new Visualiser(canvas.getContext('2d'), this.grid);
        this.#addListeners();
        this.currentSolver = null;
    }
    #setAutoSolve(e) {
        this.#autoSolve = e.target.checked
        if (this.#autoSolve) {
            this.#runSolver()
        }

    }

    #testMouseOnImgHandler(e) {
        // const canvas = this.grid.canvas;
        // //still need this
        // const ctx = canvas.getContext('2d');
        // this.dot = {
        //     x: 0,
        //     y: 0
        // }
        // ctx.fillRect(e.offsetX / this.grid.miniImage.width * this.grid.scale,
        //     e.offsetY / this.grid.miniImage.height * this.grid.scale, 1, 1);
    }


    #changeVisualScale(e) {
        this.grid.scale = Number(e.target.value);
        document.getElementById('vScale').innerHTML = e.target.value;
        this.grid.reScale();
    }

    #setQuickSolve(e) {
        this.visualiser.quickSolve = e.target.checked
    }

    #openCloseMenu(e) {
        document.getElementById('menuItems').className = e.target.checked ? 'active' : '';
        document.querySelector('#closeMenu').className = e.target.checked ? 'active' : '';
    }

    #setActiveHeuristic(e) {
        this.grid.activeHeuristic = window[e.target.id];
        document.getElementById('currentDistanceMetric').innerHTML = e.target.id
    }

    #showVisualElement(e) {
        this.visualiser[e.target.id] = e.target.checked;
    }

    #setScanDotSize(e) {
        document.getElementById('sdSize').innerHTML = e.target.value;
        this.visualiser.agentScanDotSize = e.target.value;
    }

    #setRobotRadius(e) {

        document.getElementById('rRadius').innerHTML = e.target.value;
        this.grid.agent.reScale(e.target.value);
        this.grid.createGridAtResolution();
    }
    #setNeighbourDotSize(e) {
        document.getElementById('ndSize').innerHTML = e.target.value;
        this.visualiser.agentNeighborDotSize = e.target.value;
    }

    #addListener(elementID, event, handler) {
        document.getElementById(elementID).addEventListener(event, handler)
    }

    #addListeners() {
        const canvas = this.grid.canvas;
        //still need this
        const ctx = canvas.getContext('2d');
        // this.dot = {
        //     x: 0,
        //     y: 0
        // }


        document.getElementById('visualScale').value = this.grid.scale;
        document.getElementById('vScale').innerHTML = this.grid.scale;
        this.#addListener('miniImage', 'mousemove', this.testMouseOnImgHandler)
        this.#addListener('visualScale', 'change', this.changeVisualScale)
        this.#addListener('AStarBtn', 'click', this.solveHandler)
        this.#addListener('DFSBtn', 'click', this.solveHandler)
        this.#addListener('BFSBtn', 'click', this.solveHandler)
        this.#addListener('UCSBtn', 'click', this.solveHandler)
        this.#addListener('quickSolve', 'click', this.setQuickSolve)
        this.#addListener('closeMenuCheck', 'click', this.#openCloseMenu)
        this.#addListener('scanDotSize', 'change', this.setScanDotSize)
        this.#addListener('neighbourDotSize', 'change', this.setNeighbourDotSize)
        this.#addListener('robotRadius', 'change', this.setRobotRadius)
        this.#addListener('autoSolve', 'click', this.setAutoSolve)

        document.querySelectorAll('.heuristic')
            .forEach(h => h.addEventListener('click', this.setActiveHeuristic))
        document.querySelectorAll('.show')
            .forEach(h => h.addEventListener('click', this.showVisualElement))
        document.getElementById('currentMotionModel').innerHTML = this.grid.motionModelName
        document.getElementById('currentDistanceMetric').innerHTML = 'euclidian'
        document.getElementById('scanDotSize').value = this.visualiser.agentScanDotSize
        document.getElementById('sdSize').innerHTML = this.visualiser.agentScanDotSize

        document.getElementById('neighbourDotSize').value = this.visualiser.agentNeighborDotSize
        document.getElementById('ndSize').innerHTML = this.visualiser.agentNeighborDotSize

        document.getElementById('visitedDotSize').value = this.visualiser.agentVisitedDotSize
        document.getElementById('vdSize').innerHTML = this.visualiser.agentVisitedDotSize

        document.getElementById('visitedDotSize').addEventListener('change', (e) => {
            document.getElementById('vdSize').innerHTML = e.target.value;
            this.visualiser.agentVisitedDotSize = e.target.value;
        });

        document.getElementById('rResolution').innerHTML = this.grid.agent.resolution
        document.getElementById('robotResolution').value = this.grid.agent.resolution

        document.getElementById('robotResolution').addEventListener('change', (e) => {
            document.getElementById('rResolution').innerHTML = e.target.value;
            this.grid.agent.resolution = e.target.value;
            this.grid.createGridAtResolution();
        });
        document.getElementById('robotRadius').value = this.grid.agent.radius;
        document.getElementById('rRadius').innerHTML = this.grid.agent.radius;

        // document.getElementById('robotRadius').addEventListener('change', this.setRobotRadius);
        document.getElementById('hStrength').addEventListener('change', (e) => {
            document.getElementById('hWeight').innerHTML = e.target.value;
        });
        document.getElementById('motion4n').addEventListener('click', this.changeMotionModel);
        document.getElementById('motion8n').addEventListener('click', this.changeMotionModel);
        const followMouse = document.getElementById('followMouse')


        canvas.addEventListener('mousemove', (e) => {
            if ((this.#isMouseDown && moveTarget.checked) || followMouse.checked) {
                // this.#posX = e.offsetX / this.grid.scale;
                // this.#posY = e.offsetY / this.grid.scale;
                this.grid.target.x = e.offsetX / this.grid.scale;
                this.grid.target.y = e.offsetY / this.grid.scale;
                if (followMouse.checked && this.#autoSolve)
                    this.#runSolver()

            }
            // this.#isMouseDown = true;
        });

        canvas.addEventListener('mousedown', (e) => {
            this.#posX = e.offsetX / this.grid.scale;
            this.#posY = e.offsetY / this.grid.scale;
            this.#isMouseDown = true;
        });
        window.addEventListener('mouseup', (e) => {
            this.#isMouseDown = false;
            if (this.#autoSolve)
                this.#runSolver()
        });
    }

    #changeMotionModel(e) {
        this.grid.setMotionModel(e.target && e.target.id.endsWith('8n'));
        document.getElementById('currentMotionModel').innerHTML = this.grid.motionModelName
    }

    changeSolver(name) {
        switch (name) {
            case 'AStar':
                this.currentSolver = AStar;
                break;
            case 'BFS':
                this.currentSolver = BFS;
                break;
            case 'DFS':
                this.currentSolver = DFS;
                break;
            case 'UCS':
                this.currentSolver = UCS;
                break;

            default:
                break;
        }
    }

    #solve(e) {
        const solverName = e.target.id.split('Btn')[0]
        currentSolver.innerHTML = solverName
        this.changeSolver(solverName);
        this.#runSolver()
    }
    #runSolver() {
        if (!this.currentSolver) return
        const solver = new this.currentSolver(this.grid);
        const startTime = new Date().getTime();
        const solution = solver.solve(this.agent, this.target);
        const endTime = new Date().getTime();
        if (solution && solution.length === 3) {
            const information = {}

            information.timeCost = endTime - startTime;
            information.memSize = objectMemorySize(solution);
            information.pathCost = (solution[2]).toFixed(2);
            information.pathLength = (solution[1].length * this.agent.resolution).toFixed(2);
            information.gridCells = this.grid.cells.length * this.grid.cells[0].length;
            information.resolution = this.grid.agent.resolution;
            information.resolvedCells = Object.keys(this.grid.agentGrid).length;
            information.currentsolver = document.getElementById('currentSolver').innerHTML;
            if (information.currentsolver === 'AStar') {
                information.currentDistanceMetric =
                    document.getElementById('currentDistanceMetric').innerHTML;
                information.hWeight = document.getElementById('hWeight').innerHTML;
            }
            const solutionInfo = new SolutionInformation(information);
            const solutionContainer = document.getElementById('solutionInformation');
            solutionContainer.append(solutionInfo);
        }


        this.visualiser.visualisePaths(solution);

    }
}
