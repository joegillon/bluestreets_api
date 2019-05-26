/**
 * Created by Joe on 5/26/2019.
 */

function getBestPartials(target, candidates, threshold) {
  let matches = [];
  candidates.forEach(function(candidate) {
    let score = fuzzball.partial_ratio(target, candidate);
    if (score >= threshold) {
      matches.push({candidate: candidate, score: score});
    }
  });
  matches = matches.sort((a, b) => (a.score > b.score) ? 1 : -1);
  return matches.map(match => match.candidate);
}