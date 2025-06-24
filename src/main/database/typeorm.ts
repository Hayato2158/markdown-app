import path from 'path'
import { DataSourceOptions } from 'typeorm'
import { NoteInfoModel } from './model/noteInfo'


export const ormconfig: DataSourceOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [NoteInfoModel],
  migrations: [`${path.join(__dirname, '/migrations')}/*.js`],
  migrationsRun: true, // マイグレーション同時実行
  synchronize: true
}
