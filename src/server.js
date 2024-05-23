// server.js
const express = require('express');
const next = require('next');
const { Server } = require('@hocuspocus/server');
const { Logger } = require('@hocuspocus/extension-logger')
const { SQLite } = require('@hocuspocus/extension-sqlite')
const initialValue = require("./EditorPreview")
const { slateNodesToInsertDelta } = require('@slate-yjs/core');
const Y = require('yjs')

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 3000;
app.prepare().then(() => {
  const server = express();

  // Create a new HocusPocus server
  const hocusPocusServer = Server.configure({
    port: 1234,
    address: '127.0.0.1',
    name: 'hocuspocus-fra1-01',
    extensions: [
      new Logger(),
      new SQLite(),
    ],
    async onLoadDocument(data) {
      // Load the initial value in case the document is empty
      if (data.document.isEmpty('content')) {
        const insertDelta = slateNodesToInsertDelta(initialValue);
        const sharedRoot = data.document.get('content', Y.XmlText);
        sharedRoot.applyDelta(insertDelta);
      }
  
      return data.document;
    },
  });

  // Start the HocusPocus server
  // hocusPocusServer.enableMessageLogging();
  hocusPocusServer.listen();

  // Handle all Next.js routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server ready on http://localhost:${port}`);
  });
});
