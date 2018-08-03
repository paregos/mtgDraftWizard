import React from 'react'

export default class CardRow extends React.Component {
  render() {
    const card = this.props.card;
    return (
      <div>
        {card.name}
        {card.cost}
        Tier: {this.props.tier}
      </div>
    )
  }
}