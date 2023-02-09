export const articles = [
   {
      id: 1,
      date_sortie: '2022-11-30T21:00:00.000Z',
      titre: 'Titre 1',
      Titre: {
         titre_fr: 'Lorem Ipsum ....',
         titre_mg: 'Raha i Chine manokana ...',
      },
      Article: {
         contenu_Article_fr: 'Contenu 1',
         contenu_Article_mg: 'Contenu 1',
         numero_Article: 1,
      },
      chapitre: 'Chp1',
      photo: null,
      video: null,
      contenu_Article_fr: 'Contenu 1',
      contenu_Article_mg: 'Contenu 1',
      Thematique: {
         id_Thematique: 1,
         nom_Thematique_fr: 'Faune',
         nom_Thematique_mg: 'Faonina',
         code_Thematique: '0001',
      },
      Type: {
         id_Type: 2,
         nom_Type_fr: 'Loi organique',
         nom_Type_mg: 'Lalana',
         code_Type: null,
      },
      Section: {
         id_Section: 2,
         nom_Section_fr: 'section2',
         nom_Section_mg: 'Sektion',
         numero_section: 2,
      },
      Sous_section: {
         id_Sous_section: 2,
         nom_sous_section_fr: 'sous_section2',
         nom_sous_section_mg: 'Soa section',
         numero_sous_section: 2,
      },
      date_created: '2022-11-30T21:04:09.000Z',
      date_updated: null,
   },
];

export const types = [
   {
      id: 1,
      nom: 'Faune',
      nom_mg: 'Bibidia',
      code: '0001',
   },
   {
      id: 2,
      nom: ' Flore',
      nom_mg: 'Zavamaniry',
      code: null,
   },
   {
      id: 3,
      nom: 'Corruption et l’engagement d’un représentant du gouvernement',
      nom_mg: 'Kolikoly sy ny fanoloran-tenan’ny mpitondra fanjakana',
      code: null,
   },
];

export const categories = [
   {
      id: 1,
      nom_Thematique_fr: 'Loi constitutionnelle',
      nom_Thematique_mg: 'Lalana fahafahana',
      code: '0001',
   },
   {
      id: 2,
      nom_Thematique_fr: 'Loi organique',
      nom_Thematique_mg: 'Lalana fahafahana',
      code: null,
   },
   {
      id: 3,
      nom_Thematique_fr: 'Ordonnance',
      nom_Thematique_mg: 'Fazahoandalana',
      code: null,
   },
];
