import React from "react";

import CardSymbol from "./CardSymbol";
import InfoBlock from "./InfoBlock";

const colors = {
    W: "#FAFEFD",
    U: "#BECBDB",
    B: "#94898D",
    R: "#EECDC4",
    G: "#C3D2BB",
    gold: "#C9B761",
    colorless: "#CBD1DD"
};

export default class CardRow extends React.Component {
    render() {
        const card = this.props.card;

        // Determine background color
        let color;
        if (!card.colors || card.colors.length == 0) {
            color = colors.colorless;
        } else if (card.colors.length == 1) {
            color = colors[card.colors[0]];
        } else {
            color = colors.gold;
        }

        let cost;
        // Get cost symbol images
        if (!card.cost) {
            cost = null;
        } else {
            cost = card.cost.match(/{.+?}/g).map((symbol) => {
                return <CardSymbol symbol={symbol.slice(1, -1)} />;
            });
        }

        return (
            <div
                style={{
                    margin: 10,
                    display: "table",
                    zIndex: 0
                }}>
                <div
                    className="card-header"
                    style={{
                        position: "relative",
                        display: "inline-block",
                        backgroundColor: color,
                        borderRadius: 2,
                        padding: 5,
                        width: 300,
                        WebkitAppRegion: "no-drag",
                        zIndex: 10
                    }}>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: 29,
                            borderRadius: 2,
                            backgroundColor: "rgba(100, 100, 100, 0.2)",
                            width: card.rating ? (card.rating * 300) / 100 : 0,
                            zIndex: -1
                        }}
                    />
                    <div
                        style={{
                            zIndex: 30,
                            fontFamily: "beleren"
                        }}>
                        {card.name}
                        <div
                            style={{
                                float: "right"
                            }}>
                            {cost}
                        </div>
                    </div>
                    <InfoBlock card={card} />
                </div>
            </div>
        );
    }
}
