import React from 'react'

export default class CardSymbol extends React.Component {
  render() {
    return (
      <div class={'card-symbol card-symbol-' + this.props.symbol} />
    )
  }
}