import { ArrowRight, Trophy } from "lucide-react";

export default function RankingPreview({ ranking, t, onViewAll }) {
  return (
    <section className="preview-card ranking-preview" aria-labelledby="top-five">
      <div className="preview-card__heading">
        <div>
          <h2 id="top-five">
            <Trophy size={21} />
            {t.rankingPreviewTitle}
          </h2>
        </div>
        <a href="/classement" onClick={onViewAll}>
          {t.seeAllTeams}
          <ArrowRight size={15} />
        </a>
      </div>

      <div className="ranking-preview__table-wrap">
        <table className="ranking-preview__table">
          <thead>
            <tr>
              <th scope="col">{t.nr}</th>
              <th scope="col">{t.delegation}</th>
              <th scope="col">{t.points}</th>
              <th scope="col">{t.rankingBonusColumn}</th>
              <th scope="col">{t.total}</th>
            </tr>
          </thead>
          <tbody>
            {ranking.slice(0, 5).map((team) => (
              <tr key={`${team[0]}-${team[1]}`}>
                <td>
                  <span className="ranking-position">{team[0]}</span>
                </td>
                <th scope="row">{team[1]}</th>
                <td>{team[2]}</td>
                <td>
                  <span className="ranking-bonuses">
                    {String(team[3])
                      .split("+")
                      .filter((bonus) => Number(bonus) > 0)
                      .map((bonus) => (
                        <span key={bonus}>+{bonus}</span>
                      ))}
                  </span>
                </td>
                <td className="ranking-total">{team[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
