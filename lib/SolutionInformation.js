class SolutionInformation extends HTMLElement {
    constructor(data) {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.createElement('template')
        template.innerHTML = `
        <style>
        div {
            position:fixed;
            bottom:0;
            left:0;
            width:100vw;
            height:50px;
            background:yellow
        }
        button {
            padding:5px 10px;
        }
        span:after {
            content: '|'
        }
        span:last-of-type:after {
            content: ''
        }
        </style>
        <div>
        <span class="timeCost">
            Time: <slot>${data.timeCost}</slot>ms
        </span>
        <span class="memSize">
            Memory: <slot>${data.memSize}</slot> bytes
        </span>
        <span class="pathCost">
            Cost: <slot>${data.pathCost}</slot>
        </span>
        <span class="pathLength">
           Length: <slot>${data.pathLength}</slot>m
        </span>
        <span class="gridCells">
            Total cells: <slot>${data.gridCells}</slot>
        </span>
        <span class="resolution">
            Resolution: <slot>${data.resolution}</slot>
        </span>
        <span class="resolvedCells">
            Resolved cells: <slot>${data.resolvedCells}</slot>
        </span>
        <span class="currentsolver">
            Solver: <slot>${data.currentsolver}</slot>
        </span>
        <span class="currentDistanceMetric">
            Heuristic: <slot>${data.currentDistanceMetric}</slot>
        </span>
        <span class="hWeight">
            Heuristic weight: <slot>${data.hWeight}</slot>
        </span>
        </div>`
        shadow.append(template.content.cloneNode(true))
    }
}

customElements.define('solution-information', SolutionInformation)
