class Listeners {
    #isMouseDown = false;
    #isDragging = false;
    #dragStartPosition = 0
    #dragEndPosition = 0
    #currentOffsetX = 0;
    #currentOffsetY = 0;
    #posX
    #posY
    constructor(agent, grid, target) {
        this.agent = agent
        this.grid = grid
        this.target = target
        this.solveHandler = this.#solve.bind(this)
        this.changeMotionModel = this.#changeMotionModel.bind(this)
        this.#addListeners()
        this.currentSolver = null
        this.visualiser = new Visualiser(canvas.getContext('2d'), this.grid)
    }

    #addListeners() {
        const canvas = this.grid.canvas
        //still need this
        const ctx = canvas.getContext('2d')
        this.dot = {
            x: 0,
            y: 0
        }

        document.getElementById('AStarBtn').addEventListener('click', this.solveHandler);
        document.getElementById('DFSBtn').addEventListener('click', this.solveHandler);
        document.getElementById('BFSBtn').addEventListener('click', this.solveHandler);
        document.getElementById('UCSBtn').addEventListener('click', this.solveHandler);
        document.getElementById('quickSolve').addEventListener('click', (e) => {
            if (e.target.checked)
                this.visualiser.quickSolve = true
            else
                this.visualiser.quickSolve = false
        });
        document.getElementById('closeMenuCheck').addEventListener('click', (e) => {
            if (e.target.checked)
                document.getElementById('menuItems').className = 'active'
            else
                document.getElementById('menuItems').className = ''

        })
        document.querySelectorAll('.heuristic')
            .forEach(h => {
                h.addEventListener('click', (e) => {
                    console.log(this.grid.activeHeuristic)
                    this.grid.activeHeuristic = window[e.target.id]
                })
            })
        document.querySelectorAll('.show')
            .forEach(h => {
                h.addEventListener('click', (e) => {
                    this.visualiser[e.target.id] = e.target.checked
                })
            })

        document.getElementById('hStrength').addEventListener('change', (e) => {
            document.getElementById('hWeight').innerHTML = e.target.value
        });
        document.getElementById('motion4n').addEventListener('click', this.changeMotionModel);
        document.getElementById('motion8n').addEventListener('click', this.changeMotionModel);

        canvas.addEventListener('mousedown', (e) => {
            this.#posX = e.offsetX
            this.#posY = e.offsetY
            this.#isMouseDown = true;
        })
        window.addEventListener('mouseup', (e) => {
            this.#isMouseDown = false;
        })

    }

    #changeMotionModel(e) {
        this.grid.setMotionModel(e.target && e.target.id.endsWith('8n'))
    }

    changeSolver(name) {
        switch (name) {
            case 'AStar':
                this.currentSolver = AStar
                break;
            case 'BFS':
                this.currentSolver = BFS
                break;
            case 'DFS':
                this.currentSolver = DFS
                break;
            case 'UCS':
                this.currentSolver = UCS
                break;

            default:
                break;
        }
    }

    #solve(e) {
        this.changeSolver(e.target.id.split('Btn')[0])
        const solver = new this.currentSolver(this.grid)
        const solution = solver.solve(this.agent, this.target)
        this.visualiser.visualisePaths(solution)
    }
}
