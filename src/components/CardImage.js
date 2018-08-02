import React from 'react'
import SearchBar from 'material-ui-search-bar'
import axios from 'axios'
import Table, {
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
    TableHead
} from 'material-ui/Table';

export default class CardImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    tick() {
    }

    mouseOn = () => {
        this.setState({ hover: true });
    }
    mouseOff = () => {
        this.setState({ hover: false });
    }

    render() {
        if (this.props.imageSource != "") {
            const styles = {
                position: 'absolute',
                top: this.props.mousey,
                left: this.props.mousex
              };
            return (
                <div>
                    <img src="https://material-ui.com/static/images/cards/contemplative-reptile.jpg" style={styles}/>
                </div>
            )
        }

        return (null)
    }
}