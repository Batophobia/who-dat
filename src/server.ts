import Fastify from "fastify";
import { getThing, getThings } from "./list.js";
import { getSilhouette } from "./image.js";

const app = Fastify({
  logger: true
});

app.get("/health", async () => {
  return {
    status: "ok"
  };
});

app.get("/list", async () => {
  return getThings();
});

app.get<{ Params: { name: string } }>(
  "/list/:name",
  async (request, reply) => {
    const name = decodeURIComponent(request.params.name);

    const thing = await getThing(name);

    if (!thing) {
      return reply.status(404).send({
        error: "Thing not found"
      });
    }

    return thing;
  }
);

app.get<{ Params: { name: string } }>(
  "/silhouette/:name",
  async (request, reply) => {
    const name = request.params.name;

    const thing = await getThing(name);

    if (!thing) {
      return reply.status(404).send({
        error: "Thing not found"
      });
    }

    try {
      const image = await getSilhouette(
        thing.name,
        thing.imageUrl
      );

      return reply
        .type("image/png")
        .send(image);
    } catch (error) {
      request.log.error(error);

      return reply.status(502).send({
        error: "Unable to retrieve source image"
      });
    }
  }
);

const start = async () => {
  try {
    await app.listen({
      host: "0.0.0.0",
      port: 3000
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();