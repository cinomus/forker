import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import {useHttp} from "./hooks/http.hook";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App/>, document.getElementById('root'))
let forks = [];
reloadForks();
function reloadForks() {
    setInterval(async ()=>{
    const response = await fetch('/api/forks')
    const data = await response.json()
    forks = data;
    console.log(forks)
    }, 1000)
}

setInterval(() => {
    class Forks extends React.Component {
        render() {
            if (forks.length === 0) {
                return <div>
                    <h1>Идет прогрев при первом запуске сервера, либо вилок нет</h1>
                </div>
            } else {
                return React.createElement('ul', null,
                    forks.map((item, i) =>
                        React.createElement('li', {key: i},
                            React.createElement('table', null,
                                React.createElement('tr', null,
                                    React.createElement('td', null,
                                        React.createElement('tr', null, item.discipline)
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('tr', null, `${item.profit}%`),
                                        React.createElement('tr', null, ((new Date().getTime() - item.date) / 1000).toFixed(0) + ' sec')
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('tr', null, item.initiator1.platform + `     [${item.initiator1.triggered}]`),
                                        React.createElement('tr', null, item.initiator2.platform + `     [${item.initiator2.triggered}]`)
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('tr', null, item.initiator1.koef_value),
                                        React.createElement('tr', null, item.initiator2.koef_value)
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('tr', null, `${item.initiator1.koef}(${item.initiator1.target})`),
                                        React.createElement('tr', null, `${item.initiator2.koef}(${item.initiator2.target})`)
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('tr', null, `${item.initiator1.team_1} vs ${item.initiator1.team_2}`),
                                        React.createElement('tr', null, `${item.initiator2.team_1} vs ${item.initiator2.team_2}`)
                                    ),
                                    React.createElement('td', null,
                                        React.createElement('tr', null, React.createElement('a', {'href': item.initiator1.href}, 'link')),
                                        React.createElement('tr', null, React.createElement('a', {'href': item.initiator2.href}, 'link'))
                                    )
                                )
                            )
                        )
                    )
                )
            }
        }
    }
    ReactDOM.render(
        <Forks/>,
        document.getElementById('root')
    );
}, 1000)
// setInterval(() => {
//     ReactDOM.render(
//         <Forks/>,
//         document.getElementById('root')
//     );
//
// }, 1000)

// let Square = (props) => {
//   return (
//     <button
//       className="square" onClick={props.onClick}>
//       {props.value}
//     </button>
//   );
//
// }
// class Board extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       squares: Array(9).fill(null),
//       xIsNext: true,
//     };
//   }
//
//   handleClick(i) {
//     const squares = this.state.squares.slice();
//     if (calculateWinner(squares) || squares[i]) {
//       return;
//     }
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     this.setState({
//       squares: squares,
//       xIsNext: !this.state.xIsNext,
//     });
//   }
//
//   renderSquare(i) {
//     return (
//       <Square
//         value={this.state.squares[i]}
//         onClick={() => this.handleClick(i)}
//       />
//     );
//   }
//
//   render() {
//     const winner = calculateWinner(this.state.squares);
//     let status;
//     if (winner) {
//       status = 'Выиграл ' + winner;
//     } else {
//       status = 'Следующий ход: ' + (this.state.xIsNext ? 'X' : 'O');
//     }
//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }
//
// class Game extends React.Component {
//   render() {
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board />
//         </div>
//         <div className="game-info">
//           <div>{/* status */}</div>
//           <ol>{/* TODO */}</ol>
//         </div>
//       </div>
//     );
//   }
// }
//
// // ========================================
//
// ReactDOM.render(
//   <Game />,
//   document.getElementById('root')
// );
// function calculateWinner(squares) {
//   const lines = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6],
//   ];
//   for (let i = 0; i < lines.length; i++) {
//     const [a, b, c] = lines[i];
//     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//       return squares[a];
//     }
//   }
//   return null;
// }