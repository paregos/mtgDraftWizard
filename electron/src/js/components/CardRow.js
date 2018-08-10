import React from 'react'

import CardSymbol from './CardSymbol'
import RatingBar from './RatingBar'

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
      <div style={{
        margin: 10,
        display: 'table'
      }}>
        <div className='card-header' style={{
          display: 'inline-block',
          backgroundColor: color,
          borderRadius: 2,
          padding: 5,
          fontFamily: 'beleren',
          width: 250,
          WebkitAppRegion: 'no-drag'
        }}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        >
          {card.name}
          <div style={{
            float: 'right'
          }}>
            {cost}
          </div>
        </div>
        <div style={{
          display: 'table-cell',
          padding: 10
        }}>
          <RatingBar
            width={50}
            height={10}
            progress={card.rating / 100} />
        </div>
      </div>
    )
  }
}