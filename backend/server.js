const app = require("./app");
const config = require("./config/env");

app.listen(config.port, () => {
  console.log(`Backend đang chạy tại http://localhost:${config.port}`);
});
