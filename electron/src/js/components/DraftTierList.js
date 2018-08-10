import React from 'react'
import CardRow from './CardRow'

export default class DraftTierList extends React.Component {
  render() {
    if(this.props.processedCards && this.props.processedCards.length > 0) {
      return (
        <div>
          {this.props.processedCards.map((card, index) => {
            return <CardRow 
              card={card}
              onMouseEnter={this.props.hoverOver.bind(this, index)}
              onMouseLeave={this.props.hoverLeave}
            />
          })}
        </div>
      );
    } else {
      return (
        <div>
          {this.props.cards.map((card, index) => {
            return <CardRow card={card} />
          })}
        </div>
      );
    }
  }
}