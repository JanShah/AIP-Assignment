class Colour {
    #r
    #g
    #b
    #a
    #hex
    constructor([r = 100, g = 100, b = 100, a = 1]) {
        this.#r = r
        this.#g = g
        this.#b = b
        this.#a = a
        this.#hex = this.#rgbToHex();
    }

    get hex() {
        return this.#hex
    }

    set r(val) {
        this.#r = Math.max(0, Math.min(255, Math.floor(val)))
    }
    set g(val) {
        this.#g = Math.max(0, Math.min(255, Math.floor(val)))
    }
    set b(val) {
        this.#b = Math.max(0, Math.min(255, Math.floor(val)))
    }
    set a(val) {
        this.#a = Math.max(0.0, Math.min(1.0, val))
    }
    set rgba([r = 100, g = 100, b = 100, a = 1]) {
        this.#r = r
        this.#g = g
        this.#b = b
        this.#a = a
    }
    get rgba() {
        return `rgba(${this.#r},${this.#g},${this.#b},${this.#a})`
    }
    #rgbToHex() {
        const hex = num => {
            return num.toString(16).padStart(2, 0)
        }
        return `#${hex(this.#r)}${hex(this.#g)}${hex(this.#b)}${hex(Math.floor(this.#a * 255))}`
    }
}

class ColourObject {
    #fill = null
    #stroke = null
    constructor(fill = null, stroke = null) {
        if (fill)
            this.#fill = new Colour(fill)
        if (stroke)
            this.#stroke = new Colour(stroke)
    }
    get fill() {
        if (this.#fill)
            return this.#fill.hex
        return false
    }

    get stroke() {
        if (this.#stroke)
            return this.#stroke.hex
        return false
    }
}

class Colours {
    constructor() {
        this.boundaryOpen = new ColourObject([255, 255, 255, 0.6])
        this.boundaryBarrier = new ColourObject([200, 50, 50, 0.6])
        this.gridOpen = new ColourObject([250, 250, 250, 0.6])
        this.gridClosed = new ColourObject([50, 100, 250, 0.8])
        this.agentFreeDetect = new ColourObject([255, 150, 0, .15])
        this.agentBarrierDetect = new ColourObject([0, 0, 0, .15])
        this.agent = new ColourObject([200, 0, 100, 0.5])
        this.visited = new ColourObject([0, 200, 100, 1])
        this.solution = new ColourObject([255, 0, 100, 1], [0, 50, 100, 1])
        this.neighbours = new ColourObject([255, 0, 0, 0.7], null)
        this.target = new ColourObject([0, 100, 255, .7])
    }

}
const colours = new Colours()
const colourSpace = document.getElementById('modelColours');

class EditColourBlock extends HTMLElement {
    constructor(colour, name) {
        super()
        const shadow = this.attachShadow({ mode: 'open' })
        const template = document.createElement('template')
        this.editTemplate = document.createElement('template')
        this.colour = colour
        this.name = name
        let str = 'border: 0px;'
        if (this.colour.stroke) {
            str = 'border: 1px solid ' + this.colour.stroke + ';';
        }
        const block = `
        <style>
            .colourBlock {
                display: flex;
                justify-content: space-between;
                margin-bottom:5px;
                align-items: center;
                max-width: 200px;
                margin-left: 20px;
            }
            .colourBox {
                display: inline-block;
                width:50px;
                height:20px;
                border-radius:3px;
                box-sizing: border-box;
                background: ${this.colour.fill ? this.colour.fill : 'none'};
                ${str}
                
            }
        </style>

        <div class="colourBlock">
			<span class="colourLabel">${name}</span>
			<button class="colourBox"></button>
		</div>
        `
        template.innerHTML = block;
        shadow.append(template.content.cloneNode(true));
        this.colourBox = shadow.querySelector('.colourBox')
    }
    
}
customElements.define('editcolour-block', EditColourBlock);

Object.keys(colours).forEach(area => {
    const colourBlock = new EditColourBlock(colours[area], area);
    colourSpace.append(colourBlock)
})



