class SolutionInformation extends HTMLElement {
    constructor(data) {
        super()
        const shadow = this.attachShadow({ mode: 'open' });
        const template = document.createElement('template')
        template.innerHTML = `
        <style>
        article {
            position:fixed;
            bottom:0;
            left:0;
            width:100vw;
            height:50px;
            background:yellow;
            display:flex;
            align-items: center;
            justify-content: center;
            z-index:2;
        }
        button {
            padding:5px 10px;
        }
        button.close {
            border:none;
            background:none;
        }
        section {
            width:100px;
        }
        section:after {
            display:inline-block;
            content: '|';
            margin-right:3px;
        }
        section:last-of-type:after {
            content: ''
        }
        span {
            font-weight:600;
        }
        </style>
        <article>
        <section class="timeCost">
            Time: <span>${data.time}</span>ms
        </section>
        <section class="memSize">
            Memory: <span>${data.memory}</span> bytes
        </section>
        <section class="pathCost">
            Cost: <span>${data.cost}</span>
        </section>
        <section class="pathLength">
           Length: <span>${data.distance}</span>m
        </section>
        <section class="gridCells">
            Total grids: <span>${data.gridCells}</span>
        </section>
        <section class="resolution">
            Resolution: <span>${data.resolution}</span>
        </section>
        <section class="resolvedCells">
            Points: <span>${data.resolvedCells}</span>
        </section>
        <section class="currentsolver">
            Solver: <span>${data.solver}</span>
        </section>
        <section class="currentDistanceMetric">
            Heuristic: <span>${data.heuristic}</span>
        </section>
        <section class="hWeight">
            Heuristic weight: <span>${data.weight}</span>
        </section>
        <button class="close">X</button>
        </article>
        `
        shadow.append(template.content.cloneNode(true))
        this.closeButton = shadow.querySelector('.close')

    }

    connectedCallback() {
        this.closeButton.addEventListener('click',()=>{
            this.parentNode.removeChild(this)
        })

    }
}

customElements.define('solution-information', SolutionInformation)
