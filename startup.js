import {
   ArticleSchema,
   ContenuSchema,
   TypeSchema,
   ThematiqueSchema,
   DoleanceSchema,
   storeDataToLocalStorage,
   removeInLocalStorage,
   getDataFromLocalStorage,
} from '_utils';

TypeSchema.createTable();
ThematiqueSchema.createTable();
ArticleSchema.createTable();
ContenuSchema.createTable();
DoleanceSchema.createTable();

/*removeInLocalStorage('currentPageApi')*/
getDataFromLocalStorage('currentPageApi').then((res) => {
   if (res === null || res === undefined) {
      storeDataToLocalStorage('currentPageApi', '1');
   }
});
