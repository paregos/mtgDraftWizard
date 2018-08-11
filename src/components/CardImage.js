import React, { Component } from "react";

export default class CardImage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.imageSource != "") {
            const styles = {
                position: "fixed",
                backfaceVisibility: "hidden",
                WebkitTransform: `translateX(${this.props.mousex}px) translateY(${this.props.mousey}px)`,
                transform: `translateX(${this.props.mousex}px) translateY(${this.props.mousey}px)`,
                top: "0",
                left: "0",
                pointerEvents: "none"
            };
            return (
                <div>
                    <img src={this.props.imageSource} style={styles} />
                </div>
            );
        }

        return null;
    }
}
