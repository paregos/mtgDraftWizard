import React from "react";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import Table, { TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableHead } from "material-ui/Table";

export default class CardRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableRow: this.props.tableRow,
            cardId: this.props.cardId,
            cardName: this.props.cardName,
            cardText: this.props.cardText,
            imageSource: this.props.imageSource,
            hover: false
        };
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillUnmount() {}

    tick() {}

    mouseOn = () => {
        this.setState({ hover: true });
    };
    mouseOff = () => {
        this.setState({ hover: false });
    };

    onMouseEnter = () => {
        this.props.changeImageSource(this.state.imageSource);
    };

    render() {
        if (this.props.show) {
            return (
                <TableRow key={this.state.tableRow} onMouseEnter={this.onMouseEnter}>
                    <TableRowColumn>{this.state.cardId}</TableRowColumn>
                    <TableRowColumn>{this.state.cardName}</TableRowColumn>
                    <TableRowColumn>{this.state.cardText}</TableRowColumn>
                </TableRow>
            );
        }

        return null;
    }
}
