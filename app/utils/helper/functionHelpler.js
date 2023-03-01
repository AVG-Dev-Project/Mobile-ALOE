export const parseStructureDataForArticle = (data) => {
   return data.map((obj) => ({
      id: obj.id,
      numero: obj.numero,
      titre_id: obj.titre.id,
      titre_numero: obj.titre.numero,
      titre_fr: obj.titre.titre_fr,
      titre_mg: obj.titre.titre_mg,
      chapitre: obj.chapitre,
      fr: obj.fr,
      mg: obj.mg,
   }));
};
export const parseStructureDataForContenu = (data) => {
   return data.map((d) => ({
      id: d.id,
      type_id: d.type.id,
      type_name_fr: d.type.name_fr,
      type_name_mg: d.type.name_mg,
      thematique_id: d.thematique.id,
      thematique_name_fr: d.thematique.name_fr,
      thematique_name_mg: d.thematique.name_mg,
      objet_id: d.objet.id,
      objet_name_fr: d.objet.name_fr,
      objet_name_mg: d.objet.name_mg,
      en_tete_id: d.en_tete.id,
      en_tete_mot_cle: d.en_tete._mot_cle,
      en_tete_name_fr: d.en_tete.name_fr,
      en_tete_name_mg: d.en_tete.name_mg,
      expose_des_motifs: d.expose_des_motifs,
      etat: d.etat,
      note: d.note,
      organisme_id: d.organisme.id,
      organisme_name_fr: d.organisme.name_fr,
      organisme_name_mg: d.organisme.name_mg,
      signature: d.signature,
      attachement: d.attachement,
   }));
};
