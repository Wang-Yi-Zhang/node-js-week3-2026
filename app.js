const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const membersRouter = require('./routes/members');
const uploadImageRouter = require('./routes/uploadImage');
const swaggerDoc = require('./fixtures/swagger.json');

const app = express();

// ───────────────────────────────────────────────────────────
// TODO 任務六：依序掛上 middleware 與 router（注意順序）
// ───────────────────────────────────────────────────────────
//
//   1. 解跨域（cors middleware，必須在所有路由之前）
//   2. 解析 JSON body（否則 POST / PUT 的 req.body 會是 undefined）
//   3. 掛載 Swagger UI（已預先提供如下，同學不需調整）：
//      app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
//   4. 把 membersRouter 掛載到 '/members' 路徑下
//   5. 把 uploadImageRouter 掛載到 '/uploadImage' 路徑下
//
// ✅ 未匹配的路由（如 GET /unknown）Express 預設會回 404，不需另外加 middleware
//
// ⚠️ **最後不需呼叫 app.listen()** — 這個部分交由 server.js 負責（分離「組裝」跟「啟動」，這樣 test.js 可以 supertest 直接戳 app、不佔 port）。
app.use(cors());
app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/members', membersRouter);
app.use('/uploadImage', uploadImageRouter);
app.use((err, req, res, next) => {
  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err.stack);
  res.status(500).json({ error: '伺服器發生非預期錯誤' });
});
module.exports = app;
