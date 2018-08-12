import React from "react";

export default class InfoBlock extends React.Component {
    render() {
        const card = this.props.card;
        if (!card) {
            return <div style={{ width: 300 }} />;
        } else {
            return (
                <div
                    style={{
                        marginTop: 5
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
                                    fontSize: 25,
                                    margin: 5
                                }}>
                                LSV Says:
                            </div>
                            <div
                                style={{
                                    margin: 10
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
