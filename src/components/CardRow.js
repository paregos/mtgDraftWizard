import React, { Fragment } from "react";
import { TableRow, TableRowColumn } from "material-ui/Table";
import CardImage from "./CardImage";
export default class CardRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableRow: this.props.tableRow,
            cardId: this.props.cardId,
            cardName: this.props.cardName,
            cardText: this.props.cardText,
            imageSource: this.props.imageSource,
            hover: false,
            mousex: 0,
            mousey: 0
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
    }

    handleMouseEnter(e) {
        this.setState({
            hover: true,
            mousex: e.clientX,
            mousey: e.clientY
        });
    }
    handleMouseMove(e) {
        this.setState({
            hover: true,
            mousex: e.clientX,
            mousey: e.clientY
        });
    }
    handleMouseLeave(e) {
        this.setState({
            hover: false,
            mousex: e.clientX,
            mousey: e.clientY
        });
    }

    render() {
        if (this.props.show) {
            return (
                <Fragment>
                    {this.state.hover && <CardImage imageSource={this.state.imageSource} mousex={this.state.mousex} mousey={this.state.mousey} />}
                    <TableRow key={this.state.tableRow} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave}>
                        <TableRowColumn>{this.state.cardId}</TableRowColumn>
                        <TableRowColumn>{this.state.cardName}</TableRowColumn>
                        <TableRowColumn>{this.state.cardText}</TableRowColumn>
                    </TableRow>
                </Fragment>
            );
        }

        return null;
    }
}
