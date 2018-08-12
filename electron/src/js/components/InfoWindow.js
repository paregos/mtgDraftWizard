import React from "react";

export default class InfoWindow extends React.Component {
    render() {
        const card = this.props.card;
        if (!card) {
            return <div style={{ width: 300 }} />;
        } else {
            return (
                <div
                    style={{
                        position: "relative",
                        top: 11 + this.props.index * 39,
                        width: 300,
                        backgroundColor: "white",
                        marginRight: 10,
                        padding: 10,
                        borderRadius: 2,
                        boxShadow: this.props.show ? "0px 3px 7px 2px rgba(0,0,0,0.5)" : "0px 2px 5px 0px rgba(0,0,0,0.5)",
                        transition: "opacity 0.3s, box-shadow 0.3s",
                        opacity: this.props.show ? 1 : 0
                    }}>
                    <div>
                        <div
                            style={{
                                display: "inline-block",
                                margin: 5,
                                fontSize: 20
                            }}>
                            LSV: {typeof card.lsvRating == "number" ? card.lsvRating : "N/A"}
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                margin: 5,
                                fontSize: 20
                            }}>
                            LRC: {typeof card.lrcRating == "number" ? card.lrcRating : "N/A"}
                        </div>
                        <div
                            style={{
                                display: "inline-block",
                                margin: 5,
                                fontSize: 20
                            }}>
                            Draftaholics: {typeof card.draftaholicsRating == "number" ? card.draftaholicsRating : "N/A"}
                        </div>
                    </div>
                    {card.lsvDescription ? (
                        <div>
                            <div
                                style={{
                                    fontSize: 30,
                                    margin: 5
                                }}>
                                LSV Says:
                            </div>
                            <div
                                style={{
                                    margin: 15
                                }}>
                                {card.lsvDescription}
                            </div>
                        </div>
                    ) : null}
                </div>
            );
        }
    }
}
