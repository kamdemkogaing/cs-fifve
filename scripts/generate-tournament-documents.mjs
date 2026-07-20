import { jsPDF } from "jspdf";
import fs from "node:fs";
import path from "node:path";

const outputDir = path.resolve("public", "documents");

function ensureOutputDir() {
  fs.mkdirSync(outputDir, { recursive: true });
}

function addPageHeader(pdf, title) {
  const pageWidth = pdf.internal.pageSize.getWidth();

  pdf.setFillColor(6, 70, 196);
  pdf.rect(0, 0, pageWidth, 24, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("FIFVE 2026", 14, 11);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.text(title, 14, 18);

  pdf.setTextColor(21, 153, 71);
  pdf.setDrawColor(21, 153, 71);
  pdf.setLineWidth(0.8);
  pdf.line(14, 29, pageWidth - 14, 29);
}

function addFooter(pdf) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

  pdf.setTextColor(100, 116, 139);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("FIFVE Weekend 2026 Cologne", 14, pageHeight - 6.5);
  pdf.text(`Page ${pdf.getCurrentPageInfo().pageNumber}`, pageWidth - 26, pageHeight - 6.5);
}

function createWriter(pdf, title) {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 16;
  const topStart = 38;
  const bottomLimit = pageHeight - 18;
  let y = topStart;

  const ensureSpace = (neededHeight = 8) => {
    if (y + neededHeight <= bottomLimit) {
      return;
    }

    addFooter(pdf);
    pdf.addPage();
    addPageHeader(pdf, title);
    y = topStart;
  };

  const writeParagraph = (text, options = {}) => {
    const {
      size = 11,
      style = "normal",
      color = [15, 23, 42],
      indent = 0,
      spacingAfter = 5,
      lineHeight = 6,
    } = options;

    pdf.setFont("helvetica", style);
    pdf.setFontSize(size);
    pdf.setTextColor(...color);

    const lines = pdf.splitTextToSize(text, 178 - indent);
    const height = Math.max(lineHeight, lines.length * lineHeight);
    ensureSpace(height + spacingAfter);
    pdf.text(lines, marginX + indent, y);
    y += height + spacingAfter;
  };

  const writeTitle = (text) => {
    writeParagraph(text, {
      size: 18,
      style: "bold",
      color: [6, 70, 196],
      spacingAfter: 7,
      lineHeight: 8,
    });
  };

  const writeSection = (text) => {
    writeParagraph(text, {
      size: 13,
      style: "bold",
      color: [21, 153, 71],
      spacingAfter: 4,
      lineHeight: 7,
    });
  };

  const writeBullet = (text, level = 0) => {
    const indent = 6 + level * 8;
    const bulletPrefix = level === 0 ? "• " : "- ";
    writeParagraph(`${bulletPrefix}${text}`, {
      indent,
      spacingAfter: 3,
      lineHeight: 5.5,
    });
  };

  return {
    writeParagraph,
    writeTitle,
    writeSection,
    writeBullet,
    finish: () => addFooter(pdf),
  };
}

function buildReglementPdf() {
  const title = "Reglement interieur du tournoi de football";
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  addPageHeader(pdf, title);
  const writer = createWriter(pdf, title);

  writer.writeTitle("Week-end FIFVE 2026 Cologne");
  writer.writeParagraph(
    "Document officiel de reference pour l'organisation sportive, administrative et disciplinaire du tournoi FIFVE 2026.",
  );

  writer.writeSection("ARTICLE 1 - INSCRIPTION ET ENGAGEMENT");
  writer.writeParagraph("La Federation internationale de football Veterans organise pendant les vacances d'ete, de juillet jusqu'a la fin du mois d'aout, un tournoi international de football veterans.");
  writer.writeParagraph("Les engagements se font par mail a bureau@fifve.com et/ou par courrier a l'adresse FIFVE bei Thomas Nkam, Johanniter Strasse 30, 44787 Bochum - Deutschland.");
  writer.writeParagraph("L'engagement est fixe a 300,00 euros par equipe et sur invitation. Toute equipe declarant forfait apres inscription ne sera pas remboursee.");
  writer.writeParagraph("L'inscription n'est valide que lorsque la FIFVE recoit la fiche d'inscription ainsi que le versement total de 300,00 euros.");

  writer.writeSection("ARTICLE 2 - CONDITION DE PARTICIPATION AU TOURNOI");
  writer.writeParagraph("Le tournoi est open et ouvert a tous. Une verification des pieces d'identite officielles avec photo est obligatoire avant toute participation.");
  writer.writeParagraph("Chaque joueur d'une meme equipe doit porter un maillot identique avec un numero different. Les matchs se deroulent sur terrains en gazon naturel et synthetique.");
  writer.writeParagraph("Tout transfert de joueur d'une equipe a une autre est interdit. L'equipe fautive est disqualifiee d'office.");
  writer.writeParagraph("Chaque equipe doit enroler ses joueurs au plus tard quatre semaines avant le debut effectif du tournoi, soit le 30 juin 2026, pour l'etablissement des licences FIFVE.");
  writer.writeBullet("Periode d'ouverture des licences sans frais supplementaire: du 01 mars 2026 au 31 mai 2026 a 18h00.");
  writer.writeBullet("Periode limite de procuration des licences avec frais supplementaire de 25 EUR par operation: du 01 juin 2026 au 30 juin 2026 a 18h00.");
  writer.writeBullet("Periode exceptionnelle d'enrolement de 48 heures: du 07.07.2026 au 08.07.2026.");

  writer.writeSection("ARTICLE 3 - PONCTUALITE");
  writer.writeParagraph("Les equipes doivent etre presentes des 08h00 au complexe sportif pour les modalites et se presenter a la table de la federation des leur arrivee pour retirer leur tableau de poule et leur horaire de match.");
  writer.writeParagraph("Chaque equipe doit se presenter au stade 10 minutes avant l'horaire indiquee, habillee et prete a jouer.");

  writer.writeSection("ARTICLE 4 - COMPOSITION D'EQUIPE");
  writer.writeParagraph("Les equipes sont composees soit de onze joueurs, soit de neuf joueurs selon le format de la rencontre, en plus des remplacants.");
  writer.writeParagraph("Seuls les joueurs titulaires d'une licence et d'un bracelet FIFVE peuvent prendre part au tournoi. Les remplacements sont illimites avec autorisation de l'arbitre.");

  writer.writeSection("ARTICLE 5 - ARBITRE ET PRECISION");
  writer.writeParagraph("Les rencontres sont dirigees par des arbitres qualifies qui appliquent le reglement mis a leur disposition.");

  writer.writeSection("ARTICLE 6 - GESTION DES CARTONS JAUNES ET ROUGES");
  writer.writeParagraph("Tout joueur sanctionne d'un carton rouge pour faute violente, coup a l'adversaire ou sur l'arbitre est exclu definitivement du tournoi.");
  writer.writeParagraph("Un carton rouge issu de deux cartons jaunes entraine une suspension automatique pour le match suivant.");
  writer.writeParagraph("Chaque carton jaune s'annule apres chaque rencontre. En cas de fraude ou de bagarre, l'equipe fautive est exclue immediatement du tournoi.");
  writer.writeParagraph("La FIFVE met en place une commission de litige qui se reserve tout droit de decision en cas de contestation.");

  writer.writeSection("ARTICLE 7 - REGLES DE JEU");
  writer.writeParagraph("Les regles appliquees sont celles du football a neuf et a onze selon les references FIFA. Les equipes effectuent un tirage au sort pour le cote du terrain.");
  writer.writeParagraph("La passe au gardien est reglementee, le port des protege-tibias est obligatoire et les demi-finales ainsi que les championnats A et B se jouent sur stade reduit. La finale se joue sur une aire reglementaire de football a 11.");

  writer.writeSection("ARTICLE 8 ET 9 - CLASSEMENTS ET REPARTITION DES POULES");
  writer.writeParagraph("La formule depend du nombre d'equipes engagees. Pour l'edition de Cologne 2026, 24 equipes sont prevues.");
  writer.writeParagraph("En cas d'affiliation de plus de 22 equipes, la FIFVE peut repartir les equipes par tirage au sort selon un modele de six groupes A, B, C, D, E et F de quatre equipes, sous reserve de disponibilite des infrastructures.");
  writer.writeBullet("Les deux premieres equipes de chaque groupe se qualifient pour le championnat B.");
  writer.writeBullet("Les premiers de chaque groupe se qualifient pour les demi-finales.");
  writer.writeBullet("Les combinaisons exactes se referent au calendrier des matchs adoptes.");
  writer.writeParagraph("Classement: 3 points par match gagne, 1 point par match nul, 0 point par match perdu.");
  writer.writeParagraph("En cas d'egalite de points, les criteres de departage sont: confrontation directe, meilleure difference de buts, meilleure attaque, meilleure defense, plus grand nombre de matchs gagnes, puis tirage au sort par la Federation.");
  writer.writeParagraph("Pour les eliminations directes, une seance de tirs au but departage les equipes en cas d'egalite a la fin du temps reglementaire. En finale, 5 tireurs par equipe puis mort subite si necessaire.");

  writer.writeSection("ARTICLE 10 - TEMPS DE JEU");
  writer.writeBullet("Matchs de groupe et demi-finales: 1 x 20 minutes sans pause.");
  writer.writeBullet("Finale: 2 x 15 minutes.");
  writer.writeBullet("Chaque equipe dispose d'au minimum 10 minutes avant sa prochaine rencontre.");

  writer.writeSection("ARTICLE 11 - FAIR-PLAY");
  writer.writeParagraph("Le Club sportif et le comite FIFVE designent, a l'issue d'un vote, une equipe recompensee par le trophee fair-play.");

  writer.writeSection("ARTICLE 12 - RESPONSABILITES");
  writer.writeParagraph("Chaque delegation est responsable de son equipement et des effets personnels de ses joueurs. La federation decline toute responsabilite en cas de vol, incident ou accident.");
  writer.writeParagraph("Chaque representant d'equipe est responsable de la bonne tenue, du respect et de la discipline de sa delegation. Chaque equipe doit se munir d'une boite a pharmacie pour les premiers soins.");

  writer.writeSection("ARTICLE 13 - CATALOGUE SANCTIONS ET LITIGES");
  writer.writeParagraph("Une commission de litige composee de trois personnes gere les troubles et les equipes fraudeuses, sur rapport de l'arbitre ou du delegue FIFVE sur le terrain.");
  writer.writeBullet("Transfert de joueur ou falsification de documents: exclusion automatique, suspension d'un an et amende de 100 EUR.");
  writer.writeBullet("Retard de plus de 6 minutes pour se presenter en maillot: forfait sur le score de 3-0.");
  writer.writeBullet("Carton rouge pour deux jaunes: suspension pour le prochain match.");
  writer.writeBullet("Carton rouge pour faute violente: exclusion du tournoi.");
  writer.writeBullet("Carton rouge pour faute tactique ou insultes: suspension pour le prochain match.");
  writer.writeBullet("Trois cartons rouges dans la meme equipe pendant une rencontre: match arrete et perdu sur tapis vert 0-3.");
  writer.writeBullet("Violence ou comportement grave envers la FIFVE: exclusion des activites et amende de 100 EUR pour un joueur ou membre, de 250 EUR a 500 EUR pour une equipe d'au moins 4 joueurs.");

  writer.writeSection("ARTICLE 14 - RECOMPENSES ET TROPHEES");
  writer.writeBullet("Equipe vainqueur: un trophee et une enveloppe.");
  writer.writeBullet("Equipe finaliste: un trophee et une enveloppe.");
  writer.writeBullet("Equipe fair-play: un trophee.");
  writer.writeBullet("Meilleur joueur, meilleur buteur et meilleur gardien: un trophee chacun.");

  writer.writeSection("ARTICLE 15 - COMPOSITION ET COMPETENCE DES MEMBRES DE LA FEDERATION");
  writer.writeParagraph("Se referer a l'organigramme officiel de la FIFVE.");

  writer.finish();
  pdf.save(path.join(outputDir, "reglement-interieur-fifve-2026.pdf"));
}

function buildChartePdf() {
  const title = "Charte sportive Week-end FIFVE 2026";
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  addPageHeader(pdf, title);
  const writer = createWriter(pdf, title);

  writer.writeTitle("Federation Internationale de Football Veterans en Europe");
  writer.writeParagraph("Cette charte vise a garantir un climat de securite, de serenite, de justice et d'equite pendant le tournoi organise par la FIFVE.");
  writer.writeParagraph("Le respect de cette charte favorise le fair-play, la convivialite et le bon deroulement du Week-end FIFVE 2026.");

  writer.writeSection("OBJET");
  writer.writeParagraph("La charte sportive complete le reglement du tournoi et rappelle les principes essentiels a respecter par les delegations, joueurs et officiels.");

  writer.writeSection("POUR PARTICIPER AU TOURNOI");
  writer.writeBullet("Etre detenteur d'une licence FIFVE en tant que membre d'une association affiliee a la FIFVE et inscrite au tournoi.");
  writer.writeBullet("Chaque joueur doit etre muni d'un bracelet electronique contenant les informations necessaires. Sans bracelet, il ne peut pas participer aux matchs de son equipe.");

  writer.writeSection("TERRAINS");
  writer.writeBullet("Terrain a gazon synthetique.");
  writer.writeBullet("Terrain a gazon naturel.");

  writer.writeSection("JOUEURS ET JOUEUSES");
  writer.writeBullet("Porter des chaussures adaptees a l'aire de jeu.");
  writer.writeBullet("Port obligatoire des protege-tibias pendant la rencontre.");

  writer.writeSection("JEUX - CHAMPIONNAT A");
  writer.writeBullet("8 joueurs de champ plus 1 gardien de but.");
  writer.writeBullet("Remplacements illimites apres verification par le delegue de terrain aupres de l'arbitre.");
  writer.writeBullet("Pas de hors-jeu pendant les matchs.");
  writer.writeBullet("1 arbitre plus 1 delegue de terrain.");
  writer.writeBullet("Duree: 1 x 20 minutes avec possibilite d'un cooling break de 2 minutes selon l'arbitre.");
  writer.writeBullet("Bareme de points: victoire 3, nul 1, defaite 0.");

  writer.writeSection("JEUX - CHAMPIONNAT B ET DEMI-FINALES");
  writer.writeBullet("8 joueurs de champ plus 1 gardien de but.");
  writer.writeBullet("Remplacements illimites apres verification par le delegue de terrain aupres de l'arbitre.");
  writer.writeBullet("Pas de hors-jeu pendant les matchs.");
  writer.writeBullet("1 arbitre plus 1 delegue de terrain.");
  writer.writeBullet("Duree: 1 x 20 minutes avec possibilite d'un cooling break de 2 minutes selon l'arbitre.");
  writer.writeBullet("En demi-finale, en cas d'egalite, seance immediate de tirs au but: 3 tireurs par equipe puis mort subite si necessaire.");

  writer.writeSection("JEUX - LA FINALE");
  writer.writeBullet("10 joueurs de champ plus 1 gardien de but.");
  writer.writeBullet("Remplacements illimites apres verification par le delegue de terrain aupres de l'arbitre.");
  writer.writeBullet("Le hors-jeu est d'application.");
  writer.writeBullet("1 arbitre central, 2 arbitres assistants et 1 delegue de terrain.");
  writer.writeBullet("Duree: 2 x 15 minutes avec mi-temps de 5 minutes.");
  writer.writeBullet("En cas d'egalite, seance immediate de tirs au but avec 5 tireurs par equipe puis mort subite si necessaire.");

  writer.writeSection("INJONCTIONS AUX DELEGATIONS");
  writer.writeBullet("Se presenter au complexe sportif le samedi 25 juillet 2026 a 08h00.");
  writer.writeBullet("La verification des pieces d'identite officielles avec photo est obligatoire.");
  writer.writeBullet("Des controles inopines peuvent etre effectues pendant le tournoi; les pieces doivent rester rapidement accessibles.");
  writer.writeBullet("Chaque equipe doit se presenter a la table des officiels des 08h00 pour verification et retrait des bracelets. La procedure est stoppee avant le debut du tournoi.");
  writer.writeBullet("Chaque equipe doit se presenter au terrain 10 minutes avant le debut de son match pour les protocoles d'usage.");
  writer.writeBullet("Une equipe avec 6 minutes de retard est declaree forfait et perd 3-0.");
  writer.writeBullet("Chaque delegation est responsable de ses equipements, de son materiel medical et de ses autres effets. La FIFVE decline toute responsabilite en cas de manque ou de perte.");
  writer.writeBullet("Le respect des officiels et des joueurs est obligatoire. Toute violation peut entrainer la saisine du comite de discipline et de litige.");
  writer.writeBullet("Toute violence physique sur autrui ou sur du materiel sera sanctionnee avec la plus grande rigueur.");
  writer.writeBullet("Chaque delegue d'equipe doit prendre connaissance du reglement complet du tournoi FIFVE.");

  writer.writeSection("NOTE FINALE");
  writer.writeParagraph("Merci de faire de ce Week-end FIFVE une fete inoubliable, avec honneur, securite et esprit sportif.");
  writer.writeParagraph("Pour plus de detail, se referer au reglement du tournoi FIFVE.");

  writer.finish();
  pdf.save(path.join(outputDir, "charte-sportive-fifve-2026.pdf"));
}

ensureOutputDir();
buildReglementPdf();
buildChartePdf();