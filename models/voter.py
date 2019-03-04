from dao.dao import Dao


def get_hx(dao, voter_ids, after=None):
    hx = []
    nxt_id = 0
    while nxt_id < len(voter_ids):
        nxt, nxt_id = next_hundred(voter_ids, nxt_id)
        sql = ("SELECT voter_id, election_date || ballot as election, election_description "
               "FROM voter_history "
               "WHERE voter_id IN (%s)") % Dao.get_param_str(nxt)
        if after:
            sql += " AND election_date > %s" % (after,)
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


def get_elections(dao):
    sql = "SELECT * FROM elections ORDER BY date DESC"
    return dao.execute(sql)


def get_elections_after(dao, date):
    sql = "SELECT code, date, description FROM elections WHERE date > ? ORDER BY date DESC"
    rex = dao.execute(sql, (date,))
    return rex


def get_latest_election(dao):
    sql = "SELECT MAX(date) FROM elections"
    rex = dao.execute(sql)
    return rex[0]['MAX(date)'].replace('-', '')


def cond(rec, block):
    if rec['street_name'] == block['street_name']:
        if rec['street_type'] == block['street_type']:
            if rec['house_number'] >= block['low_addr']:
                if rec['house_number'] <= block['high_addr']:
                    if odd_even_cond(block['odd_even'], rec['house_number']):
                        return True
    return False


def odd_even_cond(qualifier, house_number):
    x = house_number % 2
    switcher = {
        'B': True,
        'E': x == 0,
        'O': x == 1
    }
    return switcher[qualifier]


