def get_all(dao, tbl):
    sql = ("SELECT * FROM %s "
           "ORDER BY last_name, first_name, middle_name") % (tbl,)
    return dao.execute(sql)


def get_for_precinct(dao, tbl, pct_id):
    sql = ("SELECT * FROM %s "
           "WHERE precinct_id=? "
           "ORDER BY last_name, first_name, middle_name") % (tbl,)
    return dao.execute(sql, (pct_id,))


def get_for_block(dao, tbl, block):
    sql = ("SELECT * "
           "FROM %s "
           "WHERE precinct_id=? "
           "AND street_name=? "
           "AND street_type=? ") % (tbl,)
    vals = [
        block['precinct_id'],
        block['street_name'],
        block['street_type']
    ]
    if 'low_addr' in block and block['low_addr'] != '':
        sql += "AND house_number BETWEEN ? AND ? "
        vals += [
            block['low_addr'],
            block['high_addr']
        ]
    if 'odd_even' in block and block['odd_even'] != '':
        if block['odd_even'] == 'O':
            sql += "AND (house_number % 2)=1 "
        elif block['odd_even'] == 'E':
            sql += "AND (house_number % 2)=0 "

    sql += "ORDER BY house_number;"

    return dao.execute(sql, vals)
