import React from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { dataFont, medGrey, materialButton } from "../../globalStyles";
import { prettyString } from "../../util/stringHelpers";
import computeResponsive from "../../util/computeResponsive";
import { TRIGGER_DOWNLOAD_MODAL } from "../../actions/types";
import Flex from "./flex";
import { applyFilter } from "../../actions/treeProperties";

const dot = (
  <span style={{marginLeft: 10, marginRight: 10}}>
    •
  </span>
);

export const preambleText = "This work is made possible by the open sharing of genetic data by research groups from all over the world. We gratefully acknowledge their contributions.";

export const getAcknowledgments = (style) => {
  if (window.location.pathname.includes("ebola")) {
    return (
      <div style={style}>
        Special thanks to Nick Loman, Matt Cotten, Ian Goodfellow and Paul Kellam for spearheading data sharing efforts during the outbreak. For a more complete phylogeographic analysis of these data see <a target="_blank" rel="noreferrer noopener" href="http://dx.doi.org/10.1038/nature22040">Dudas et al</a>. Curated data used in the paper are available at <a target="_blank" rel="noreferrer noopener" href="https://github.com/ebov/space-time">github.com/ebov/space-time</a>. The animation shown here was inspired by <a target="_blank" rel="noreferrer noopener" href="https://youtu.be/eWnIhWUpQiQ">a work</a> by <a target="_blank" rel="noreferrer noopener" href="http://bedford.io/team/gytis-dudas/">Gytis Dudas</a>.
      </div>
    );
  }
  if (window.location.pathname.includes("zika")) {
    return (
      <div style={style}>
        Special thanks to Nick Loman, Nathan Grubaugh, Kristof Theys, Nuno Faria, Kristian Andersen, Andrew Rambaut and Karl Erlandson for data sharing, comments and suggestions.
      </div>
    );
  }
  if (window.location.pathname.includes("mumps")) {
    return (
      <div style={style}>
        Special thanks to Jennifer Gardy, Shirlee Wohl, Jeff Joy, Nathan Yozwiak, Hayden Metsky, Agatha Jassem, Louise Moncla, Gytis Dudas and Pardis Sabeti for data sharing, comments and suggestions.
      </div>
    );
  }
  if (window.location.pathname.includes("h7n9")) {
    return (
      <div style={style}>
        We thank the <a target="_blank" rel="noreferrer noopener" href="https://gisaid.org">GISAID Initiative</a> for enabling genomic surveillance of influenza and for providing a critical data sharing platform.
      </div>
    );
  }
  if (window.location.pathname.includes("flu")) {
    return (
      <div>
        <div style={style}>
          We thank the <a target="_blank" rel="noreferrer noopener" href="https://gisaid.org">GISAID Initiative</a> for enabling genomic surveillance of influenza and for providing a critical data sharing platform. Titer data used in antigenic analysis was generated by the <a target="_blank" rel="noreferrer noopener" href="https://www.crick.ac.uk/research/worldwide-influenza-centre">Worldwide Influenza Centre at the Francis Crick Institute</a> and the <a target="_blank" rel="noreferrer noopener" href="https://www.cdc.gov/flu/">Influenza Division at the US Centers for Disease Control and Prevention</a>. Special thanks to John McCauley, Rod Daniels, Colin Russell, Dave Wentworth, Becky Garten, Vivien Dugan, Sebastian Maurer-Stroh, Peter Bogner, Michael Lässig and Marta Łuksza for feedback and advice.
        </div>
        <div style={style}>
        Currently, <a target="_blank" rel="noreferrer noopener" href="https://nextflu.org">nextflu.org</a> remains the canonical analysis of seasonal influenza evolution. Phylogenetic results are mirrored between the sites, while <a target="_blank" rel="noreferrer noopener" href="https://nextflu.org">nextflu.org</a> maintains features (like frequency trajectories) not yet available on <a target="_blank" rel="noreferrer noopener" href="https://nextstrain.org">nextstrain.org</a>.
        </div>
      </div>
    );
  }
  return null;
}

const dispatchFilter = (dispatch, activeFilters, key, value) => {
  const mode = activeFilters[key].indexOf(value) === -1 ? "add" : "remove";
  dispatch(applyFilter(key, [value], mode));
};

export const displayFilterValueAsButton = (dispatch, activeFilters, filterName, itemName, display, showX) => {
  const active = activeFilters[filterName].indexOf(itemName) !== -1;
  if (active && showX) {
    return (
      <div key={itemName} style={{display: "inline-block"}}>
        <div
          className={'boxed-item-icon'}
          onClick={() => {dispatchFilter(dispatch, activeFilters, filterName, itemName);}}
          role="button"
          tabIndex={0}
        >
          {'\xD7'}
        </div>
        <div className={"boxed-item active-with-icon"}>
          {display}
        </div>
      </div>
    );
  }
  if (active) {
    return (
      <div
        className={"boxed-item active-clickable"}
        key={itemName}
        onClick={() => {dispatchFilter(dispatch, activeFilters, filterName, itemName);}}
        role="button"
        tabIndex={0}
      >
        {display}
      </div>
    );
  }
  return (
    <div
      className={"boxed-item inactive"}
      key={itemName}
      onClick={() => {dispatchFilter(dispatch, activeFilters, filterName, itemName);}}
      role="button"
      tabIndex={0}
    >
      {display}
    </div>
  );
};

const removeFiltersButton = (dispatch, filterNames, outerClassName, label) => {
  return (
    <div
      className={`${outerClassName} boxed-item active-clickable`}
      style={{paddingLeft: '5px', paddingRight: '5px', display: "inline-block"}}
      onClick={() => {
        filterNames.forEach((n) => dispatch(applyFilter(n, [], 'set')))
      }}
    >
      {label}
    </div>
  );
};

@connect((state) => {
  return {
    tree: state.tree,
    totalStateCounts: state.tree.totalStateCounts,
    metadata: state.metadata,
    colorOptions: state.metadata.colorOptions,
    browserDimensions: state.browserDimensions.browserDimensions,
    activeFilters: state.controls.filters
  };
})
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.getStyles = () => {
      /* the styles of the individual items is set in CSS */
      const styles = {
        footer: {
          marginLeft: "30px",
          paddingBottom: "30px",
          fontFamily: dataFont,
          fontSize: 15,
          fontWeight: 300,
          color: medGrey,
          lineHeight: 1.4
        },
        acknowledgments: {
          marginTop: "10px"
        },
        citationList: {
          marginTop: "10px",
          lineHeight: 1.0
        },
        line: {
          marginTop: "20px",
          marginBottom: "20px",
          borderBottom: "1px solid #CCC"
        },
        preamble: {
          fontSize: 15
        },
        fineprint: {
          fontSize: 14
        }
      };
      return styles;
    };
  }
  shouldComponentUpdate(nextProps) {
    if (this.props.tree.version !== nextProps.tree.version ||
    this.props.browserDimensions !== nextProps.browserDimensions) {
      return true;
    } else if (Object.keys(this.props.activeFilters) !== Object.keys(nextProps.activeFilters)) {
      return true;
    } else if (Object.keys(this.props.activeFilters)) {
      for (const name of this.props.activeFilters) {
        if (this.props.activeFilters[name] !== nextProps.activeFilters[name]) {
          return true;
        }
      }
    }
    return false;
  }

  displayFilter(styles, filterName) {
    const totalStateCount = this.props.totalStateCounts[filterName];
    return (
      <div>
        {`Filter by ${prettyString(filterName)}`}
        {this.props.activeFilters[filterName].length ? removeFiltersButton(this.props.dispatch, [filterName], "inlineRight", `Clear ${filterName} filter`) : null}
        <Flex wrap="wrap" justifyContent="flex-start" alignItems="center" style={styles.citationList}>
          {Object.keys(totalStateCount).sort().map((itemName) => {
            let display;
            if (filterName === "authors") {
              display = (
                <g>
                  {prettyString(itemName, {stripEtAl: true})}
                  {" et al (" + totalStateCount[itemName] + ")"}
                </g>
              );
            } else {
              display = (
                <g>
                  {prettyString(itemName)}
                  {" (" + totalStateCount[itemName] + ")"}
                </g>
              );
            }
            return displayFilterValueAsButton(this.props.dispatch, this.props.activeFilters, filterName, itemName, display, false);
          })}
        </Flex>
      </div>
    );
  }

  getUpdated() {
    let updated = null;
    if (this.props.metadata.updated) {
      updated = this.props.metadata.updated;
    }
    if (!updated) return null;
    return (
      <span>Data updated {updated}</span>
    );
  }
  downloadDataButton() {
    return (
      <button
        style={Object.assign({}, materialButton, {backgroundColor: "rgba(0,0,0,0)", color: medGrey, margin: 0, padding: 0})}
        onClick={() => { this.props.dispatch({ type: TRIGGER_DOWNLOAD_MODAL }); }}
      >
        <i className="fa fa-download" aria-hidden="true"/>
        <span style={{position: "relative"}}>{" download data"}</span>
      </button>
    );
  }
  getMaintainer() {
    if (Object.prototype.hasOwnProperty.call(this.props.metadata, "maintainer")) {
      return (
        <span>
          Build maintained by <a href={this.props.metadata.maintainer[1]} target="_blank">{this.props.metadata.maintainer[0]}</a>
        </span>
      );
    }
    return null;
  }

  render() {
    if (!this.props.metadata || !this.props.tree.nodes) return null;
    const styles = this.getStyles();
    const responsive = computeResponsive({
      horizontal: 1,
      vertical: 0.3333333,
      browserDimensions: this.props.browserDimensions,
      sidebar: this.props.sidebar,
      sidebarRight: this.props.sidebarRight
    });
    const width = responsive.width - 30; // need to subtract margin when calculating div width
    return (
      <div style={styles.footer}>
        <div style={{width: width}}>
          <div style={styles.line}/>
          <div style={styles.preamble}>
            {preambleText}
          </div>
          {getAcknowledgments(styles.acknowledgments)}
          <div style={styles.line}/>
          {Object.keys(this.props.activeFilters).map((name) => {
            return (
              <div key={name}>
                {this.displayFilter(styles, name)}
                <div style={styles.line}/>
              </div>
            );
          })}
          <Flex style={styles.fineprint}>
            {this.getMaintainer()}
            {dot}
            {this.getUpdated()}
            {dot}
            {this.downloadDataButton()}
          </Flex>
        </div>
      </div>
    );
  }
}

export default Footer;
