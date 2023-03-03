export const parseStructureDataForArticle = (data) => {
   return data.map((obj) => ({
      id: obj.id,
      contenu: obj.contenu,
      article_created_at: obj.created_at,
      numero: obj.numero,
      titre_id: obj.titre.id,
      titre_numero: obj.titre.numero,
      titre_fr: obj.titre.titre_fr,
      titre_mg: obj.titre.titre_mg,
      chapitre_id: obj.chapitre?.id,
      chapitre_numero: obj.chapitre?.numero,
      chapitre_titre_fr: obj.chapitre?.titre_fr,
      chapitre_titre_mg: obj.chapitre?.titre_mg,
      contenu_fr: obj.contenu_fr,
      contenu_mg: obj.contenu_mg,
   }));
};
export const parseStructureDataForContenu = (data) => {
   return data.map((d) => ({
      id: d.id,
      numero: d.numero,
      contenu_created_at: d.created_at,
      type_id: d.type.id,
      type_nom_fr: d.type.nom_fr,
      type_nom_mg: d.type.nom_mg,
      thematique_id: d.thematique.id,
      thematique_nom_fr: d.thematique.nom_fr,
      thematique_nom_mg: d.thematique.nom_mg,
      objet_id: d.objet.id,
      objet_contenu_fr: d.objet.contenu_fr,
      objet_contenu_mg: d.objet.contenu_mg,
      en_tete_id: d.en_tete?.id,
      en_tete_mot_cle: d.en_tete?.mot_cle,
      en_tete_contenu_fr: d.en_tete?.contenu_fr,
      en_tete_contenu_mg: d.en_tete?.contenu_mg,
      expose_des_motifs_id: d.expose_des_motifs?.id,
      expose_des_motifs_mot_cle: d.expose_des_motifs?.mot_cle,
      expose_des_motifs_contenu_fr: d.expose_des_motifs?.contenu_fr,
      expose_des_motifs_contenu_mg: d.expose_des_motifs?.contenu_mg,
      etat_id: d.etat?.id,
      etat_nom_fr: d.etat?.nom_fr,
      etat_nom_mg: d.etat?.nom_mg,
      note_id: d.note?.id,
      note_contenu_fr: d.note?.contenu_fr,
      note_contenu_mg: d.note?.contenu_mg,
      organisme_id: d.organisme.id,
      organisme_nom_fr: d.organisme.nom_fr,
      organisme_nom_mg: d.organisme.nom_mg,
      signature: d.signature,
      attachement: d.attachement,
   }));
};

export const filterArticleToListByContenu = (idContenu, articles) => {
   let res = articles.filter(
      (article) => parseInt(article.contenu) === parseInt(idContenu)
   );
   return res;
};
