import * as SQLite from 'expo-sqlite';
import { BaseModel, types } from 'expo-sqlite-orm';

export default class ArticleSchema extends BaseModel {
   constructor(obj) {
      super(obj);
   }

   static get database() {
      return async () => SQLite.openDatabase('database.db');
   }

   static get tableName() {
      return 'article';
   }

   static get columnMapping() {
      return {
         id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
         numero: { type: types.INTEGER, not_null: true },
         titre: { type: types.TEXT, not_null: true },
         contenu: { type: types.TEXT, not_null: true },
         date: { type: types.DATE, not_null: true },
         thematique: { type: types.TEXT, not_null: true },
         type: { type: types.TEXT, not_null: true },
      };
   }
}
