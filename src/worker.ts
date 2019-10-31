require("dotenv").config();
require("source-map-support").install();
import "module-alias/register";
import * as throng from "throng";
import prodLogger from "./logger/prodLogger";

const workers = process.env.WEB_CONCURRENCY || 1;

// The maximum number of jobs each worker should process at once. This will need
// to be tuned for your application. If each job is mostly waiting on network
// responses it can be much higher. If each job is CPU-intensive, it might need
// to be much lower.
const maxJobsPerWorker = 50;

async function start() {
  prodLogger.info("Workers running: " + workers);
}

// Initialize the clustered worker process
// See: https://devcenter.heroku.com/articles/node-concurrency for more info
throng({ workers, start });
