const cluster = require("cluster");
const os = require("os");

if (cluster.isPrimary) {
    const numCPUs = os.cpus().length;
    console.log(`Primary ${process.pid} running — forking ${numCPUs} workers`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });

} else {
    const app = require("./src/app");
    const connectMongoDB = require("./src/config/db");
    const { connectRedis } = require("./src/config/redis");
    const PORT = process.env.PORT || 3000;

    (async () => {
        await connectMongoDB();
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`Worker ${process.pid} started at PORT: ${PORT}`);
        });
    })();
}
