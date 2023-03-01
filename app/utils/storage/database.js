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
         numero: { type: types.INTEGER, not_null: true },
         titre_id: { type: types.INTEGER, not_null: true },
         titre_numero: { type: types.INTEGER, not_null: true },
         titre_fr: { type: types.TEXT, not_null: true },
         titre_mg: { type: types.TEXT, not_null: true },
         chapitre: { type: types.TEXT },
         fr: { type: types.TEXT, not_null: true },
         mg: { type: types.TEXT, not_null: true },
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
         type_id: { type: types.INTEGER, not_null: true },
         type_name_fr: { type: types.TEXT, not_null: true },
         type_name_mg: { type: types.TEXT, not_null: true },
         thematique_id: { type: types.INTEGER, not_null: true },
         thematique_name_fr: { type: types.TEXT, not_null: true },
         thematique_name_mg: { type: types.TEXT, not_null: true },
         objet_id: { type: types.INTEGER, not_null: true },
         objet_name_fr: { type: types.TEXT, not_null: true },
         objet_name_mg: { type: types.TEXT, not_null: true },
         en_tete_id: { type: types.INTEGER, not_null: true },
         en_tete_mot_cle: { type: types.TEXT, not_null: true },
         en_tete_name_fr: { type: types.TEXT, not_null: true },
         en_tete_name_mg: { type: types.TEXT, not_null: true },
         expose_des_motifs: { type: types.TEXT },
         etat: { type: types.TEXT },
         note: { type: types.TEXT },
         organisme_id: { type: types.INTEGER, not_null: true },
         organisme_name_fr: { type: types.TEXT, not_null: true },
         organisme_name_mg: { type: types.TEXT, not_null: true },
         signature: { type: types.TEXT },
         attachement: { type: types.TEXT, not_null: true },
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
