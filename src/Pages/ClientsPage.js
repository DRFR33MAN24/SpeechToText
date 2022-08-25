import React, { Component } from 'react';
import { Context } from './MainPage'
class ClientsPage extends Component {
    state = { name: "الإعدادات" }
    static contextType = Context;
    componentWillMount() {
        this.context(this.state.name);
    }
    render() {
        return (
            <div >
                <h1>Clients Page</h1>
            </div>
        );
    }
}

export default ClientsPage;