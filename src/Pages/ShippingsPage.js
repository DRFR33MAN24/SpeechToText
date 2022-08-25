import React, { Component } from 'react';
import { Context } from './MainPage'
class ShippingsPage extends Component {
    state = { name: "الإعدادات" }
    static contextType = Context;
    componentWillMount() {
        this.context(this.state.name);
    }
    render() {
        return (
            <div>
                <h1>ShippingsPage</h1>
            </div>
        );
    }
}

export default ShippingsPage;