import './util/module.alias';

import { Server } from '@overnightjs/core';
import bodyParser from 'body-parser';
import expressPino from 'express-pino-logger';
import cors from 'cors';
import { ForecastController } from '@src/controllers/forecast';
import { BeachesController } from '@src/controllers/beaches';
import { Application } from 'express';

import * as database from '@src/database';
import { UsersController } from '@src/controllers/users';
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(expressPino({ logger }));
    this.app.use(cors({ origin: '*' }));
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([forecastController, beachesController, usersController]);
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening of port: ' + this.port);
    });
  }
}