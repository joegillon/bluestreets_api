from dao.dao import Dao


def get_hx(dao, voter_ids):
    hx = []
    nxt_id = 0
    while nxt_id < len(voter_ids):
        nxt, nxt_id = next_hundred(voter_ids, nxt_id)
        sql = ("SELECT * FROM voter_history "
               "WHERE voter_id IN (%s);") % Dao.get_param_str(nxt)
        hx += dao.execute(sql, nxt)
    return hx


def next_hundred(ids, idx):
    stop = idx + 100
    if stop > len(ids):
        stop = len(ids)
    return [ids[i] for i in range(idx, stop)], stop


def get_voters_for_precinct(dao, pct_id):
    sql = ("SELECT voter_id "
           "FROM voters "
           "WHERE precinct_id=? ")
    rex = dao.execute(sql, (pct_id,))
    return [rec['voter_id'] for rec in rex] if rex else []
