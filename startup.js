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
getDataFromLocalStorage('currentPageContenuApi').then((res) => {
   if (res === null || res === undefined) {
      storeDataToLocalStorage('currentPageContenuApi', '1');
   }
});

getDataFromLocalStorage('currentPageArticleApi').then((res) => {
   if (res === null || res === undefined) {
      storeDataToLocalStorage('currentPageArticleApi', '1');
   }
});
