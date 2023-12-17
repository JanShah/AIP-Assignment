class Grapher {
    constructor() {
        graphSection.innerHTML = ""
        graphDataButtons.innerHTML = ""
        this.canvas = document.createElement('canvas');
        graphSection.append(this.canvas);
        this.canvas.id = 'graph';
        this.ctx = this.canvas.getContext('2d')
        this.rawData = ''
        this.data = [];
        this.heuristic = 'All'
        this.solver = 'All'
        this.motionModel = 'All'
        this.xOpt = 'time'
        this.yOpt = 'memory'
        this.zoomOptions = {
            zoom: {
                limits: {
                    y: { min: -100, max: 200, minRange: 50 }
                },
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'xy',
                scaleMode: 'xy',
            },
            pan: {
                enabled: true,
                mode: 'xy',
                scaleMode: 'xy',
            }
        };
        if (localStorage.getItem('performance')) {

            this.rawData = localStorage.getItem('performance')
            this.data = JSON.parse(this.rawData);
            this.loadMenu()
            this.createChart()
        } else {
            this.loadPrefill()
        }

        
    }

    loadMenu() {
        if (this.data.length) {
            const btnContainer = document.createElement('section')
            const btnContainer2 = document.createElement('section')
            const btnContainer3 = document.createElement('section')
            btnContainer.className = 'btn-group'
            btnContainer2.className = 'btn-group'
            btnContainer3.className = 'btn-group'
            btnContainer3.style.width = '240px'

            const otherFilters = ['solver', 'motionModel', 'heuristic']
            const quantKeys = this.keys.filter(label => !otherFilters.includes(label));

            const allHeuristics = ['All', 'chebyshev', 'euclidian', 'manhattan']
            this.heuristicBtn = document.createElement('button');
            this.heuristicBtn.innerText = 'Heuristic All';
            btnContainer3.append(this.heuristicBtn)

            let curHeuristicId = 0
            this.heuristicBtn.addEventListener('click', (e) => {
                curHeuristicId = (curHeuristicId + 1) % allHeuristics.length;
                this.heuristicBtn.innerText = 'Heuristic ' + allHeuristics[curHeuristicId];
                this.heuristic = allHeuristics[curHeuristicId];
                this.filterData()

                this.destroy()
                this.createChart()
            })
            const motionModelBtn = document.createElement('button');
            motionModelBtn.innerText = 'Motion model All'
            btnContainer3.append(motionModelBtn)
            const allMotionModels = ['All', '4n', '8n']
            let curMotionModelID = 0
            motionModelBtn.addEventListener('click', () => {
                curMotionModelID = (curMotionModelID + 1) % allMotionModels.length
                motionModelBtn.innerText = 'Motion model ' + allMotionModels[curMotionModelID]
                this.motionModel = allMotionModels[curMotionModelID]
                this.filterData()

                this.destroy()
                this.createChart()
            })
            const solverBtn = document.createElement('button');
            solverBtn.innerText = 'Solver All'
            btnContainer3.append(solverBtn)


            const allSolvers = ['All', 'AStar', 'DFS', 'BFS', 'UCS'];
            let cursolverId = 0
            solverBtn.addEventListener('click', () => {
                cursolverId = (cursolverId + 1) % allSolvers.length
                solverBtn.innerText = 'Solver ' + allSolvers[cursolverId]
                this.solver = allSolvers[cursolverId];
                this.filterData()

                this.destroy()
                this.createChart()
            })

            this.XButtons = []
            quantKeys.forEach(key => {
                const button = document.createElement('button');
                this.XButtons.push(button)
                button.innerText = 'X ' + key
                if (this.xOpt === key)
                    button.classList.add('active')
                btnContainer.append(button)
                button.addEventListener('click', () => {
                    this.xOpt = key
                    this.XButtons.forEach(btn => { btn.classList.remove('active') })
                    button.classList.add('active')
                    this.destroy()
                    this.createChart()
                })
            })

            this.YButtons = []
            quantKeys.forEach(key => {
                const button = document.createElement('button');
                this.YButtons.push(button)
                button.innerText = 'Y ' + key
                if (this.yOpt === key)
                    button.classList.add('active')
                btnContainer2.append(button)
                button.addEventListener('click', () => {
                    this.yOpt = key
                    this.YButtons.forEach(btn => { btn.classList.remove('active') })
                    button.classList.add('active')
                    this.destroy()
                    this.createChart()
                })
            })
            graphDataButtons.append(btnContainer)
            graphDataButtons.append(btnContainer2)
            graphDataButtons.append(document.createElement('div'))
            graphDataButtons.append(btnContainer3)

        }
    }

    async loadPrefill() {
        this.rawData = JSON.stringify(await getData(window.location.origin + '/lib/data/prefill.json'))
        this.data = JSON.parse(this.rawData)
        this.loadMenu()
        this.createChart()
       
    }

    filterData() {
        this.data = JSON.parse(this.rawData).filter(obj => {
            const f1 = this.solver === 'All'
            const f2 = this.motionModel === 'All'
            const f3 = this.heuristic === 'All'
            if (f1 && f2 && f3) return true
            let isValid = true
            if (!f1) {
                isValid = obj.solver === this.solver
                if (this.solver !== 'AStar') {
                    this.heuristic = 'All'
                    this.heuristicBtn.innerText = 'Heuristic All';
                }
            }
            if (!f2 && isValid) {
                isValid = obj.motionModel === this.motionModel
            }
            if (!f3 && isValid) {
                isValid = obj.heuristic === this.heuristic
            }
            return isValid

        })
    }

    close() {
        graphContainer.className = ''
        this.destroy()

    }

    destroy() {
        if (this.chart) this.chart.destroy()
    }

    createChart() {

        const scales = {
            x: {
                position: 'top',
            },
            y: {
                position: 'right',
            },
        };

        graphContainer.className = 'active'
        const dtc = this.data
            .filter(obj => obj['solver'] === 'DFS')
            .map((obj) => ({ y: obj[this.yOpt], x: obj[this.xOpt] }));
        const dtb = this.data
            .filter(obj => obj['solver'] == 'BFS')
            .map((obj) => ({ y: obj[this.yOpt], x: obj[this.xOpt] }));
        const dta = this.data
            .filter(obj => obj['solver'] == 'UCS')
            .map((obj) => ({ y: obj[this.yOpt], x: obj[this.xOpt] }));
        const dts = this.data
            .filter(obj => obj['solver'] == 'AStar')
            .map((obj) => ({ y: obj[this.yOpt], x: obj[this.xOpt] }));
        const config = {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "DFS",
                        data: dtc,
                        backgroundColor: "rgb(255, 99, 132)",
                    }, {
                        label: "BFS",
                        data: dtb,
                        backgroundColor: "rgb(100, 99, 200)",
                    }, {
                        label: "UCS",
                        data: dta,
                        backgroundColor: "rgb(0, 255, 50)",
                    }, {
                        label: "AStar",
                        data: dts,
                        backgroundColor: "rgb(200, 10, 0)",
                    },
                ]
            },
            options: {
                plugins: {
                    zoom: this.zoomOptions,
                    title: {
                        display: true,
                        position: 'bottom',
                        text: (ctx) => 'Zoom ' + this.zoomStatus() + ', Pan ' + this.panStatus(),
                    }
                },
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom",
                    },
                },
            },
        };
        this.chart = new Chart(this.ctx, config);

    }

    zoomStatus() {
        if (this.zoomOptions.zoom.wheel.enabled) return "enabled"
        return 'disabled'
    }
    panStatus() {
        if (this.zoomOptions.pan.enabled) return "enabled"
        return 'disabled'
    }
    getDataByKey(key) {
        return this.data.map(obj => obj[key])
    }

    get keys() {
        const keys = []
        if (this.data.length) {
            this.data.forEach(obj => {
                Object.keys(obj).forEach(key => {
                    if (keys.indexOf(key) === -1) {
                        keys.push(key)
                    }
                })
            })
            return keys
        }
        return false
    }

    sortByKey(key) {
        this.data.sort((a, b) => {
            return a[key] - b[key]
        });

    }

    getObjDataByAlgorithm(algorithm) {
        return this.data.filter(obj => {
            return obj.currentsolver === algorithm;
        })
    }

    getKeyDataByAlgorithm(algorithm, key) {
        return this.getObjDataByAlgorithm(algorithm).map(obj => obj[key]);
    }
}