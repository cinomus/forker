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