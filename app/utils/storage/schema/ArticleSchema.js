import Realm from 'realm';

class Article extends Realm.Object {}
Contact.schema = {
   name: 'Article',
   properties: {
      _id: 'objectId',
      numero: 'int',
      titre: 'string',
      contenu: 'string',
      date: 'string',
      thematique: 'string',
      type: 'string',
   },
   primaryKey: '_id',
};

export default new Realm({ schema: [Article] });
