import React from "react";

const Results = props => {
    if (props.results.length > 0) {
        return (
            <div>
                <div className="results-container">
                    {props.results.map(result => {
                        return (
                            <div key={result.pageid}>
                                <h3>
                                    <a href={result.url}>{result.title}</a>
                                </h3>
                                <span className="link">
                                    <a href={result.url}>{result.url}</a>
                                </span>
                                <p
                                    className="description"
                                    dangerouslySetInnerHTML={{
                                        __html: result.snippet
                                    }}
                                ></p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    } else {
        return <div>no results</div>;
    }
};

export default Results;
