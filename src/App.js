import './App.css';
import 'chart.js/auto';
import React from "react";
import {Chart} from 'chart.js'
import {Pie} from 'react-chartjs-2';

function App() {
  return (
    <div className="App">
        <a className="App-image" href="https://github.com/itsmichaelyu/punctuation" aria-label="Homepage "
           data-turbo="false">
            <svg className="Filter" height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
        </a>
      <header className="App-header">
          <span className="App-title-text">Punctuation Only</span>
          <h1><span id="space">Input</span><span id="space">Output</span></h1>
          <Worker></Worker>
      </header>
    </div>
  );
}

Chart.defaults.color = "#fff";

class Worker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            original: '',
            modified: '',
            labels: [],
            data: [],
            datasets: [{
                data: [],
                backgroundColor: ['red', 'green', 'blue', 'purple', 'yellow', 'pink', 'orange', 'violet', 'brown', 'gray', 'white', 'black', 'amber'],
                fontColor: ['white'],
                borderWidth: 0,
            }]
        };
        this.handleChange = this.handleChange.bind(this);
        this.fileSubmit = this.fileSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({original: event.target.value});
        this.setState({modified: this.findPunctuation(event.target.value)})
        this.updateChart(this.findPunctuation(event.target.value));
    }

    findPunctuation(str) {
        let text = "";
        let reg = /[…[\].,/!?'"“”;:{}\-–—()]/g;
        if (str.match(reg) != null) {
            str.match(reg).forEach(function(x){text += (x === "“" || x === "”") ? "\"" : x;});
        }
        return text;
    }

    count(text) {
        let count = new Map();
        for(let x in text) {
            if(count.has(text.charAt(x))) {
                count.set(text.charAt(x), count.get(text.charAt(x))+1);
            } else {
                count.set(text.charAt(x), 1);
            }
        }
        return count;
    }

    updateChart(text) {
        let count = this.count(text);
        // console.log(count, text);
        let keys = [], vals = [];
        for (const [key, value] of count) {
            keys.push(key);
            vals.push(value);
        }
        this.setState({labels: keys, data: vals, datasets: [{data: vals}]});
    }

    countPrinter(labels, data) {
        let text = "";
        for (let i in labels) {
            text += labels[i] + " " + data[i] + "\n";
        }
        return text;
    }
  
    fileSubmit(event) {
        event.preventDefault();
        let fr=new FileReader();
        fr.onload=function(event){
            document.getElementById('fileIn').textContent=event.target.result;
            this.setState({value: event.target.result});
            console.log(event.target.result);
        }
        fr.readAsText(event.target.files[0]);
    }

    // handleFileChosen = (file) => {
    //     let fileReader = new FileReader();
    //     fileReader.onloadend = handleFileRead(file);
    //     fileReader.readAsText(file);
    // };

    render() {
        return (
            <h1>
                <textarea className="App-input" id="textIn" value={this.state.original} onChange={this.handleChange} />
                <textarea className="App-output" readOnly={true} value={this.state.modified} />
                <textarea className="App-counter" readOnly={true} disabled={true} value={this.countPrinter(this.state.labels, this.state.data)} />
                {/*<input type="file" id="fileIn" className="App-file-selector" accept=".txt,.docx,.doc,.dot,.dotx" onChange={e => this.handleFileChosen(e.target.files[0])} />*/}
                <div className="App-pie">
                    <Pie data={{
                        labels: this.state.labels,
                        datasets: this.state.datasets,
                    }}
                    />
                </div>
            </h1>
        );
    }
}

export default App;
