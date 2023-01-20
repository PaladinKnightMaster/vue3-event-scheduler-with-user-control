const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');
const cors = require('cors');
app = express();
app.use(serveStatic(path.join(__dirname, 'dist')));
app.use(cors());
const port = process.env.PORT || 3000;
app.listen(port);