import React from 'react'
import ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import axios from 'axios'

import { getCardInfo } from './helpers/CardInfo'
import DraftTierList from './components/DraftTierList'
import InfoWindow from './components/InfoWindow'

const title = 'MTG Draft Wizard';
const TIER_URL = 'http://localhost:3010/tiers'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draftState: {
        draftId: 0,
        packNumber: 0,
        pickNumber: 0,
        draftPack: [],
        pickedCards: [],
        processedCards: []
      },
      hoverIndex: 0,
      hovering: false
    }
  }

  componentDidMount() {
    ipcRenderer.on('draftStateUpdate', (event, data) => {
      console.log(event, data);
      data.draftPack = data.draftPack || [];
      data.pickedCards = data.pickedCards || [];
      data.processedCards = data.processedCards || [];
      this.setState({
        draftState: data
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.draftState);
    if(_.isEqual(prevState.draftState.draftId, this.state.draftState.draftId) &&
       _.isEqual(prevState.draftState.packNumber, this.state.draftState.packNumber) && 
       _.isEqual(prevState.draftState.pickNumber, this.state.draftState.pickNumber)) {
      return;
    }

    axios.post(TIER_URL, this.state.draftState)
      .then(res => {
        // Check that it's still the same pick
        // if(res.data.draftId != this.state.draftId ||
        //    res.data.pickNumber != this.state.pickNumber ||
        //    res.data.packNumber != this.state.packNumber) {
        //   console.log('no')
        //   return;
        // }

        console.log(res.data);

        this.setState({
          draftState: {
            ...this.state.draftState,
            processedCards: res.data.processedCards
          }
        })
      })
  }

  hoverOver(index) {
    this.setState({
      hoverIndex: index,
      hovering: true
    });
  }

  hoverLeave() {
    this.setState({
      hovering: false
    })
  }

  render() {
    return (
      <div style={{
        display: 'table'
      }}>
        <div style={{
          display: 'table-cell'
        }}>
          <InfoWindow
            card={this.state.draftState.processedCards[this.state.hoverIndex]}
            show={this.state.hovering}
            index={this.state.hoverIndex}
          />
        </div>
        <div style={{
          display: 'table-cell',
          borderRadius: 2,
          boxShadow: '0px 2px 5px 0px rgba(0,0,0,0.5)',
          WebkitAppRegion: 'drag',
          backgroundColor: 'white'
        }}>
          <DraftTierList
            hoverOver={this.hoverOver.bind(this)}
            hoverLeave={this.hoverLeave.bind(this)}
            processedCards={this.state.draftState.processedCards.map(card => {
              return {
                ...card,
                ...getCardInfo(card.id)
              }
            })}
            cards={
              this.state.draftState.draftPack.map(id => {
                return getCardInfo(id);
              })} />
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);