/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import * as cors from 'cors';
import { Invoice } from './model';


const app = express();
app.use(cors())
app.use(express.json());

const getPagination = (page, size) => {
  const limit = size ? +size : 50;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count, rows: results } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(count / limit);

  return { count, results, totalPages, currentPage };
};



app.get('/invoices', async (req: express.Request, res: express.Response) => {
  try {
    const params = req.query;
    const { page, size } = params;
    const { limit, offset } = getPagination(page, size);
    const column = params.column as string;
    const direction = params.direction as string;
    const invoices = await Invoice.findAndCountAll({
      ...(column && direction && { order: [[column, direction]] }),
      limit: limit,
      offset: offset,
    });
    return res.status(200).send(getPagingData(invoices, page, limit));
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

app.put(
  '/invoices/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const data = req.body;
      const params = req.params;
      const row = await Invoice.update(data, {
        where: {
          id: Number(params.id),
        },
      });
      if (row[0] === 0) return res.sendStatus(404);
      return res.sendStatus(201);
    } catch (oO) {
      console.log(oO);
      return res.sendStatus(500);
    }
  }
);

app.delete(
  '/invoices/:id',
  async (req: express.Request, res: express.Response) => {
    try {
      const params = req.params;
      const row = await Invoice.destroy({
        where: {
          id: params.id,
        },
      });
      if (!row) return res.sendStatus(404);
      return res.sendStatus(201);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  }
);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);
