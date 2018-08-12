import React from 'react'

export default class RatingBar extends React.Component {
  render() {
    let visibility = 'visible';
    if(isNaN(this.props.progress) || this.props.progress < 0) {
      visibility = 'hidden';
    }

    return (
      <div>
        <div style={{
          visibility: visibility,
          width: this.props.width,
          height: this.props.height,
          borderRadius: this.props.height / 2,
          backgroundColor: '#CFD8DC'
        }}/>
        <div style={{
          position: 'relative',
          visibility: visibility,
          top: -this.props.height,
          width: this.props.width * this.props.progress,
          height: this.props.height,
          marginBottom: -this.props.height,
          borderRadius: this.props.height / 2,
          backgroundColor: lerpColor('#B71C1C', '#2196F3', this.props.progress),
          transition: '0.3s all'
        }}/>
      </div>
    )
  }
}

/**
 * A linear interpolator for hexadecimal colors
 * @param {String} a
 * @param {String} b
 * @param {Number} amount
 * @example
 * // returns #7F7F7F
 * lerpColor('#000000', '#ffffff', 0.5)
 * @returns {String}
 */
function lerpColor(a, b, amount) { 

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}