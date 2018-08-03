import Cards from '../../../cards.json'

const placeholder = {
  name: '???',
  cost: '{0}',
  colors: [],
  colorIdentity: []
}

export function getCardInfo(id) {
  const card = Cards[id];
  if(card) {
    return card;
  } else {
    return placeholder;
  }
}