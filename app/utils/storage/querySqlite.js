import DatabaseLayer from 'expo-sqlite-orm/src/DatabaseLayer';
import * as SQLite from 'expo-sqlite';
import { DoleanceSchema } from '_utils/storage/database';

export const insertOrUpdateToDBFunc = async (
   db_name,
   db_table,
   data_to_insert
) => {
   const databaseLayer = new DatabaseLayer(
      async () => SQLite.openDatabase(`${db_name}.db`),
      db_table
   );
   const result = await databaseLayer.bulkInsertOrReplace(data_to_insert);
   console.log(`${db_table} inséré dans la base!`);
   return result;
};
