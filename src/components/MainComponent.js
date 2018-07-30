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
import CardRow from "./CardRow"
import orderBy from "lodash/orderBy";

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardData: [],
      isLoading: true,
      fixedHeader: true,
      fixedFooter: false,
      stripedRows: false,
      showRowHover: true,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: false,
      height: '700px',
      columnToSort: "name",
      columnToSearch: "name",
      sortDirection: "desc",
      searchTerm: '',
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    axios.get('..//M19.json') // JSON File Path
      .then( response => {
        this.setState({
          cardData: response.data.cards
      });
      console.log(this.state);
      this.setState({ isLoading: false });
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  tick() {
  }

  render() {

    const { cardData, isLoading, searchTerm } = this.state;

    var cards = cardData ? cardData : {};

    if (isLoading) {
      return (
      <div>
        <p>Loading ...</p>
        <div class="lds-css ng-scope">
              <div style={{width:"100%", height:"100%"}} class="lds-eclipse">
                <div></div>
                <div></div>
              </div>
            </div>
      </div>
      )
    }

    return(
      <div>
        <SearchBar
          onChange={(value) => {
            console.log(value)
            this.setState({searchTerm: value})            
          }}
          onRequestSearch={() => console.log(this.state.searchTerm)}
          style={{
            margin: '0 auto',
            maxWidth: 800
          }}
        />

       <Table
          height={this.state.height}
          style={{ "margin-top": 20, width: 1200 }}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          handleSort={this.state.handleSort}
          columnToSort={this.state.columnToSort}
          sortDirection={this.state.sortDirection}
          data={orderBy(
            this.state.searchTerm ? this.state.cardData.filter(x =>
            x[this.state.columnToSearch].toLowerCase().includes(this.state.searchTerm)) : this.state.cardData,
            this.state.cardData,
            this.state.columnToSort,
            this.state.sortDirection
          )}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn tooltip="Unique Card ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="Card Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="Card Text">Card Text</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
          {cards.map((card, i) => {
              console.log(card.name.includes(searchTerm))
              return (
                <CardRow 
                  tableRow = {i} 
                  cardId = {card.id}
                  cardName = {card.name}
                  cardText = {card.text}
                  show = {card.name.includes(searchTerm)}
                >
                </CardRow> 
              )
          })}
          </TableBody>
        </Table>
      </div>
    )
  }
}