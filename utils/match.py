from metaphone import doublemetaphone
from fuzzywuzzy import fuzz, process


class MatchLib(object):

    @staticmethod
    def get_single(s):
        return doublemetaphone(s)[0]

    @staticmethod
    def get_both(s):
        return doublemetaphone(s)

    @staticmethod
    def get_score(target, candidate):
        return fuzz.ratio(target, candidate)

    @staticmethod
    def get_top_score(s1, s2):
        from fuzzywuzzy import fuzz

        meta1 = MatchLib.get_both(s1)
        meta2 = MatchLib.get_both(s2)
        top_score = 0
        score = fuzz.partial_ratio(meta1[0], meta2[0])
        if score > top_score:
            top_score = score
        score = fuzz.partial_ratio(meta1[0], meta2[1])
        if score > top_score:
            top_score = score
        score = fuzz.partial_ratio(meta1[1], meta2[0])
        if score > top_score:
            top_score = score
        score = fuzz.partial_ratio(meta1[1], meta2[1])
        if score > top_score:
            top_score = score
        return top_score

    @staticmethod
    def get_best_match(target, candidates, threshold=None):
        match = process.extractOne(target, candidates)
        if not threshold:
            return match
        return match[0] if match[1] >= threshold else None

    @staticmethod
    def get_best_matches(target, candidates, threshold):
        matches = process.extract(target, set(candidates))
        return [match for match in matches if match[1] >= threshold]

    @staticmethod
    def get_best_partials(target, candidates, threshold):
        matches = []
        for candidate in candidates:
            score = fuzz.partial_ratio(target, candidate)
            if score >= threshold:
                matches.append((candidate, score))
        matches.sort(key=lambda tup: tup[1], reverse=True)
        return [match[0] for match in matches]

    @staticmethod
    def get_best_partial(target, candidates, threshold):
        top_score = 0
        best_match = None
        for candidate in candidates:
            score = fuzz.partial_ratio(target, candidate)
            if score > top_score:
                best_match = candidate
                top_score = score
        return best_match if top_score >= threshold else None

    @staticmethod
    def get_matching_records(target, candidates):
        d_inverse = MatchLib.invert_ids(candidates)
        matches = process.extract(target, set(candidates.values()))
        return [(match[1], d_inverse[match[0]]) for match in matches]

    @staticmethod
    def invert_ids(d):
        D = {}
        for k, v in d.items():
            if v not in D:
                D[v] = []
            D[v].append(k)
        return D