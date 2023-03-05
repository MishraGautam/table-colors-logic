import React, { Component } from 'react'
import './App.css'
export default class App1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 0,
            cols: 0,
            numofcolors: 0,
            colorsarray: [],
            cells: [],
            table: [],
            msg: false
        }
    }

    handleInputChange = (e) => {
        const { name, value } = e.target;
        let newColorsArray = []
        const tableCells = []
        if (name == "numofcolors") {
            for (let i = 0; i < parseInt(e.target.value); i++) {
                let color = "#"
                color += Math.floor(Math.random() * 16777215).toString(16);
                newColorsArray.push(color)
            }
        }
        else {
            newColorsArray = this.state.colorsarray
        }
        this.setState({ [name]: parseInt(value), colorsarray: newColorsArray, table:[], msg:false })
    }

    getRandomColor = () => {
        const randomIndex = Math.floor(Math.random() * this.state.colorsarray.length);
        const item = this.state.colorsarray[randomIndex];
        return item;
    };

    renderTable = () => {
        const { rows, cols } = this.state;
        const table = [];
        const tableCells = []
        for (let i = 0; i < rows; i++) {
            const row = [];
            const srow = [];
            for (let j = 0; j < cols; j++) {
                const color = this.getRandomColor();
                row.push(<td key={j} style={{ backgroundColor: color, textAlign: 'center' }}>{color}</td>);
                srow.push({ color: color, visited: false });
            }
            table.push(<tr key={i}>{row}</tr>);
            tableCells.push(srow);
        }
        this.setState({ cells: tableCells, table, msg:false })
        // return table;
    };

    findLargestAdjacent = () => {
        let maxCount = 0;
        let maxColor = "";
        const { rows, cols, cells } = this.state;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (!cells[i][j].visited) {
                    let color = cells[i][j].color;
                    let count = 1;
                    const queue = [{ x: i, y: j }];
                    cells[i][j].visited = true;
                    while (queue.length > 0) {
                        const curr = queue.shift();
                        if (curr.x > 0 && cells[curr.x - 1][curr.y].color === color && !cells[curr.x - 1][curr.y].visited) {
                            queue.push({ x: curr.x - 1, y: curr.y });
                            cells[curr.x - 1][curr.y].visited = true;
                            count++;
                        }
                        if (curr.x < rows - 1 && cells[curr.x + 1][curr.y].color === color && !cells[curr.x + 1][curr.y].visited) {
                            queue.push({ x: curr.x + 1, y: curr.y });
                            cells[curr.x + 1][curr.y].visited = true;
                            count++;
                        }
                        if (curr.y > 0 && cells[curr.x][curr.y - 1].color === color && !cells[curr.x][curr.y - 1].visited) {
                            queue.push({ x: curr.x, y: curr.y - 1 });
                            cells[curr.x][curr.y - 1].visited = true;
                            count++;
                        }
                        if (curr.y < cols - 1 && cells[curr.x][curr.y + 1].color === color && !cells[curr.x][curr.y + 1].visited) {
                            queue.push({ x: curr.x, y: curr.y + 1 });
                            cells[curr.x][curr.y + 1].visited = true;
                            count++;
                        }
                    }
                    if (count > maxCount) {
                        maxCount = count;
                        maxColor = color;
                    }
                }
            }
        }
        this.setState({ msg: true, response: `Result: the biggest area contains ${maxCount} cells with ${maxColor} color` })
    }


    render() {
        const { rows, cols, numofcolors, table, msg, response } = this.state;
        return (
            <div>
                <label>
                    Rows: &emsp;
                    <input type="number" name="rows" value={rows} onChange={this.handleInputChange} />
                </label><br/><br/>
                <label>
                    Columns: &emsp;
                    <input type="number" name="cols" value={cols} onChange={this.handleInputChange} />
                </label><br/><br/>
                <label>
                    Colours: &emsp;
                    <input type="number" name="numofcolors" value={numofcolors} onChange={this.handleInputChange} />
                </label><br/><br/>
                {table.length > 0 && <table style={{ height: '500px', width: '70%' }}>{table}</table>}
                <div style={{ display: 'flex' }}>
                    <button className="button1" onClick={this.renderTable}>Generate Table</button>&emsp;
                    {table.length > 0 && !msg && <button className="button1 button2" onClick={this.findLargestAdjacent}>Find largest adjacent</button>}
                </div>
                {msg && <h3>{response}</h3>}
            </div>
        )
    }
}
