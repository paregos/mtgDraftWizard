import React, { Component } from "react";
import spinner from "../img/spinner.gif";

export default class CardImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.handleImageLoaded = this.handleImageLoaded.bind(this);
    }

    handleImageLoaded() {
        this.setState({
            loading: true
        });
    }
    render() {
        if (this.props.imageSource != "") {
            const offsetX = this.state.loading ? 15 : 0;
            const offsetY = this.state.loading ? -10 : 0;
            const styles = {
                position: "fixed",
                backfaceVisibility: "hidden",
                WebkitTransform: `translateX(${this.props.mousex + offsetX}px) translateY(${this.props.mousey + offsetY}px)`,
                transform: `translateX(${this.props.mousex + offsetX}px) translateY(${this.props.mousey + offsetY}px)`,
                top: "0",
                left: "0",
                pointerEvents: "none"
            };
            return (
                <div>
                    <img src={this.state.loading ? spinner : this.props.imageSource} style={styles} onLoad={this.handleImageLoaded} />
                </div>
            );
        }

        return null;
    }
}
