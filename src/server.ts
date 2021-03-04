import * as app from './app';

app.listen(process.env.PORT, () => {
  console.info(`server running http://localhost:${process.env.PORT}`);
});
