def get_all(dao):
    sql = ("SELECT * FROM precincts "
           "ORDER BY jurisdiction_name, ward, precinct")
    return dao.execute(sql)


def get_precinct(dao, pct_id):
    sql = ("SELECT * FROM precincts "
           "WHERE id=?")
    return dao.execute(sql, (pct_id,))
