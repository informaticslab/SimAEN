/*
# DISTRIBUTION STATEMENT A. Approved for public release. Distribution is unlimited.

# This material is based upon work supported under Air Force Contract No. FA8702-15-D-0001.
# Any opinions,findings, conclusions or recommendations expressed in this material are those
# of the author(s) and do not necessarily reflect the views of the Centers for Disease Control.

# (c) 2021 Massachusetts Institute of Technology.

# The software/firmware is provided to you on an As-Is basis

# Delivered to the U.S. Government with Unlimited Rights, as defined in DFARS Part 252.227-7013
# or 7014 (Feb 2014). Notwithstanding any copyright notice, U.S. Government rights in this work
# are defined by DFARS 252.227-7013 or DFARS 252.227-7014 as detailed above. Use of this work
# other than as specifically authorized by the U.S. Government may violate any copyrights that
# exist in this work.

# Copyright (c) 2021 Massachusetts Institute of Technology
# SPDX short identifier: MIT

# Developed as part of: SimAEN, 2021
*/

import React from "react";
import { scaleLinear } from "d3-scale";
import {
  XYPlot,
  LineSeries,
  LabelSeries,
  XAxis,
  Voronoi,
  Hint,
} from "react-vis";
import debounce from "debounce";

import { desiredLabels, layout, NUMBER_OF_DAYS, MAX_Y } from "../../constants";

type interactive = {
  allPoints: { x: number; y: number }[];
  idMap: { [id: string]: { x: number; y: number }[] };
};
type highlightState = {
  highlightSeries: { x: number; y: number }[] | null;
  highlightTip: {
    y: number;
    name: React.MouseEvent<HTMLElement, MouseEvent>;
  } | null;
};

export default function Interactive(props: interactive) {
  const { allPoints, idMap } = props;
  const { height, width, margin } = layout;
  const x = scaleLinear()
    .domain([0, NUMBER_OF_DAYS])
    .range([margin.left, width - margin.right]);
  const y = scaleLinear()
    .domain([0, MAX_Y])
    .range([height - margin.top - margin.bottom, 0]);
  const [state, setState] = React.useState<highlightState>({
    highlightSeries: null,
    highlightTip: null,
  });

  const debouncedSetState = debounce(
    (newState: highlightState) => setState(newState),
    40
  );

  return (
    <div className="absolute full">
      <XYPlot
        onMouseLeave={() =>
          setState({ highlightSeries: null, highlightTip: null })
        }
        xDomain={[0, NUMBER_OF_DAYS]}
        yDomain={[0, MAX_Y + 1]}
        {...layout}
      >
        <LabelSeries
          labelAnchorX="start"
          data={desiredLabels.map((row, idx) => {
            return ({
              x: idMap[row]?.[0]?.x || 10 * idx ,
              y: idMap[row]?.[0]?.y || 10 * idx,
              label: row,
              yOffset: -12,
            })
          }
        )}
          style={{ fontSize: "10px", fontFamily: "sans-serif" }}
          getX={(d) => NUMBER_OF_DAYS}
          getY={(d) => d.y}
          // getLabel={(d) => `${d.toUpperCase()}`}
        />
        <XAxis
          tickFormat={(d) => (!d ? "1st game" : !(d % 10) ? `${d}th` : "")}
        />
        {state.highlightSeries && (
          <LineSeries
            animation
            curve=""
            data={state.highlightSeries}
            color="black"
          />
        )}
        {state.highlightTip && (
          <Hint
            value={{ y: state.highlightTip.y, x: NUMBER_OF_DAYS }}
            align={{ horizontal: "right" }}
          >
            {`${state.highlightTip.name} ${state.highlightTip.y}`}
          </Hint>
        )}

        <Voronoi
          extent={[
            [0, y(MAX_Y)],
            [width, height - margin.bottom],
          ]}
          nodes={allPoints}
          // polygonStyle={{
          //   // UNCOMMENT BELOW TO SEE VORNOI
          //   stroke: "rgba(0, 0, 0, .2)",
          // }}
          onHover={(row) => {
            const player = idMap.row;
            if (!player) {
              setState({
                highlightSeries: null,
                highlightTip: null,
              });
              return;
            }
            debouncedSetState({
              highlightSeries: player,
              highlightTip: {
                y: player[player.length - 1].y,
                name: row,
              },
            });
          }}
          x={(d) => x(d.x)}
          y={(d) => y(d.y)}
        />
      </XYPlot>
    </div>
  );
}
