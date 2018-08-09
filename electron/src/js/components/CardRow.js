import React from 'react'

import CardSymbol from './CardSymbol'

const colors = {
  W: '#FAFEFD',
  U: '#BECBDB',
  B: '#94898D',
  R: '#EECDC4',
  G: '#C3D2BB',
  gold: '#C9B761',
  colorless: '#CBD1DD'
}

export default class CardRow extends React.Component {
  render() {
    const card = this.props.card;

    // Determine background color
    let color;
    if(!card.colors || card.colors.length == 0) {
      color = colors.colorless;
    } else if(card.colors.length == 1) {
      color = colors[card.colors[0]];
    } else {
      color = colors.gold;
    }

    // Get cost symbol images
    const cost = card.cost.match(/{.+?}/g).map(symbol => {
      return <CardSymbol symbol={symbol.slice(1, -1)} />
    })

    return (
      <div>
        <div style={{
          display: 'inline-block',
          width: 50
        }}>
          {this.props.tier}
        </div>
        <div style={{
          display: 'inline-block',
          backgroundColor: color,
          border: '1px solid black',
          borderRadius: 10,
          padding: 5,
          fontFamily: 'beleren',
          width: 250
        }}>
          {card.name}
          <div style={{
            float: 'right'
          }}>
            {cost}
          </div>
        </div>
      </div>
    )
  }
}