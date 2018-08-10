import React from "react";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import Table, { TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableHead } from "material-ui/Table";

export default class CardImage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.imageSource != "") {
            const styles = {
                position: "absolute",
                top: this.props.mousey,
                left: this.props.mousex
            };
            return (
                <div>
                    <img src={this.props.imageSource} style={styles} />
                </div>
            );
        }

        return null;
    }
}
