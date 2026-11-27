import {
  classementRules,
  ranking,
  selectedTeamsByCountry,
} from "../data/fifveData";

export const fifveDataService = {
  getRanking: () => ranking,
  getSelectedTeams: () => selectedTeamsByCountry,
  getClassificationRules: () => classementRules,
};
