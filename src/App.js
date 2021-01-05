import React from 'react';
import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom';

import AttendanceMap from './pages/attendanceMap'
import AtteAndance from './pages/attendanceList'

function App() {

    var deviceWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
    window.onresize = function () {
        var deviceWidth = document.documentElement.clientWidth;
        document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
    };
    return (
            <HashRouter>
                <Switch>

                    <Route exact path="/" component={AtteAndance} />
                    <Route exact path="/AttendanceMap" component={AttendanceMap} />
                   
                </Switch>
            </HashRouter>
    );
}

export default App;
