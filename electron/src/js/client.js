import React from 'react'
import ReactDOM from 'react-dom'
import { ipcRenderer } from 'electron'
import _ from 'lodash'
import axios from 'axios'

import { getCardInfo } from './helpers/CardInfo'
import DraftTierList from './components/DraftTierList'

const title = 'MTG Draft Wizard';
const TIER_URL = 'http://localhost:3010/tiers'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draftState: {
        packNumber: 0,
        pickNumber: 0,
        draftPack: [],
        pickedCards: []
      }
    }
  }

  componentDidMount() {
    ipcRenderer.on('draftStateUpdate', (event, data) => {
      console.log(event, data);
      data.draftPack = data.draftPack || [];
      data.pickedCards = data.pickedCards || [];
      this.setState({
        draftState: data
      })
    })
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.draftState);
    if(_.isEqual(prevState.draftState.draftPack, this.state.draftState.draftPack) &&
       _.isEqual(prevState.draftState.pickedCards, this.state.draftState.pickedCards)) {
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

        this.setState({
          draftState: {
            ...this.state.draftState,
            tiers: res.data.tiers
          }
        })
      })
  }

  render() {
    return (
      <div>
        <DraftTierList
          tiers={this.state.draftState.tiers}
          cards={
            this.state.draftState.draftPack.map(id => {
              return getCardInfo(id);
            })} />
        ...
        <DraftTierList cards={
          this.state.draftState.pickedCards.map(id => {
            return getCardInfo(id);
          })} />
      </div>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);