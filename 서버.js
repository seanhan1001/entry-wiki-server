const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("서버 열림.");
});

app.get("/test-entry", async (req, res) => {
    try {
        const response = await fetch(
            "https://playentry.org/project/6a8a394af6d0027a7c0576b7/"
        );

        const text = await response.text();

        const scripts = [
            ...text.matchAll(/<script[^>]+src=["']([^"']+)["']/g)
        ].map(match => match[1]);

        console.log("status:", response.status);
        console.log("scripts:", scripts);

        res.json({
            status: response.status,
            scripts: scripts
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
});

app.post("/wiki", async (req, res) => {
    const 내용  = req.body.내용;

    const response = await fetch(
        "https://ko.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&format=json&origin=*&titles=" +
        encodeURIComponent(내용)
    );

    const data = await response.json();

    const 결과 =
        data.query.pages[
            Object.keys(data.query.pages)[0]
        ].extract;

    res.json({
        결과: 결과
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("서버 실행 중...");
});
