// packages
import { LoiService } from '_utils/services/LoiService';
import { DoleanceSchema } from '_utils/storage/database';
import { Dimensions, PixelRatio } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const parseStructureDataForArticle = (data) => {
   return data.map((obj) => ({
      id: obj.id,
      contenu: obj.contenu,
      numero: obj.numero,
      titre_id: obj.titre?.id,
      titre_numero: obj.titre?.numero,
      titre_fr: obj.titre?.titre_fr,
      titre_mg: obj.titre?.titre_mg,
      chapitre_id: obj.chapitre?.id,
      chapitre_numero: obj.chapitre?.numero,
      chapitre_titre_fr: obj.chapitre?.titre_fr,
      chapitre_titre_mg: obj.chapitre?.titre_mg,
      section_id: obj.section?.id,
      section_titre_fr: obj.section?.titre_section_fr,
      section_titre_mg: obj.section?.titre_section_mg,
      contenu_fr: obj.contenu_fr,
      contenu_mg: obj.contenu_mg,
   }));
};
export const parseStructureDataForContenu = (data) => {
   return data.map((d) => ({
      id: d.id,
      numero: d.numero,
      date: d.date,
      type_id: d.type?.id,
      type_nom_fr: d.type?.nom_fr,
      type_nom_mg: d.type?.nom_mg,
      thematique_id: d.thematique?.id,
      thematique_nom_fr: d.thematique?.nom_fr,
      thematique_nom_mg: d.thematique?.nom_mg,
      objet_id: d.objet?.id,
      objet_contenu_fr: d.objet?.contenu_fr,
      objet_contenu_mg: d.objet?.contenu_mg,
      en_tete_id: d.en_tete?.id,
      en_tete_mot_cle: d.en_tete?.mot_cle,
      en_tete_contenu_fr: d.en_tete?.contenu_fr,
      en_tete_contenu_mg: d.en_tete?.contenu_mg,
      en_tete_contenu_fr_mobile: d.en_tete?.contenu_fr_mobile,
      en_tete_contenu_mg_mobile: d.en_tete?.contenu_mg_mobile,
      expose_des_motifs_id: d.expose_des_motifs?.id,
      expose_des_motifs_mot_cle: d.expose_des_motifs?.mot_cle,
      expose_des_motifs_contenu_fr: d.expose_des_motifs?.contenu_fr,
      expose_des_motifs_contenu_mg: d.expose_des_motifs?.contenu_mg,
      expose_des_motifs_contenu_fr_mobile:
         d.expose_des_motifs?.contenu_fr_mobile,
      expose_des_motifs_contenu_mg_mobile:
         d.expose_des_motifs?.contenu_mg_mobile,
      etat_id: d.etat?.id,
      etat_nom_fr: d.etat?.nom_fr,
      etat_nom_mg: d.etat?.nom_mg,
      note_id: d.note?.id,
      note_contenu_fr: d.note?.contenu_fr,
      note_contenu_mg: d.note?.contenu_mg,
      organisme_id: d.organisme?.id,
      organisme_nom_fr: d.organisme?.nom_fr,
      organisme_nom_mg: d.organisme?.nom_mg,
      tag: JSON.stringify(d.tag),
      signature: d.signature,
      attachement: d.attachement,
   }));
};

export const parseDataArticleLazyLoading = (obj) => {
   return {
      id: obj.id,
      contenu: obj.contenu,
      numero: obj.numero,
      titre_id: obj.titre?.id,
      titre_numero: obj.titre?.numero,
      titre_fr: obj.titre?.titre_fr,
      titre_mg: obj.titre?.titre_mg,
      chapitre_id: obj.chapitre?.id,
      chapitre_numero: obj.chapitre?.numero,
      chapitre_titre_fr: obj.chapitre?.titre_fr,
      chapitre_titre_mg: obj.chapitre?.titre_mg,
      section_id: obj.section?.id,
      section_titre_fr: obj.section?.titre_section_fr,
      section_titre_mg: obj.section?.titre_section_mg,
      contenu_fr: obj.contenu_fr,
      contenu_mg: obj.contenu_mg,
   };
};

export const parseDataContenuLazyLoading = (d) => {
   return {
      id: d.id,
      numero: d.numero,
      date: d.date,
      type_id: d.type?.id,
      type_nom_fr: d.type?.nom_fr,
      type_nom_mg: d.type?.nom_mg,
      thematique_id: d.thematique?.id,
      thematique_nom_fr: d.thematique?.nom_fr,
      thematique_nom_mg: d.thematique?.nom_mg,
      objet_id: d.objet?.id,
      objet_contenu_fr: d.objet?.contenu_fr,
      objet_contenu_mg: d.objet?.contenu_mg,
      en_tete_id: d.en_tete?.id,
      en_tete_mot_cle: d.en_tete?.mot_cle,
      en_tete_contenu_fr: d.en_tete?.contenu_fr,
      en_tete_contenu_mg: d.en_tete?.contenu_mg,
      en_tete_contenu_fr_mobile: d.en_tete?.contenu_fr_mobile,
      en_tete_contenu_mg_mobile: d.en_tete?.contenu_mg_mobile,
      expose_des_motifs_id: d.expose_des_motifs?.id,
      expose_des_motifs_mot_cle: d.expose_des_motifs?.mot_cle,
      expose_des_motifs_contenu_fr: d.expose_des_motifs?.contenu_fr,
      expose_des_motifs_contenu_mg: d.expose_des_motifs?.contenu_mg,
      expose_des_motifs_contenu_fr_mobile:
         d.expose_des_motifs?.contenu_fr_mobile,
      expose_des_motifs_contenu_mg_mobile:
         d.expose_des_motifs?.contenu_mg_mobile,
      etat_id: d.etat?.id,
      etat_nom_fr: d.etat?.nom_fr,
      etat_nom_mg: d.etat?.nom_mg,
      note_id: d.note?.id,
      note_contenu_fr: d.note?.contenu_fr,
      note_contenu_mg: d.note?.contenu_mg,
      organisme_id: d.organisme?.id,
      organisme_nom_fr: d.organisme?.nom_fr,
      organisme_nom_mg: d.organisme?.nom_mg,
      tag: JSON.stringify(d.tag),
      signature: d.signature,
      attachement: d.attachement,
   };
};

export const filterArticleToListByContenu = (idContenu, articles) => {
   let res = articles.filter(
      (article) => parseInt(article.contenu) === parseInt(idContenu)
   );
   return res;
};

export const checkAndsendMailFromLocalDBToAPI = async () => {
   let mails = await DoleanceSchema.query({ columns: '*' });
   if (mails.length > 0) {
      mails.map((mail) => {
         LoiService.sendMailToServ(mail.email, mail.objet, mail.contenu);
         return DoleanceSchema.destroy(mail.id);
      });
   }
   return;
};

export const parsingTags = (jsonContent) => {
   let res = JSON.parse(jsonContent);
   return res;
};

export const isAloeFile = (file) => {
   if (!file) {
      return;
   }

   if (file.mimeType !== 'application/octet-stream') {
      return false;
   }

   let lastDotIndex = file.name?.lastIndexOf('.');
   let extensionOfFile = file.name?.slice(lastDotIndex + 1); //for delete "." and conserve aloe

   if (extensionOfFile === 'aloe') {
      return true;
   }

   return false;
};

export const widthPercentageToDP = (widthPercent) => {
   // Parse string percentage input and convert it to number.
   const elemWidth =
      typeof widthPercent === 'number'
         ? widthPercent
         : parseFloat(widthPercent);

   // Use PixelRatio.roundToNearestPixel method in order to round the layout
   // size (dp) to the nearest one that correspons to an integer number of pixels.
   return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

/**
 * Converts provided height percentage to independent pixel (dp).
 * @param  {string} heightPercent The percentage of screen's height that UI element should cover
 *                                along with the percentage symbol (%).
 * @return {number}               The calculated dp depending on current device's screen height.
 */
export const heightPercentageToDP = (heightPercent) => {
   const elemHeight =
      typeof heightPercent === 'number'
         ? heightPercent
         : parseFloat(heightPercent);

   return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};
