import axios from "axios";

export const fetchData = async query => {
    //first fetch 50 items
    const pageNumber = 50;
    const searchUrl =
        "https://de.wikipedia.org/w/api.php?origin=*&action=query&list=search&format=json&srsearch=" +
        query +
        "&srlimit=" +
        pageNumber;
    let results = [];
    await axios.get(searchUrl).then(
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
    );
    return results;
};

export const fetchUrl = async collected => {
    let results = collected;
    let limit = 0;
    for (var index in results) {
        limit += 1;
        let page = results[index];
        let pageID = page.pageid;
        let pageUrlRetrivalUrl =
            "https://de.wikipedia.org/w/api.php?origin=*&action=query&prop=info&pageids=" +
            pageID +
            "&inprop=url&format=json";

        await axios.get(pageUrlRetrivalUrl).then(
            res => {
                page.url = res.data.query.pages[pageID].fullurl;
                if (page.url === undefined) {
                    limit -= 1;
                    results.splice(index, 1);
                }
            },
            error => {
                console.log(error);
            }
        );
        if (limit === 10) {
            break;
        }
    }
    return results.splice(0, 10);
};
