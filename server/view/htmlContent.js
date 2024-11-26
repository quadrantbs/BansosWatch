const path = require("path");
const fs = require("fs");
const { marked } = require("marked");

const apiDocs = (req, res, next) => {
  const filePath = path.join(__dirname, "../API Docs.md");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error reading the file");
    }

    const htmlContent = marked(data);

    res.send(`
 <html>
  <head>
    <title>Bansos Watch - API Docs</title>
    <!-- Bootstrap CSS -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-GNCj4Gh6LJ6rAzM6yzUmht3k8jCw5gy4Fl5SI1iybVjkF8fbT49K7oP5coU4R3jo"
      crossorigin="anonymous"
    >
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Roboto', sans-serif;
        background-color: #f8f9fa;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
      }
      .container {
        max-width: 800px;
        width: 80%;
        margin: 20px;
      }
      .markdown-body {
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      h1 {
        font-weight: 700;
        color: #343a40;
      }
      .markdown-body h2,
      .markdown-body h3,
      .markdown-body h4 {
        font-weight: 700;
        color: #495057;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      .markdown-body p {
        font-weight: 400;
        color: #6c757d;
        line-height: 1.6;
      }
      .markdown-body code {
        background-color: #f1f3f5;
        padding: 2px 4px;
        border-radius: 4px;
        font-family: 'Courier New', Courier, monospace;
        color: #d63384;
      }
      .markdown-body pre {
        background-color: #f8f9fa;
        padding: 10px;
        border-radius: 4px;
        overflow: auto;
        color: #212529;
        font-family: 'Courier New', Courier, monospace;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="markdown-body">
        ${htmlContent}
      </div>
    </div>
  </body>
</html>


          `);
  });
};

module.exports = apiDocs;
