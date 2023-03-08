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
         id: { type: types.INTEGER, primary_key: true, not_null: true }, // For while only supports id as primary key
         contenu: { type: types.INTEGER, not_null: true },
         numero: { type: types.INTEGER, not_null: true },
         titre_id: { type: types.INTEGER, not_null: true },
         titre_numero: { type: types.INTEGER, not_null: true },
         titre_fr: { type: types.TEXT },
         titre_mg: { type: types.TEXT },
         chapitre_id: { type: types.INTEGER },
         chapitre_numero: { type: types.INTEGER },
         chapitre_titre_fr: { type: types.TEXT },
         chapitre_titre_mg: { type: types.TEXT },
         contenu_fr: { type: types.TEXT },
         contenu_mg: { type: types.TEXT },
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
         numero: { type: types.TEXT },
         date: { type: types.TEXT },
         type_id: { type: types.INTEGER, not_null: true },
         type_nom_fr: { type: types.TEXT, not_null: true },
         type_nom_mg: { type: types.TEXT },
         thematique_id: { type: types.INTEGER, not_null: true },
         thematique_nom_fr: { type: types.TEXT, not_null: true },
         thematique_nom_mg: { type: types.TEXT },
         objet_id: { type: types.INTEGER },
         objet_contenu_fr: { type: types.TEXT },
         objet_contenu_mg: { type: types.TEXT },
         en_tete_id: { type: types.INTEGER },
         en_tete_mot_cle: { type: types.TEXT },
         en_tete_contenu_fr: { type: types.TEXT },
         en_tete_contenu_mg: { type: types.TEXT },
         expose_des_motifs_id: { type: types.INTEGER },
         expose_des_motifs_mot_cle: { type: types.TEXT },
         expose_des_motifs_contenu_fr: { type: types.TEXT },
         expose_des_motifs_contenu_mg: { type: types.TEXT },
         etat_id: { type: types.INTEGER },
         etat_nom_fr: { type: types.TEXT },
         etat_nom_mg: { type: types.TEXT },
         note_id: { type: types.INTEGER },
         note_contenu_fr: { type: types.TEXT },
         note_contenu_mg: { type: types.TEXT },
         organisme_id: { type: types.INTEGER },
         organisme_nom_fr: { type: types.TEXT },
         organisme_nom_mg: { type: types.TEXT },
         signature: { type: types.TEXT },
         attachement: { type: types.TEXT },
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
         nom_fr: { type: types.TEXT, not_null: true },
         nom_mg: { type: types.TEXT },
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
         nom_fr: { type: types.TEXT, not_null: true },
         nom_mg: { type: types.TEXT },
      };
   }
}

export class DoleanceSchema extends BaseModel {
   constructor(obj) {
      super(obj);
   }

   static get database() {
      return async () => SQLite.openDatabase('database.db');
   }

   static get tableName() {
      return 'doleance';
   }

   static get columnMapping() {
      return {
         id: { type: types.INTEGER, primary_key: true, autoincrement: true }, // For while only supports id as primary key
         email: { type: types.TEXT, not_null: true },
         objet: { type: types.TEXT },
         message: { type: types.TEXT },
      };
   }
}
