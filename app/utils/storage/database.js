import * as SQLite from 'expo-sqlite';
import { BaseModel, types } from 'expo-sqlite-orm';

export class ArticleSchema extends BaseModel {
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
         datas: { type: types.JSON, not_null: true },
      };
   }
}

export class ContenuSchema extends BaseModel {
   constructor(obj) {
      super(obj);
   }

   static get database() {
      return async () => SQLite.openDatabase('database.db');
   }

   static get tableName() {
      return 'contenu';
   }

   static get columnMapping() {
      return {
         id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
         datas: { type: types.JSON, not_null: true },
      };
   }
}

export class TypeSchema extends BaseModel {
   constructor(obj) {
      super(obj);
   }

   static get database() {
      return async () => SQLite.openDatabase('database.db');
   }

   static get tableName() {
      return 'type';
   }

   static get columnMapping() {
      return {
         id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
         name_fr: { type: types.TEXT, not_null: true },
         name_mg: { type: types.TEXT, not_null: true },
      };
   }
}

export class ThematiqueSchema extends BaseModel {
   constructor(obj) {
      super(obj);
   }

   static get database() {
      return async () => SQLite.openDatabase('database.db');
   }

   static get tableName() {
      return 'thematique';
   }

   static get columnMapping() {
      return {
         id: { type: types.INTEGER, primary_key: true }, // For while only supports id as primary key
         name_fr: { type: types.TEXT, not_null: true },
         name_mg: { type: types.TEXT, not_null: true },
      };
   }
}
