import React from "react";
import SearchBar from "material-ui-search-bar";
import axios from "axios";
import Table, { TableBody, TableHeader, TableHeaderColumn, TableRow } from "material-ui/Table";
import CardRow from "./CardRow";

export default class MainComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardData: [],
            isLoading: true,
            searchTerm: "",
            imageSource: "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=447137&type=card"
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        console.log(process.env);
        var baseUrl = process.env.ENVIRONMENT == "dev" ? "http://localhost:3010" : "https://mtgdraftwizard.herokuapp.com";
        console.log(baseUrl);
        axios
            .get(baseUrl + "/cards/all") // JSON File Path
            .then((response) => {
                console.log(response);
                this.setState({
                    cardData: response.data.cards
                });
                this.setState({ isLoading: false });
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    render() {
        const { cardData, isLoading, searchTerm } = this.state;

        var cards = cardData ? cardData : {};

        if (isLoading) {
            return (
                <div>
                    <p>Loading ...</p>
                    <div class="lds-css ng-scope">
                        <div style={{ width: "100%", height: "100%" }} class="lds-eclipse">
                            <div />
                            <div />
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <SearchBar
                    onChange={(value) => {
                        this.setState({ searchTerm: value.toLowerCase() });
                    }}
                    onRequestSearch={() => console.log(this.state.searchTerm)}
                    style={{
                        margin: "0 auto",
                        maxWidth: 800
                    }}
                />

                <div>
                    <Table height="700px" style={{ marginTop: 20, width: 1200 }} fixedHeader={true} fixedFooter={false} selectable={true} multiSelectable={false}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn tooltip="Unique Card ID">ID</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Card Name">Name</TableHeaderColumn>
                                <TableHeaderColumn tooltip="Card Text">Card Text</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false} deselectOnClickaway={true} showRowHover={true} stripedRows={false}>
                            {cards.map((card, i) => {
                                return (
                                    <CardRow
                                        key={i}
                                        tableRow={i}
                                        cardId={card.id}
                                        cardName={card.name}
                                        cardText={card.text}
                                        imageSource={card.imageUrl}
                                        show={card.name.toLowerCase().includes(searchTerm)}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}
