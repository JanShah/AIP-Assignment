class Grapher {
    constructor() {
        graphSection.innerHTML = ""
        graphDataButtons.innerHTML = ""
        this.canvas = document.createElement('canvas');
        graphSection.append(this.canvas);
        this.canvas.id = 'graph';
        this.ctx = this.canvas.getContext('2d')
        this.rawData = localStorage.getItem('performance')
        this.data = JSON.parse(this.rawData);
        console.log(this.data)

        if (this.data.length) {
            this.keys.forEach(key => {
                const button = document.createElement('button');
                button.innerText = key
                graphDataButtons.append(button)
            })

        }
        // const chart = new Chart()
    }

    close() {
        graphContainer.className = ''
        if (this.chart) this.chart.destroy()

    }

    createChart() {
        graphContainer.className = 'active'
        const dtc = this.data
            .filter(obj => obj['solver'] === 'DFS')
            .map((obj) => ({ y: obj["resolvedCells"], x: obj["cost"] }));
        const dtb = this.data
            .filter(obj => obj['solver'] == 'BFS')
            .map((obj) => ({ y: obj["resolvedCells"], x: obj["cost"] }));
        const dta = this.data
            .filter(obj => obj['solver'] == 'UCS')
            .map((obj) => ({ y: obj["resolvedCells"], x: obj["cost"] }));
        const dts = this.data
            .filter(obj => obj['solver'] == 'AStar')
            .map((obj) => ({ y: obj["resolvedCells"], x: obj["cost"] }));
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

    getDataByKey(key) {
        return this.data.map(obj => obj[key])
    }

    get keys() {
        if (this.data.length) {
            return Object.keys(this.data[0])
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