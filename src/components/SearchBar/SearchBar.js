import React from "react";
import axios from "axios";

import Results from "../Results/Results";

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            results: []
        };
    }

    fetchSearchResults = query => {
        //first fetch 50 items
        const pageNumber = 50;
        const searchUrl =
            "https://de.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=" +
            query +
            "&srlimit=" +
            pageNumber;
        let results = [];
        //fetching title, description and pageid
        axios
            .get(searchUrl)
            .then(
                res => {
                    let data = res.data.query.search;
                    for (var key in data) {
                        results.push({
                            url: "no link",
                            pageid: data[key].pageid,
                            title: data[key].title,
                            snippet: data[key].snippet
                        });
                    }
                },
                error => {
                    console.log(error);
                }
            )
            .then(res => {
                // fetching the Urls via the pageID
                for (var result in results) {
                    let page = results[result];
                    let pageID = page.pageid;
                    let pageUrlRetrivalUrl =
                        "https://de.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=" +
                        pageID +
                        "&inprop=url&format=json";

                    axios.get(pageUrlRetrivalUrl).then(
                        res => {
                            page.url = res.data.query.pages[pageID].fullurl;
                            if (page.url === undefined) {
                                results.splice(result, 1);
                            }

                            this.forceUpdate();
                        },
                        error => {
                            console.log(error);
                        }
                    );
                }
                results = results.slice(0, 10);
                this.setState({ results });
            });
    };

    componentDidUpdate(prevProps) {
        if (this.results !== prevProps.results) {
            console.log("test");
        }
    }

    handleOnKeyPress = event => {
        const query = event.target.value;
        if (event.key === "Enter") {
            if (query.length < 3) {
                this.setState({ query, results: {} });
                alert("Query should have 3 or more characters");
            } else {
                this.setState({ query }, () => {
                    this.fetchSearchResults(query);
                });
            }
        }
    };

    handleOnClick = event => {
        event.preventDefault();
        const { query } = this.state;
        if (query.length < 3) {
            alert("Query should have 3 or more characters");
        } else {
            this.setState({ query }, () => {
                this.fetchSearchResults(query);
            });
        }
    };

    handleOnChange = event => {
        event.preventDefault();
        this.setState({ query: event.target.value });
    };

    render() {
        const { query } = this.state;

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
                <Results results={this.state.results} />
            </div>
        );
    }
}
export default SearchBar;
