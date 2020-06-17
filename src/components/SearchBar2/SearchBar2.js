import React from "react";

import Results from "../Results/Results";
import { fetchData, fetchUrl } from "../DataCollector";
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetching: false,
            query: "",
            results: []
        };
    }

    handleOnKeyPress = async event => {
        const query = event.target.value;
        if (event.key === "Enter") {
            this.handleDataCollect(query);
        }
    };

    handleOnClick = async event => {
        event.preventDefault();
        const { query } = this.state;
        this.handleDataCollect(query);
    };

    handleDataCollect = async query => {
        if (query.length < 3) {
            this.setState({ query, results: {} });
            alert("Query should have 3 or more characters");
        } else {
            this.setState({ query, fetching: true });
            let collected = await fetchData(query);
            let results = await fetchUrl(collected);
            this.setState({ fetching: false, results: results });
        }
    };

    handleOnChange = event => {
        event.preventDefault();
        this.setState({ query: event.target.value });
    };

    render() {
        const { query, fetching } = this.state;

        return (
            <div className="container">
                <h2 className="heading">Wikipedia Search</h2>
                <label className="search-label" htmlFor="search-input">
                    <input
                        type="text"
                        value={query}
                        id="search-input"
                        placeholder="Search..."
                        onChange={this.handleOnChange}
                        onKeyPress={this.handleOnKeyPress}
                    />
                </label>
                <button type="submit" onClick={this.handleOnClick}>
                    Search
                </button>
                {fetching ? (
                    <h1>FETCHING DATA</h1>
                ) : (
                    <Results results={this.state.results} />
                )}
            </div>
        );
    }
}
export default SearchBar;
