import { NextApiResponseServerIo } from "@/lib/types";
import { Server as NetServer } from "http";
import { Server as ServerIO } from "socket.io";
import { NextApiRequest } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    io.on("connection", (s) => {
      s.on("create-room", (documentId) => {
        s.join(documentId);
      });
      s.on("send-changes", (deltas, documentId) => {
        console.log("CHANGE");
        s.to(documentId).emit("receive-changes", deltas, documentId);
      });
      s.on("send-cursor-move", (range, documentId, cursorId) => {
        s.to(documentId).emit(
          "receive-cursor-move",
          range,
          documentId,
          cursorId
        );
      });
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
