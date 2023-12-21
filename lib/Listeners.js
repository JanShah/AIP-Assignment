class Listeners {
    #isMouseDown = false;
    #isRightMouseDown = false;
    #autoSolve = false;
    #isEditing = false;
    #posX;
    #posY;
    constructor(grid) {
        this.grid = grid;
        this.solveHandler = this.#solve.bind(this);
        this.changeMotionModel = this.#changeMotionModel.bind(this);
        this.changeVisualScale = this.#changeVisualScale.bind(this);
        this.setActiveHeuristic = this.#setActiveHeuristic.bind(this);
        this.showVisualElement = this.#showVisualElement.bind(this);
        this.setScanDotSize = this.#setScanDotSize.bind(this);
        this.setQuickSolve = this.#setQuickSolve.bind(this);
        this.setAutoSolve = this.#setAutoSolve.bind(this);
        this.setNeighbourDotSize = this.#setNeighbourDotSize.bind(this);
        this.setRobotRadius = this.#setRobotRadius.bind(this);
        this.setEditingGrid = this.#setEditingGrid.bind(this)
        this.loadDefault = this.#loadDefault.bind(this)
        this.setMinTargetDistance = this.#setMinTargetDistance.bind(this);
        this.visualiser = new Visualiser(canvas.getContext('2d'), this.grid);
        this.editMotionModel = this.#editMotionModel.bind(this);
        this.currentSolver = AStar;
        this.#autoSolve = autoSolve.checked
        this.runToTarget = this.#runToTarget.bind(this)
        this.showNewGraph = this.#showNewGraph.bind(this);
        this.closeGraph = this.#closeGraph.bind(this);
        this.visualiser.onPathEnd = this.sequenceSlider.bind(this)
        this.setGridRowsCols = this.#setGridRowsCols.bind(this);
        this.#addListeners();
    }
    #setGridRowsCols(e) {
        this.grid.newGrid(Number(e.target.value), Number(e.target.value))
    }



    #closeGraph() {
        if (this.graph) {
            this.graph.close()
        }
    }
    #showNewGraph() {
        this.graph = new Grapher();
    }

    #runToTarget(e) {

        this.grid.agent.follower(e.target.checked)
    }

    #editMotionModel(e) {
        const which = e.target.id.split('edit')[1];
        const el = document.getElementById('editMotionModel')
        el.innerHTML = ""

        document.getElementById('editMotionModel').style.height = 'auto';
        const model = which === '4n' ? this.grid.agent.motionModel4n() : this.grid.agent.motionModel8n();
        const labels = ['X', 'Y', 'Cost'];
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        table.appendChild(thead)
        const tr = document.createElement('tr');
        thead.appendChild(tr)
        labels.forEach(le => {
            const td = document.createElement('td')
            td.innerHTML = le;
            tr.appendChild(td);

        })
        const closeBtn = document.createElement('button')
        closeBtn.className = 'modelCloseBtn'
        closeBtn.innerHTML = "X"
        closeBtn.addEventListener('click', () => {
            el.removeChild(table)
        })
        const closeTD = document.createElement('td')
        closeTD.appendChild(closeBtn)
        tr.appendChild(closeTD)
        const tbody = document.createElement('tbody');
        table.appendChild(tbody)
        model.forEach((row, index) => {
            const tr = document.createElement('tr');
            tbody.appendChild(tr)
            row.forEach((el, xIndex) => {
                const td = document.createElement('td')
                const input = document.createElement('input')
                input.type = 'number'
                input.value = el;
                input.style.transition = 'all 0.2s'
                input.dataset.y = index;
                input.dataset.x = xIndex;
                input.dataset.model = which;
                input.addEventListener('focus', (e) => {
                    e.target.select();
                })

                input.addEventListener('input', this.changeModel.bind(this));
                td.appendChild(input);
                tr.appendChild(td);
            })
        })
        el.append(table);
    }

    changeModel(e) {
        const data = e.target.dataset;
        const model = data.model === '4n' ? 'm4' : 'm8'
        const x = data.x
        const y = data.y
        const value = Number(e.target.value)
        if (!isNaN(value)) {
            this.grid.agent[model][y][x] = value
            e.target.style.background = 'rgb(0,255,0)'
            return setTimeout(() => {
                e.target.style.background = 'rgb(255,255,255)'
            }, 100)
        }
        e.target.style.background = 'rgb(200,0,0)'

        setTimeout(() => {
            e.target.style.background = 'none'

        }, 200)
    }

    #setMinTargetDistance(e) {
        document.getElementById('rtDistance').innerHTML = e.target.value
        document.getElementById('minTargetDistance').value = e.target.value

        this.grid.setMinTargetDistance(Number(e.target.value));
    }

    #loadDefault(e) {
        const origin = window.location.origin
        const pathname = window.location.pathname === '/index.html' ? '/' : '/index.html'
        window.location.assign(origin + pathname + "#" + e.target.dataset.id)
    }

    #setEditingGrid(e) {
        this.#isEditing = e.target.checked
        moveTarget.checked = false
        moveRobot.checked = false
        followMouse.checked = false
    }
    #setAutoSolve(e) {

        this.#autoSolve = e.target.checked
        if (this.#autoSolve) {
            this.runSolver()
        }

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
        if (this.#autoSolve) {
            this.runSolver()
        }
    }

    #showVisualElement(e) {
        this.visualiser[e.target.id] = e.target.checked;
        if (e.target.id === 'showTooltips') {
            document.querySelectorAll('.info').forEach(el => {
                el.style.display = e.target.checked ? 'inline-block' : 'none'
            })
        }
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

    switchOffAll() {
        moveTarget.checked = false
        moveRobot.checked = false
        followMouse.checked = false
        autoSolve.checked = false
        quickSolve.checked = false
        editGrid.checked = false
        treeSearch.checked = false
        showBigGrid.checked = false
        showSolution.checked = false
        showVisited.checked = false
        showEdges.checked = false
        showNeighbours.checked = false
        showFinalPath.checked = false
        showSolutionNodes.checked = false

        this.visualiser.showBigGrid = false
        this.visualiser.showBarrierOverlay = false
        this.visualiser.showRobotScan = false
        this.visualiser.showSolution = false
        this.visualiser.showVisited = false
        this.visualiser.showNeighbours = false
        this.visualiser.showFinalPath = false
        this.visualiser.showSolutionNodes = false
        this.visualiser.showEdges = false
    }

    #addListeners() {
        const canvas = this.grid.canvas;
        document.getElementById('gridRowsCols').value = this.grid.cells.length
        document.getElementById('visualScale').value = this.grid.scale;
        document.getElementById('vScale').innerHTML = this.grid.scale;
        this.#addListener('gridRowsCols', 'input', this.setGridRowsCols)
        this.#addListener('closeGraph', 'click', this.closeGraph)
        this.#addListener('showGraph', 'click', this.showNewGraph)
        this.#addListener('visualScale', 'change', this.changeVisualScale)
        this.#addListener('runToTarget', 'click', this.runToTarget)
        this.#addListener('AStarBtn', 'click', this.solveHandler)
        this.#addListener('DFSBtn', 'click', this.solveHandler)
        this.#addListener('BFSBtn', 'click', this.solveHandler)
        this.#addListener('UCSBtn', 'click', this.solveHandler)
        this.#addListener('quickSolve', 'click', this.setQuickSolve)
        this.#addListener('closeMenuCheck', 'click', this.#openCloseMenu)
        this.#addListener('scanDotSize', 'input', this.setScanDotSize)
        this.#addListener('neighbourDotSize', 'change', this.setNeighbourDotSize)
        this.#addListener('robotRadius', 'input', this.setRobotRadius)
        this.#addListener('autoSolve', 'click', this.setAutoSolve)
        this.#addListener('editGrid', 'click', this.setEditingGrid)
        this.#addListener('minTargetDistance', 'change', this.setMinTargetDistance)
        this.#addListener('edit4n', 'click', this.editMotionModel)
        this.#addListener('edit8n', 'click', this.editMotionModel)
        document.getElementById('rtDistance').innerHTML = this.grid.minTargetDistance
        document.getElementById('minTargetDistance').value = this.grid.minTargetDistance

        const tt = document.querySelector('.tooltip')
        document.querySelectorAll('.info').forEach(el => {
            el.addEventListener('mouseover', (e) => {
                if (!this.visualiser.showTooltips) return
                tt.style.top = (e.y - 60) + 'px'
                tt.style.left = e.x + 20 + 'px'
                tt.querySelector('p').innerHTML = information[e.target.dataset.topic]

            })
            el.addEventListener('mouseout', (e) => {
                tt.style.top = (- 60) + 'px'
                tt.style.left = (-20) + 'px'

            })
        })

        document.querySelectorAll('.defaults')
            .forEach(d => {
                d.addEventListener('click', this.loadDefault)
            })
        document.querySelectorAll('.heuristic')
            .forEach(h => h.addEventListener('click', this.setActiveHeuristic));
        document.querySelectorAll('.show')
            .forEach(h => h.addEventListener('click', this.showVisualElement));

        document.getElementById('currentMotionModel').innerHTML = this.grid.motionModelName
        document.getElementById('currentDistanceMetric').innerHTML = 'euclidian'

        document.getElementById('scanDotSize').value = this.visualiser.agentScanDotSize
        document.getElementById('sdSize').innerHTML = this.visualiser.agentScanDotSize

        document.getElementById('neighbourDotSize').value = this.visualiser.agentNeighborDotSize
        document.getElementById('ndSize').innerHTML = this.visualiser.agentNeighborDotSize

        document.getElementById('visitedDotSize').value = this.visualiser.agentVisitedDotSize
        document.getElementById('vdSize').innerHTML = this.visualiser.agentVisitedDotSize

        document.getElementById('visitedDotSize').addEventListener('input', (e) => {
            document.getElementById('vdSize').innerHTML = e.target.value;
            this.visualiser.agentVisitedDotSize = e.target.value;
        });

        document.getElementById('rResolution').innerHTML = this.grid.agent.resolution
        document.getElementById('robotResolution').value = this.grid.agent.resolution

        document.getElementById('robotResolution').addEventListener('input', (e) => {
            document.getElementById('rResolution').innerHTML = e.target.value;
            this.grid.agent.resolution = e.target.value;
            this.grid.createGridAtResolution();
            if (this.#autoSolve) {
                this.runSolver()
            }
        });
        document.getElementById('robotRadius').value = this.grid.agent.radius;
        document.getElementById('rRadius').innerHTML = this.grid.agent.radius;

        document.getElementById('hStrength').addEventListener('input', (e) => {
            this.grid.hw = Number(e.target.value);
            document.getElementById('hWeight').innerHTML = this.grid.hw;
            if (this.#autoSolve) {
                this.runSolver()
            }
        });
        document.getElementById('motion4n').addEventListener('mousedown', this.changeMotionModel);
        document.getElementById('motion8n').addEventListener('mousedown', this.changeMotionModel);
        const followMouse = document.getElementById('followMouse')
        const moveRobot = document.getElementById('moveRobot')
        const moveTarget = document.getElementById('moveTarget')
        const editGrid = document.getElementById('editGrid')
        moveRobot.addEventListener('click', () => {
            moveTarget.checked = false
            editGrid.checked = false
            followMouse.checked = false
            this.#isEditing = false
        });

        followMouse.addEventListener('click', () => {
            moveRobot.checked = false
            moveTarget.checked = false
            editGrid.checked = false
            this.#isEditing = false

        });
        moveTarget.addEventListener('click', () => {
            moveRobot.checked = false
            editGrid.checked = false
            followMouse.checked = false
            this.#isEditing = false
        });

        canvas.addEventListener('mousemove', (e) => {
            const x = Math.floor(e.offsetX / this.grid.scale)
            const y = Math.floor(e.offsetY / this.grid.scale)


            this.#posX = x
            this.#posY = y

            if (this.#isEditing) {
                const x = this.#posX;
                const y = this.#posY

                if (this.#isMouseDown) {
                    this.grid.cells[y][x] = 1
                    this.grid.setObstacles()
                    this.grid.createGridAtResolution()
                }
                if (this.#isRightMouseDown) {
                    this.grid.cells[y][x] = 0
                    this.grid.setObstacles()
                    this.grid.createGridAtResolution()
                }
            }



            if ((this.#isMouseDown && moveTarget.checked) || followMouse.checked) {
                this.grid.target.x = e.offsetX / this.grid.scale;
                this.grid.target.y = e.offsetY / this.grid.scale;
                if (followMouse.checked && this.#autoSolve)
                    this.runSolver()
            }
            if (this.#isMouseDown && moveRobot.checked) {
                const x = Number((e.offsetX / this.grid.scale).toFixed(2));
                const y = Number((e.offsetY / this.grid.scale).toFixed(2))
                const pos = this.grid.getIdealPosition(x, y);
                this.grid.agent.x = pos.x
                this.grid.agent.y = pos.y
                this.grid.agent.setOffsets()
                this.grid.createGridAtResolution()
            }
        });
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();

        });

        canvas.addEventListener('mousedown', (e) => {
            this.#posX = Math.floor(e.offsetX / this.grid.scale);
            this.#posY = Math.floor(e.offsetY / this.grid.scale);
            if (e.button === 0)
                this.#isMouseDown = true;
            if (e.button === 2)
                this.#isRightMouseDown = true
            if (this.#isEditing) {
                if (this.#isMouseDown) {
                    this.grid.cells[this.#posY][this.#posX] = 1
                    this.grid.setObstacles()
                    this.grid.createGridAtResolution()
                }
                if (this.#isRightMouseDown) {
                    this.grid.cells[this.#posY][this.#posX] = 0
                    this.grid.setObstacles()
                    this.grid.createGridAtResolution()
                }
            }
        });

        window.addEventListener('mouseup', (e) => {
            this.#posX = -1
            this.#posY = -1
            this.#isMouseDown = false;
            this.#isRightMouseDown = false
            if (this.#autoSolve) {
                this.runSolver()
            }
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

    sequenceSlider() {
        const slider = document.createElement('input')
        slider.type = 'range'
        slider.min = 0
        slider.max = this.visualiser.finalSteps
        slider.value = this.visualiser.finalSteps
        slider.steps = 1
        const canvasWidth = Number(Math.min(Math.floor(window.innerWidth - (window.innerWidth / 2)), canvas.style.width.split('px')[0]))
        slider.style.width = Math.min(window.innerWidth, canvasWidth) + 'px'
        const animationSlider = document.getElementById('animationSlider')
        animationSlider.innerHTML = ""
        animationSlider.appendChild(slider)
        slider.addEventListener('input', (e) => {
            this.visualiser.maxStep = Number(e.target.value)
        })

    }

    #solve(e) {
        const solverName = e.target.id.split('Btn')[0]
        if (document.getElementById('currentSolver').classList.contains('danger')) {
            document.getElementById('currentSolver').classList.remove('danger')
            document.getElementById('currentSolver').classList.add('success')
        }
        currentSolver.innerHTML = solverName
        this.changeSolver(solverName);
        this.runSolver();
    }
    runSolver() {
        if (!this.currentSolver) return
        const solver = new this.currentSolver(this.grid);
        const startTime = new Date().getTime();
        const solution = solver.solve(this.grid.agent, this.grid.target);
        const endTime = new Date().getTime();
        if (solution && solution.length === 3) {
            const information = {}


            information.time = endTime - startTime;
            information.memory = objectMemorySize(solution);
            information.cost = Number((solution[2]).toFixed(2));
            information.motionModel = this.grid.motionModelName
            information.distance = Number((solution[1].length *
                this.grid.agent.resolution).toFixed(2));
            information.gridCells = this.grid.cells.length * this.grid.cells[0].length;
            information.resolution = this.grid.agent.resolution;
            information.resolvedCells = Object.keys(this.grid.agentGrid).length;
            information.solver = this.currentSolver.name
            if (information.solver === 'AStar') {
                const h = this.grid.activeHeuristic
                const heuristic = h === euclidian ? 'euclidian' : h === chebyshev ? 'chebyshev' : 'manhattan'
                information.heuristic = heuristic
                information.weight = this.grid.hw;

            }

            if (this.grid.testsRunning) {
                let currentData = [];
                if (localStorage.getItem('performance')) {
                    currentData = JSON.parse(localStorage.getItem('performance'));
                }
                currentData.push(information)
                localStorage.setItem('performance', JSON.stringify(currentData));

            }

            const solutionInfo = new SolutionInformation(information);
            const solutionContainer = document.getElementById('solutionInformation');
            solutionContainer.innerHTML = ''
            solutionContainer.append(solutionInfo);

        }


        this.visualiser.visualisePaths(solution);

    }
}
