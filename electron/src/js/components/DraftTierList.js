import React from 'react'
import CardRow from './CardRow'

export default class DraftTierList extends React.Component {
  render() {
    return (
      <div>
        {this.props.cards.map((card, index) => {
          return <CardRow card={card} tier={this.props.tiers ? this.props.tiers[index] : '?'} />
        })}
      </div>
    );
  }
}