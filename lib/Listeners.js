class Listeners {
    #isMouseDown = false;
    #isDragging = false;
    #dragStartPosition = 0
    #dragEndPosition = 0
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
        this.visualiser = new Visualiser(canvas.getContext('2d'), this.grid);
        this.#addListeners();
        this.currentSolver = null;
    }

    #addListeners() {
        const canvas = this.grid.canvas;
        //still need this
        const ctx = canvas.getContext('2d');
        this.dot = {
            x: 0,
            y: 0
        }

        this.grid.miniImage.addEventListener('mousemove', (e) => {
            ctx.fillRect(e.offsetX / this.grid.miniImage.width * this.grid.scale,
                e.offsetY / this.grid.miniImage.height * this.grid.scale, 1, 1);
        })
        document.getElementById('visualScale').value = this.grid.scale;
        document.getElementById('vScale').innerHTML = this.grid.scale;

        document.getElementById('visualScale').addEventListener('change', (e) => {
            this.grid.scale = Number(e.target.value);
            document.getElementById('vScale').innerHTML = e.target.value;
            this.grid.reScale();
        })
        document.getElementById('AStarBtn').addEventListener('click', this.solveHandler);
        document.getElementById('DFSBtn').addEventListener('click', this.solveHandler);
        document.getElementById('BFSBtn').addEventListener('click', this.solveHandler);
        document.getElementById('UCSBtn').addEventListener('click', this.solveHandler);
        document.getElementById('quickSolve').addEventListener('click', (e) => {
            if (e.target.checked) {
                this.visualiser.quickSolve = true;
            } else {
                this.visualiser.quickSolve = false;
            }
        });
        document.getElementById('closeMenuCheck').addEventListener('click', (e) => {
            document.getElementById('menuItems').className = e.target.checked ? 'active' : '';
            document.querySelector('#closeMenu').className = e.target.checked ? 'active' : '';

        });
        document.querySelectorAll('.heuristic')
            .forEach(h => {
                h.addEventListener('click', (e) => {
                    this.grid.activeHeuristic = window[e.target.id];
                    document.getElementById('currentDistanceMetric').innerHTML = e.target.id
                })
            })
        document.querySelectorAll('.show')
            .forEach(h => {
                h.addEventListener('click', (e) => {
                    this.visualiser[e.target.id] = e.target.checked;
                })
            })
        document.getElementById('currentMotionModel').innerHTML = this.grid.motionModelName
        document.getElementById('currentDistanceMetric').innerHTML = 'euclidian'
        document.getElementById('scanDotSize').value = this.visualiser.agentScanDotSize
        document.getElementById('sdSize').innerHTML = this.visualiser.agentScanDotSize

        document.getElementById('scanDotSize').addEventListener('change', (e) => {
            document.getElementById('sdSize').innerHTML = e.target.value;
            this.visualiser.agentScanDotSize = e.target.value;
        });


        document.getElementById('neighbourDotSize').value = this.visualiser.agentNeighborDotSize
        document.getElementById('ndSize').innerHTML = this.visualiser.agentNeighborDotSize

        document.getElementById('neighbourDotSize').addEventListener('change', (e) => {
            document.getElementById('sdSize').innerHTML = e.target.value;
            this.visualiser.agentNeighborDotSize = e.target.value;
        });

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

        document.getElementById('robotRadius').addEventListener('change', (e) => {
            document.getElementById('rRadius').innerHTML = e.target.value;
            this.grid.agent.reScale(e.target.value);
            this.grid.createGridAtResolution();
        });
        document.getElementById('hStrength').addEventListener('change', (e) => {
            document.getElementById('hWeight').innerHTML = e.target.value;
        });
        document.getElementById('motion4n').addEventListener('click', this.changeMotionModel);
        document.getElementById('motion8n').addEventListener('click', this.changeMotionModel);

        canvas.addEventListener('mousemove', (e) => {
            this.#posX = e.offsetX;
            this.#posY = e.offsetY;
            this.#isMouseDown = true;
        });

        canvas.addEventListener('mousedown', (e) => {
            this.#posX = e.offsetX;
            this.#posY = e.offsetY;
            this.#isMouseDown = true;
        });
        window.addEventListener('mouseup', (e) => {
            this.#isMouseDown = false;
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
        this.changeSolver(e.target.id.split('Btn')[0]);
        const solver = new this.currentSolver(this.grid);
        const solution = solver.solve(this.agent, this.target);
        this.visualiser.visualisePaths(solution);
    }
}
